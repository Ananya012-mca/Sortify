# SORTIFY Waste Classification - Debugging Guide

## Issue: Classification Failing

If you see "Classification failed for classifying" error, follow these steps:

### Step 1: Verify Backend is Running

```bash
curl http://localhost:5000/health
```

Should respond with: `{"status":"ok","message":"Backend is running"}`

If it fails, start the backend:
```bash
cd backend
python app.py
```

### Step 2: Test the /predict Endpoint Directly

Use curl to test with a real image from the dataset:

```bash
cd backend
curl -X POST http://localhost:5000/predict \
  -F "file=@../dataset/train/plastic/plastic1.jpg"
```

Expected response:
```json
{
  "category": "plastic",
  "confidence": 85.5,
  "suggestions": [],
  "timestamp": "2026-02-10T..."
}
```

### Step 3: Check Frontend Environment

Make sure these are set in `frontend/src/config.js`:

```javascript
const API_BASE_URL = "http://localhost:5000";
export default API_BASE_URL;
```

### Step 4: Run Automated Backend Test

```bash
cd backend
python test_api.py
```

This will:
1. Check if backend is healthy
2. Test the /predict endpoint with a dataset image
3. Show any errors or responses

### Step 5: Check Browser Console

Open browser DevTools (F12) and check Console tab:
- Look for "Classification error:" messages
- Check Network tab → POST to `/predict`
- See actual response status and error details

### Step 6: Check Backend Logs

Look at the Flask server terminal output for:
- Model loading errors
- TensorFlow/Keras errors
- MongoDB connection issues
- CORS errors

### Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| `No image uploaded` | Frontend not sending file properly |
| `Model loading failed` | TensorFlow/Keras not installed or model.h5 corrupted |
| `MongoDB connection error` | MongoDB not running on localhost:27017 |
| `CORS error` | Frontend and backend not on same origin (fix: ensure localhost:5000 for API) |
| `Socket timeout` | Model is too slow, increase request timeout |

### Quick Test Command (Bash/PowerShell)

```bash
# Test health endpoint
curl http://localhost:5000/health

# Test predict with dataset image
curl -X POST http://localhost:5000/predict \
  -F "file=@./dataset/train/plastic/plastic1.jpg"
```

### If Still Failing

1. **Check Python dependencies in backend:**
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

2. **Verify model file exists:**
   ```bash
   ls -la backend/waste_classification_model.h5
   ```

3. **Check MongoDB is running:**
   ```bash
   # Windows
   mongod
   
   # Or check if service is running
   ```

4. **Test with browser DevTools** - capture the actual error from Network tab and share it.
