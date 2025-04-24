import pytest
from rest_framework.test import APIClient
import mongomock
from bson import ObjectId
from datetime import datetime
from django.core.files.uploadedfile import SimpleUploadedFile
from app import dbcommands as db


@pytest.fixture
def client():
    return APIClient()

# --- Login View ---
def test_login_success(client, monkeypatch):
    fake_db = mongomock.MongoClient().db
    fake_db.users.insert_one({"email": "test@test.com", "password": "123", "_id": "user123"})

    monkeypatch.setattr(db, "users", fake_db.users)
    monkeypatch.setattr(db, "login", lambda e, p: "user123" if e == "test@test.com" and p == "123" else None)

    response = client.post("/api/users/Login", {"email": "test@test.com", "password": "123"}, format="json")
    assert response.status_code == 200
    assert response.data["message"] == "Login successful"
    assert response.data["user_id"] == "user123"

def test_login_failure(client, monkeypatch):
    monkeypatch.setattr(db, "login", lambda e, p: None)

    response = client.post("/api/users/Login", {"email": "wrong@test.com", "password": "bad"}, format="json")
    assert response.status_code == 401
    assert "Invalid email or password" in response.data["error"]

# --- Sign Up View ---
def test_signup_success(client, monkeypatch):
    monkeypatch.setattr(db, "set_user", lambda _id, name, email, password, typ: None)

    response = client.post("/api/users/SignUp", {
        "_id": "123",
        "name": "Tali",
        "email": "tali@example.com",
        "password": "123",
        "type": "student"
    }, format="json")

    assert response.status_code == 201
    assert response.data["message"] == "Signup successful"

# --- GetUserName View ---
def test_get_user_name_success(client, monkeypatch):
    monkeypatch.setattr(db, "get_user_name_by_id", lambda uid: "Tali" if uid == "123" else None)

    response = client.post("/api/users/Home", {"_id": "123"}, format="json")
    assert response.status_code == 200
    assert response.data["name"] == "Tali"

def test_get_user_name_not_found(client, monkeypatch):
    monkeypatch.setattr(db, "get_user_name_by_id", lambda uid: None)

    response = client.post("/api/users/Home", {"_id": "unknown"}, format="json")
    assert response.status_code == 404

# --- RequestStatusView ---
def test_request_status_view(client, monkeypatch):
    monkeypatch.setattr(db, "get_pending_asks_for_admin", lambda aid: [{
        "_id": ObjectId(),
        "title": "Request A",
        "status": "pending",
        "id_sending": 1,
        "importance": "high",
        "id_receiving": 2,
        "text": "Some details"
    }])

    from app.serializer import RequestStatusserializer
    
    class FakeSerializer:
        def __init__(self, *args, **kwargs):
            self.data = [{
                "title": "Request A",
                "status": "pending",
                "id_sending": 1
            }]

    monkeypatch.setattr("app.views.RequestStatusserializer", FakeSerializer)

    response = client.get("/api/request_status/")
    assert response.status_code == 200
    assert response.data[0]["title"] == "Request A"
    assert response.data[0]["status"] == "pending"
    assert response.data[0]["id_sending"] == 1

# --- StudentPersonalRequests ---

def test_student_personal_requests_post_success(client, monkeypatch, tmp_path):
    def mock_add_ask(id_sending, id_receiving, importance, text, title, documents, department):
        return ObjectId()

    monkeypatch.setattr(db, "add_ask", mock_add_ask)

    test_file = SimpleUploadedFile("test.pdf", b"test content", content_type="application/pdf")

    payload = {
        "id_sending": "1",           # important: send as string to match serializer expectations
        "id_receiving": "2",
        "importance": "High",
        "text": "Please approve",
        "title": "Approval",
        "department": "CS"
    }

    response = client.post(
        "/api/studentrequests/",
        data={**payload, "documents": test_file},
        format="multipart"
    )

    print("========== RESPONSE ==========")
    print(response.status_code)
    print(response.data)
    print("==============================")

    assert response.status_code == 201
    assert response.data["success"] is True
    assert "_id" in response.data["data"]
