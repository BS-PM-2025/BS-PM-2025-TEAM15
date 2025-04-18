from django.shortcuts import render

# Create your views here.
def home(request):
    return render(request, 'home.html')


#react
from django.shortcuts import render

from django.shortcuts import render
from rest_framework.views import APIView
from . models import *
from rest_framework.response import Response
from . serializer import *

#for user
import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import user_collection
from bson.objectid import ObjectId
import bcrypt

class ReactView(APIView):
  
    serializer_class = ReactSerializer

    def get(self, request):
        detail = [ {"name": detail.name,"detail": detail.detail} 
        for detail in React.objects.all()]
        return Response(detail)

    def post(self, request):

        serializer = ReactSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return  Response(serializer.data)

@csrf_exempt 
def signup_view(request):
    if request.method == "POST":
        data = json.loads(request.body)
        name = data.get("name")
        email = data.get("email")
        password = data.get("password")
        Id = data.get("Id")

        if user_collection.find_one({"email": email}):
            return JsonResponse({"error": "User already exists"}, status=400)

        hashed_pw = bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt())

        user_collection.insert_one({
            "name": name,
            "email": email,
            "password": hashed_pw,
            "_id": Id,
        })

        return JsonResponse({"message": "User created successfully"}, status=201)

#user part
@csrf_exempt
def login_view(request):
    if request.method == "POST":
        data = json.loads(request.body)
        email = data.get("email")
        password = data.get("password")

        user = user_collection.find_one({"email": email})
        if not user:
            return JsonResponse({"error": "User not found"}, status=404)

        if not bcrypt.checkpw(password.encode("utf-8"), user["password"]):
            return JsonResponse({"error": "Incorrect password"}, status=401)

        return JsonResponse({"message": "Login successful"}, status=200)
