import requests, json

BASE = "http://localhost:5001"


def call_chat(msg):
    url = f"{BASE}/chat"
    r = requests.post(url, json={"message": msg}, timeout=30)
    print("POST /chat -> status", r.status_code)
    try:
        data = r.json()
    except Exception:
        print("Non-JSON response:\n", r.text)
        return
    print(json.dumps(data, indent=2, ensure_ascii=False))


def call_stream(msg):
    url = f"{BASE}/chat/stream"
    print("Streaming POST to", url, "message=", msg)
    with requests.post(url, json={"message": msg}, stream=True, timeout=60) as r:
        print("Status", r.status_code)
        acc = ""
        marker = "__RAG_SOURCES__:"
        for chunk in r.iter_content(chunk_size=None):
            if not chunk:
                continue
            text = chunk.decode(errors='ignore')
            if marker in text:
                before, after = text.split(marker, 1)
                acc += before
                print("\n[STREAMED TEXT]\n", acc)
                try:
                    meta = json.loads(after.strip())
                    print("\n[METADATA]\n", json.dumps(meta, indent=2, ensure_ascii=False))
                except Exception as e:
                    print("Failed to parse metadata:", e)
                break
            else:
                acc += text
                print(text, end='', flush=True)
        print("\n--- stream done ---\n")


if __name__ == '__main__':
    tests = ["hi", "How should I dispose of batteries?", "Tell me a fact about recycling"]
    for t in tests:
        print("\n=== TEST /chat ===\n")
        call_chat(t)
        print("\n=== TEST /chat/stream ===\n")
        call_stream(t)
