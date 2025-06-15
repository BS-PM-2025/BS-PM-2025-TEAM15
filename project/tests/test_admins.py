import pytest
from rest_framework.test import APIClient
from unittest.mock import patch
from bson import ObjectId

client = APIClient()

# === 1. /api/isadmin/ — check if user is admin ===
@patch("app.views.dbcommands.is_admin")
def test_is_admin_view(mock_is_admin):
    mock_is_admin.return_value = True
    response = client.post("/api/isadmin/", {"userId": 1}, format="json")
    assert response.status_code == 200
    assert response.data["is_admin"] is True

# === 2. /api/isprof/ — check if user is professor ===
@patch("app.views.dbcommands.is_prof")
def test_is_prof_view(mock_is_prof):
    mock_is_prof.return_value = True
    response = client.post("/api/isprof/", {"userId": 2}, format="json")
    assert response.status_code == 200
    assert response.data["is_"] is True

# === 3. /admins/ — get list of all admins ===
@patch("app.views.dbcommands.administrators.find")
@patch("app.views.dbcommands.get_user_name_by_id")
def test_get_all_admins(mock_get_name, mock_find):
    mock_find.return_value = [{"user_id": 1}, {"user_id": 2}]
    mock_get_name.side_effect = ["Alice", "Bob"]
    response = client.get("/admins/")
    assert response.status_code == 200
    assert len(response.data) == 2

# === 4. /api/professors/ — get list of all professors ===
@patch("app.views.dbcommands.get_all_professors")
@patch("app.views.dbcommands.get_user_name_by_id")
def test_get_all_professors(mock_get_name, mock_get_all):
    mock_get_all.return_value = [{"user_id": 3, "department": "Math", "role": "Lecturer"}]
    mock_get_name.return_value = "Dr. Smith"
    response = client.get("/api/professors/")
    assert response.status_code == 200
    assert response.data[0]["name"] == "Dr. Smith"

# === 5. /asks/10/ — get ask details ===
@patch("app.views.dbcommands.get_ask_by_id")
def test_get_ask_details_found(mock_get_ask):
    mock_get_ask.return_value = {"idr": 10, "title": "Help"}
    response = client.get("/asks/10/")
    assert response.status_code == 200
    assert response.data["idr"] == 10

# === 6. /asks/99/ — ask not found ===
@patch("app.views.dbcommands.get_ask_by_id")
def test_get_ask_details_not_found(mock_get_ask):
    mock_get_ask.return_value = None
    response = client.get("/asks/99/")
    assert response.status_code == 404

# === 7. /asks/15/add_note/ — add note to ask ===
@patch("app.views.dbcommands.append_note_to_ask")
def test_add_note_success(mock_append):
    mock_append.return_value = True
    response = client.post("/asks/15/add_note/", {"note": "admin: OK"}, format="json")
    assert response.status_code == 200

# === 8. /asks/15/add_note/ — empty note error ===
@patch("app.views.dbcommands.append_note_to_ask")
def test_add_note_empty(mock_append):
    response = client.post("/asks/15/add_note/", {"note": ""}, format="json")
    assert response.status_code == 400

# === 9. /comments/123/ — get comment text ===
@patch("app.views.dbcommands.get_comment_by_idr")
def test_get_comment_found(mock_get_comment):
    mock_get_comment.return_value = {"text": "admin: reply"}
    response = client.get("/comments/123/")
    assert response.status_code == 200
    assert "admin" in response.json()["text"]

# === 10. /comments/999/ — comment not found ===
@patch("app.views.dbcommands.get_comment_by_idr")
def test_get_comment_not_found(mock_get_comment):
    mock_get_comment.return_value = None
    response = client.get("/comments/999/")
    assert response.status_code == 200
    assert response.json()["text"] == ""

# === 11. /api/update_grade/ — update valid grade ===
@patch("app.views.dbcommands.update_student_grade")
def test_update_grade_valid(mock_update):
    mock_update.return_value = 1
    response = client.post("/api/update_grade/", {
        "user_id": 1,
        "course_id": "abc123",
        "grade": 95
    }, format="json")
    assert response.status_code == 200

# === 12. /api/update_grade/ — grade out of range ===
def test_update_grade_invalid_value():
    response = client.post("/api/update_grade/", {
        "user_id": 1,
        "course_id": "abc123",
        "grade": 110
    }, format="json")
    assert response.status_code == 400

# === 13. /api/available_courses/10/ — get available courses ===
@patch("app.views.dbcommands.get_available_courses")
def test_get_available_courses(mock_get_courses):
    mock_get_courses.return_value = [
        {"_id": ObjectId(), "name": "Physics", "points": 3}
    ]
    response = client.get("/api/available_courses/10/")
    assert response.status_code == 200
    assert response.data[0]["name"] == "Physics"

# === 14. /api/professor_courses/55/ — get professor’s courses ===
@patch("app.views.dbcommands.get_courses_by_lecturer")
def test_professor_courses(mock_get_courses):
    mock_get_courses.return_value = [{"_id": ObjectId(), "name": "AI"}]
    response = client.get("/api/professor_courses/55/")
    assert response.status_code == 200
    assert response.data[0]["name"] == "AI"


# === 17. /courses/add/ — missing field → error ===
@patch("app.views.dbcommands.create_course")
def test_add_course_missing_field(mock_create):
    import json
    response = client.post("/courses/add/", json.dumps({
        "name": "DB"
    }), content_type="application/json")
    assert response.status_code == 400

# === 18. /api/students_in_course/<id>/ — get enrolled students ===
@patch("app.views.dbcommands.get_students_for_course")
def test_students_in_course(mock_get_students):
    mock_get_students.return_value = [{"user_id": 1, "name": "Jane"}]
    response = client.get("/api/students_in_course/abc123/")
    assert response.status_code == 200
    assert response.data[0]["name"] == "Jane"

# === 19. /api/enroll_course/ — enroll successfully ===
@patch("app.views.dbcommands.enroll_student")
def test_enroll_course_success(mock_enroll):
    mock_enroll.return_value = True
    response = client.post("/api/enroll_course/", {
        "user_id": 1,
        "course_id": str(ObjectId())
    }, format="json")
    assert response.status_code == 200

# === 20. /api/enroll_course/ — already enrolled ===
@patch("app.views.dbcommands.enroll_student")
def test_enroll_course_duplicate(mock_enroll):
    mock_enroll.return_value = False
    response = client.post("/api/enroll_course/", {
        "user_id": 1,
        "course_id": str(ObjectId())
    }, format="json")
    assert response.status_code == 200
    assert "already enrolled" in response.data["message"]
