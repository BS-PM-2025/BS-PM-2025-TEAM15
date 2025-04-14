from django.urls import path
from . import views
from .views import ReactView,Student_personal_requests
from .views import RequestStatusView


urlpatterns = [
    path('', views.home, name='home'),
    path('wel/', ReactView.as_view(), name="something"),
    path('/',ReactView.as_view(),name = "Home"),
    path('api/studentrequests/',Student_personal_requests.as_view(),name = "Studentrequest"),
     path('api/request-status/', RequestStatusView.as_view(), name='request-status'),

]
