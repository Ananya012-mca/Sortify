import os
import json
import logging
from typing import List, Tuple

try:
    from sentence_transformers import SentenceTransformer
    import numpy as np
except Exception:
    SentenceTransformer = None

try:
    import openai
except Exception:
    openai = None

logger = logging.getLogger(__name__)


class RAGAssistant:
    """Retrieval-Augmented Generation helper.

    - Builds a small in-memory vector store from provided knowledge (dicts/lists).
    - Uses sentence-transformers `all-MiniLM-L6-v2` for embeddings if installed.
    - If `OPENAI_API_KEY` is present and `openai` is installed, it will call the ChatCompletion API
      to produce a generative answer that cites retrieved passages.
    - Otherwise returns the retrieved passages as a helpful summary.
    """

    def __init__(self, model_name: str = "all-MiniLM-L6-v2"):
        self.model_name = model_name
        self.encoder = None
        self.docs = []  # list of (id, title, text)
        self.embeddings = None
        if SentenceTransformer is not None:
            try:
                self.encoder = SentenceTransformer(self.model_name)
            except Exception as e:
                logger.warning("Failed to load SentenceTransformer: %s", e)
                self.encoder = None

    def build_index(self, knowledge_sources: List[Tuple[str, str]]):
        """Accepts a list of (title, text) and builds embeddings."""
        self.docs = []
        texts = []
        for i, (title, text) in enumerate(knowledge_sources):
            doc_id = str(i)
            self.docs.append((doc_id, title, text))
            texts.append(text)

        if self.encoder is not None and len(texts) > 0:
            try:
                self.embeddings = np.array(self.encoder.encode(texts, show_progress_bar=False))
            except Exception as e:
                logger.warning("Embedding failure: %s", e)
                self.embeddings = None
        else:
            self.embeddings = None

    def _cosine_similarities(self, query_embedding, matrix):
        # query_embedding: (d,), matrix: (n,d)
        import numpy as np
        q = query_embedding / (np.linalg.norm(query_embedding) + 1e-12)
        M = matrix / (np.linalg.norm(matrix, axis=1, keepdims=True) + 1e-12)
        return (M @ q).squeeze()

    def retrieve(self, query: str, top_k: int = 3):
        """Return top_k documents (title, text, score)."""
        if self.embeddings is None or self.encoder is None:
            # Fallback: return first top_k docs without scoring
            return [(t, txt, 0.0) for (_, t, txt) in self.docs[:top_k]]

        q_emb = np.array(self.encoder.encode([query], show_progress_bar=False))[0]
        scores = self._cosine_similarities(q_emb, self.embeddings)
        idxs = list(reversed(scores.argsort()[-top_k:]))
        results = []
        for idx in idxs:
            doc_id, title, text = self.docs[idx]
            results.append((title, text, float(scores[idx])))
        return results

    def answer(self, query: str, top_k: int = 3, max_tokens: int = 300):
        """Return a generative answer if OpenAI is available, otherwise a concatenated summary."""
        retrieved = self.retrieve(query, top_k=top_k)

        context_blocks = []
        for title, text, score in retrieved:
            context_blocks.append(f"### {title}\n{ text }\n")

        context = "\n---\n".join(context_blocks)

        # If OpenAI bindings and key exist, call ChatCompletion
        api_key = os.environ.get("OPENAI_API_KEY")
        if openai is not None and api_key:
            openai.api_key = api_key
            system_prompt = (
                "You are a helpful, concise assistant that answers questions about waste management, recycling, and disposal. "
                "Use only the provided context blocks (cite titles) when those directly answer the user; otherwise answer briefly and suggest next steps. "
                "If you cannot find the answer in the context, say so and provide general guidance."
            )

            messages = [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": f"Context:\n{context}\nUser question: {query}"}
            ]

            try:
                resp = openai.ChatCompletion.create(
                    model=os.environ.get("OPENAI_MODEL", "gpt-3.5-turbo"),
                    messages=messages,
                    max_tokens=max_tokens,
                    temperature=0.2,
                )
                answer = resp["choices"][0]["message"]["content"]
                return {"answer": answer, "retrieved": retrieved, "used_llm": True}
            except Exception as e:
                logger.error("OpenAI call failed: %s", e)
                # Fall through to fallback

        # Fallback: return the retrieved context concatenated with a short hint
        concat = "\n\n".join([f"{title}: {text}" for (title, text, _) in retrieved])
        hint = (
            "I could not access an LLM API. Here are the most relevant passages I found. "
            "Enable `OPENAI_API_KEY` to get a concise generated answer."
        )
        return {"answer": f"{concat}\n\n{hint}", "retrieved": retrieved, "used_llm": False}

    def stream_answer(self, query: str, top_k: int = 3, max_tokens: int = 300):
        """Stream answer as text chunks. Yields strings (may be partial)."""
        retrieved = self.retrieve(query, top_k=top_k)

        context_blocks = []
        for title, text, score in retrieved:
            context_blocks.append(f"### {title}\n{ text }\n")

        context = "\n---\n".join(context_blocks)

        api_key = os.environ.get("OPENAI_API_KEY")
        if openai is not None and api_key:
            openai.api_key = api_key
            system_prompt = (
                "You are a helpful, concise assistant that answers questions about waste management, recycling, and disposal. "
                "Use only the provided context blocks (cite titles) when those directly answer the user; otherwise answer briefly and suggest next steps. "
                "If you cannot find the answer in the context, say so and provide general guidance."
            )

            messages = [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": f"Context:\n{context}\nUser question: {query}"}
            ]

            try:
                # Stream via OpenAI incremental responses
                stream = openai.ChatCompletion.create(
                    model=os.environ.get("OPENAI_MODEL", "gpt-3.5-turbo"),
                    messages=messages,
                    max_tokens=max_tokens,
                    temperature=0.2,
                    stream=True,
                )

                # The stream yields events with 'choices' deltas
                partial = []
                for event in stream:
                    # event may contain 'choices' with 'delta'
                    try:
                        delta = event.get('choices', [])[0].get('delta', {})
                        content = delta.get('content')
                        if content:
                            yield content
                    except Exception:
                        # ignore malformed events
                        continue

                # After streaming content, send final sources metadata as JSON line
                try:
                    sources_payload = {"sources": [(t, text, s) for (t, text, s) in retrieved]}
                    yield "\n__RAG_SOURCES__:" + json.dumps(sources_payload)
                except Exception:
                    yield "\n__RAG_SOURCES__:[]"
                return
            except Exception as e:
                logger.error("OpenAI streaming failed: %s", e)

        # Fallback: stream retrieved passages line by line
        for title, text, score in retrieved:
            yield f"{title}: {text}\n"
        yield "\n__RAG_SOURCES__:" + json.dumps({"sources": [(t, text, s) for (t, text, s) in retrieved]})
