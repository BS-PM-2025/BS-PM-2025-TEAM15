from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from bson import ObjectId
import dbcommands

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
        ask_id = ObjectId(ask_id)
        new_admin_id = request.data.get("new_admin_id")
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
        ask_id = ObjectId(ask_id)
        new_status = request.data.get("status")
        update_data = {"status": new_status}

        if "id_receiving" in request.data:
            update_data["id_receiving"] = request.data["id_receiving"]

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
    all_asks = dbcommands.get_pending_asks_for_admin(adminid)
    for ask in all_asks:
        ask["_id"] = str(ask["_id"])
        ask["date_sent"] = ask["date_sent"].isoformat()
    return Response(all_asks)

# --- POST: Add a note (appended to ask text) ---
@api_view(["POST"])
def add_note_to_ask(request, ask_id):
    try:
        ask_id = ObjectId(ask_id)
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
