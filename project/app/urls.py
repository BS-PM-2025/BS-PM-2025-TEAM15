from django.urls import path
from . import views
from .adminviews import is_admin,get_all_requests,reassign_ask,update_ask_status,get_all_admins,add_note_to_ask,get_full_student_summary
from .views import  ReactView,Student_personal_requests,RequestStatusView,SignUpView,LoginView,GetUserNameView
from django.conf.urls.static import static
from django.conf import settings

urlpatterns = [
   
    path('', views.home, name='home'),
    path('wel/', ReactView.as_view(), name="something"),
    path('api/studentrequests/',Student_personal_requests.as_view(),name = "Studentrequest"),
    path('api/users/Login',LoginView.as_view(),name = "Login"),
    path('api/users/SignUp',SignUpView.as_view(),name = "Signup"),
    path('api/request_status/',RequestStatusView.as_view(),name ="request_status"),
    path('api/users/Home', GetUserNameView.as_view(), name='get_user_name'),
    path("asks/", get_all_requests),
    path("asks/<str:ask_id>/reassign/", reassign_ask),
    path("asks/<str:ask_id>/update_status/", update_ask_status),
    path("admins/", get_all_admins),
    path("asks/<str:ask_id>/add_note/", add_note_to_ask),
    path("studentlookup/<int:student_id>/", get_full_student_summary),
    

    #to check if the user is admin
    path('api/isadmin/',is_admin)
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
