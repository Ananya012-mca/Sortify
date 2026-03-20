#!/usr/bin/env python3
"""Final comprehensive test of image classification"""

import sys
import os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'backend'))

from predict import predict_waste
from pathlib import Path
import random

print("=" * 60)
print("FINAL CLASSIFICATION TEST")
print("=" * 60)

# Test with each class
dataset_dir = Path("dataset/val")
classes = ['cardboard', 'glass', 'metal', 'paper', 'plastic', 'trash']
results = []

for class_name in classes:
    class_dir = dataset_dir / class_name
    if class_dir.exists():
        images = list(class_dir.glob("*"))
        if images:
            test_file = random.choice(images)
            
            try:
                with open(test_file, 'rb') as f:
                    category, confidence, is_authentic, auth_message, suggestions = predict_waste(f)
                    
                    is_correct = category == class_name
                    results.append({
                        'expected': class_name,
                        'predicted': category,
                        'confidence': confidence,
                        'correct': is_correct
                    })
                    
                    status = "PASS" if is_correct else "FAIL"
                    print("[%s] %s -> %s (%.1f%%)" % (status, class_name, category, confidence))
                    
            except Exception as e:
                print("[FAIL] %s ERROR: %s" % (class_name, str(e)[:40]))
                results.append({
                    'expected': class_name,
                    'predicted': 'ERROR',
                    'confidence': 0,
                    'correct': False
                })

# Summary
print("\n" + "=" * 60)
correct = sum(1 for r in results if r['correct'])
total = len(results)
accuracy = (correct / total * 100) if total > 0 else 0

print("ACCURACY: %d/%d (%.1f%%)" % (correct, total, accuracy))
print("=" * 60)

if accuracy == 100:
    print("SUCCESS! Classification is working perfectly!")
elif accuracy >= 80:
    print("GOOD! Classification is working well!")
else:
    print("WARNING: Classification has some issues")
