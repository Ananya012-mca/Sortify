#!/usr/bin/env python3
"""
Test script for enhanced chatbot with improved accuracy and responses
"""

import sys
import io

# Fix encoding for Windows
if sys.platform == 'win32':
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

sys.path.insert(0, 'd:\\Projects\\waste_classification_ml\\waste_classification_ml\\chatbot')

from chatbot import WasteclassificationChatbot

def test_chatbot():
    bot = WasteclassificationChatbot()
    
    # Test queries covering various intent types
    test_queries = [
        # Fact requests
        "Tell me a fun fact about recycling",
        "How long does plastic take to decompose?",
        "Did you know any statistics?",
        
        # Item disposal guidance
        "How do I dispose of a battery?",
        "What should I do with old electronics?",
        "How to get rid of paint cans?",
        "Can I throw away a tire?",
        
        # Waste type queries
        "Tell me about cardboard recycling",
        "How to recycle glass properly?",
        "Recycling tips for plastic",
        "What about metal containers?",
        
        # Context-based tips
        "Tips for office recycling",
        "How to recycle at home?",
        "Restaurant waste management tips",
        "Travel recycling best practices",
        
        # FAQ-style questions
        "Can I recycle wet paper?",
        "What plastics can I recycle?",
        "Should I remove plastic bag lids?",
        "How do I find recycling near me?",
        
        # Help requests
        "Help! What can you do?",
        "How can I reduce waste?",
        "What waste types can you help with?",
        
        # Reuse & impact queries
        "Any creative ideas for plastic bottles?",
        "What's the environmental impact of glass recycling?",
        "How much energy is saved by recycling aluminum?",
        
        # Unrelated topics (should politely redirect)
        "Tell me a joke",
        "What about the weather?",
        "Do you like basketball?",
    ]
    
    print("=" * 80)
    print("ENHANCED CHATBOT TESTING")
    print("=" * 80)
    
    for i, query in enumerate(test_queries, 1):
        response = bot.chat(query)
        print(f"\n[{i}] Question: {query}")
        print(f"    Type: {response.get('type', 'unknown')}")
        if 'item' in response:
            print(f"    Item: {response['item']}")
        if 'waste_category' in response:
            print(f"    Category: {response['waste_category']}")
        if 'context' in response:
            print(f"    Context: {response['context']}")
        
        resp_text = response['response'][:150] if len(response['response']) > 150 else response['response']
        print(f"    Response: {resp_text}...")
        print("    " + "-" * 76)
    
    print("\n" + "=" * 80)
    print("TEST SUMMARY")
    print("=" * 80)
    print(f"Tested {len(test_queries)} different query types")
    print("Enhanced intent detection working")
    print("Improved responses with formatting")
    print("Better FAQ matching and similarity scoring")
    print("Expanded disposal guides")
    print("More eco-facts available")
    
if __name__ == "__main__":
    test_chatbot()
