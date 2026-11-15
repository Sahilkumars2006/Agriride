from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.http import JsonResponse

def api_root(request):
    return JsonResponse({
        "project": "AgriRide Backend API",
        "tagline": "Rent Smarter. Farm Better.",
        "status": "Online & Operational",
        "version": "1.0.0",
        "author": "Sahil Kumar",
        "github": "https://github.com/Sahilkumars2006/Agriride",
        "endpoints": {
            "categories": "/api/v1/categories/",
            "equipment": "/api/v1/equipment/",
            "bookings": "/api/v1/bookings/",
            "auth_login": "/api/v1/auth/login/",
            "auth_register": "/api/v1/auth/register/",
            "farmer_dashboard": "/api/v1/dashboard/farmer/",
            "owner_dashboard": "/api/v1/dashboard/owner/",
            "admin_dashboard": "/api/v1/dashboard/admin/",
            "django_admin": "/admin/"
        }
    })

urlpatterns = [
    path('', api_root, name='api-root'),
    path('admin/', admin.site.urls),
    # API Base v1
    path('api/v1/', include('apps.users.urls')),
    path('api/v1/', include('apps.equipment.urls')),
    path('api/v1/', include('apps.bookings.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
