import requests

try:
    resp = requests.get('http://127.0.0.1:5001/health', timeout=5)
    print('status', resp.status_code, 'json', resp.json())
except Exception as e:
    print('error', e)
