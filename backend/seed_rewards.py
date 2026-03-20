from pymongo import MongoClient

def seed_rewards():
    client = MongoClient("mongodb://localhost:27017/")
    db = client["waste_db"]
    rewards_col = db["rewards"]

    # Clear existing rewards
    rewards_col.delete_many({})

    rewards = [
        {
            "id": 1,
            "title": "Free Coffee",
            "description": "Get a free coffee at your local eco-friendly cafe.",
            "cost": 100,
            "image": "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&h=200&fit=crop",
        },
        {
            "id": 2,
            "title": "Potted Plant",
            "description": "A small succulent to brighten up your space.",
            "cost": 250,
            "image": "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=200&fit=crop",
        },
        {
            "id": 3,
            "title": "Reusable Tote Bag",
            "description": "A stylish and sturdy tote bag for your groceries.",
            "cost": 400,
            "image": "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=200&fit=crop",
        },
        {
            "id": 4,
            "title": "Eco-Friendly Water Bottle",
            "description": "Stay hydrated with this sustainable stainless steel bottle.",
            "cost": 600,
            "image": "https://images.unsplash.com/photo-1602143399827-bd959683a347?w=400&h=200&fit=crop",
        },
        {
            "id": 5,
            "title": "Solar Powered Charger",
            "description": "Charge your devices using the power of the sun.",
            "cost": 1500,
            "image": "https://images.unsplash.com/photo-1594818379496-da1e345b0ded?w=400&h=200&fit=crop",
        }
    ]

    rewards_col.insert_many(rewards)
    print("Rewards seeded successfully!")

if __name__ == "__main__":
    seed_rewards()
