from django.urls import path
from . import views
from .views import ReactView

urlpatterns = [
    path('', views.home, name='home'),
    path('wel/', ReactView.as_view(), name="something"),
    path('/',ReactView.as_view(),name = "Home"),
    path("user/", show_first_user),


]
