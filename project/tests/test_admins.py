import pytest
from rest_framework.test import APIClient
import mongomock
from bson import ObjectId
from datetime import datetime
from app import dbcommands


@pytest.fixture
def client():
    return APIClient()

# --- Get All Admins ---
def test_get_all_admins(client, monkeypatch):
    fake_db = mongomock.MongoClient().db
    fake_db.administrators.insert_one({"user_id": 1})
    fake_db.users.insert_one({"_id": 1, "name": "Shir"})

    monkeypatch.setattr(dbcommands, "administrators", fake_db.administrators)
    monkeypatch.setattr(dbcommands, "get_user_name_by_id", lambda uid: "Shir")

    response = client.get("/admins/")
    assert response.status_code == 200
    assert response.data[0]["user_id"] == 1
    assert response.data[0]["name"] == "Shir"

# --- Get All Requests for Admin ---
def test_get_all_requests(client, monkeypatch):
    fake_requests = [
        {"_id": "ask1", "date_sent": datetime.now(), "status": "pending", "id_receiving": 2}
    ]
    monkeypatch.setattr(dbcommands, "get_open_asks_for_admin", lambda aid: fake_requests)

    response = client.get("/asks/")
    assert response.status_code == 200
    assert len(response.data) == 1
    assert response.data[0]["_id"] == "ask1"

# --- Update Ask Status ---
def test_update_ask_status(client, monkeypatch):
    fake_db = mongomock.MongoClient().db
    ask_id = fake_db.requests.insert_one({
        "status": "pending",
        "id_receiving": 2
    }).inserted_id

    monkeypatch.setattr(dbcommands, "requests", fake_db.requests)

    response = client.post(f"/asks/{ask_id}/update_status/", {
        "status": "closed"
    }, format="json")

    assert response.status_code == 200
    updated = fake_db.requests.find_one({"_id": ask_id})
    assert updated["status"] == "closed"

# --- Reassign Ask ---
def test_reassign_ask(client, monkeypatch):
    fake_db = mongomock.MongoClient().db
    ask_id = fake_db.requests.insert_one({
        "id_receiving": 2
    }).inserted_id

    monkeypatch.setattr(dbcommands, "requests", fake_db.requests)

    response = client.post(f"/asks/{ask_id}/reassign/", {
        "new_admin_id": 3
    }, format="json")

    assert response.status_code == 200
    updated = fake_db.requests.find_one({"_id": ask_id})
    assert updated["id_receiving"] == 3

# --- Add Note to Ask ---
def test_add_note_to_ask(client, monkeypatch):
    fake_db = mongomock.MongoClient().db
    ask_id = fake_db.requests.insert_one({
        "text": "Original text"
    }).inserted_id

    monkeypatch.setattr(dbcommands, "requests", fake_db.requests)

    response = client.post(f"/asks/{ask_id}/add_note/", {
        "note": "New note"
    }, format="json")

    assert response.status_code == 200
    updated = fake_db.requests.find_one({"_id": ask_id})
    assert "New note" in updated["text"]

# --- Get Full Student Summary ---
def test_get_full_student_summary(client, monkeypatch):
    sid = 10
    fake_students = mongomock.MongoClient().db.students
    fake_students.insert_one({"user_id": sid})

    monkeypatch.setattr(dbcommands, "students", fake_students)
    monkeypatch.setattr(dbcommands, "get_user_name_by_id", lambda _: "Tali")
    monkeypatch.setattr(dbcommands, "get_user_email_by_id", lambda _: "tali@example.com")
    monkeypatch.setattr(dbcommands, "get_student_department_by_id", lambda _: "CS")
    monkeypatch.setattr(dbcommands, "get_student_status_by_id", lambda _: "active")
    monkeypatch.setattr(dbcommands, "get_student_sum_points_by_id", lambda _: 80)
    monkeypatch.setattr(dbcommands, "get_student_average_by_id", lambda _: 90)
    monkeypatch.setattr(dbcommands, "get_all_courses", lambda _: [])
    monkeypatch.setattr(dbcommands, "requests", mongomock.MongoClient().db.requests)

    response = client.get(f"/studentlookup/{sid}/")
    assert response.status_code == 200
    assert response.data["info"]["name"] == "Tali"
