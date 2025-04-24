import mongomock
from .\project\app import dbcommands
from datetime import datetime

def test_login_success():
    client = mongomock.MongoClient()
    db = client['university_system']
    db.users.insert_one({"email": "test@test.com", "password": "123", "_id": "1"})

    dbcommands.users = db.users  # mock the collection
    user_id = dbcommands.login("test@test.com", "123")
    assert user_id == "1"

def test_get_average():
    client = mongomock.MongoClient()
    db = client['university_system']
    db.studcourses.insert_many([
        {"id_student": "1", "id_course": "A", "grade": 80},
        {"id_student": "1", "id_course": "B", "grade": 90},
    ])

    dbcommands.studcourses = db.studcourses
    dbcommands.get_all_courses = lambda sid: ["A", "B"]
    dbcommands.get_grade = lambda sid, cid: 80 if cid == "A" else 90

    avg = dbcommands.get_average("1")
    assert avg == 85
