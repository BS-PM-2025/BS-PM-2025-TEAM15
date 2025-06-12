import pytest
from rest_framework.test import APIClient
from unittest.mock import patch, MagicMock
import json
from django.test import RequestFactory

# Shared fixtures
@pytest.fixture
def client():
    return APIClient()

@pytest.fixture
def factory():
    return RequestFactory()

# 1. Test: home view renders successfully
def test_home_view(factory):
    from app.views import home
    request = factory.get("/")
    response = home(request)
    assert response.status_code == 200  # Basic GET request to home

# 2. Test: edit_request_text appends text correctly
@patch("app.views.append_text", return_value=True)
def test_edit_request_text_success(mock_append):
    client = APIClient()
    data = {"new_text": "New update"}
    response = client.post("/asks/123/edit_text/", data=json.dumps(data), content_type="application/json")
    assert response.status_code == 200
    assert response.json()["message"] == "Text appended successfully."

# 3. Test: login with correct credentials returns user_id
@patch("app.views.db.login", return_value=42)
def test_login_success(mock_login, client):
    data = {"email": "test@example.com", "password": "1234"}
    response = client.post("/api/users/Login", data)
    assert response.status_code == 200
    assert "user_id" in response.data

# 4. Test: get user name returns correct value
@patch("app.views.db.get_user_name_by_id", return_value="Test User")
def test_get_user_name(mock_get, client):
    response = client.post("/api/users/Home", {"_id": 1}, format="json")
    assert response.status_code == 200
    assert response.data["name"] == "Test User"


# 5. Test: request_status returns list of asks
@patch("app.views.dbcommands.get_student_asks", return_value=[1, 2])
@patch("app.views.dbcommands.get_ask_by_id", side_effect=[{"status": "pending"}, {"status": "closed"}])
def test_request_status_view(mock_get_ask, mock_get_asks, client):
    response = client.get("/api/request_status/?user_id=5")
    assert response.status_code == 200
    assert len(response.data) == 2

# 6. Test: student signup inserts user and student
@patch("app.views.db.set_user")
@patch("app.views.db.set_Student")
def test_signup_success(mock_set_student, mock_set_user, client):
    data = {
        "_id": 1, "name": "John", "email": "john@test.com", "password": "pw",
        "type": "Student", "department": "CS", "status": "active",
        "sum_points": 20, "average": 80
    }
    response = client.post("/api/users/SignUp", data, format="json")
    assert response.status_code == 201

# 7. Test: search GET returns list of students
@patch("app.views.dbcom.get_all_students", return_value=[{"_id": 1, "name": "Alice"}])
def test_search_get(mock_get_students, client):
    response = client.get("/api/search/?query=test")
    assert response.status_code == 200
    assert len(response.data) == 1

# 9. Test: student stats view returns counts for admin
@patch("app.views.dbcommands.is_admin", return_value=True)
@patch("app.views.db.requests.find", return_value=[{"status": "pending"}, {"status": "closed"}])
@patch("app.views.dbcommands.count_unread_messages", return_value=1, create=True)
def test_student_stats_admin(mock_unread, mock_find, mock_is_admin, client):
    response = client.get("/api/stats/2")
    assert response.status_code == 200
    assert response.data["pendingRequests"] == 1
    assert response.data["doneRequests"] == 1
    assert response.data["newMessages"] == 1



# 10. Test: graph GET with no courses returns 404
@patch("app.views.dbcom.get_student_department_by_id", return_value="CS")
@patch("app.views.dbcom.get_courses_grouped_by_year_and_semester", return_value={})
def test_graphs_get(mock_courses, mock_dept, client):
    response = client.get("/api/graph/?user_id=1")
    assert response.status_code == 404


# 11. Test: graph POST returns course grades
@patch("app.views.dbcom.get_all_courses", return_value=[{"$oid": "507f1f77bcf86cd799439011"}])
@patch("app.views.dbcom.find_courses_with_nested_id", return_value={"grade": 88, "finish": True})
@patch("app.views.dbcom.get_course_by_oid", return_value="Algorithms")
def test_graphs_post(mock_course_name, mock_find_grade, mock_all_courses, client):
    response = client.post("/api/graph/?user_id=1")
    assert response.status_code == 200
    assert "courses" in response.data


# 12. Test: student dashboard returns earned credit info
@patch("app.views.db.get_full_student_profile", return_value={})
@patch("app.views.db.get_courses_in_list", return_value=[{"id_course": 1, "grade": 90, "finish": True}])
@patch("app.views.db.get_course_full_info", return_value={
    "name": "OS", "lecturer": "Dr. A", "department": "CS", "points": 5
})
def test_student_course_info(mock_info, mock_list, mock_profile, client):
    response = client.get("/api/student/dashboard?user_id=1")
    assert response.status_code == 200
    assert response.data["total_earned_credits"] == 5.0

# 13. Test: filehandle returns None if no file is provided
def test_filehandle_no_file():
    from app.views import Student_personal_requests
    view = Student_personal_requests()
    request = MagicMock()
    request.FILES.get.return_value = None
    result = view.filehandle(request)
    assert result is None
