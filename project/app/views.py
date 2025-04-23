from rest_framework.decorators import api_view
from rest_framework import status
from bson import ObjectId
from . import dbcommands as db  
from django.shortcuts import render

# Create your views here.
def home(request):
    return render(request, 'home.html')

from .models import Counter

#react
from django.shortcuts import render
from django.shortcuts import render
from rest_framework.views import APIView
from . models import *
from rest_framework.response import Response
from . serializer import *

class ReactView(APIView):
  
    serializer_class = ReactSerializer

    # def get(self, request):
    #     detail = [ {"name": detail.name,"detail": detail.detail} 
    #     for detail in React.objects.all()]
    #     return Response(detail)

    # def post(self, request):

    #     serializer = ReactSerializer(data=request.data)
    #     if serializer.is_valid(raise_exception=True):
    #         serializer.save()
    #         return  Response(serializer.data)
        
# class Student_personal_requests(APIView):
#     # @transaction.atomic
  
#     def get_next_sequence(self, name):
#         counter = db.counters.find_one_and_update(
#             {"_id": name},
#             {"$inc": {"seq": 1}},
#             upsert=True,
#             return_document=ReturnDocument.AFTER
#         )
#         return counter["seq"]

from .serializer import YourRequestSerializer  # ודא/י שאת מייבאת את הסריאלייזר המתאים

class Student_personal_requests(APIView):
    # @transaction.atomic
   
    # def get_next_sequence(self, name):
    #     counter = db.counters.find_one_and_update(
    #         {"_id": name},
    #         {"$inc": {"seq": 1}},
    #         upsert=True,
    #         return_document=ReturnDocument.AFTER
    #     )
    #     return counter["seq"]

    def filehandle(self,request):
        file = request.FILES.get('documents')

        if file:
            from django.core.files.storage import FileSystemStorage
            fs = FileSystemStorage()
            filename = fs.save(file.name, file)
            file_url = fs.url(filename)
        else:
            file_url = None

        return file_url
    def post(self, request):
        print("========== REQUEST DATA ==========")
        print(request.data)  # This shows the body data (JSON)
        print("==================================")

        data = request.data.copy()  # חשוב לעשות copy כדי לא לערוך ישירות את request.data
        # data["idr"] = self.get_next_sequence("student_requests_id")

        serializer = StudentRequestSerializer(data=data)
        if serializer.is_valid():
            data = serializer.validated_data
            file_url_res = self.filehandle(request)
            inserted = db.add_ask(
                data["id_sending"],
                data["id_receiving"],
                data["importance"],
                data["text"],
                data["title"],
                file_url_res,
                data["department"]
            )
            return Response({"success": True, "data": {"_id": str(inserted)}}, status=201)
        else:
            return Response({"success": False, "errors": serializer.errors}, status=400)
        #סטטוס בקשות 
from rest_framework.views import APIView
from rest_framework.response import Response
#from .models import YourRequestModel
from .serializer import YourRequestSerializer
from . import dbcommands as dbcom 

class RequestStatusView(APIView):
    def get(self, request):
        requests = dbcom.get_pending_asks_for_admin(2)  # אם צריך לפי משתמש, סנן לפי `request.user`
        serializer = RequestStatusserializer(requests, many=True)
        return Response(serializer.data)

from django.contrib.auth.hashers import make_password, check_password
from .models import users
from .serializer import UserSignUpSerializer
import json

# SIGN UP View
class SignUpView(APIView):
    def post(self, request):
        try:
            data = request.data
            serializer = UserSignUpSerializer(data=data)

            print("========== REQUEST DATA ==========")
            print(request.data)  # This shows the body data (JSON)
            print("==================================")

            if serializer.is_valid():
                #put here a function to send data,USING DB.COMMANDS
                data = serializer.validated_data
                db.set_User(
                    data["_id"],
                    data["name"],
                    data["email"],
                    data["password"],
                    data["type"]
                );
                return Response({'message': 'Signup successful'}, status=status.HTTP_201_CREATED)
            else:
                print(serializer.errors)
                return Response({'error': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# LOGIN View
class LoginView(APIView):
    def post(self, request):
        try:
            data = request.data
            email = data.get('email')
            password = data.get('password')

            print("========== LOGIN REQUEST ==========")
            print(request.data)
            print("===================================")

            user_id = db.login(email, password)  # This uses the dbcommands login function
            if user_id:
                return Response({'message': 'Login successful', 'user_id': user_id}, status=status.HTTP_200_OK)
            else:
                return Response({'error': 'Invalid email or password'}, status=status.HTTP_401_UNAUTHORIZED)

        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        

class GetUserNameView(APIView):
    def post(self, request):
        try:
            user_id = request.data.get('_id')

            if not user_id and isinstance(request.data, (str, int)):
                user_id = request.data

            if not user_id:
                return Response({'error': 'Missing user_id'}, status=status.HTTP_400_BAD_REQUEST)

            print("========== USER REQUEST ==========")
            print("user_id =", user_id)
            print("===================================")

            found_user = db.get_user_name(user_id);
            if found_user:
                return Response({'name': found_user}, status=status.HTTP_200_OK)
            else:
                return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
