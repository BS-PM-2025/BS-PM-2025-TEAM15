from django.contrib import admin
from django.contrib.admin import AdminSite

# Subclass AdminSite and keep it ready before any import uses it
class SafeAdminSite(AdminSite):
    site_header = "Safe Admin"
    site_title = "Safe Admin Portal"
    index_title = "Welcome to Safe Admin"

# Assign to admin.site BEFORE anything uses it
safe_admin = SafeAdminSite(name="safe_admin")
admin.site = safe_admin

# You can optionally register your models here, if needed
# from .models import YourModel
# admin.site.register(YourModel)
