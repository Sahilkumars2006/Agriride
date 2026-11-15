from rest_framework import serializers
from datetime import date
from django.db.models import Q
from .models import Booking
from apps.equipment.models import Equipment
from apps.equipment.serializers import EquipmentListSerializer
from apps.users.serializers import UserBriefSerializer

class BookingCreateSerializer(serializers.ModelSerializer):
    equipment_id = serializers.UUIDField(write_only=True)

    class Meta:
        model = Booking
        fields = [
            'id',
            'equipment_id',
            'start_date',
            'end_date',
            'billing_mode',
            'duration_units',
            'notes',
            'total_amount',
            'booking_status'
        ]
        read_only_fields = ['id', 'total_amount', 'booking_status']

    def validate(self, attrs):
        equipment_id = attrs.get('equipment_id')
        start_date = attrs.get('start_date')
        end_date = attrs.get('end_date')

        try:
            equipment = Equipment.objects.get(id=equipment_id, is_active=True)
        except Equipment.DoesNotExist:
            raise serializers.ValidationError({"equipment_id": "Specified equipment not found or inactive."})

        # Disallow renting own equipment
        request = self.context.get('request')
        if request and request.user == equipment.owner:
            raise serializers.ValidationError({"equipment_id": "You cannot rent your own machinery listing."})

        if start_date < date.today():
            raise serializers.ValidationError({"start_date": "Start date cannot be in the past."})

        if end_date < start_date:
            raise serializers.ValidationError({"end_date": "End date cannot be prior to start date."})

        # Anti-overlap availability check: Check if overlapping accepted/active bookings exist
        conflicting_bookings = Booking.objects.filter(
            equipment=equipment,
            booking_status__in=[Booking.BookingStatus.ACCEPTED, Booking.BookingStatus.ACTIVE],
            start_date__lte=end_date,
            end_date__gte=start_date
        )
        if conflicting_bookings.exists():
            raise serializers.ValidationError(
                "This machinery already has a confirmed rental for the requested date period. Please choose alternate dates."
            )

        attrs['equipment_instance'] = equipment
        return attrs

    def create(self, validated_data):
        equipment = validated_data.pop('equipment_instance')
        validated_data.pop('equipment_id')
        request = self.context.get('request')
        farmer = request.user

        booking = Booking(
            farmer=farmer,
            equipment=equipment,
            **validated_data
        )
        booking.calculate_totals()
        booking.save()
        return booking


class BookingListDetailSerializer(serializers.ModelSerializer):
    equipment = EquipmentListSerializer(read_only=True)
    farmer = UserBriefSerializer(read_only=True)
    owner = UserBriefSerializer(source='equipment.owner', read_only=True)

    class Meta:
        model = Booking
        fields = [
            'id',
            'farmer',
            'owner',
            'equipment',
            'start_date',
            'end_date',
            'billing_mode',
            'duration_units',
            'unit_rate',
            'base_amount',
            'security_deposit',
            'platform_fee',
            'total_amount',
            'booking_status',
            'payment_status',
            'notes',
            'rejection_reason',
            'created_at',
            'updated_at'
        ]
