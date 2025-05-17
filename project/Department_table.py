from pymongo import MongoClient

# Connect to MongoDB
client = MongoClient("mongodb+srv://admin:123456!@db.hsm1joq.mongodb.net/")
db = client["university_system"]

# Define validator
validator = {
    "$jsonSchema": {
        "bsonType": "object",
        "required": ["department"],
        "properties": {
            "department": {
                "bsonType": "string",
                "description": "must be a string and is required"
            },
            "courses": {
                "bsonType": "array",
                "description": "must be an array of course objects",
                "items": {
                    "bsonType": "object",
                    "required": ["year", "course_name", "university_credit"],
                    "properties": {
                        "year": {
                            "bsonType": "int",
                            "minimum": 1,
                            "maximum": 4,
                            "description": "Academic year (1 to 4)"
                        },
                        "course_name": {
                            "bsonType": "string",
                            "description": "Name of the course"
                        },
                        "university_credit": {
                            "bsonType": "int",
                            "minimum": 0,
                            "maximum": 30,
                            "description": "Credits for the course"
                        }
                    }
                }
            }
        }
    }
}

# Create collection with validation
db.create_collection("departments", validator=validator)

print("Collection 'departments' created with schema validation.")