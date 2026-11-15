from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from django.db import transaction
from .models import Booking
from .serializers import (
    BookingCreateSerializer,
    BookingListDetailSerializer
)
from apps.users.permissions import IsFarmer, IsEquipmentOwner, IsAdminUserRole
from apps.users.models import Notification

class BookingCreateView(generics.CreateAPIView):
    """
    POST /api/v1/bookings/
    Farmer submits an agricultural equipment rental request.
    """
    serializer_class = BookingCreateSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        booking = serializer.save()
        # Trigger notification to equipment owner
        Notification.objects.create(
            user=booking.equipment.owner,
            title=f"New Booking Request #{str(booking.id)[:8]}",
            message=f"Farmer {booking.farmer.first_name or booking.farmer.username} submitted a booking request for {booking.equipment.name} ({booking.start_date} to {booking.end_date})."
        )


class FarmerBookingsListView(generics.ListAPIView):
    """
    GET /api/v1/bookings/farmer/
    Farmer views their rental booking history and status.
    """
    serializer_class = BookingListDetailSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Booking.objects.filter(farmer=self.request.user).select_related(
            'equipment', 'equipment__owner', 'equipment__category'
        ).prefetch_related('equipment__images')


class OwnerBookingsListView(generics.ListAPIView):
    """
    GET /api/v1/bookings/owner/
    Equipment Owner views incoming booking requests for their fleet.
    """
    serializer_class = BookingListDetailSerializer
    permission_classes = [permissions.IsAuthenticated, IsEquipmentOwner]

    def get_queryset(self):
        return Booking.objects.filter(equipment__owner=self.request.user).select_related(
            'farmer', 'equipment', 'equipment__category'
        ).prefetch_related('equipment__images')


class BookingDetailView(generics.RetrieveAPIView):
    """GET /api/v1/bookings/<uuid:pk>/"""
    queryset = Booking.objects.all().select_related('farmer', 'equipment', 'equipment__owner')
    serializer_class = BookingListDetailSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        booking = super().get_object()
        user = self.request.user
        # Allow farmer, equipment owner, or admin to view
        if booking.farmer != user and booking.equipment.owner != user and user.role != 'ADMIN':
            raise permissions.PermissionDenied("You are not authorized to view this booking.")
        return booking


class BookingAcceptView(APIView):
    """
    POST /api/v1/bookings/<uuid:pk>/accept/
    Equipment Owner accepts a pending booking request.
    Verifies anti-overlap constraint with locking.
    """
    permission_classes = [permissions.IsAuthenticated, IsEquipmentOwner]

    @transaction.atomic
    def post(self, request, pk):
        booking = get_object_or_404(
            Booking.objects.select_for_update(),
            pk=pk,
            equipment__owner=request.user
        )

        if booking.booking_status != Booking.BookingStatus.PENDING:
            return Response(
                {"error": f"Cannot accept booking in '{booking.booking_status}' status."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Collision check against other accepted/active rentals
        conflict = Booking.objects.filter(
            equipment=booking.equipment,
            booking_status__in=[Booking.BookingStatus.ACCEPTED, Booking.BookingStatus.ACTIVE],
            start_date__lte=booking.end_date,
            end_date__gte=booking.start_date
        ).exclude(id=booking.id).exists()

        if conflict:
            return Response(
                {"error": "A conflicting booking was already accepted for this machinery for overlapping dates."},
                status=status.HTTP_409_CONFLICT
            )

        booking.booking_status = Booking.BookingStatus.ACCEPTED
        booking.save()

        # Trigger notification to farmer
        Notification.objects.create(
            user=booking.farmer,
            title=f"Booking #{str(booking.id)[:8]} Confirmed!",
            message=f"Owner {request.user.first_name or request.user.username} has confirmed your rental of {booking.equipment.name}. Machine ready for field dispatch."
        )

        return Response({
            "message": "Booking accepted successfully.",
            "booking": BookingListDetailSerializer(booking).data
        }, status=status.HTTP_200_OK)


class BookingRejectView(APIView):
    """
    POST /api/v1/bookings/<uuid:pk>/reject/
    Equipment Owner rejects a pending booking request.
    """
    permission_classes = [permissions.IsAuthenticated, IsEquipmentOwner]

    def post(self, request, pk):
        booking = get_object_or_404(
            Booking,
            pk=pk,
            equipment__owner=request.user
        )

        if booking.booking_status != Booking.BookingStatus.PENDING:
            return Response(
                {"error": f"Cannot reject booking in '{booking.booking_status}' status."},
                status=status.HTTP_400_BAD_REQUEST
            )

        reason = request.data.get('reason', 'Equipment unavailable for maintenance.')
        booking.booking_status = Booking.BookingStatus.REJECTED
        booking.rejection_reason = reason
        booking.save()

        # Trigger notification to farmer
        Notification.objects.create(
            user=booking.farmer,
            title=f"Booking #{str(booking.id)[:8]} Declined",
            message=f"Your rental request for {booking.equipment.name} was declined: {reason}"
        )

        return Response({
            "message": "Booking request rejected.",
            "booking": BookingListDetailSerializer(booking).data
        }, status=status.HTTP_200_OK)


class BookingCancelView(APIView):
    """
    POST /api/v1/bookings/<uuid:pk>/cancel/
    Farmer cancels their pending booking request.
    """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        booking = get_object_or_404(Booking, pk=pk, farmer=request.user)

        if booking.booking_status not in [Booking.BookingStatus.PENDING, Booking.BookingStatus.ACCEPTED]:
            return Response(
                {"error": f"Cannot cancel rental in '{booking.booking_status}' status."},
                status=status.HTTP_400_BAD_REQUEST
            )

        booking.booking_status = Booking.BookingStatus.CANCELLED
        booking.payment_status = Booking.PaymentStatus.REFUNDED
        booking.save()

        return Response({
            "message": "Booking cancelled successfully. Deposit marked for refund.",
            "booking": BookingListDetailSerializer(booking).data
        }, status=status.HTTP_200_OK)


class BookingCompleteView(APIView):
    """
    POST /api/v1/bookings/<uuid:pk>/complete/
    Equipment Owner or Admin marks rental as completed upon machine return.
    """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        booking = get_object_or_404(Booking, pk=pk)

        # Check authorization
        if booking.equipment.owner != request.user and request.user.role != 'ADMIN':
            raise permissions.PermissionDenied("Only the machine owner or an admin can mark completion.")

        booking.booking_status = Booking.BookingStatus.COMPLETED
        booking.save()

        return Response({
            "message": "Rental successfully marked as completed.",
            "booking": BookingListDetailSerializer(booking).data
        }, status=status.HTTP_200_OK)


class AdminAllBookingsListView(generics.ListAPIView):
    """
    GET /api/v1/admin/bookings/
    Admin endpoint to view and filter all platform rentals.
    """
    serializer_class = BookingListDetailSerializer
    permission_classes = [IsAdminUserRole]

    def get_queryset(self):
        queryset = Booking.objects.all().select_related(
            'farmer', 'equipment', 'equipment__owner', 'equipment__category'
        ).prefetch_related('equipment__images')
        
        status_param = self.request.query_params.get('status')
        if status_param:
            queryset = queryset.filter(booking_status=status_param.upper())
            
        return queryset
