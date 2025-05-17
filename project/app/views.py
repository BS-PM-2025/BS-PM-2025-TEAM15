from rest_framework.decorators import api_view
from rest_framework import status
from bson import ObjectId
from app import dbcommands as db  
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

    #deleted commented code

from .serializer import YourRequestSerializer  # ודא/י שאת מייבאת את הסריאלייזר המתאים

class Student_personal_requests(APIView):

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
                data["department"],
                data["category"]
            )
            return Response({"success": True, "data": {"_id": str(inserted)}}, status=201)
        else:
            return Response({"success": False, "errors": serializer.errors}, status=400)

    def get(self,request):
        try : 
            
            student_id = request.query_params.get('_id')
            if not student_id:
                return Response({'error': 'Missing student_id'}, status=status.HTTP_400_BAD_REQUEST)

            # Get related course IDs for the student
            course_ids = db.get_all_courses(student_id)  
            if not course_ids:
                return Response({'courses': []}, status=status.HTTP_200_OK)

            # Fetch full course data from the `courses` collection
            course_docs = db.courses.find({
                "_id": { "$in": [ObjectId(cid) for cid in course_ids] }
            })

            # Convert ObjectId to str for JSON serialization
            courses = []
            for course in course_docs:
                print("\n",course)
                course['_id'] = str(course['_id'])
                courses.append(course)
            

            return Response({'courses': courses}, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        #סטטוס בקשות 
from rest_framework.views import APIView
from rest_framework.response import Response
from django.http import JsonResponse
from .serializer import YourRequestSerializer

from . import dbcommands as dbcom 
from . import dbcommands

class RequestStatusView(APIView):
    def get(self, request):
        student_id = request.query_params.get('user_id')
        if not student_id:
            return Response({'error': 'Missing user_id'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            ask_ids = dbcommands.get_student_asks(student_id)
            print("\n",student_id)
            # שימוש ב get_ask_by_id כמו שהוא
            asks = []
            for aid in ask_ids:
                ask = dbcommands.get_ask_by_id(aid)
                if ask:
                    asks.append(ask)

            return Response(asks, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
from django.contrib.auth.hashers import make_password, check_password
from .models import users,SearchModel
from .serializer import UserSignUpSerializer, SearchSerializer,Graph_courses
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
                db.set_user(
                    data["_id"],
                    data["name"],
                    data["email"],
                    data["password"],
                    data["type"]
                );
                if data["type"] == "Student":
                    db.set_Student(
                        data["_id"],
                        data["department"],
                        data["status"],
                        data["sum_points"],
                        data["average"]
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

            found_user = db.get_user_name_by_id(user_id)
            if found_user:
                return Response({'name': found_user}, status=status.HTTP_200_OK)
            else:
                return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class Searchview(APIView):
    def get(self, request):
        query = request.GET.get("query", "")
        if not query:
            return Response([])

        documents = dbcom.get_all_students()

        student_list = []
        for doc in documents:
            doc['_id'] = str(doc['_id'])  # Convert ObjectId
            student_list.append(doc)
        
        print(student_list[0])

        serializer = SearchSerializer(student_list, many=True)
        return Response(serializer.data)
    def post(self,request):
        try:
            user_id = int(request.data.get('user_id'))
            status_change = request.data.get('Statuschange')
            print("The User is ",user_id)
            print("The wanted Status:",status_change)

            if(dbcom.change_student_status_by_id(user_id,status_change)):
                return Response({"success": True},status=status.HTTP_200_OK)
            else:
                return Response({"success": False,'error': 'Cant change Status ,try again please'}, status=status.HTTP_404_NOT_FOUND)
    
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        


class graphs(APIView):
    def get(self, request):

        try:
            user_id = request.GET.get("user_id")

            if not user_id:
                return Response({"success": False, "error": "Missing user_id"}, status=status.HTTP_400_BAD_REQUEST)
            print("📥 Received GET to /api/graph with user_id =", request.GET.get("user_id"))
            users_dep = dbcom.get_student_department_by_id(user_id)
            if not users_dep:
                
                return Response({"success": False, "error": "Student not found or no department associated."}, status=status.HTTP_404_NOT_FOUND)
            print("users_dep",users_dep)
            course_data = dbcom.get_courses_grouped_by_year_and_semester(users_dep)

            print("course_data",course_data)
            if course_data:
                serialized_data = {}

                for year, semesters in course_data.items():
                    serialized_data[year] = {}
                    for semester, course_list in semesters.items():
                        course_dicts = [
                            {
                                "name": course.get("name"),
                                "status": course.get("status", "Locked"),
                                "year": year,
                                "semester": semester,
                                "depend_on": course.get("depend_on")
                            }
                            for course in course_list
                        ]
                        serializer = Graph_courses(course_dicts, many=True)
                        serialized_data[year][semester] = serializer.data
                  
                return Response({"success": True, "courses": serialized_data}, status=status.HTTP_200_OK)

            return Response({"success": False, "error": "No courses found for the department."}, status=status.HTTP_404_NOT_FOUND)

        except Exception as e:

            print("ERROR:", str(e))
            return Response({"success": False, "error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        

    def post(self,request):
        print("📥 Received post to /api/graph with user_id =", request.GET.get("user_id"))

        try:  
            user_id = request.GET.get("user_id")
            if not user_id:
                    print("ERROR:", str(e))
                    return Response({"success": False, "error": "Missing user_id"}, status=status.HTTP_400_BAD_REQUEST)
            
           
            user_courses_grades = []

            grade = 0
            serialized_data = {}
            user_courses = dbcom.get_all_courses(user_id)
            print("usercourse",user_courses)
            course_ids = []
            for raw_course in user_courses:
                if isinstance(raw_course, dict) and '$oid' in raw_course:
                    course_ids.append(ObjectId(raw_course['$oid']))
                else:
                    # fallback: if it's already ObjectId or string
                    course_ids.append(ObjectId(str(raw_course)))
                    
            for course in course_ids:
                string_id = str(course)

                grade = dbcom.find_courses_with_nested_id(string_id,user_id)
                name_course = dbcom.get_course_by_oid(course)
                print("name",name_course)
                print("grade::",grade)
                user_courses_grades.append({
                    "name": name_course,
                    "grade": grade if grade is not None else 'None'
                })
                serializer = grades_graph(user_courses_grades,many=True)
                serialized_data = serializer.data
            print(user_courses_grades)
            return Response({"success": True, "courses": serialized_data}, status=status.HTTP_200_OK)
        
        except Exception as e:
            print("ERROR:", str(e))
            return Response({"success": False, "error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
