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
import json
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse

from . import dbcommands as dbcom 
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from . import dbcommands  # חשוב!    
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
                data["id_receiving"], ########adding check
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
    def get(self, request):
        try:
            departments = db.get_all_departments()  # You already store departments in DB
            return Response(departments, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

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
        
#ספירת בקשות ובדיקה כמה יש וכמה הסתיימו 
class StudentStatsView(APIView):
    def get(self, request, student_id):
        user_id = int(student_id)
        print("--->>> Stats request for user:", user_id)

        try:
            # Use your helper function to check admin status
            is_admin_user = dbcommands.is_admin(user_id)

            # Initialize counters
            total = 0
            pending = 0
            inprogress = 0
            approved = 0
            done = 0

            if is_admin_user:
                # Admin: get requests they received
                all_requests = db.requests.find({ "id_receiving": user_id })
            else:
                # Student: get requests they sent
                ask_ids = dbcommands.get_student_asks(user_id)
                all_requests = [dbcommands.get_ask_by_id(aid) for aid in ask_ids]

            # Count statuses
            for ask in all_requests:
                if ask:
                    total += 1
                    status_val = ask.get("status", "").lower()

                    if status_val == "pending":
                        pending += 1
                    elif status_val == "approved":
                        approved += 1
                    elif status_val == "done":
                        done += 1
                    elif "in progress" in status_val or "בטיפול" in status_val:
                        inprogress += 1

            new_messages = (
                dbcommands.count_unread_messages(user_id)
                if hasattr(dbcommands, "count_unread_messages")
                else 0
            )

            return Response({
                "totalRequests": total,
                "IN_progress": inprogress,
                "pendingRequests": pending,
                "doneRequests": done,
                "newMessages": new_messages
            }, status=status.HTTP_200_OK)

        except Exception as e:
            print("❌ Error in StudentStatsView:", e)
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
        
#StudentDash view
class GetStudentCourseInfoView(APIView):
    def get(self, request):
        try:
            user_id_ = int(request.query_params.get('user_id'))
            if not user_id_:
                return Response({"error": "Missing user_id"}, status=status.HTTP_400_BAD_REQUEST)
            
            student = db.get_full_student_profile(user_id_)

            student_courses = db.get_courses_in_list(user_id_)
            
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

                course_info = db.get_course_full_info(course_id)

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

#Student Profile
def helper_for_sum_points(x):
            student = db.get_full_student_profile(x)

            student_courses = db.get_courses_in_list(x)
            
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

                course_info = db.get_course_full_info(course_id)

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
            return  total_earned_credits
class GetStudentProfileView(APIView):
    

    def get(self, request):
        try:
            
            user_id = int(request.query_params.get('user_id'))
            if not user_id:
                return Response({"error": "Missing user_id"}, status=status.HTTP_400_BAD_REQUEST)

            student_data = db.get_full_student_profile(user_id)
            
            user_name = db.get_user_name_by_id(user_id)
            user_email = db.get_user_email_by_id(user_id)
            user_avg = db.get_student_average_by_id(user_id)
            user_sun_po = helper_for_sum_points(user_id)
            if not student_data or not user_name:
                return Response({"error": "Student not found"}, status=status.HTTP_404_NOT_FOUND)
            print("well 2", user_sun_po)
            return Response({
                "name": user_name,
                "email": user_email,
                "department": student_data.get("department"),
                "status": student_data.get("status"),
                "sum_points": user_sun_po,
                "average": user_avg,
            }, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
   
    def put(self, request):
        try:
            user_id = int(request.data.get("user_id"))
            name = request.data.get("name")
            email = request.data.get("email")

            if not user_id or not name or not email:
                return Response({"error": "Missing data"}, status=status.HTTP_400_BAD_REQUEST)

            db.users.update_one({"_id": user_id}, {"$set": {"name": name, "email": email}})
            return Response({"message": "Profile updated successfully"}, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)



from .dbcommands import append_text

@csrf_exempt
def edit_request_text(request, ask_id):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            new_text = data.get("new_text", "").strip()

            if not new_text:
                return JsonResponse({"error": "Text cannot be empty."}, status=400)

            success = append_text(ask_id, new_text)  # ✅ use your helper

            if not success:
                return JsonResponse({"error": "Request not found."}, status=404)

            return JsonResponse({"message": "Text appended successfully."}, status=200)

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    return JsonResponse({"error": "Invalid method"}, status=405)
