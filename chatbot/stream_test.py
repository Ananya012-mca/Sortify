import sys
try:
    import requests, json
except Exception as e:
    print("Missing dependency 'requests'. Install with: python -m pip install requests")
    sys.exit(1)

url = "http://localhost:5001/chat/stream"
message = "How should I dispose of batteries?"
print(f"POST {url} with message: {message}\n")
try:
    resp = requests.post(url, json={"message": message}, stream=True, timeout=60)
except Exception as e:
    print("Request failed:", e)
    sys.exit(1)

if resp.status_code != 200:
    print(f"Server returned status {resp.status_code}: {resp.text}")
    sys.exit(1)

acc = ""
marker = "__RAG_SOURCES__:"
for chunk in resp.iter_content(chunk_size=None):
    if not chunk:
        continue
    try:
        text = chunk.decode(errors="ignore")
    except Exception:
        text = str(chunk)
    if marker in text:
        before, after = text.split(marker, 1)
        acc += before
        print("\n[STREAM OUTPUT]\n")
        print(acc)
        try:
            sources = json.loads(after.strip())
            print("\n[SOURCES]\n", json.dumps(sources, indent=2))
        except Exception as e:
            print("\n[SOURCES PARSE ERROR]", e)
        break
    else:
        acc += text
        print(text, end="", flush=True)

print("\n\n[STREAM COMPLETE]")
