from pymongo import MongoClient,ReturnDocument
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
    return [ask["_id"] for ask in requests.find({"id_sending": int(student_id)})]

# 7. Department Asks
def department_asks(dept_name):
    return [ask["_id"] for ask in requests.find({"department": dept_name})]

# 8. Change Ask Status
def change_ask_status(ask_id, new_status):
    result = requests.update_one({"_id": int(ask_id)}, {"$set": {"status": new_status}})
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

# 11. Get User Info (excluding password)
def get_user_info(user_id):
    return users.find_one({"_id":int(user_id)}, {"password": 0})



def get_user_name(user_id):
    user = users.find_one({"_id": int( user_id)} )
   
    if user:
        return user.get("name")
    return None



# 12. Get Full Student Profile
def get_full_student_profile(student_id):
    user = users.find_one({"_id":int (student_id)})
    student_data = students.find_one({"user_id": int(student_id)})
    if user and student_data:
        profile = {**user, **student_data}
        profile.pop("user_id", None)
        return profile
    return None

# 13. Get Pending Asks for Admin
def get_pending_asks_for_admin(admin_id):
    return list(requests.find({"id_receiving": admin_id, "status": "pending"}))

# 14. Delete Ask
def delete_ask(ask_id):
    result = requests.delete_one({"_id": int(ask_id)})
    return result.deleted_count > 0

# 15. Get Course Info
def get_course_info(course_id):
    return courses.find_one({"_id": int(course_id)})

# 16. Update Grade for Student in a Course
def update_grade(student_id, course_id, grade):
    result = studcourses.update_one(
        {"id_student": student_id, "id_course": int(course_id)},
        {"$set": {"grade": grade}}
    )
    return result.modified_count > 0

# 17. Update Average for a Student
def update_average(student_id):
    course_ids = get_all_courses(student_id)
    grades = [get_grade(student_id, cid) for cid in course_ids]
    valid_grades = [g for g in grades if g is not None]
    if valid_grades:
        new_avg = sum(valid_grades) / len(valid_grades)
        students.update_one({"user_id": int(student_id)}, {"$set": {"average": new_avg}})
        return new_avg
    return None

# ===== Set User =====
def set_User(user_id, user_name, user_email, user_password, user_type):
    ask = {
        "_id": int(user_id),
        "email": user_email,
        "name": user_name,
        "password": user_password,
        "type": user_type,
    }
    return users.insert_one(ask).inserted_id