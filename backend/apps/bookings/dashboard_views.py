from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions
from django.db.models import Sum, Count, Q
from .models import Booking
from apps.equipment.models import Equipment
from apps.users.models import User
from .serializers import BookingListDetailSerializer
from apps.equipment.serializers import EquipmentListSerializer
from apps.users.permissions import IsFarmer, IsEquipmentOwner, IsAdminUserRole

class FarmerDashboardView(APIView):
    """
    GET /api/v1/dashboard/farmer/
    Returns farmer analytics: total bookings, active rentals, pending requests, total expenditure, recent bookings.
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        farmer = request.user
        bookings = Booking.objects.filter(farmer=farmer)

        total_bookings = bookings.count()
        pending_bookings = bookings.filter(booking_status=Booking.BookingStatus.PENDING).count()
        active_rentals = bookings.filter(booking_status__in=[Booking.BookingStatus.ACCEPTED, Booking.BookingStatus.ACTIVE]).count()
        completed_rentals = bookings.filter(booking_status=Booking.BookingStatus.COMPLETED).count()

        total_spent = bookings.filter(
            booking_status__in=[Booking.BookingStatus.ACCEPTED, Booking.BookingStatus.ACTIVE, Booking.BookingStatus.COMPLETED]
        ).aggregate(total=Sum('total_amount'))['total'] or 0

        recent_bookings = bookings.select_related(
            'equipment', 'equipment__owner'
        ).prefetch_related('equipment__images')[:5]

        return Response({
            "metrics": {
                "total_bookings": total_bookings,
                "pending_bookings": pending_bookings,
                "active_rentals": active_rentals,
                "completed_rentals": completed_rentals,
                "total_spent": float(total_spent),
            },
            "recent_bookings": BookingListDetailSerializer(recent_bookings, many=True).data
        })


class OwnerDashboardView(APIView):
    """
    GET /api/v1/dashboard/owner/
    Returns owner fleet analytics: total equipment, active listings, pending incoming requests, earnings, recent requests.
    """
    permission_classes = [permissions.IsAuthenticated, IsEquipmentOwner]

    def get(self, request):
        owner = request.user
        fleet = Equipment.objects.filter(owner=owner, is_active=True)
        bookings = Booking.objects.filter(equipment__owner=owner)

        total_equipment = fleet.count()
        active_listings = fleet.filter(available=True).count()
        pending_requests = bookings.filter(booking_status=Booking.BookingStatus.PENDING).count()
        completed_rentals = bookings.filter(booking_status=Booking.BookingStatus.COMPLETED).count()

        total_earnings = bookings.filter(
            booking_status=Booking.BookingStatus.COMPLETED
        ).aggregate(total=Sum('base_amount'))['total'] or 0

        recent_requests = bookings.select_related(
            'farmer', 'equipment'
        ).prefetch_related('equipment__images')[:5]

        return Response({
            "metrics": {
                "total_equipment": total_equipment,
                "active_listings": active_listings,
                "pending_requests": pending_requests,
                "completed_rentals": completed_rentals,
                "total_earnings": float(total_earnings),
            },
            "recent_requests": BookingListDetailSerializer(recent_requests, many=True).data
        })


class AdminDashboardView(APIView):
    """
    GET /api/v1/dashboard/admin/
    Returns platform-wide metrics for administrator.
    """
    permission_classes = [IsAdminUserRole]

    def get(self, request):
        total_users = User.objects.count()
        total_farmers = User.objects.filter(role=User.Role.FARMER).count()
        total_owners = User.objects.filter(role=User.Role.OWNER).count()
        total_equipment = Equipment.objects.filter(is_active=True).count()
        
        all_bookings = Booking.objects.all()
        total_bookings = all_bookings.count()
        pending_bookings = all_bookings.filter(booking_status=Booking.BookingStatus.PENDING).count()
        completed_bookings = all_bookings.filter(booking_status=Booking.BookingStatus.COMPLETED).count()

        gross_value = all_bookings.filter(
            booking_status__in=[Booking.BookingStatus.ACCEPTED, Booking.BookingStatus.ACTIVE, Booking.BookingStatus.COMPLETED]
        ).aggregate(total=Sum('total_amount'))['total'] or 0

        recent_bookings = all_bookings.select_related(
            'farmer', 'equipment', 'equipment__owner'
        ).prefetch_related('equipment__images')[:8]

        return Response({
            "metrics": {
                "total_users": total_users,
                "total_farmers": total_farmers,
                "total_owners": total_owners,
                "total_equipment": total_equipment,
                "total_bookings": total_bookings,
                "pending_bookings": pending_bookings,
                "completed_bookings": completed_bookings,
                "gross_platform_value": float(gross_value),
            },
            "recent_bookings": BookingListDetailSerializer(recent_bookings, many=True).data
        })
