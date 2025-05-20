from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from . import dbcommands
from django.utils.dateparse import parse_datetime
from bson import ObjectId

# --- GET all admins ---
@api_view(["GET"])
def get_all_admins(request):
    admins = dbcommands.administrators.find()
    results = []
    for admin in admins:
        name = dbcommands.get_user_name_by_id(admin["user_id"])
        if name:
            results.append({
                "user_id": admin["user_id"],
                "name": name
            })
    return Response(results)

# -- Check if current user is admin --
@api_view(["POST"])
def is_admin(request):
    user_id = request.data.get("userId")
    user_check = dbcommands.is_admin(user_id)
    return Response({"is_admin": user_check})

# --- POST: Reassign ask to a different admin ---
@api_view(["POST"])
def reassign_ask(request, ask_id):
    try:
        ask_id = int(ask_id)
        new_admin_id = int(request.data.get("new_admin_id"))
        success = dbcommands.reassign_ask_to_admin(ask_id, new_admin_id)
        if success:
            return Response({"message": "Ask reassigned."})
        return Response({"error": "Request not found or update failed."}, status=404)
    except Exception as e:
        return Response({"error": str(e)}, status=400)

# --- POST: Update ask status (and optionally assign) ---
@api_view(["POST"])
def update_ask_status(request, ask_id):
    try:
        ask_id = int(ask_id)
        new_status = request.data.get("status")
        id_receiving = request.data.get("id_receiving")

        success = dbcommands.update_ask_status_by_idr(ask_id, new_status, id_receiving)
        if success:
            return Response({"message": "Ask status updated."})
        return Response({"error": "Request not found or update failed."}, status=404)
    except Exception as e:
        return Response({"error": str(e)}, status=400)

# --- GET: All requests for a given admin ---
@api_view(["GET"])
def get_all_requests(request):
    try:
        importance = request.GET.get("importance")
        status_filter = request.GET.get("status")
        category = request.GET.get("category")
        date_sent_from = request.GET.get("from")
        date_sent_to = request.GET.get("to")
        sort_by = request.GET.get("sort")
        order = request.GET.get("order", "asc")
        admin_id = request.GET.get("admin_id")

        query = {}
        if admin_id:
            query["id_receiving"] = int(admin_id)
        if importance:
            query["importance"] = importance
        if status_filter:
            query["status"] = status_filter
        if category:
            query["category"] = category
        if date_sent_from or date_sent_to:
            query["date_sent"] = {}
            if date_sent_from:
                query["date_sent"]["$gte"] = parse_datetime(date_sent_from)
            if date_sent_to:
                query["date_sent"]["$lte"] = parse_datetime(date_sent_to)

        asks = list(dbcommands.requests.find(query))
        for ask in asks:
            ask["_id"] = str(ask["_id"])
            ask["date_sent"] = ask["date_sent"].isoformat()

        reverse = (order == "desc")
        if sort_by == "importance":
            importance_order = {"high": 1, "medium": 2, "low": 3}
            asks.sort(key=lambda x: importance_order.get(x.get("importance", "low"), 4), reverse=reverse)
        elif sort_by == "date":
            asks.sort(key=lambda x: x.get("date_sent"), reverse=reverse)

        return Response(asks)
    except Exception as e:
        return Response({"error": str(e)}, status=400)

# --- POST: Add a note ---
@api_view(["POST"])
def add_note_to_ask(request, ask_id):
    try:
        ask_id = int(ask_id)
        note = request.data.get("note", "").strip()
        if not note:
            return Response({"error": "Empty note"}, status=400)
        success = dbcommands.append_note_to_ask(ask_id, note)
        if success:
            return Response({"message": "Note added."})
        return Response({"error": "Ask not found or update failed."}, status=404)
    except Exception as e:
        return Response({"error": str(e)}, status=400)

# --- GET: Full student summary ---
@api_view(["GET"])
def get_full_student_summary(request, student_id):
    try:
        student_id = int(student_id)
        print(student_id)
        profile = dbcommands.get_full_student_profile(student_id)
        if not profile:
            return Response({"error": f"User ID {student_id} is not a student."}, status=404)
       
        course_ids = dbcommands.get_all_courses(student_id)
        courses = []
        for cid in course_ids:
           
            course = dbcommands.get_course_info(cid)
            if course:
                courses.append({
                    "course_id": str(cid),
                    "name": course["name"],
                    "points": course["points"],
                    "grade": dbcommands.get_grade(student_id, cid)
                })
        
        ask_ids = dbcommands.get_student_asks(student_id)
        asks = [dbcommands.get_ask_by_id(aid) for aid in ask_ids if dbcommands.get_ask_by_id(aid)]
        
        return Response({
            "info": {
                "name": profile.get("name"),
                "email": profile.get("email"),
                "department": profile.get("department"),
                "status": profile.get("status"),
                "sum_points": profile.get("sum_points"),
                "average": profile.get("average")
            },
            "courses": courses,
            "average": profile.get("average"),
            "asks": asks
        })
    except Exception as e:
        return Response({"error": str(e)}, status=400)

@api_view(["POST"])
def enroll_course(request):
    try:
        user_id = int(request.data.get("user_id"))
        course_id = request.data.get("course_id")
        if not user_id or not course_id:
            return Response({"error": "Missing user_id or course_id"}, status=400)

        course_oid = ObjectId(course_id)
        success = dbcommands.enroll_student(user_id, course_oid)

        if success:
            return Response({"message": "Student enrolled successfully"})
        else:
            return Response({"message": "Student already enrolled"}, status=200)

    except Exception as e:
        return Response({"error": str(e)}, status=400)

@api_view(["GET"])
def get_available_courses_view(request, user_id):
    try:
        courses = dbcommands.get_available_courses(user_id)
        result = []

        for course in courses:
            result.append({
                "course_id": str(course["_id"]),
                "name": course["name"],
                "points": course.get("points", 0)
            })

        return Response(result)
    except Exception as e:
        return Response({"error": str(e)}, status=400)

@api_view(["GET"])
def professor_courses(request, professor_id):
    print(f"📥 GET /api/professor_courses/{professor_id}/ called")
    courses = dbcommands.get_courses_by_lecturer(professor_id)
    print("🎓 Courses found:", courses)

    # Convert ObjectId to str
    for course in courses:
        if "_id" in course:
            course["_id"] = str(course["_id"])

    return Response(courses)



@api_view(["GET"])
def students_in_course(request, course_id):
    students = dbcommands.get_students_for_course(course_id)
    return Response(students)

@api_view(["POST"])
def update_grade(request):
    try:
        print("📥 Grade update request:", request.data)
        user_id = int(request.data.get("user_id"))
        course_id = request.data.get("course_id")
        new_grade = float(request.data.get("grade"))

        updated = dbcommands.update_student_grade(user_id, course_id, new_grade)
        print(f"✅ Updated records: {updated}")

        return Response({"message": "Grade updated successfully"})

    except Exception as e:
        print("❌ Error:", e)
        return Response({"error": str(e)}, status=400)

