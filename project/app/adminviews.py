from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from . import dbcommands as dbcommands
from django.utils.dateparse import parse_datetime
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

# Hardcoded admin ID (can be made dynamic later)
adminid = 2

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

# --- POST: Reassign ask to a different admin ---
@api_view(["POST"])
def reassign_ask(request, ask_id):
    try:
        ask_id = int(ask_id)
        new_admin_id = int(request.data.get("new_admin_id"))
        dbcommands.requests.update_one(
            {"_id": ask_id},
            {"$set": {"id_receiving": new_admin_id}}
        )
        return Response({"message": "Ask reassigned."})
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

# --- POST: Update ask status (and optionally assign) ---
@api_view(["POST"])
def update_ask_status(request, ask_id):
    try:
        ask_id = int(ask_id)
        new_status = request.data.get("status")
        update_data = {"status": new_status}

        if "id_receiving" in request.data:
            update_data["id_receiving"] = int(request.data["id_receiving"])

        dbcommands.requests.update_one(
            {"_id": ask_id},
            {"$set": update_data}
        )
        return Response({"message": "Ask status updated."})
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

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

        query = {"id_receiving": adminid}

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
            asks.sort(key=lambda x: importance_order.get(x.get("importance", "low"), 3), reverse=reverse)
        elif sort_by == "date":
            asks.sort(key=lambda x: x.get("date_sent"), reverse=reverse)

        return Response(asks)

    except Exception as e:
        return Response({"error": str(e)}, status=400)



# --- POST: Add a note (appended to ask text) ---
@api_view(["POST"])
def add_note_to_ask(request, ask_id):
    try:
        ask_id = int(ask_id)
        note = request.data.get("note", "").strip()
        if not note:
            return Response({"error": "Empty note"}, status=400)

        existing_ask = dbcommands.requests.find_one({"_id": ask_id})
        if not existing_ask:
            return Response({"error": "Ask not found"}, status=404)

        updated_text = existing_ask.get("text", "") + f"\n{note}"
        dbcommands.requests.update_one(
            {"_id": ask_id},
            {"$set": {"text": updated_text}}
        )
        return Response({"message": "Note appended to ask text."})
    except Exception as e:
        return Response({"error": str(e)}, status=400)

# --- GET: Full student summary ---
@api_view(["GET"])
def get_full_student_summary(request, student_id):
    try:
        student_id = int(student_id)
        profile = dbcommands.get_full_student_profile(student_id)
        if not profile:
            return Response({"error": f"User ID {student_id} is not a student."}, status=404)

        # Fetch courses
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

        # Fetch requests
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
