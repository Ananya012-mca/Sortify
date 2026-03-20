import os
import re
from collections import defaultdict

from chatbot import WasteclassificationChatbot


def build_tests(bot: WasteclassificationChatbot):
    tests = []  # list of (query, expected_keywords)

    # From categories: expect answers to include category name and a tip or what_to_do
    for cat, info in bot.waste_knowledge.items():
        q1 = f"How do I recycle {cat}?"
        expected = [cat]
        # add tokens from what_to_do and recycling_tips
        if info.get("what_to_do"):
            expected += re.findall(r"\w+", info["what_to_do"].lower())[:3]
        if info.get("recycling_tips"):
            expected += re.findall(r"\w+", info["recycling_tips"].lower())[:3]
        tests.append((q1, set(expected)))

    # From extended_faq: map question keys to tests
    for q, a in bot.extended_faq.items():
        query = q + "?"
        # choose a few key tokens from the answer
        tokens = re.findall(r"\w+", a.lower())
        expected = set(tokens[:4]) if tokens else {q}
        tests.append((query, expected))

    # From disposal guides
    for item, guide in bot.disposal_guides.items():
        q = f"How should I dispose of {item}?"
        tokens = re.findall(r"\w+", guide.lower())
        expected = set(tokens[:4])
        tests.append((q, expected))

    return tests


def score_answer(answer: str, expected: set) -> bool:
    a = answer.lower()
    matches = sum(1 for tok in expected if tok in a)
    # pass if at least 30% of expected tokens are present (heuristic)
    return matches >= max(1, int(len(expected) * 0.3))


def evaluate():
    use_rag = os.environ.get("USE_RAG", "0") == "1"
    bot = WasteclassificationChatbot(use_rag=use_rag)

    tests = build_tests(bot)
    results = []

    for query, expected in tests:
        resp = bot.chat(query)
        text = resp.get("response", "")
        ok = score_answer(text, expected)
        results.append((query, ok, text, expected))

    total = len(results)
    passed = sum(1 for r in results if r[1])
    accuracy = passed / total * 100

    print(f"Evaluated {total} queries — Passed: {passed} — Accuracy: {accuracy:.2f}%")

    # Report some failures for inspection
    failures = [r for r in results if not r[1]]
    if failures:
        print("\nSample failures (up to 10):")
        for q, ok, text, expected in failures[:10]:
            print("---")
            print("Query:", q)
            print("Expected tokens:", sorted(list(expected))[:10])
            print("Response:", text)


if __name__ == "__main__":
    evaluate()
