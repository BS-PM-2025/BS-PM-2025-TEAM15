from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from . import dbcommands as dbcommands

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
#-- check if current useris admin --#
@api_view(["POST"])
def is_admin(request):
    user_id = request.data.get("userId")  # read from POST body
    user_check = dbcommands.is_admin(user_id)
    return Response({"is_admin": user_check})

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

# --- GET: All open asks assigned to admin ---
@api_view(["GET"])
def get_all_requests(request):
    all_asks = dbcommands.get_open_asks_for_admin(adminid)
    for ask in all_asks:
        ask["_id"] = str(ask["_id"])
        ask["date_sent"] = ask["date_sent"].isoformat()
    return Response(all_asks)

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
        student_exists = dbcommands.students.find_one({"user_id": student_id})
        if not student_exists:
            return Response({"error": f"User ID {student_id} is not a student."}, status=404)

        info = {
            "name": dbcommands.get_user_name_by_id(student_id),
            "email": dbcommands.get_user_email_by_id(student_id),
            "department": dbcommands.get_student_department_by_id(student_id),
            "status": dbcommands.get_student_status_by_id(student_id),
            "sum_points": dbcommands.get_student_sum_points_by_id(student_id),
            "average": dbcommands.get_student_average_by_id(student_id),
        }

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

        ask_ids = dbcommands.get_all_asks_by_idr(student_id)
        asks = [dbcommands.get_ask_by_idr(aid) for aid in ask_ids if dbcommands.get_ask_by_idr(aid)]

        return Response({
            "info": info,
            "courses": courses,
            "average": info["average"],
            "asks": asks
        })
    except Exception as e:
        return Response({"error": str(e)}, status=400)
