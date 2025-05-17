from rest_framework.decorators import api_view
from rest_framework import status
from bson import ObjectId
from app import dbcommands as db
from django.shortcuts import render
from rest_framework.views import APIView
from .models import *
from rest_framework.response import Response
from .serializer import *
from django.contrib.auth.hashers import make_password, check_password
#from .models import users, courses, studcourses
#from .serializer import UserSignUpSerializer, StudentSerializer, CourseSerializer, StudCourseSerializer
import json
#from .models import YourRequestModel
#from .serializer import YourRequestSerializer
from . import dbcommands as dbcom 
#from .models import Counter

# Create your views here.
def home(request):
    return render(request, 'home.html')

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

class RequestStatusView(APIView):
    def get(self, request):
        requests = dbcom.get_pending_asks_for_admin(2)  # אם צריך לפי משתמש, סנן לפי `request.user`
        serializer = RequestStatusserializer(requests, many=True)
        return Response(serializer.data)

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
       
#Home view
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

#StudentDash view
class GetStudentCourseInfoView(APIView):
    def get(self, request):
        try:
            user_id_ = int(request.query_params.get('user_id'))
            if not user_id_:
                return Response({"error": "Missing user_id"}, status=status.HTTP_400_BAD_REQUEST)
            
            student = db.get_full_student_profile(user_id_)

            student_courses = db.get_all_courses(user_id_)
            
            total_earned_credits = 0.0
            completed_courses = []
            courses_details = []
            completed_amount = 0

            print("######Check######")
            print("Student check: " + str(student))
            print("student courses check: " + str(student_courses))

            for course in student_courses:
                course_id = course["id_course"]
                grade = course["grade"]
                finished = course["finish"]

                print("Course_id check: " + str(course_id))
                print("grade check: " + str(grade))
                print("finished check: " + str(finished))

                course_info = db.get_course_info(course_id)

                print("Course info check:" + str(course_info))

                if finished:
                    total_earned_credits += float(course_info["points"])
                    completed_amount = completed_amount+1
                courses_details.append({
                    "name": course_info.get("name"),
                    "lecturer": course_info.get("lecturer"),
                    "department": course_info.get("department"),
                    "points": course_info.get("points"),
                    "grade": grade,
                    "finished": finished
                })

            TOTAL_REQUIRED_CREDITS = 160
            remaining_credits = max(0, TOTAL_REQUIRED_CREDITS - total_earned_credits)

            return Response({
                "total_earned_credits": total_earned_credits,
                "credits_remaining": remaining_credits,
                "courses": courses_details,
                "amount_completed":completed_amount,
            }, status=status.HTTP_200_OK)
        
        except Exception as e:
            print("ERROR:", str(e))
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
