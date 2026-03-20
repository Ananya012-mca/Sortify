from flask import Flask, request, jsonify
from flask_cors import CORS
from chatbot import WasteclassificationChatbot
import logging
import json
import os

app = Flask(__name__)
CORS(app)
use_rag_flag = os.environ.get("USE_RAG", "0") == "1"
chatbot = WasteclassificationChatbot(use_rag=use_rag_flag)

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Health check endpoint
@app.route("/health", methods=["GET"])
def health_check():
    """Health check endpoint to verify API is running"""
    return jsonify({
        "status": "ok",
        "service": "Waste Classification Chatbot API",
        "version": "1.0"
    }), 200

@app.route("/chat", methods=["POST"])
def chat():
    """Handle chatbot messages with standard response format"""
    try:
        data = request.json
        if not data:
            return jsonify({"success": False, "error": "Invalid request format"}), 400
        
        user_message = data.get("message", "").strip()
        
        if not user_message:
            return jsonify({"success": False, "error": "No message provided"}), 400
        
        if len(user_message) > 1000:
            return jsonify({"success": False, "error": "Message too long (max 1000 characters)"}), 400
        
        logger.info(f"Chat request: {user_message[:100]}")
        response = chatbot.chat(user_message)
        
        # Standardize response
        response["success"] = True
        return jsonify(response), 200
    except Exception as e:
        logger.error(f"Chat error: {str(e)}")
        return jsonify({"success": False, "error": "Internal server error", "details": str(e)}), 500


@app.route("/chat/stream", methods=["POST"])
def chat_stream():
    """Stream chatbot responses for real-time LLM output. Returns chunked text.

    Clients should POST JSON {"message": "..."} and read the response body as a text stream.
    The stream ends with a line starting with '__RAG_SOURCES__:' followed by JSON containing sources.
    """
    try:
        data = request.json
        if not data:
            return jsonify({"success": False, "error": "Invalid request format"}), 400

        user_message = data.get("message", "").strip()
        if not user_message:
            return jsonify({"success": False, "error": "No message provided"}), 400

        logger.info(f"Chat stream request: {user_message[:100]}")

        # ALWAYS run the full chatbot logic first (greetings, facts, etc.)
        response = chatbot.chat(user_message)
        response_type = response.get("type", "")
        
        # Only use RAG streaming for rag_fallback and rag types when RAG is available
        if (response_type in ["rag_fallback", "rag"] and chatbot.use_rag and chatbot.rag is not None):
            def generate_rag():
                try:
                    for chunk in chatbot.rag.stream_answer(user_message, top_k=3):
                        if isinstance(chunk, bytes):
                            yield chunk
                        else:
                            yield chunk
                except Exception as e:
                    logger.error(f"Streaming error: {e}")
                    yield "\n[Error streaming response]\n"

            return app.response_class(generate_rag(), mimetype='text/plain; charset=utf-8')

        # For non-RAG responses, stream the chatbot response as plain text
        response_payload = {
            "text": response.get("response", ""),
            "type": response.get("type"),
            "data": response.get("data"),
            "sources": response.get("sources"),
            "success": True
        }

        def generate_fallback():
            try:
                # Stream the main text
                text = response_payload["text"] or ""
                yield text
                # Then yield a metadata marker the frontend understands
                try:
                    meta = {k: v for k, v in response_payload.items() if k != "text"}
                    yield "\n__RAG_SOURCES__:" + json.dumps(meta)
                except Exception:
                    yield "\n__RAG_SOURCES__:{}"
            except Exception as e:
                yield "\n[Error generating response]"

        return app.response_class(generate_fallback(), mimetype='text/plain; charset=utf-8')
    except Exception as e:
        logger.error(f"Chat stream error: {str(e)}")
        return jsonify({"success": False, "error": "Internal server error", "details": str(e)}), 500

@app.route("/chat/categories", methods=["GET"])
def get_categories():
    """Get all waste categories with additional info"""
    try:
        categories = chatbot.get_all_categories()
        category_emojis = {
            "plastic": "🥤",
            "glass": "🍾",
            "metal": "🥫",
            "paper": "📄",
            "cardboard": "📦",
            "trash": "🗑️"
        }
        
        categories_list = [
            {
                "name": cat.title(),
                "id": cat,
                "emoji": category_emojis.get(cat, "📦")
            }
            for cat in categories
        ]
        
        return jsonify({
            "success": True,
            "categories": categories_list,
            "total": len(categories_list)
        }), 200
    except Exception as e:
        logger.error(f"Categories error: {str(e)}")
        return jsonify({"success": False, "error": str(e)}), 500

@app.route("/chat/info/<waste_type>", methods=["GET"])
def get_waste_info(waste_type):
    """Get detailed info about a waste type"""
    try:
        info = chatbot.get_waste_info(waste_type.lower())
        if info:
            return jsonify({
                "success": True,
                "waste_type": waste_type.title(),
                "info": info
            }), 200
        else:
            return jsonify({
                "success": False,
                "error": f"Waste type '{waste_type}' not found. Available types: {', '.join(chatbot.get_all_categories())}"
            }), 404
    except Exception as e:
        logger.error(f"Info error: {str(e)}")
        return jsonify({"success": False, "error": str(e)}), 500

@app.route("/chat/tips/<waste_type>", methods=["GET"])
def get_tips(waste_type):
    """Get recycling tips for a waste type"""
    try:
        tips = chatbot.get_recycling_tips(waste_type.lower())
        if tips:
            return jsonify({
                "success": True,
                "waste_type": waste_type.title(),
                "tips": tips
            }), 200
        else:
            return jsonify({
                "success": False,
                "error": f"Waste type '{waste_type}' not found"
            }), 404
    except Exception as e:
        logger.error(f"Tips error: {str(e)}")
        return jsonify({"success": False, "error": str(e)}), 500

@app.route("/chat/reuse/<waste_type>", methods=["GET"])
def get_reuse(waste_type):
    """Get reuse ideas for a waste type"""
    try:
        ideas = chatbot.get_reuse_ideas(waste_type.lower())
        if ideas:
            return jsonify({
                "success": True,
                "waste_type": waste_type.title(),
                "reuse_ideas": ideas
            }), 200
        else:
            return jsonify({
                "success": False,
                "error": f"Waste type '{waste_type}' not found"
            }), 404
    except Exception as e:
        logger.error(f"Reuse error: {str(e)}")
        return jsonify({"success": False, "error": str(e)}), 500

@app.route("/chat/impact/<waste_type>", methods=["GET"])
def get_impact(waste_type):
    """Get environmental impact for a waste type"""
    try:
        impact = chatbot.get_impact_info(waste_type.lower())
        if impact:
            return jsonify({
                "success": True,
                "waste_type": waste_type.title(),
                "impact": impact
            }), 200
        else:
            return jsonify({
                "success": False,
                "error": f"Impact info for '{waste_type}' not available"
            }), 404
    except Exception as e:
        logger.error(f"Impact error: {str(e)}")
        return jsonify({"success": False, "error": str(e)}), 500

@app.route("/chat/fact", methods=["GET"])
def get_eco_fact():
    """Get a random eco-friendly fact"""
    try:
        fact = chatbot.get_random_fact()
        return jsonify({
            "success": True,
            "fact": fact
        }), 200
    except Exception as e:
        logger.error(f"Fact error: {str(e)}")
        return jsonify({"success": False, "error": str(e)}), 500

@app.errorhandler(404)
def not_found(error):
    """Handle 404 errors"""
    return jsonify({
        "success": False,
        "error": "Endpoint not found",
        "available_endpoints": [
            "GET /health",
            "POST /chat",
            "GET /chat/categories",
            "GET /chat/info/<waste_type>",
            "GET /chat/tips/<waste_type>",
            "GET /chat/reuse/<waste_type>",
            "GET /chat/impact/<waste_type>",
            "GET /chat/fact"
        ]
    }), 404

@app.errorhandler(500)
def internal_error(error):
    """Handle 500 errors"""
    logger.error(f"Internal error: {str(error)}")
    return jsonify({
        "success": False,
        "error": "Internal server error"
    }), 500

if __name__ == "__main__":
    logger.info("Starting Waste Classification Chatbot API on port 5001")
    app.run(debug=True, port=5001, host="0.0.0.0")
