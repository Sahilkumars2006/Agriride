from django.urls import path
from .views import (
    BookingCreateView,
    FarmerBookingsListView,
    OwnerBookingsListView,
    BookingDetailView,
    BookingAcceptView,
    BookingRejectView,
    BookingCancelView,
    BookingCompleteView,
    AdminAllBookingsListView
)
from .dashboard_views import (
    FarmerDashboardView,
    OwnerDashboardView,
    AdminDashboardView
)

urlpatterns = [
    # Bookings CRUD & Transitions
    path('bookings/', BookingCreateView.as_view(), name='booking-create'),
    path('bookings/farmer/', FarmerBookingsListView.as_view(), name='farmer-bookings-list'),
    path('bookings/owner/', OwnerBookingsListView.as_view(), name='owner-bookings-list'),
    path('bookings/<uuid:pk>/', BookingDetailView.as_view(), name='booking-detail'),
    path('bookings/<uuid:pk>/accept/', BookingAcceptView.as_view(), name='booking-accept'),
    path('bookings/<uuid:pk>/reject/', BookingRejectView.as_view(), name='booking-reject'),
    path('bookings/<uuid:pk>/cancel/', BookingCancelView.as_view(), name='booking-cancel'),
    path('bookings/<uuid:pk>/complete/', BookingCompleteView.as_view(), name='booking-complete'),

    # Admin Bookings
    path('admin/bookings/', AdminAllBookingsListView.as_view(), name='admin-bookings-list'),

    # Dashboards Analytics
    path('dashboard/farmer/', FarmerDashboardView.as_view(), name='farmer-dashboard'),
    path('dashboard/owner/', OwnerDashboardView.as_view(), name='owner-dashboard'),
    path('dashboard/admin/', AdminDashboardView.as_view(), name='admin-dashboard'),
]
