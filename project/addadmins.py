from pymongo import MongoClient

# --- Connect to MongoDB ---
client = MongoClient("mongodb+srv://admin:123456!@db.hsm1joq.mongodb.net/")
db = client["university_system"]
requests_col = db["requests"]

# --- Get all used idr values ---
used_idrs = set()
for doc in requests_col.find({"idr": {"$exists": True}}):
    used_idrs.add(doc["idr"])

# --- Function to find next available idr ---
def get_next_idr():
    current = 1
    while current in used_idrs:
        current += 1
    used_idrs.add(current)
    return current

# --- Assign missing idr values ---
updated = 0
for doc in requests_col.find({"idr": {"$exists": False}}):
    new_idr = get_next_idr()
    requests_col.update_one({"_id": doc["_id"]}, {"$set": {"idr": new_idr}})
    print(f"Updated document {doc['_id']} with idr={new_idr}")
    updated += 1

print(f"\n✅ Done. Assigned idr to {updated} request(s).")
