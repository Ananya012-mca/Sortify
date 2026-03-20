# 🤖 Chatbot Quick Start Guide

This guide will help you get the improved waste classification chatbot running in minutes.

## ⚡ Quick Start (2 Steps)

### Step 1: Start the Python API Server
Open a terminal and run:

```bash
python chatbot/chatbot_api.py
```

You should see:
```
Starting Waste Classification Chatbot API on port 5001
```

✅ The API is now running and ready to accept requests!

### Step 2: Open the Chatbot in Your App
- Navigate to the `/chatbot` route in your React app
- OR click the floating robot head button (🤖) on any page
- Start asking questions!

## 🎯 What's New

The chatbot now features:
- **Robot Head Symbol (🤖)** - Instead of chat bubble
- **Auto-Reconnection** - Automatically retries when connection is lost
- **Retry Failed Messages** - Click "Retry" button on failed messages
- **Better Error Messages** - Clear guidance when API is unavailable
- **Connection Status** - Shows online/offline status in real-time
- **Health Checks** - Verifies API connection on startup
- **6 New API Endpoints** - Get specific info without chatting

## 🔍 Example Queries to Try

```
"Tell me about plastic recycling"
"How to dispose of batteries?"
"Give me a recycling fact"
"Tips for home recycling"
"Can I recycle plastic bags?"
"How long does glass take to decompose?"
"What are reuse ideas for cardboard?"
"Recycling tips for metal"
```

## 🚨 Troubleshooting

### Chatbot Shows "Offline"
❌ **Problem:** The chatbot says "Waiting for API connection"

🔧 **Solution:**
1. Check if `python chatbot/chatbot_api.py` is running
2. Make sure no other service is using port 5001
3. The app will auto-reconnect (watch the status indicator)

### "Request timed out" Error
❌ **Problem:** Messages aren't going through

🔧 **Solution:**
1. The API server might be slow
2. Click the "Retry" button to try again
3. Ensure the Python process is still running

### Port 5001 Already in Use
❌ **Problem:** Error: `Address already in use`

🔧 **Solution:**
```bash
# Find the process using port 5001 (Windows)
netstat -ano | findstr :5001

# Find the process using port 5001 (Mac/Linux)
lsof -i :5001

# Kill the process (replace PID with the process ID)
taskkill /PID <PID> /F
```

Then run the server again.

## 📊 Testing the API Directly

You can test the API without the UI using curl or Postman:

```bash
# Test API health
curl http://localhost:5001/health

# Chat with the bot
curl -X POST http://localhost:5001/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Tell me about plastic"}'

# Get all categories
curl http://localhost:5001/chat/categories

# Get a random eco fact
curl http://localhost:5001/chat/fact
```

## 🎨 Customization

### Change the Robot Emoji
Edit `frontend/src/components/FloatingChatbot.jsx`:
```jsx
// Change this line:
<button>🤖</button>

// To any other emoji:
<button>🦾</button>  // Robot arm
<button>🔧</button>  // Wrench
<button>♻️</button>   // Recycle symbol
```

### Modify Chatbot Greeting
Edit `frontend/src/components/chatbot.jsx` and update the initial message in `useState`.

### Add More Knowledge
Edit `chatbot/chatbot.py` to add:
- New waste categories
- More FAQ answers
- Additional disposal guides
- More eco facts

## 📝 Architecture

```
Backend (Python):
  chatbot/chatbot_api.py (Flask server on port 5001)
  ├── Handles HTTP requests
  ├── Returns JSON responses
  └── Auto-logs requests

Frontend (React):
  frontend/src/components/chatbot.jsx
  ├── Sends messages to API
  ├── Shows connection status
  ├── Retries on failure
  └── Displays responses beautifully
```

## 🌐 API Response Format

All API responses follow this format:

```json
{
  "success": true,
  "response": "...",
  "type": "info",
  "data": {...}
}
```

Error responses:
```json
{
  "success": false,
  "error": "Descriptive error message"
}
```

## 🔐 Security Notes

- The API runs on `localhost:5001` (local only by default)
- CORS is enabled for development
- Messages are not stored permanently
- No personal data is collected

For production deployment:
1. Change `host="0.0.0.0"` to specific IP
2. Use `debug=False`
3. Add authentication if needed
4. Use HTTPS in production

## 📞 Common Commands

```bash
# Start the API server
python chatbot/chatbot_api.py

# Check if API is running (in another terminal)
curl http://localhost:5001/health

# Development mode (React frontend)
npm run dev  # (from frontend directory)

# Build frontend
npm run build  # (from frontend directory)
```

## 🎓 Learn More

- See full API documentation: `chatbot/README.md`
- Check chatbot knowledge base: `chatbot/chatbot.py`
- Frontend component details: `frontend/src/components/chatbot.jsx`

## ✨ Tips for Best Results

1. **Be Natural** - The chatbot understands conversational questions
2. **Be Specific** - Mention the waste type you're asking about
3. **Ask Follow-ups** - The bot remembers context
4. **Try Suggestions** - Click the suggested buttons for quick answers
5. **Check Status** - Look at the connection indicator (🟢 online/🔴 offline)

---

**Happy Recycling! ♻️**

For detailed API documentation, see [chatbot/README.md](chatbot/README.md)
