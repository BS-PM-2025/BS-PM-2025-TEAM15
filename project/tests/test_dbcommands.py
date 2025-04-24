import mongomock
import pytest
from datetime import datetime
from app import dbcommands

# Mock MongoDB collections
@pytest.fixture(autouse=True)
def setup_mongo(monkeypatch):
    client = mongomock.MongoClient()
    db = client["university_system"]

    monkeypatch.setattr(dbcommands, "users", db.users)
    monkeypatch.setattr(dbcommands, "students", db.students)
    monkeypatch.setattr(dbcommands, "administrators", db.administrators)
    monkeypatch.setattr(dbcommands, "requests", db.requests)
    monkeypatch.setattr(dbcommands, "courses", db.courses)
    monkeypatch.setattr(dbcommands, "studcourses", db.studcourses)

# === AUTH ===
def test_login_success():
    dbcommands.users.insert_one({"email": "a@a.com", "password": "123", "_id": 1})
    assert dbcommands.login("a@a.com", "123") == 1

def test_is_admin_true():
    dbcommands.administrators.insert_one({"user_id": 2})
    assert dbcommands.is_admin(2) is True

# === USERS ===
def test_get_user_name_by_id():
    dbcommands.users.insert_one({"_id": 3, "name": "Yana"})
    assert dbcommands.get_user_name_by_id(3) == "Yana"

def test_set_user_and_fetch():
    uid = dbcommands.set_user(4, "Shir", "shir@uni.com", "pass", "student")
    assert dbcommands.get_user_email_by_id(4) == "shir@uni.com"
    assert dbcommands.get_user_type_by_id(4) == "student"

# === STUDENT INFO ===
def test_get_full_student_profile():
    dbcommands.users.insert_one({"_id": 5, "name": "Felix"})
    dbcommands.students.insert_one({"user_id": 5, "department": "CS"})
    profile = dbcommands.get_full_student_profile(5)
    assert profile["name"] == "Felix"
    assert profile["department"] == "CS"

# === COURSE ENROLLMENT ===
def test_enroll_student_and_grade():
    enrolled = dbcommands.enroll_student(10, 101)
    assert enrolled is True
    dbcommands.update_grade(10, 101, 85)
    assert dbcommands.get_grade(10, 101) == 85

# === AVERAGE ===
def test_average_calc():
    dbcommands.studcourses.insert_many([
        {"id_student": 11, "id_course": 1, "grade": 90},
        {"id_student": 11, "id_course": 2, "grade": 80}
    ])
    dbcommands.students.insert_one({"user_id": 11})
    avg = dbcommands.update_average(11)
    assert avg == 85

# === REQUESTS ===
def test_add_and_fetch_ask():
    ask_id = dbcommands.add_ask(20, 21, "high", "text", "title", None, "CS")
    asks = dbcommands.get_all_asks(20)
    assert ask_id in asks

def test_change_ask_status():
    ask_id = dbcommands.add_ask(22, 23, "low", "text", "status test", None, "Math")
    result = dbcommands.change_ask_status(ask_id, "resolved")
    assert result is True
    assert dbcommands.requests.find_one({"_id": ask_id})["status"] == "resolved"

def test_delete_ask():
    ask_id = dbcommands.add_ask(30, 31, "low", "text", "delete test", None, "Bio")
    deleted = dbcommands.delete_ask(ask_id)
    assert deleted is True
