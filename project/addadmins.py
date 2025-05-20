from pymongo import MongoClient
from datetime import datetime, timedelta
import random

# --- Connect to MongoDB ---
client = MongoClient("mongodb+srv://admin:123456%21@db.hsm1joq.mongodb.net/?retryWrites=true&w=majority")
db = client["university_system"]
requests_col = db["requests"]

# --- Example responses ---
responses = [
    "Your request has been approved.",
    "Request was handled successfully.",
    "Completed. No further action needed.",
    "Check your email for final confirmation.",
    "Admin processed your request."
]

# --- Update all documents if fields are missing ---
all_docs = requests_col.find({})

updated_count = 0

for doc in all_docs:
    update_fields = {}

    if 'done_date' not in doc:
        update_fields['done_date'] = datetime.utcnow() - timedelta(days=random.randint(1, 10))

    if 'response_text' not in doc:
        update_fields['response_text'] = random.choice(responses)

    if update_fields:
        requests_col.update_one(
            { "_id": doc["_id"] },
            { "$set": update_fields }
        )
        updated_count += 1

print(f"\n✅ Updated {updated_count} documents with missing fields.")

