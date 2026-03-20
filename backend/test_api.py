import requests
import os
from pathlib import Path

API_BASE = "http://127.0.0.1:5000"
DATASET_PATH = Path(__file__).parent.parent / "dataset" / "train"

def test_health():
    """Test if backend is running"""
    try:
        response = requests.get(f"{API_BASE}/health", timeout=5)
        print(f"✅ Backend Health: {response.status_code}")
        print(f"   Response: {response.json()}\n")
        return True
    except Exception as e:
        print(f"❌ Backend not running: {e}")
        print(f"   Start with: python app.py\n")
        return False

def test_predict():
    """Test predict endpoint with dataset images"""
    categories = ["plastic", "glass", "metal", "paper", "cardboard", "trash"]
    
    for category in categories:
        category_path = DATASET_PATH / category
        if not category_path.exists():
            print(f"⚠️  Category folder not found: {category}")
            continue
        
        # Get first image in category
        images = list(category_path.glob("*.jpg"))
        if not images:
            print(f"⚠️  No images found in {category}")
            continue
        
        test_image = images[0]
        print(f"Testing {category} with {test_image.name}...")
        
        try:
            with open(test_image, 'rb') as f:
                files = {'file': f}
                response = requests.post(f"{API_BASE}/predict", files=files, timeout=30)
            
            if response.status_code == 200:
                data = response.json()
                pred_category = data.get('category')
                confidence = data.get('confidence')
                print(f"   ✅ Predicted: {pred_category} ({confidence}%)")
            else:
                print(f"   ❌ Error {response.status_code}: {response.json()}")
        except Exception as e:
            print(f"   ❌ Request failed: {e}")
        
        print()

if __name__ == "__main__":
    print("🧪 Testing SORTIFY Backend\n")
    
    if not test_health():
        exit(1)
    
    print("Testing /predict endpoint with dataset images:")
    print("=" * 50)
    test_predict()
    print("=" * 50)
    print("✅ All tests completed!")
