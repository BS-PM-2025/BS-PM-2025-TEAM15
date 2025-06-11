from pymongo import MongoClient

# --- Connect to MongoDB ---
client = MongoClient("mongodb+srv://admin:123456%21@db.hsm1joq.mongodb.net/?retryWrites=true&w=majority")
db = client["university_system"]

requests_col = db["requests"]
comments_col = db["comments"]

# --- Optional: clear existing comments first ---
# comments_col.delete_many({})  # uncomment if you want to reset

# --- Track how many created ---
created_count = 0

for request in requests_col.find():
    idr = request.get("idr")
    if idr is None:
        continue

    # Check if comment for this idr already exists
    if comments_col.find_one({"idr": idr}):
        continue  # skip existing

    # Create comment object
    comment_doc = {
        "idr": idr,
        "text": ""  # or prefill with something like f"Initial comment for idr {idr}"
    }

    comments_col.insert_one(comment_doc)
    created_count += 1

print(f"✅ Created {created_count} new comment documents.")
