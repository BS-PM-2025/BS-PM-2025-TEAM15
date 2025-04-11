from django.urls import path
from . import views
from .views import ReactView,Student_personal_requests


urlpatterns = [
    path('', views.home, name='home'),
    path('wel/', ReactView.as_view(), name="something"),
    path('/',ReactView.as_view(),name = "Home"),
    path('api/studentrequests/',Student_personal_requests.as_view(),name = "Studentrequest"),

]
