from pymongo import MongoClient

# --- Connect to MongoDB ---
client = MongoClient("mongodb+srv://admin:123456%21@db.hsm1joq.mongodb.net/?retryWrites=true&w=majority")
db = client["university_system"]

# --- Create the 'notifications' collection ---
if "notifications" not in db.list_collection_names():
    db.create_collection("notifications")
    print("Collection 'notifications' created.")
else:
    print("Collection 'notifications' already exists.")
