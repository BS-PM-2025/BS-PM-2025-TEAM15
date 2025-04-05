from pymongo import MongoClient
from datetime import datetime

client = MongoClient("mongodb+srv://admin:123456!@db.hsm1joq.mongodb.net/")
db = client["university_system"]

# Collections
users = db["users"]
students = db["students"]
administrators = db["administrators"]
requests = db["requests"]
courses = db["courses"]
studcourses = db["studcourses"]

# 1. Login
def login(email, password):
    user = users.find_one({"email": email, "password": password})
    return user["_id"] if user else None

# 2. Is Admin
def is_admin(user_id):
    return administrators.find_one({"user_id": user_id}) is not None

# 3. Get All Courses for Student
def get_all_courses(student_id):
    return [entry["id_course"] for entry in studcourses.find({"id_student": student_id})]

# 4. Get Grade
def get_grade(student_id, course_id):
    entry = studcourses.find_one({"id_student": student_id, "id_course": course_id})
    return entry["grade"] if entry else None

# 5. Get Average
def get_average(student_id):
    course_ids = get_all_courses(student_id)
    grades = [get_grade(student_id, cid) for cid in course_ids]
    valid_grades = [g for g in grades if g is not None]
    return sum(valid_grades) / len(valid_grades) if valid_grades else None

# 6. Get All Requests (Asks) by Student
def get_all_asks(student_id):
    return [ask["_id"] for ask in requests.find({"id_sending": student_id})]

# 7. Department Asks
def department_asks(dept_name):
    return [ask["_id"] for ask in requests.find({"department": dept_name})]

# 8. Change Ask Status
def change_ask_status(ask_id, new_status):
    result = requests.update_one({"_id": ask_id}, {"$set": {"status": new_status}})
    return result.modified_count > 0

# 9. Add Ask
def add_ask(id_sending, id_receiving, importance, text, title, documents, department):
    ask = {
        "id_sending": id_sending,
        "id_receiving": id_receiving,
        "importance": importance,
        "text": text,
        "title": title,
        "date_sent": datetime.now(),
        "status": "pending",
        "documents": documents,
        "department": department
    }
    return requests.insert_one(ask).inserted_id

# 10. Enroll Student in Course
def enroll_student(id_student, id_course):
    exists = studcourses.find_one({"id_student": id_student, "id_course": id_course})
    if exists:
        return False  # Already enrolled
    studcourses.insert_one({
        "id_student": id_student,
        "id_course": id_course,
        "grade": None,
        "start": datetime.now(),
        "finish": None
    })
    return True
