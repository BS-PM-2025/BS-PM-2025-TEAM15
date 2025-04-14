from django.urls import path
from . import views
from .views import ReactView,Student_personal_requests
from django.conf.urls.static import static
from django.conf import settings



urlpatterns = [
    path('', views.home, name='home'),
    path('wel/', ReactView.as_view(), name="something"),
    path('/',ReactView.as_view(),name = "Home"),
    path('api/studentrequests/',Student_personal_requests.as_view(),name = "Studentrequest"),

]+ static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
