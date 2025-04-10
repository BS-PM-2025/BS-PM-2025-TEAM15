from django.urls import path
from . import views
from .views import get_all_requests
from .views import reassign_ask
from .views import update_ask_status
from .views import get_all_admins
from .views import add_note_to_ask



urlpatterns = [
   
    path("asks/", get_all_requests),
    path("asks/<str:ask_id>/reassign/", reassign_ask),
    path("asks/<str:ask_id>/update_status/", update_ask_status),
    path("admins/", get_all_admins),
    path("asks/<str:ask_id>/add_note/", add_note_to_ask),



]
