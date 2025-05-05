from pymongo import MongoClient, ReturnDocument
from datetime import datetime

# MongoDB Setup
client = MongoClient("mongodb+srv://admin:123456!@db.hsm1joq.mongodb.net/")
db = client["university_system"]

# Collections
users = db["users"]
students = db["students"]
administrators = db["administrators"]
requests = db["requests"]
courses = db["courses"]
studcourses = db["studcourses"]

# Helper
def to_int(x):
    try:
        return int(x)
    except (ValueError, TypeError):
        return x  # fallback for ObjectId or already-int values

# === Authentication ===
def login(email, password):
    user = users.find_one({"email": email, "password": password})
    return user["_id"] if user else None

def is_admin(user_id):
    return administrators.find_one({"user_id": to_int(user_id)}) is not None

# === User Info ===
def get_user_info(user_id):
    return users.find_one({"_id": to_int(user_id)}, {"password": 0})

def get_user_name_by_id(user_id):
    user = users.find_one({"_id": to_int(user_id)})
    return user.get("name") if user else None

def get_user_email_by_id(user_id):
    user = users.find_one({"_id": to_int(user_id)})
    return user.get("email") if user else None

def get_user_password_by_id(user_id):
    user = users.find_one({"_id": to_int(user_id)})
    return user.get("password") if user else None

def get_user_type_by_id(user_id):
    user = users.find_one({"_id": to_int(user_id)})
    return user.get("type") if user else None

def set_user(user_id, user_name, user_email, user_password, user_type):
    new_user = {
        "_id": to_int(user_id),
        "name": user_name,
        "email": user_email,
        "password": user_password,
        "type": user_type
    }
    return users.insert_one(new_user).inserted_id

# === Student Info ===
def get_full_student_profile(student_id):
    user = users.find_one({"_id": to_int(student_id)})
    student_data = students.find_one({"user_id": to_int(student_id)})
    if user and student_data:
        profile = {**user, **student_data}
        profile.pop("user_id", None)
        return profile
    return None

def get_student_department_by_id(user_id):
    student = students.find_one({"user_id": to_int(user_id)})
    return student.get("department") if student else None

def get_student_status_by_id(user_id):
    student = students.find_one({"user_id": to_int(user_id)})
    return student.get("status") if student else None

def get_student_sum_points_by_id(user_id):
    student = students.find_one({"user_id": to_int(user_id)})
    return student.get("sum_points") if student else None

def get_student_average_by_id(user_id):
    student = students.find_one({"user_id": to_int(user_id)})
    return student.get("average") if student else None

def update_average(student_id):
    avg = get_average(student_id)
    if avg is not None:
        students.update_one({"user_id": to_int(student_id)}, {"$set": {"average": avg}})
    return avg

# === Admin Info ===
def get_admin_department_by_id(user_id):
    admin = administrators.find_one({"user_id": to_int(user_id)})
    return admin.get("department") if admin else None

def get_admin_role_by_id(user_id):
    admin = administrators.find_one({"user_id": to_int(user_id)})
    return admin.get("role") if admin else None

# === Courses ===
def get_all_courses(student_id):
    return [entry["id_course"] for entry in studcourses.find({"id_student": to_int(student_id)})]

def get_grade(student_id, course_id):
    entry = studcourses.find_one({"id_student": to_int(student_id), "id_course": to_int(course_id)})
    return entry.get("grade") if entry else None

def get_average(student_id):
    grades = [get_grade(student_id, cid) for cid in get_all_courses(student_id)]
    valid = [g for g in grades if g is not None]
    return sum(valid) / len(valid) if valid else None

def enroll_student(id_student, id_course):
    if studcourses.find_one({"id_student": to_int(id_student), "id_course": to_int(id_course)}):
        return False
    studcourses.insert_one({
        "id_student": to_int(id_student),
        "id_course": to_int(id_course),
        "grade": None,
        "start": datetime.now(),
        "finish": None
    })
    return True

def update_grade(student_id, course_id, grade):
    result = studcourses.update_one(
        {"id_student": to_int(student_id), "id_course": to_int(course_id)},
        {"$set": {"grade": grade}}
    )
    return result.modified_count > 0

def get_course_info(course_id):
    return courses.find_one({"_id": course_id})  # don't cast to int

# === Requests / Asks ===
def get_student_asks(student_id):
    return [ask["idr"] for ask in requests.find({"id_sending": to_int(student_id)})]

def get_open_asks_for_admin(admin_id):
    return list(requests.find({"id_receiving": to_int(admin_id), "status": {"$ne": "closed"}}))

def get_pending_asks_for_admin(admin_id):
    return list(requests.find({"id_receiving": to_int(admin_id), "status": "pending"}))

def department_asks(dept_name):
    return [ask["_id"] for ask in requests.find({"department": dept_name})]

def change_ask_status(ask_id, new_status):
    result = requests.update_one({"_id": ask_id}, {"$set": {"status": new_status}})
    return result.modified_count > 0

def add_ask(id_sending, id_receiving, importance, text, title, documents, department):
    ask = {
        "id_sending": to_int(id_sending),
        "id_receiving": to_int(id_receiving),
        "importance": importance,
        "text": text,
        "title": title,
        "date_sent": datetime.now(),
        "status": "pending",
        "documents": documents,
        "department": department,
        "idr": requests.count_documents({}) + 1  # generate `idr` for integer indexing
    }
    return requests.insert_one(ask).inserted_id

def delete_ask(ask_id):
    result = requests.delete_one({"_id": ask_id})
    return result.deleted_count > 0

def get_ask_by_id(idr):
    ask = requests.find_one({"idr": to_int(idr)})
    if ask:
        ask["_id"] = str(ask["_id"])
        ask["date_sent"] = ask["date_sent"].isoformat()
    return ask


# === Requests / Ask Updates ===

def reassign_ask_by_idr(idr, new_admin_id):
    return requests.update_one(
        {"idr": to_int(idr)},
        {"$set": {
            "id_receiving": to_int(new_admin_id),
            "status": "pending"
        }}
    ).modified_count > 0

def update_ask_status_by_idr(idr, new_status, new_admin_id=None):
    update_fields = {"status": new_status}
    if new_admin_id is not None:
        update_fields["id_receiving"] = to_int(new_admin_id)
    return requests.update_one(
        {"idr": to_int(idr)},
        {"$set": update_fields}
    ).modified_count > 0

def append_note_to_ask(idr, note_text):
    ask = requests.find_one({"idr": to_int(idr)})
    if not ask:
        return False
    new_text = ask.get("text", "") + f"\n{note_text}"
    result = requests.update_one(
        {"idr": to_int(idr)},
        {"$set": {"text": new_text}}
    )
    return result.modified_count > 0
