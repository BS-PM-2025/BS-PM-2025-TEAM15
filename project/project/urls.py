from django.urls import path, include
#from app.admin import safe_admin  #  import your custom admin

urlpatterns = [
    #path('admin/', safe_admin.urls),  #  use your safe_admin
    path('', include('app.urls')),
]
