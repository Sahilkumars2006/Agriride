from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    # API Base v1
    path('api/v1/', include('apps.users.urls')),
    path('api/v1/', include('apps.equipment.urls')),
    path('api/v1/', include('apps.bookings.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
