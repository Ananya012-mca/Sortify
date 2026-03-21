#!/usr/bin/env python3
"""Test prediction directly without the Flask server"""

import sys
import os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'backend'))

from predict import predict_waste
from pathlib import Path
from PIL import Image

# Find a test image
test_images_dir = Path("backend/test_images")
if test_images_dir.exists():
    test_files = list(test_images_dir.glob("*"))
    if test_files:
        print(f"Found {len(test_files)} test image(s)")
        # Test with the first image
        test_file = test_files[0]
        print(f"\nTesting with: {test_file}")
        
        try:
            with open(test_file, 'rb') as f:
                result = predict_waste(f)
                print(f"✅ Prediction successful!")
                print(f"Category: {result[0]}")
                print(f"Confidence: {result[1]}%")
                print(f"Authentic: {result[2]}")
                print(f"Message: {result[3]}")
                print(f"Suggestions: {result[4]}")
        except Exception as e:
            print(f"❌ Error during prediction: {e}")
            import traceback
            traceback.print_exc()
    else:
        print("No test images found in backend/test_images")
else:
    print("backend/test_images directory not found")
    
    # Try to get info about the model
    print("\n📊 Checking model...")
    try:
        from predict import model, classes
        print(f"✅ Model loaded successfully")
        print(f"Expected input shape: 224x224x3")
        print(f"Classes: {classes}")
    except Exception as e:
        print(f"❌ Error loading model: {e}")
        import traceback
        traceback.print_exc()
