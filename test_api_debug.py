#!/usr/bin/env python3
"""Test the actual API to see what error occurs"""

import requests
import json
from pathlib import Path

# Test without authentication first
test_image = Path("dataset/val/cardboard/cardboard10.jpg")

if test_image.exists():
    print("Testing API endpoint at http://localhost:5000/predict")
    print("=" * 60)
    
    try:
        with open(test_image, 'rb') as f:
            files = {'file': f}
            response = requests.post("http://localhost:5000/predict", files=files, timeout=10)
            
        print(f"Status Code: {response.status_code}")
        print(f"Response Headers: {dict(response.headers)}")
        print(f"Response Text: {response.text}")
        
        if response.status_code == 200:
            print("\nJSON Response:")
            print(json.dumps(response.json(), indent=2))
            print("\n✓ SUCCESS - The API is working!")
        else:
            print(f"\n✗ ERROR - Status {response.status_code}")
            try:
                print("Error details:", response.json())
            except:
                print("Could not parse response as JSON")
                
    except requests.exceptions.ConnectionError as e:
        print(f"✗ Connection Error: Cannot connect to backend")
        print(f"  Is Flask running? Check: http://localhost:5000/health")
    except requests.exceptions.Timeout:
        print(f"✗ Timeout: Backend took too long to respond")
    except Exception as e:
        print(f"✗ Error: {e}")
else:
    print(f"✗ Test image not found: {test_image}")
