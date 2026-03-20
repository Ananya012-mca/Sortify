from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_pymongo import PyMongo
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from predict import predict_waste
import os
from datetime import datetime

app = Flask(__name__)

# Enhanced CORS configuration for frontend-backend communication
CORS(app, 
     origins=["http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:5174", "http://127.0.0.1:5174", "http://localhost:5175", "http://127.0.0.1:5175", "http://localhost:5176", "http://127.0.0.1:5176", "http://localhost:5177", "http://127.0.0.1:5177", "http://localhost:5178", "http://127.0.0.1:5178", "http://localhost:5179", "http://127.0.0.1:5179", "http://localhost:3000"],
     supports_credentials=True,
     allow_headers=["Content-Type", "Authorization"],
     methods=["GET", "POST", "OPTIONS", "PUT", "DELETE"])

# Configuration
app.config["MONGO_URI"] = "mongodb://localhost:27017/waste_db"
app.config["JWT_SECRET_KEY"] = "super-secret-key"  # Change this in production

mongo = PyMongo(app)
bcrypt = Bcrypt(app)
jwt = JWTManager(app)

# Collections
users_col = mongo.db.users
history_col = mongo.db.history
rewards_col = mongo.db.rewards
redemptions_col = mongo.db.redemptions

@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok", "message": "Backend is running"}), 200

@app.route("/signup", methods=["POST"])
def signup():
    data = request.json
    name = data.get("name")
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"error": "Email and password required"}), 400

    if users_col.find_one({"email": email}):
        return jsonify({"error": "Email already exists"}), 400

    hashed_password = bcrypt.generate_password_hash(password).decode("utf-8")
    
    user_id = users_col.insert_one({
        "name": name or email.split("@")[0],
        "email": email,
        "password": hashed_password,
        "points": 0,
        "stats": {
            "cardboard": 0,
            "glass": 0,
            "metal": 0,
            "paper": 0,
            "plastic": 0,
            "trash": 0
        },
        "created_at": datetime.utcnow()
    }).inserted_id

    access_token = create_access_token(identity=email)
    return jsonify({
        "message": "User created successfully",
        "access_token": access_token,
        "user": {
            "name": name or email.split("@")[0],
            "email": email,
            "points": 0
        }
    }), 201

@app.route("/login", methods=["POST"])
def login():
    data = request.json
    email = data.get("email")
    password = data.get("password")

    user = users_col.find_one({"email": email})
    if user and bcrypt.check_password_hash(user["password"], password):
        access_token = create_access_token(identity=email)
        return jsonify({
            "access_token": access_token,
            "user": {
                "name": user["name"],
                "email": user["email"],
                "points": user.get("points", 0)
            }
        }), 200
    
    return jsonify({"error": "Invalid email or password"}), 401

@app.route("/predict", methods=["POST"])
@jwt_required(optional=True)
def predict():
    try:
        # Check file upload
        if "file" not in request.files:
            return jsonify({"category": "invalid", "confidence": 0.0}), 400

        file = request.files["file"]
        if not file or file.filename == "":
            return jsonify({"category": "invalid", "confidence": 0.0}), 400

        # Allowed categories - as list for proper comparison
        allowed_categories = ["paper", "plastic", "glass", "metal", "cardboard", "trash"]
        confidence_threshold = 0.15  # Softmax threshold for 6-class classification

        # Get prediction from model
        try:
            category, primary_conf, secondary_conf, is_authentic, auth_message, suggestions, raw_prediction = predict_waste(file)
        except Exception as model_error:
            print(f"Model prediction error: {model_error}")
            return jsonify({"category": "invalid", "confidence": 0.0}), 200

        # Check authenticity / face detection - if either failed, mark invalid
        if not is_authentic or category is None:
            print(f"Authenticity check failed: is_authentic={is_authentic}, category={category}")
            return jsonify({"category": "invalid", "confidence": 0.0}), 200

        # Normalize and validate category
        predicted_label = str(category).lower().strip()
        if predicted_label not in allowed_categories:
            print(f"Predicted label '{predicted_label}' not in allowed categories")
            return jsonify({"category": "invalid", "confidence": 0.0}), 200

        # Compute softmax probabilities from raw model output and enforce
        # the pre‑existing confidence threshold on the *raw* output.  We
        # intentionally keep the boosted value returned by predict_waste and
        # use that for the response/database so the front end shows the higher
        # percentage the user expects.
        try:
            import numpy as np
            raw_pred = np.array(raw_prediction, dtype=np.float32)
            
            # Compute softmax: exp(x) / sum(exp(x)) for numerical stability
            exp_pred = np.exp(raw_pred - np.max(raw_pred))
            softmax_probs = exp_pred / np.sum(exp_pred)
            
            # raw_confidence used solely for thresholding
            raw_confidence = float(np.max(softmax_probs))
            print(f"Predicted: {predicted_label}, raw confidence: {raw_confidence:.4f}, boosted confidence: {primary_conf:.4f}")
            
        except Exception as softmax_error:
            print(f"Softmax computation error: {softmax_error}")
            return jsonify({"category": "invalid", "confidence": 0.0}), 200

        # Apply confidence threshold (0.20 - reasonable for softmax on 6 classes)
        if raw_confidence < confidence_threshold:
            print(f"Raw confidence {raw_confidence:.4f} below threshold {confidence_threshold}")
            return jsonify({"category": "invalid", "confidence": 0.0}), 200

        # At this point classification is valid; use the boosted value when
        # communicating the confidence back to callers and storing in the DB
        confidence = float(primary_conf)
        # Update user database if authenticated
        current_user_email = get_jwt_identity()
        if current_user_email:
            try:
                record = {
                    "category": predicted_label,
                    "confidence": confidence,
                    "suggestions": suggestions,
                    "timestamp": datetime.utcnow(),
                    "email": current_user_email
                }
                history_col.insert_one(record)
                users_col.update_one(
                    {"email": current_user_email},
                    {
                        "$inc": {
                            "points": 10,
                            f"stats.{predicted_label}": 1
                        }
                    }
                )
            except Exception as db_error:
                print(f"Database update error: {db_error}")
                # Still return valid prediction even if DB update fails

        # Return valid category with confidence
        return jsonify({
            "category": predicted_label,
            "confidence": float(confidence)
        }), 200

    except Exception as e:
        print(f"Predict endpoint error: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({"category": "invalid", "confidence": 0.0}), 500

@app.route("/correct-prediction", methods=["POST"])
@jwt_required()
def correct_prediction():
    data = request.json
    history_id = data.get("history_id")
    correct_category = data.get("correct_category")
    old_category = data.get("old_category")
    
    if not history_id or not correct_category or not old_category:
        return jsonify({"error": "Missing data"}), 400
        
    current_user_email = get_jwt_identity()
    
    from bson.objectid import ObjectId
    
    # Update history entry
    result = history_col.update_one(
        {"_id": ObjectId(history_id), "email": current_user_email},
        {"$set": {"category": correct_category, "was_corrected": True}}
    )
    
    if result.modified_count > 0:
        # Update user stats
        users_col.update_one(
            {"email": current_user_email},
            {
                "$inc": {
                    f"stats.{old_category}": -1,
                    f"stats.{correct_category}": 1
                }
            }
        )
        return jsonify({"message": "Classification corrected successfully"}), 200
        
    return jsonify({"error": "Failed to update"}), 400

@app.route("/history", methods=["GET"])
@jwt_required()
def get_history():
    current_user_email = get_jwt_identity()
    history = list(history_col.find({"email": current_user_email}).sort("timestamp", -1))
    
    for item in history:
        item["_id"] = str(item["_id"])
        if "timestamp" in item and isinstance(item["timestamp"], datetime):
            item["timestamp"] = item["timestamp"].isoformat()
        
    return jsonify(history)

@app.route("/profile", methods=["GET"])
@jwt_required()
def get_profile():
    current_user_email = get_jwt_identity()
    user = users_col.find_one({"email": current_user_email}, {"password": 0})
    if user:
        user["_id"] = str(user["_id"])
        
        # Sync stats if they are missing or all zero but history exists
        stats = user.get("stats", {})
        total_stats = sum(stats.values()) if stats else 0
        
        if total_stats == 0:
            # Check history to see if we need to sync
            history_count = history_col.count_documents({"email": current_user_email})
            if history_count > 0:
                # Recalculate stats from history
                new_stats = {
                    "cardboard": 0,
                    "glass": 0,
                    "metal": 0,
                    "paper": 0,
                    "plastic": 0,
                    "trash": 0
                }
                user_history = history_col.find({"email": current_user_email})
                for item in user_history:
                    cat = item.get("category", "").lower()
                    if cat in new_stats:
                        new_stats[cat] += 1
                
                # Update user document
                users_col.update_one(
                    {"email": current_user_email},
                    {"$set": {"stats": new_stats}}
                )
                user["stats"] = new_stats
                
        return jsonify(user)
    return jsonify({"error": "User not found"}), 404

@app.route("/profile/update", methods=["PUT"])
@jwt_required()
def update_profile():
    current_user_email = get_jwt_identity()
    data = request.json
    name = data.get("name")
    
    if not name:
        return jsonify({"error": "Name is required"}), 400
        
    result = users_col.update_one(
        {"email": current_user_email},
        {"$set": {"name": name}}
    )
    
    if result.modified_count > 0:
        return jsonify({"message": "Profile updated successfully"})
    return jsonify({"message": "No changes made"})


@app.route("/profile/avatar", methods=["POST"])
@jwt_required()
def upload_avatar():
    current_user_email = get_jwt_identity()
    if "file" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files["file"]
    data = file.read()
    import base64
    # determine mime type from filename
    ext = file.filename.rsplit('.', 1)[-1].lower() if '.' in file.filename else 'png'
    mime = "image/png"
    if ext in ["jpg", "jpeg"]:
        mime = "image/jpeg"
    elif ext == "gif":
        mime = "image/gif"

    b64 = base64.b64encode(data).decode("utf-8")
    data_url = f"data:{mime};base64,{b64}"

    result = users_col.update_one({"email": current_user_email}, {"$set": {"avatar": data_url}})
    if result.modified_count > 0:
        return jsonify({"message": "Avatar uploaded", "avatar": data_url}), 200
    else:
        # even if not modified (same avatar), return success
        user = users_col.find_one({"email": current_user_email}, {"password": 0})
        return jsonify({"message": "Avatar updated", "avatar": user.get("avatar")}), 200


@app.route("/profile/photos", methods=["POST"])
@jwt_required()
def add_profile_photo():
    current_user_email = get_jwt_identity()
    if "file" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files["file"]
    data = file.read()
    import base64
    # determine mime type from filename
    ext = file.filename.rsplit('.', 1)[-1].lower() if '.' in file.filename else 'png'
    mime = "image/png"
    if ext in ["jpg", "jpeg"]:
        mime = "image/jpeg"
    elif ext == "gif":
        mime = "image/gif"

    b64 = base64.b64encode(data).decode("utf-8")
    data_url = f"data:{mime};base64,{b64}"

    # push the photo into an array on the user document
    result = users_col.update_one({"email": current_user_email}, {"$push": {"additional_images": data_url}})
    if result.modified_count > 0:
        return jsonify({"message": "Photo added", "added_photo": data_url}), 200
    else:
        # If not modified, still try to return current list
        user = users_col.find_one({"email": current_user_email}, {"password": 0})
        return jsonify({"message": "Photo added", "additional_images": user.get("additional_images", [])}), 200

@app.route("/rewards", methods=["GET"])
def get_rewards():
    rewards = list(rewards_col.find({}, {"_id": 0}))
    return jsonify(rewards)

@app.route("/redeem", methods=["POST"])
@jwt_required()
def redeem():
    data = request.json
    cost = data.get("cost")
    reward_id = data.get("reward_id")
    reward_title = data.get("reward_title")
    current_user_email = get_jwt_identity()

    user = users_col.find_one({"email": current_user_email})
    if not user:
        return jsonify({"error": "User not found"}), 404

    if user.get("points", 0) < cost:
        return jsonify({"error": "Insufficient points"}), 400

    # Deduct points
    users_col.update_one({"email": current_user_email}, {"$inc": {"points": -cost}})
    
    # Save redemption history
    redemption = {
        "email": current_user_email,
        "reward_id": reward_id,
        "reward_title": reward_title,
        "cost": cost,
        "timestamp": datetime.utcnow()
    }
    redemptions_col.insert_one(redemption)
    
    # Get updated points
    updated_user = users_col.find_one({"email": current_user_email})
    
    return jsonify({
        "message": "Reward redeemed successfully",
        "new_points": updated_user["points"]
    })

@app.route("/redemptions", methods=["GET"])
@jwt_required()
def get_redemptions():
    current_user_email = get_jwt_identity()
    redemptions = list(redemptions_col.find({"email": current_user_email}).sort("timestamp", -1))
    
    for item in redemptions:
        item["_id"] = str(item["_id"])
        if "timestamp" in item and isinstance(item["timestamp"], datetime):
            item["timestamp"] = item["timestamp"].isoformat()
        
    return jsonify(redemptions)

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)
