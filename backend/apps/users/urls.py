from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import (
    RegisterView, 
    LoginView, 
    UserProfileView,
    AdminUserListView,
    AdminUserDetailView,
    NotificationListView,
    NotificationMarkReadView,
    NotificationMarkAllReadView
)

urlpatterns = [
    # Authentication endpoints
    path('auth/register/', RegisterView.as_view(), name='auth-register'),
    path('auth/login/', LoginView.as_view(), name='auth-login'),
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='token-refresh'),
    path('auth/me/', UserProfileView.as_view(), name='auth-me'),
    path('auth/profile/', UserProfileView.as_view(), name='auth-profile'),

    # Admin user management endpoints
    path('admin/users/', AdminUserListView.as_view(), name='admin-users-list'),
    path('admin/users/<uuid:pk>/', AdminUserDetailView.as_view(), name='admin-users-detail'),

    # Notifications endpoints
    path('notifications/', NotificationListView.as_view(), name='notifications-list'),
    path('notifications/<uuid:pk>/read/', NotificationMarkReadView.as_view(), name='notification-mark-read'),
    path('notifications/mark-all-read/', NotificationMarkAllReadView.as_view(), name='notifications-mark-all-read'),
]
