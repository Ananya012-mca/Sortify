#!/usr/bin/env python3
"""Test the exact same request the browser would make"""

import requests
from pathlib import Path
import json

test_image = Path("dataset/val/cardboard/cardboard10.jpg")

if test_image.exists():
    print("Simulating browser fetch request...")
    print("=" * 60)
    
    try:
        # This is exactly what the browser JavaScript does
        with open(test_image, 'rb') as f:
            files = {'file': f}
            headers = {
                'User-Agent': 'Mozilla/5.0'
            }
            
            response = requests.post(
                "http://localhost:5000/predict",
                files=files,
                headers=headers,
                timeout=30
            )
        
        print(f"Status: {response.status_code} {response.reason}")
        print(f"Headers: {dict(response.headers)}")
        print(f"Body: {response.text}")
        
        if response.ok:
            print("\n✓ API Response is successful!")
            data = response.json()
            print(f"Parsed JSON: {json.dumps(data, indent=2)}")
        else:
            print(f"\n✗ API returned error status: {response.status_code}")
            
    except requests.exceptions.ConnectionError as e:
        print(f"✗ Connection failed: {e}")
        print("  This is why 'Failed to fetch' appears in the browser!")
    except requests.exceptions.Timeout as e:
        print(f"✗ Request timeout: {e}")
    except Exception as e:
        print(f"✗ Error: {type(e).__name__}: {e}")
else:
    print(f"Test image not found: {test_image}")
