#!/usr/bin/env python
import requests
import json

API_URL = "http://localhost:5001/chat"

test_queries = [
    "Tell me a fact",
    "How to dispose of a battery?",
    "Tips for recycling plastic",
    "Home recycling tips",
    "What is glass recycling?"
]

print("=" * 60)
print("TESTING IMPROVED CHATBOT API")
print("=" * 60)

for query in test_queries:
    try:
        response = requests.post(API_URL, json={"message": query}, timeout=5)
        data = response.json()
        
        print(f"\n📝 Query: {query}")
        print(f"🤖 Type: {data.get('type', 'unknown')}")
        print(f"💬 Response: {data.get('response', 'No response')}")
        if data.get('data'):
            print(f"📊 Data keys: {list(data['data'].keys())}")
        print("-" * 60)
    except Exception as e:
        print(f"❌ Error for '{query}': {e}")

print("\n✅ Chatbot testing complete!")
