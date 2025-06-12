from pymongo import MongoClient

# Connect to MongoDB
client = MongoClient("mongodb+srv://admin:123456!@db.hsm1joq.mongodb.net/")
db = client["university_system"]

# Define collections
users = db["users"]
administrators = db["administrators"]

# Create list of new admins
new_admins = [
    {
        "_id": 3,
        "name": "Dana Math",
        "email": "dana@math.com",
        "password": "hashed_password",
        "type": "admin",
        "department": "Mathematics",
        "role": "Math Department Admin"
    },
    {
        "_id": 4,
        "name": "Eli Fin",
        "email": "eli@scifin.com",
        "password": "hashed_password",
        "type": "admin",
        "department": "Finance",
        "role": "SciFin Department Admin"
    },
    {
        "_id": 5,
        "name": "Rina Student",
        "email": "rina@studentbody.com",
        "password": "hashed_password",
        "type": "admin",
        "department": "Student Body",
        "role": "Student Body Admin"
    }
]

# Insert each admin
for admin in new_admins:
    # Insert into users collection
    users.insert_one({
        "_id": admin["_id"],
        "name": admin["name"],
        "email": admin["email"],
        "password": admin["password"],
        "type": admin["type"]
    })

    # Insert into administrators collection
    administrators.insert_one({
        "user_id": admin["_id"],
        "department": admin["department"],
        "role": admin["role"]
    })

print("3 new admins inserted successfully!")
