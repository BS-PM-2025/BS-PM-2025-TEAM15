from django.contrib import admin
from django.contrib.admin import AdminSite

# Patch: Use a safe dummy admin site to prevent Jenkins crash
class SafeAdminSite(AdminSite):
    site_header = "Placeholder Admin"
    site_title = "Placeholder Admin Portal"
    index_title = "Welcome to Placeholder Admin"

admin.site = SafeAdminSite()
