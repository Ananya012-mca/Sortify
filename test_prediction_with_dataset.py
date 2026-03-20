#!/usr/bin/env python3
"""Test prediction with actual dataset images"""

import sys
import os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'backend'))

from predict import predict_waste
from pathlib import Path
import random

# Find a test image from the dataset
dataset_dir = Path("dataset/val")
if dataset_dir.exists():
    classes = ['cardboard', 'glass', 'metal', 'paper', 'plastic', 'trash']
    
    print("🔍 Looking for validation images...")
    for class_name in classes:
        class_dir = dataset_dir / class_name
        if class_dir.exists():
            images = list(class_dir.glob("*"))
            if images:
                # Pick a random image from this class
                test_file = random.choice(images)
                print(f"\n✅ Found {len(images)} {class_name} images")
                print(f"📸 Testing with: {test_file.name}")
                print(f"   Expected class: {class_name}")
                
                try:
                    with open(test_file, 'rb') as f:
                        # ignore extra values returned by the updated function
                        category, confidence, is_authentic, auth_message, suggestions, *_ = predict_waste(f)
                        print(f"\n🎯 Prediction Result:")
                        print(f"   Category: {category}")
                        print(f"   Confidence: {confidence}%")
                        print(f"   Authentic: {is_authentic}")
                        print(f"   Message: {auth_message}")
                        print(f"   Suggestions: {suggestions}")
                        
                        match = "✅" if category == class_name else "❌"
                        print(f"\n{match} Match: {category} vs expected {class_name}")
                        
                except Exception as e:
                    print(f"❌ Error during prediction: {e}")
                    import traceback
                    traceback.print_exc()
                
                break  # Test with just one image for now
else:
    print("❌ dataset/val directory not found")

print("\n✅ Model loading test:")
try:
    from predict import model, classes as pred_classes
    print(f"✅ Model loaded successfully")
    print(f"   Classes: {pred_classes}")
except Exception as e:
    print(f"❌ Error loading model: {e}")
