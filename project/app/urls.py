from django.urls import path
from . import views
from .adminviews import is_admin,is_prof,get_all_requests,reassign_ask,update_ask_status,get_all_admins,add_note_to_ask,get_full_student_summary,enroll_course,get_available_courses_view
from .views import  ReactView,Student_personal_requests,RequestStatusView,SignUpView,LoginView,GetUserNameView, GetStudentCourseInfoView,Searchview,graphs
from django.conf.urls.static import static
from django.conf import settings 
from .views import StudentStatsView , edit_request_text
from .adminviews import update_grade,students_in_course,professor_courses,get_ask_details,download_request_documents, get_comment,get_all_courses_view,add_course,get_all_professors

urlpatterns = [
    path('', views.home, name='home'),
    path('wel/', ReactView.as_view(), name="something"),
    path('api/studentrequests/',Student_personal_requests.as_view(),name = "Studentrequest"),
    path('api/users/Login',LoginView.as_view(),name = "Login"),
    path('api/users/SignUp',SignUpView.as_view(),name = "Signup"),
    path('api/request_status/',RequestStatusView.as_view(),name ="request_status"),
    path('api/users/Home', GetUserNameView.as_view(), name='get_user_name'),
    path('api/student/dashboard', GetStudentCourseInfoView.as_view() ,name="Student_Dashboard"),
    path("asks/", get_all_requests),
    path("asks/<str:ask_id>/reassign/", reassign_ask),
    path("asks/<str:ask_id>/update_status/", update_ask_status),
    path("admins/", get_all_admins),
    path("asks/<str:ask_id>/add_note/", add_note_to_ask),
    path("studentlookup/<int:student_id>/", get_full_student_summary),
    path('api/stats/<int:student_id>', StudentStatsView.as_view(), name='student-stats'),
    path("asks/<int:ask_id>/edit_text/", views.edit_request_text, name="edit_request_text"),
    path("asks/<int:ask_id>/", get_ask_details),
    path("courses/all/", get_all_courses_view),
    path("api/professors/", get_all_professors),
    path("comments/<int:idr>/", get_comment),

    path('api/search/', Searchview.as_view(), name="search"),
    path('api/update_status/',Searchview.as_view()),
    path('api/graph/',graphs.as_view()),
    path('api/enroll_course/', enroll_course),
    path("api/available_courses/<int:user_id>/", get_available_courses_view),
    path("api/professor_courses/<int:professor_id>/", professor_courses),
    path("api/students_in_course/<str:course_id>/", students_in_course),
    path("api/update_grade/", update_grade),
    path("asks/<int:idr>/download_documents/", download_request_documents),
    path("courses/add/", add_course),

    #to check if the user is admin
    path('api/isadmin/',is_admin),
    path('api/isprof/',is_prof),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
