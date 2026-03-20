#!/usr/bin/env python3
"""Test the Flask API with a real image"""

import requests
import sys
import os
from pathlib import Path
import time
import subprocess
import signal
import threading

# Start Flask server in background
print("🚀 Starting Flask backend...")
flask_process = subprocess.Popen(
    [sys.executable, "backend/app.py"],
    stdout=subprocess.PIPE,
    stderr=subprocess.PIPE,
    cwd=os.getcwd()
)

# Give Flask time to start
time.sleep(3)

try:
    # Test health endpoint first
    print("🏥 Testing health endpoint...")
    response = requests.get("http://localhost:5000/health")
    print(f"Health check: {response.status_code} - {response.json()}")
    
    # Find a test image from dataset
    dataset_dir = Path("dataset/val/cardboard")
    if dataset_dir.exists():
        images = list(dataset_dir.glob("*"))
        if images:
            test_image = images[0]
            print(f"\n📸 Testing prediction with: {test_image.name}")
            
            with open(test_image, 'rb') as f:
                files = {'file': f}
                response = requests.post("http://localhost:5000/predict", files=files)
                print(f"\nResponse Status: {response.status_code}")
                print(f"Response Body: {response.json()}")
                
                if response.status_code == 200:
                    print("\n✅ Prediction API works successfully!")
                else:
                    print(f"\n❌ API Error: {response.json()}")
        else:
            print("❌ No test images found")
    else:
        print("❌ dataset/val/cardboard not found")

except requests.exceptions.ConnectionError:
    print("❌ Could not connect to Flask server. Is MongoDB running?")
    print("   Make sure MongoDB is running on localhost:27017")
except Exception as e:
    print(f"❌ Error: {e}")
    import traceback
    traceback.print_exc()
finally:
    print("\n🛑 Stopping Flask server...")
    flask_process.terminate()
    flask_process.wait(timeout=5)
