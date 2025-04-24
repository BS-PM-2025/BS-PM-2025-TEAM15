from pymongo import MongoClient, ReturnDocument
from datetime import datetime

# === MongoDB Setup ===
client = MongoClient("mongodb+srv://admin:123456!@db.hsm1joq.mongodb.net/")
db = client["university_system"]

# === Collections ===
users = db["users"]
students = db["students"]
administrators = db["administrators"]
requests = db["requests"]
courses = db["courses"]
studcourses = db["studcourses"]

# === Authentication ===
def login(email, password):
    user = users.find_one({"email": email, "password": password})
    return user["_id"] if user else None

def is_admin(user_id):
    return administrators.find_one({"user_id": user_id}) is not None

# === User Info Getters ===
def get_user_info(user_id):
    return users.find_one({"_id": user_id}, {"password": 0})

def get_user_name_by_id(user_id):
    user = users.find_one({"_id": user_id})
    return user.get("name") if user else None

def get_user_email_by_id(user_id):
    user = users.find_one({"_id": user_id})
    return user.get("email") if user else None

def get_user_password_by_id(user_id):
    user = users.find_one({"_id": user_id})
    return user.get("password") if user else None

def get_user_type_by_id(user_id):
    user = users.find_one({"_id": user_id})
    return user.get("type") if user else None

# === Student Info ===
def get_full_student_profile(student_id):
    user = users.find_one({"_id": student_id})
    student_data = students.find_one({"user_id": student_id})
    if user and student_data:
        profile = {**user, **student_data}
        profile.pop("user_id", None)
        return profile
    return None

def get_student_department_by_id(user_id):
    student = students.find_one({"user_id": user_id})
    return student.get("department") if student else None

def get_student_status_by_id(user_id):
    student = students.find_one({"user_id": user_id})
    return student.get("status") if student else None

def get_student_sum_points_by_id(user_id):
    student = students.find_one({"user_id": user_id})
    return student.get("sum_points") if student else None

def get_student_average_by_id(user_id):
    student = students.find_one({"user_id": user_id})
    return student.get("average") if student else None

def update_average(student_id):
    course_ids = get_all_courses(student_id)
    grades = [get_grade(student_id, cid) for cid in course_ids]
    valid_grades = [g for g in grades if g is not None]
    if valid_grades:
        new_avg = sum(valid_grades) / len(valid_grades)
        students.update_one({"user_id": student_id}, {"$set": {"average": new_avg}})
        return new_avg
    return None

# === Admin Info ===
def get_admin_department_by_id(user_id):
    admin = administrators.find_one({"user_id": user_id})
    return admin.get("department") if admin else None

def get_admin_role_by_id(user_id):
    admin = administrators.find_one({"user_id": user_id})
    return admin.get("role") if admin else None

# === Courses ===
def get_all_courses(student_id):
    return [entry["id_course"] for entry in studcourses.find({"id_student": student_id})]

def get_grade(student_id, course_id):
    entry = studcourses.find_one({"id_student": student_id, "id_course": course_id})
    return entry.get("grade") if entry else None

def get_average(student_id):
    grades = [get_grade(student_id, cid) for cid in get_all_courses(student_id)]
    valid = [g for g in grades if g is not None]
    return sum(valid) / len(valid) if valid else None

def enroll_student(id_student, id_course):
    if studcourses.find_one({"id_student": id_student, "id_course": id_course}):
        return False
    studcourses.insert_one({
        "id_student": id_student,
        "id_course": id_course,
        "grade": None,
        "start": datetime.now(),
        "finish": None
    })
    return True

def update_grade(student_id, course_id, grade):
    result = studcourses.update_one(
        {"id_student": student_id, "id_course": course_id},
        {"$set": {"grade": grade}}
    )
    return result.modified_count > 0

def get_course_info(course_id):
    return courses.find_one({"_id": course_id})

# === Requests / Asks ===
def get_all_asks(student_id):
    return [ask["_id"] for ask in requests.find({"id_sending": student_id})]

def get_open_asks_for_admin(admin_id):
    return list(requests.find({"id_receiving": admin_id, "status": {"$ne": "closed"}}))

def get_pending_asks_for_admin(admin_id):
    return list(requests.find({"id_receiving": admin_id, "status": "pending"}))

def department_asks(dept_name):
    return [ask["_id"] for ask in requests.find({"department": dept_name})]

def change_ask_status(ask_id, new_status):
    result = requests.update_one({"_id": ask_id}, {"$set": {"status": new_status}})
    return result.modified_count > 0

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

def delete_ask(ask_id):
    result = requests.delete_one({"_id": ask_id})
    return result.deleted_count > 0
