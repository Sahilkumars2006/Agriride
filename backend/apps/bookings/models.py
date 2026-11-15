import uuid
from decimal import Decimal
from django.db import models
from django.conf import settings
from apps.equipment.models import Equipment

class Booking(models.Model):
    class BookingStatus(models.TextChoices):
        PENDING = 'PENDING', 'Pending Owner Review'
        ACCEPTED = 'ACCEPTED', 'Accepted by Owner'
        REJECTED = 'REJECTED', 'Rejected by Owner'
        ACTIVE = 'ACTIVE', 'Active Field Rental'
        COMPLETED = 'COMPLETED', 'Rental Completed'
        CANCELLED = 'CANCELLED', 'Cancelled by Farmer'

    class PaymentStatus(models.TextChoices):
        PENDING = 'PENDING', 'Payment Pending'
        PAID = 'PAID', 'Payment Received (Escrow)'
        REFUNDED = 'REFUNDED', 'Deposit Refunded'

    class BillingMode(models.TextChoices):
        HOUR = 'HOUR', 'Hourly Billing'
        DAY = 'DAY', 'Daily Billing'

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    farmer = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='farmer_bookings'
    )
    equipment = models.ForeignKey(
        Equipment,
        on_delete=models.CASCADE,
        related_name='equipment_bookings'
    )
    start_date = models.DateField(db_index=True)
    end_date = models.DateField(db_index=True)
    billing_mode = models.CharField(
        max_length=10,
        choices=BillingMode.choices,
        default=BillingMode.DAY
    )
    duration_units = models.PositiveIntegerField(default=1)

    unit_rate = models.DecimalField(max_digits=10, decimal_places=2)
    base_amount = models.DecimalField(max_digits=10, decimal_places=2)
    security_deposit = models.DecimalField(max_digits=10, decimal_places=2, default=1000.00)
    platform_fee = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)

    booking_status = models.CharField(
        max_length=20,
        choices=BookingStatus.choices,
        default=BookingStatus.PENDING,
        db_index=True
    )
    payment_status = models.CharField(
        max_length=20,
        choices=PaymentStatus.choices,
        default=PaymentStatus.PAID,
        db_index=True
    )

    notes = models.TextField(blank=True, null=True)
    rejection_reason = models.TextField(blank=True, null=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Booking #{str(self.id)[:8]} - {self.equipment.name} ({self.booking_status})"

    def calculate_totals(self):
        """Server-side price calculation logic. Never trust client numbers."""
        if self.billing_mode == self.BillingMode.HOUR:
            self.unit_rate = self.equipment.price_per_hour
        else:
            self.unit_rate = self.equipment.price_per_day

        self.base_amount = Decimal(self.unit_rate) * Decimal(self.duration_units)
        self.security_deposit = Decimal(self.equipment.security_deposit)
        self.platform_fee = (self.base_amount * Decimal('0.05')).quantize(Decimal('1.00'))
        self.total_amount = self.base_amount + self.security_deposit + self.platform_fee
