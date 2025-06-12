from django.contrib import admin
from django.contrib.admin import AdminSite

# ✅ Define and instantiate a custom admin site to avoid Jenkins crash
class SafeAdminSite(AdminSite):
    site_header = "Placeholder Admin"
    site_title = "Placeholder Admin Portal"
    index_title = "Welcome to Placeholder Admin"

# ✅ Correct: instantiate the custom admin site
admin.site = SafeAdminSite(name="safe_admin")
