import pytest
import mongomock
from app import dbcommands as db

@pytest.fixture
def mock_db(monkeypatch):
    client = mongomock.MongoClient()
    mock = client["university_system"]

    # Critical patch to support db.db.*
    monkeypatch.setattr(db, "db", mock)

    # Patch individual collections
    monkeypatch.setattr(db, "users", mock.users)
    monkeypatch.setattr(db, "students", mock.students)
    monkeypatch.setattr(db, "administrators", mock.administrators)
    monkeypatch.setattr(db, "professors", mock.professors)
    monkeypatch.setattr(db, "requests", mock.requests)
    monkeypatch.setattr(db, "comments", mock.comments)
    monkeypatch.setattr(db, "courses", mock.courses)
    monkeypatch.setattr(db, "studcourses", mock.studcourses)
    monkeypatch.setattr(db, "departments", mock.departments)

    return mock

def test_set_user_and_login(mock_db):
    db.set_user(1, "Tali", "tali@example.com", "123", "student")
    assert db.login("tali@example.com", "123") == 1

def test_is_admin_true(mock_db):
    db.administrators.insert_one({"user_id": 2})
    assert db.is_admin(2)

def test_is_admin_false(mock_db):
    assert db.is_admin(999) is False

def test_is_prof_true(mock_db):
    mock_db.professors.insert_one({"user_id": 3})
    assert db.is_prof(3) is True


def test_get_user_info(mock_db):
    db.users.insert_one({"_id": 4, "name": "Dana", "email": "dana@x.com", "password": "abc", "type": "admin"})
    user = db.get_user_info(4)
    assert user["name"] == "Dana"
    assert "password" not in user

def test_get_user_name_by_id(mock_db):
    db.users.insert_one({"_id": 5, "name": "Alex"})
    assert db.get_user_name_by_id(5) == "Alex"

def test_get_user_email_by_id(mock_db):
    db.users.insert_one({"_id": 6, "email": "a@b.com"})
    assert db.get_user_email_by_id(6) == "a@b.com"

def test_get_user_password_by_id(mock_db):
    db.users.insert_one({"_id": 7, "password": "secret"})
    assert db.get_user_password_by_id(7) == "secret"

def test_get_user_type_by_id(mock_db):
    db.users.insert_one({"_id": 8, "type": "admin"})
    assert db.get_user_type_by_id(8) == "admin"

def test_get_all_students(mock_db):
    db.students.insert_one({"user_id": 9})
    students = db.get_all_students()
    assert any(s["user_id"] == 9 for s in students)

def test_set_Student(mock_db):
    sid = db.set_Student(10, "CS", "active", 100, 80)
    s = mock_db.students.find_one({"user_id": 10})
    assert s["department"] == "CS"

def test_get_full_student_profile(mock_db):
    db.users.insert_one({"_id": 11, "name": "Leo"})
    db.students.insert_one({"user_id": 11, "department": "Math"})
    profile = db.get_full_student_profile(11)
    assert profile["name"] == "Leo"
    assert profile["department"] == "Math"

def test_get_student_department_by_id(mock_db):
    db.students.insert_one({"user_id": 12, "department": "Bio"})
    assert db.get_student_department_by_id(12) == "Bio"

def test_get_student_status_by_id(mock_db):
    db.students.insert_one({"user_id": 13, "status": "grad"})
    assert db.get_student_status_by_id(13) == "grad"

def test_get_student_sum_points_by_id(mock_db):
    db.students.insert_one({"user_id": 14, "sum_points": 130})
    assert db.get_student_sum_points_by_id(14) == 130

def test_get_student_average_by_id(mock_db):
    db.students.insert_one({"user_id": 15, "average": 91})
    assert db.get_student_average_by_id(15) == 91

def test_get_admin_department_by_id(mock_db):
    db.administrators.insert_one({"user_id": 16, "department": "Physics"})
    assert db.get_admin_department_by_id(16) == "Physics"

def test_get_admin_role_by_id(mock_db):
    db.administrators.insert_one({"user_id": 17, "role": "Head"})
    assert db.get_admin_role_by_id(17) == "Head"

def test_set_user_and_check_type(mock_db):
    db.set_user(18, "Ben", "ben@x.com", "123", "professor")
    assert db.get_user_type_by_id(18) == "professor"

from datetime import datetime
from bson import ObjectId

def test_get_all_courses(mock_db):
    mock_db.studcourses.insert_many([
        {"id_student": 20, "id_course": 1001},
        {"id_student": 20, "id_course": 1002}
    ])
    result = db.get_all_courses(20)
    assert set(result) == {1001, 1002}

def test_get_courses_in_list(mock_db):
    mock_db.studcourses.insert_one({"id_student": 21, "id_course": 1003})
    result = db.get_courses_in_list(21)
    assert result[0]["id_course"] == 1003

def test_get_grade(mock_db):
    mock_db.studcourses.insert_one({"id_student": 22, "id_course": 2001, "grade": 88})
    assert db.get_grade(22, 2001) == 88

def test_enroll_student(mock_db):
    result = db.enroll_student(23, 3001)
    assert result is True
    assert mock_db.studcourses.find_one({"id_student": 23, "id_course": 3001})

def test_enroll_student_duplicate(mock_db):
    db.enroll_student(24, 3002)
    result = db.enroll_student(24, 3002)
    assert result is False  # Already enrolled

def test_get_course_info(mock_db):
    mock_db.courses.insert_one({"_id": 4001, "name": "Calculus"})
    result = db.get_course_info(4001)
    assert result["name"] == "Calculus"

def test_get_student_asks(mock_db):
    mock_db.requests.insert_one({"id_sending": 25, "idr": 99})
    result = db.get_student_asks(25)
    assert 99 in result

def test_get_open_asks_for_admin(mock_db):
    mock_db.requests.insert_one({"id_receiving": 26, "status": "in progress"})
    result = db.get_open_asks_for_admin(26)
    assert result[0]["status"] == "in progress"

def test_get_pending_asks_for_admin(mock_db):
    mock_db.requests.insert_one({"id_receiving": 27, "status": "pending"})
    result = db.get_pending_asks_for_admin(27)
    assert result[0]["status"] == "pending"

def test_department_asks(mock_db):
    mock_db.requests.insert_one({"_id": 123, "department": "Math"})
    result = db.department_asks("Math")
    assert 123 in result

def test_add_ask_and_get_by_id(mock_db):
    mock_db.requests.insert_one({"idr": 0})  # ensures next idr is 1
    db.set_user(28, "Nina", "nina@x.com", "x", "student")
    mock_db.administrators.insert_one({"user_id": 29, "department": "CS"})
    db.add_ask(28, 29, "high", "please help", "Title", [], "CS", "financial")
    ask = db.get_ask_by_id(1)
    assert ask and ask["title"] == "Title"


def test_delete_ask(mock_db):
    inserted = mock_db.requests.insert_one({"_id": ObjectId()})
    result = db.delete_ask(inserted.inserted_id)
    assert result is True

def test_get_comment_by_idr(mock_db):
    mock_db.comments.insert_one({"idr": 30, "text": "admin: please reply"})
    result = db.get_comment_by_idr(30)
    assert result is not None
    assert "admin:" in result.get("text", "")

def test_reassign_ask_by_idr(mock_db):
    mock_db.requests.insert_one({"idr": 31, "id_receiving": 1, "status": "pending"})
    success = db.reassign_ask_by_idr(31, 32)
    updated = mock_db.requests.find_one({"idr": 31})
    assert success and updated["id_receiving"] == 32

def test_update_ask_status_by_idr(mock_db):
    mock_db.requests.insert_one({"idr": 33, "status": "pending"})
    db.update_ask_status_by_idr(33, "closed")
    ask = mock_db.requests.find_one({"idr": 33})
    assert ask["status"] == "closed"

def test_append_note_to_ask_new(mock_db):
    success = db.append_note_to_ask(34, "admin: hello there")
    assert success is True
    comment = mock_db.comments.find_one({"idr": 34})
    assert comment and "admin:" in comment.get("text", "")

def test_append_note_to_ask_existing(mock_db):
    mock_db.comments.insert_one({"idr": 35, "text": "prev"})
    success = db.append_note_to_ask(35, "admin: next")
    assert success is True
    text = mock_db.comments.find_one({"idr": 35}).get("text", "")
    assert "next" in text and "prev" in text


def test_append_text(mock_db):
    mock_db.requests.insert_one({"idr": 36, "text": "original"})
    db.append_text(36, "new text")
    ask = mock_db.requests.find_one({"idr": 36})
    assert ask["text"] == "new text"

def test_create_course(mock_db):
    result = db.create_course("Physics", 37, "Science", 3)
    assert result is True
    assert mock_db.courses.find_one({"name": "Physics"}) is not None

def test_get_all_professors(mock_db):
    mock_db.professors.insert_one({"user_id": 38})
    profs = db.get_all_professors()
    assert any(p["user_id"] == 38 for p in profs)


def test_get_courses_grouped_by_year_and_semester(mock_db):
    mock_db.departments.insert_one({
        "name": "Algo1", "year": "1", "semester": "First", "department": "CS", "status": "Open"
    })
    result = db.get_courses_grouped_by_year_and_semester("CS")
    assert "1" in result and "First" in result["1"]

def test_get_course_by_oid(mock_db):
    mock_db.courses.insert_one({"_id": 1000, "name": "Logic"})
    assert db.get_course_by_oid(1000) == "Logic"

def test_get_available_courses(mock_db):
    mock_db.students.insert_one({"user_id": 39, "department": "CS"})
    mock_db.departments.insert_many([
        {"department": "CS", "name": "CourseX"},
        {"department": "CS", "name": "CourseY"},
    ])
    mock_db.courses.insert_many([
        {"_id": 1111, "name": "CourseX"},
        {"_id": 1112, "name": "CourseY"},
    ])
    mock_db.studcourses.insert_one({"id_student": 39, "id_course": 1112})  # already enrolled
    result = db.get_available_courses(39)
    names = [c["name"] for c in result]
    assert "CourseX" in names and "CourseY" not in names

def test_get_courses_by_lecturer(mock_db):
    mock_db.courses.insert_one({"lecturer": 40, "name": "ML"})
    result = db.get_courses_by_lecturer(40)
    assert result and result[0]["name"] == "ML"

from bson import ObjectId

def test_get_students_for_course(mock_db):
    cid = ObjectId()
    mock_db.studcourses.insert_one({"id_course": cid, "id_student": 41})
    mock_db.students.insert_one({"user_id": 41, "department": "CS"})
    mock_db.users.insert_one({"_id": 41, "name": "StudentA"})
    result = db.get_students_for_course(str(cid))
    assert result and result[0]["name"] == "StudentA"


def test_get_students_for_course_invalid(mock_db):
    result = db.get_students_for_course("invalid-objectid")
    assert result == []

from bson import ObjectId

def test_update_student_grade(mock_db):
    cid = ObjectId()
    mock_db.studcourses.insert_one({"id_student": 42, "id_course": cid})
    result = db.update_student_grade(42, str(cid), 95)
    updated = mock_db.studcourses.find_one({"id_student": 42})
    assert updated.get("grade") == 95
    assert result == 1


def test_update_average_existing(mock_db):
    mock_db.students.insert_one({"user_id": 43, "average": 0})
    mock_db.studcourses.insert_many([
        {"id_student": 43, "id_course": 1, "grade": 90},
        {"id_student": 43, "id_course": 2, "grade": 100},
    ])
    avg = db.update_average(43)
    assert avg == 95

def test_find_courses_with_nested_id_found(mock_db):
    cid = ObjectId()
    mock_db.studcourses.insert_one({
        "id_student": 44, "id_course": cid, "grade": 77
    })
    result = db.find_courses_with_nested_id(str(cid), 44)
    assert result == 77

def test_find_courses_with_nested_id_not_found(mock_db):
    result = db.find_courses_with_nested_id("nonexisting", 45)
    assert isinstance(result, list) and len(result) == 0

def test_get_course_full_info_oid_dict(mock_db):
    cid = ObjectId()
    mock_db.courses.insert_one({"_id": cid, "name": "Advanced Math"})
    result = db.get_course_full_info({"$oid": str(cid)})
    assert result["name"] == "Advanced Math"

def test_get_course_full_info_str(mock_db):
    cid = ObjectId()
    mock_db.courses.insert_one({"_id": cid, "name": "DB Systems"})
    result = db.get_course_full_info(str(cid))
    assert result["name"] == "DB Systems"

def test_get_course_full_info_invalid(mock_db):
    result = db.get_course_full_info("not_an_oid")
    assert result is None

def test_get_user_info_not_found(mock_db):
    assert db.get_user_info(9999) is None

def test_get_user_name_by_id_not_found(mock_db):
    assert db.get_user_name_by_id(8888) is None

def test_get_user_email_by_id_not_found(mock_db):
    assert db.get_user_email_by_id(7777) is None

def test_get_user_password_by_id_not_found(mock_db):
    assert db.get_user_password_by_id(6666) is None

def test_get_user_type_by_id_not_found(mock_db):
    assert db.get_user_type_by_id(5555) is None

def test_get_student_department_by_id_not_found(mock_db):
    assert db.get_student_department_by_id(4444) is None

def test_get_admin_department_by_id_not_found(mock_db):
    assert db.get_admin_department_by_id(3333) is None

