from pymongo import MongoClient, ReturnDocument
from datetime import datetime
from django.http import JsonResponse
from collections import defaultdict
from bson import ObjectId


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
departments = db["departments"]
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
    uid = to_int(user_id)
    return (
        db.administrators.find_one({"user_id": uid}) is not None
        or db.professors.find_one({"user_id": uid}) is not None
    )


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
def get_all_students():
    students_cursor = students.find()
    return list(students_cursor)  


def set_Student(user_id, department, status, sum_points, average):
    new_Student = {
        "user_id": to_int(user_id),
        "department": department,
        "status": status,
        "sum_points": sum_points,
        "average": average
    }
    return students.insert_one(new_Student).inserted_id

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
def get_all_courses(student_id): #get courses for student
    return [entry["id_course"] for entry in studcourses.find({"id_student": to_int(student_id)})]

def get_courses_in_list(student_id):
    return list(studcourses.find({"id_student": to_int(student_id)}))


def get_grade(student_id, course_id):
    entry = studcourses.find_one({"id_student": to_int(student_id), "id_course":(course_id)}) 
    return entry.get("grade") if entry else None

def find_courses_with_nested_id(target_course_id_str,user_id):
    print(f"Looking for entries with course ID $oid: {target_course_id_str}")
    
    
    # Initialize counters and result list
    total_checked = 0
    matches_found = 0
    matching_entries = []
    grade = 0
    # Get all entries
    all_entries = studcourses.find()
    
    # Iterate through each entry
    for entry in all_entries:
        total_checked += 1
        
        # Extract the course ID from the nested structure
        entry_course_id = None
        id_course_field = entry.get('id_course')
        
        # Handle different possible structures
        if isinstance(id_course_field, dict) and '$oid' in id_course_field:
            entry_course_id = id_course_field['$oid']
        elif hasattr(id_course_field, 'id') and hasattr(id_course_field.id, 'hex'):
            # If it's an ObjectId directly
            entry_course_id = str(id_course_field)
        else:
            # Try string conversion as fallback
            entry_course_id = str(id_course_field)
        
        # Check for match
        if entry_course_id and target_course_id_str in entry_course_id:
        
                matches_found += 1
                matching_entries.append(entry)
                if(entry["id_student"],user_id):
                    print("std",entry["id_student"])
                    print("grade?",entry["grade"])
                    grade = entry["grade"]
                    return grade
                # Display the matching entry
                print(f"\nMatch #{matches_found} found:")
                for key, value in entry.items():
                    print(f"  {key}: {value}")

    # Print summary
    print(f"\nChecked {total_checked} entries in total")
    print(f"Found {matches_found} entries with course ID $oid matching {target_course_id_str}")
    
    return matching_entries


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

def get_course_info(course_id):
    return courses.find_one({"_id": course_id})  # don't cast to int

def get_course_full_info(course_id):
    try:
        if isinstance(course_id, dict) and "$oid" in course_id:
            course_id = ObjectId(course_id["$oid"])
        elif isinstance(course_id, str):
            course_id = ObjectId(course_id)
        return courses.find_one({"_id": course_id})
    except Exception as e:
        print(f"Error in get_course_info: {e}")
        return None

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

def add_ask(id_sending, id_receiving, importance, text, title, documents, department,category):
    last_doc = db.requests.find_one({}, {'idr': 1}, sort=[('idr', -1)])
    last_idr = int(last_doc['idr']) if last_doc and 'idr' in last_doc else 0
    new_idr = last_idr + 1   
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
        "idr": new_idr,  # generate `idr` for integer indexing
        "category": category
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

#departements

#get all courses of a departments
def get_courses_grouped_by_year_and_semester(department_name):
    query = {"department": department_name}
    all_courses = departments.find(query)

    result = defaultdict(lambda: defaultdict(list))

    for course in all_courses:
        year = course.get("year")
        semester = course.get("semester")

        if not year or not semester or not course.get("name"):
            continue

        course_info = {
            "name": course.get("name"),
            "year": year,
            "semester": semester,
            "status": course.get("status", "Locked"),
            "grade": course.get("grade", "-"),
            "depend_on": course.get("depand_on")
        }

        result[year][semester].append(course_info)

    # Ensure both semesters exist for every year
    semester_names = ["First", "Second"]
    for year in result:
        for semester in semester_names:
            result[year][semester] = result[year].get(semester, [])
    print(dict(result))
    return dict(result)

def get_course_by_oid(course_id):
    entry = courses.find_one({"_id": to_int(course_id)})
  
    return entry['name']

def get_available_courses(user_id):
    student = students.find_one({"user_id": to_int(user_id)})
    if not student:
        return []

    department = student.get("department")
    if not department:
        return []

    # 1. Get all course names listed in the department
    department_courses = departments.find({"department": department})
    course_names = [c["name"] for c in department_courses if "name" in c]

    # 2. Get all course docs with those names
    course_docs = list(courses.find({"name": {"$in": course_names}}))

    # 3. Get enrolled course IDs for this student
    enrolled = studcourses.find({"id_student": to_int(user_id)})
    enrolled_ids = {e["id_course"] for e in enrolled}

    # 4. Filter out already enrolled courses
    available_courses = [c for c in course_docs if c["_id"] not in enrolled_ids]

    return available_courses

def get_courses_by_lecturer(lecturer_id):
    return list(db.courses.find({"lecturer": lecturer_id}))

def get_students_for_course(course_id):
    try:
        print("🔍 get_students_for_course called with:", course_id)

        # Convert to ObjectId
        course_oid = ObjectId(course_id)

        enrollments = list(db.studcourses.find({"id_course": course_oid}))
        print("📚 Found enrollments:", enrollments)

        results = []

        for e in enrollments:
            student = db.students.find_one({"user_id": e["id_student"]})
            user = db.users.find_one({"_id": e["id_student"]})
            print(f"👤 Fetching student {e['id_student']}: student={student}, user={user}")

            if student and user:
                results.append({
                    "user_id": e["id_student"],
                    "name": user.get("name", "Unknown"),
                    "grade": e.get("grade", None)
                })

        print("✅ Final student list:", results)
        return results

    except Exception as e:
        print("❌ Error in get_students_for_course:", e)
        return []


def update_student_grade(user_id, course_id, new_grade):
    from bson import ObjectId
    if isinstance(course_id, str):
        course_id = ObjectId(course_id)

    result = db.studcourses.update_one(
        {"id_student": user_id, "id_course": course_id},
        {"$set": {"grade": new_grade}}
    )
    print("🔄 update result:", result.modified_count)
    return result.modified_count
