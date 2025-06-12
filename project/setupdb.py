from pymongo import MongoClient
from datetime import datetime

# Connect to MongoDB
client = MongoClient("mongodb+srv://admin:123456!@db.hsm1joq.mongodb.net/")
db = client["university_system"]

# Define collections
users = db["users"]
students = db["students"]
administrators = db["administrators"]
requests = db["requests"]
courses = db["courses"]
studcourses = db["studcourses"]

# Clean old data (optional — for dev only)
users.delete_many({})
students.delete_many({})
administrators.delete_many({})
courses.delete_many({})
studcourses.delete_many({})

### --- Create Student User (ID = 1) ---
student_user = {
    "_id": 1,
    "name": "Alice Student",
    "email": "alice@student.com",
    "password": "hashed_password",
    "type": "student"
}
users.insert_one(student_user)

students.insert_one({
    "user_id": student_user["_id"],
    "department": "Computer Science",
    "status": "active",
    "sum_points": 120,
    "average": 85.4
})

### --- Create Admin User (ID = 2) ---
admin_user = {
    "_id": 2,
    "name": "Bob Admin",
    "email": "bob@admin.com",
    "password": "hashed_password",
    "type": "admin"
}
users.insert_one(admin_user)

administrators.insert_one({
    "user_id": admin_user["_id"],
    "department": "Computer Science",
    "role": "Head of Department"
})

### --- Add Example Course ---
course = {
    "name": "Introduction to Databases",
    "lecturer": "Dr. Mongo",
    "department": "Computer Science",
    "points": 4
}
course_id = courses.insert_one(course).inserted_id

### --- Link Student to Course ---
studcourses.insert_one({
    "id_student": student_user["_id"],
    "id_course": course_id,
    "grade": None,
    "start": datetime.now(),
    "finish": None
})

print(" Users, roles, course, and enrollment added successfully!")
