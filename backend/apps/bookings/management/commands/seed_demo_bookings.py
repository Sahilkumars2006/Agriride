from django.core.management.base import BaseCommand
from datetime import date, timedelta
from decimal import Decimal
from apps.users.models import User
from apps.equipment.models import Equipment
from apps.bookings.models import Booking

class Command(BaseCommand):
    help = 'Seeds realistic sample bookings for demonstration'

    def handle(self, *args, **options):
        farmer = User.objects.filter(role=User.Role.FARMER).first()
        owner = User.objects.filter(role=User.Role.OWNER).first()

        if not farmer or not owner:
            self.stdout.write(self.style.ERROR('Please run seed_demo_users first.'))
            return

        equipment_list = Equipment.objects.filter(owner=owner)
        if not equipment_list.exists():
            self.stdout.write(self.style.ERROR('Please run seed_equipment_data first.'))
            return

        mahindra = equipment_list.filter(brand='Mahindra').first() or equipment_list.first()

        # 1. Pending Booking (Ready for Owner to Accept during demonstration!)
        Booking.objects.get_or_create(
            farmer=farmer,
            equipment=mahindra,
            start_date=date.today() + timedelta(days=2),
            end_date=date.today() + timedelta(days=4),
            defaults={
                'billing_mode': Booking.BillingMode.DAY,
                'duration_units': 2,
                'unit_rate': mahindra.price_per_day,
                'base_amount': mahindra.price_per_day * 2,
                'security_deposit': mahindra.security_deposit,
                'platform_fee': Decimal('320.00'),
                'total_amount': (mahindra.price_per_day * 2) + mahindra.security_deposit + Decimal('320.00'),
                'booking_status': Booking.BookingStatus.PENDING,
                'notes': 'Requested for laser levelling and seedbed preparation across 12 acres.'
            }
        )

        # 2. Completed Booking (For earnings metrics)
        completed_eq = equipment_list.last()
        Booking.objects.get_or_create(
            farmer=farmer,
            equipment=completed_eq,
            start_date=date.today() - timedelta(days=10),
            end_date=date.today() - timedelta(days=8),
            defaults={
                'billing_mode': Booking.BillingMode.DAY,
                'duration_units': 2,
                'unit_rate': completed_eq.price_per_day,
                'base_amount': completed_eq.price_per_day * 2,
                'security_deposit': completed_eq.security_deposit,
                'platform_fee': Decimal('200.00'),
                'total_amount': (completed_eq.price_per_day * 2) + completed_eq.security_deposit + Decimal('200.00'),
                'booking_status': Booking.BookingStatus.COMPLETED,
                'notes': 'Wheat harvesting successfully completed.'
            }
        )

        self.stdout.write(self.style.SUCCESS('Seeded demonstration bookings successfully.'))
