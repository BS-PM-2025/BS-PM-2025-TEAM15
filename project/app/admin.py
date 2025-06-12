class SafeAdminSite(AdminSite):
    site_header = "Safe Admin"
    site_title = "Safe Admin Portal"
    index_title = "Welcome to Safe Admin"

safe_admin = SafeAdminSite(name="safe_admin")
