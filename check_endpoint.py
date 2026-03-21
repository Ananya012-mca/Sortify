import io, os, sys
# ensure backend package is importable (same trick used in tests)
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'backend'))
from backend.app import app
from flask import json
from pathlib import Path

# create a test client
client = app.test_client()

first_img = None
for cls in ['cardboard','glass','metal','paper','plastic','trash']:
    p = Path('dataset/val')/cls
    if p.exists():
        imgs = list(p.glob('*'))
        if imgs:
            first_img = imgs[0]
            break

if not first_img:
    print('no image found')
else:
    print('testing with', first_img)
    with open(first_img,'rb') as f:
        data = {'file': (f, first_img.name)}
        resp = client.post('/predict', data=data, content_type='multipart/form-data')
        print('status', resp.status_code)
        print('json', resp.json)
