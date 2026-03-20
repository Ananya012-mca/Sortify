# Waste Classification Chatbot 🤖

A specialized, fully functional chatbot designed to help users with waste classification, recycling tips, environmental impact information, and comprehensive waste disposal guidance.

## ✨ Features

- **Smart Waste Categorization**: Get detailed info about 6 waste categories (cardboard, glass, metal, paper, plastic, trash)
- **Recycling Tips & Best Practices**: Learn how to properly prepare items for recycling
- **Environmental Impact**: Understand the ecological benefits and decomposition timelines
- **Reuse Ideas**: Get creative suggestions to repurpose items before disposal
- **Item-Specific Disposal Guides**: Find disposal methods for 30+ specific items (batteries, electronics, paint, etc.)
- **Context-Based Tips**: Receive tailored advice for home, office, restaurant, or travel scenarios
- **FAQ Support**: Answer 50+ frequently asked recycling questions with smart matching
- **Real-time Interactive Chat**: Conversational interface with typing indicators and timestamps
- **Auto-Reconnection**: Automatic retry logic when API connection is lost
- **Environmental Facts**: Share interesting recycling and sustainability statistics

## 🗑️ Waste Categories Supported

1. **Cardboard** ♻️ - Cardboard boxes and corrugated materials
2. **Glass** 🍾 - Glass bottles, jars, and containers
3. **Metal** 🥫 - Aluminum and steel cans and containers
4. **Paper** 📄 - Newspaper, magazines, office paper
5. **Plastic** 🥤 - Plastic bottles and containers (types 1-7)
6. **Trash** 🗑️ - Non-recyclable waste and general refuse

## 🚀 Quick Start

### Backend API Setup (Python)

1. Navigate to the chatbot directory:
```bash
cd chatbot
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Run the chatbot API server:
```bash
python chatbot_api.py
```

The API will start on `http://localhost:5001` and display:
```
Starting Waste Classification Chatbot API on port 5001
```

### Frontend Setup (React)

The chatbot is pre-integrated into the React frontend. Simply navigate to `/chatbot` route in the app or click the floating robot head button (🤖) on any page.

## 🔌 API Endpoints

### Health Check
```
GET /health
Response: { "status": "ok", "service": "Waste Classification Chatbot API", "version": "1.0" }
```

### Chat
```
POST /chat
Request: { "message": "Tell me about plastic recycling" }
Response: { "success": true, "response": "...", "type": "info", ... }
```

### Get All Categories
```
GET /chat/categories
Response: { "success": true, "categories": [...], "total": 6 }
```

### Get Waste Type Information
```
GET /chat/info/<waste_type>
Example: GET /chat/info/plastic
```

### Get Recycling Tips
```
GET /chat/tips/<waste_type>
Example: GET /chat/tips/glass
```

### Get Reuse Ideas
```
GET /chat/reuse/<waste_type>
Example: GET /chat/reuse/cardboard
```

### Get Environmental Impact
```
GET /chat/impact/<waste_type>
Example: GET /chat/impact/aluminum
```

### Get Random Eco Fact
```
GET /chat/fact
Response: { "success": true, "fact": "🌍 Recycling one aluminum can saves..." }
```

## 💬 Example Queries

**Waste Information:**
- "Tell me about cardboard recycling"
- "How do I recycle plastic bottles?"
- "What should I do with glass containers?"

**Disposal Methods:**
- "How to dispose of batteries?"
- "Where should I throw electronics?"
- "Can I recycle paint cans?"

**Context-Specific:**
- "Recycling tips for home"
- "How to organize office waste"
- "Tips for restaurant waste management"

**General Info:**
- "Tell me a fact"
- "What's the environmental impact?"
- "How long does plastic take to decompose?"

**FAQs:**
- "Can I recycle wet paper?"
- "What about plastic bags?"
- "How to find recycling near me?"

## 🏗️ Architecture

```
chatbot/
├── chatbot.py              # Core NLP engine with knowledge base
├── chatbot_api.py          # Enhanced Flask API (improved)
├── requirements.txt        # Python dependencies
└── README.md              # Documentation

frontend/src/
├── components/
│   ├── chatbot.jsx        # Main chatbot UI (improved)
│   ├── FloatingChatbot.jsx # Floating robot button
│   └── chatbot.css        # Styling (enhanced)
└── pages/
    └── ChatbotPage.jsx    # Full page view
```

## 🎯 Key Improvements (v1.0)

✅ **Enhanced Bot Symbol**: Uses robot head emoji (🤖) instead of chat bubble  
✅ **Auto-Reconnection**: Smart exponential backoff retry mechanism  
✅ **Retry Failed Messages**: One-click message retry on connection errors  
✅ **Health Check**: API health verification on component mount  
✅ **Better Error Messages**: Clear, actionable error feedback  
✅ **New Endpoints**: Reuse ideas, impact info, eco facts  
✅ **Improved API**: Standardized responses with success/error flags  
✅ **Enhanced UI**: Status indicator with connection state  
✅ **Logging**: Server-side request logging for debugging  
✅ **Bug Fixes**: Fixed syntax errors and improved stability  

## 🔧 Technical Stack

**Backend:**
- Python 3.8+
- Flask web framework
- Flask-CORS for cross-origin requests
- Custom NLP engine for intent matching

**Frontend:**
- React 18+
- Real-time message updates
- Responsive design
- Terminal-friendly emoji support

## 📊 Knowledge Base

### Quick Stats
- **6** Waste Categories with comprehensive details
- **50+** FAQ answers with fuzzy matching
- **30+** Specific item disposal guides
- **50+** Environmental statistics and eco facts
- **4** Context-specific tip sets (home/office/restaurant/travel)
- **8** Impact information summaries

### Sample Topics Covered
- Recycling processes and benefits
- Decomposition timelines
- Proper waste sorting techniques
- Common recycling mistakes
- Local recycling resources
- Donation and reuse options
- Hazardous material disposal
- Seasonal waste management

## 🌍 Environmental Impact

By using this chatbot to improve recycling practices, users can:
- Prevent millions of tons of waste from landfills
- Reduce carbon emissions and energy consumption
- Conserve natural resources and water
- Protect wildlife and ecosystems
- Support circular economy principles

## 🐛 Troubleshooting

**Chatbot Shows "Offline":**
1. Ensure the Python API is running: `python chatbot/chatbot_api.py`
2. Check if port 5001 is available
3. Wait for auto-reconnect (visible as "Retry" attempts)

**Messages Not Sending:**
1. Check browser console for error messages
2. Verify the API are running on localhost:5001
3. Click "Retry" button on error messages

**No Responses:**
1. Check that the message is waste-related
2. Try rephrasing the question naturally
3. Use one of the suggested quick buttons

## 📝 Notes

- The chatbot intelligently filters unrelated queries (non-waste topics)
- All responses are based on environmental best practices and verified facts
- Information is continuously updated with latest recycling guidelines
- The chatbot learns from conversation patterns to improve matching

## 🤝 Contributing

Found an issue or have suggestions? The chatbot knowledge base can be extended in `chatbot.py`:
- Add new waste categories
- Expand FAQ entries
- Add more disposal guides
- Include additional eco facts

---

**Made for Sortify - Sustainable Waste Management System** ♻️
