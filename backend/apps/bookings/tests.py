from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from datetime import date, timedelta
from decimal import Decimal
from apps.users.models import User
from apps.equipment.models import Category, Equipment
from apps.bookings.models import Booking

class BookingWorkflowTests(TestCase):
    def setUp(self):
        self.client = APIClient()

        # Farmer
        self.farmer = User.objects.create_user(
            email='farmer.test@agriride.org',
            username='farmer_test',
            password='Password@123',
            role=User.Role.FARMER,
            first_name='Karan'
        )

        # Owner
        self.owner = User.objects.create_user(
            email='owner.test@agriride.org',
            username='owner_test',
            password='Password@123',
            role=User.Role.OWNER,
            first_name='Harpreet'
        )

        # Category & Equipment
        self.category = Category.objects.create(
            id='tractors',
            name='Tractors'
        )

        self.equipment = Equipment.objects.create(
            owner=self.owner,
            category=self.category,
            name='Sonalika Tiger 55 HP',
            brand='Sonalika',
            model='Tiger DI 55',
            price_per_hour=Decimal('400.00'),
            price_per_day=Decimal('2500.00'),
            security_deposit=Decimal('1500.00'),
            location='Ludhiana, Punjab',
            state='Punjab',
            description='Test tractor'
        )

    def test_booking_creation_and_price_calculation(self):
        """Farmer submits a booking and backend computes prices accurately."""
        self.client.force_authenticate(user=self.farmer)

        start = date.today() + timedelta(days=2)
        end = date.today() + timedelta(days=4)

        data = {
            'equipment_id': str(self.equipment.id),
            'start_date': str(start),
            'end_date': str(end),
            'billing_mode': 'DAY',
            'duration_units': 2,
            'notes': 'Wheat field plowing'
        }

        url = reverse('booking-create')
        response = self.client.post(url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        booking = Booking.objects.get(id=response.data['id'])

        # Expected: base = 2 * 2500 = 5000; deposit = 1500; fee = 250; total = 6750
        self.assertEqual(booking.base_amount, Decimal('5000.00'))
        self.assertEqual(booking.security_deposit, Decimal('1500.00'))
        self.assertEqual(booking.platform_fee, Decimal('250.00'))
        self.assertEqual(booking.total_amount, Decimal('6750.00'))
        self.assertEqual(booking.booking_status, Booking.BookingStatus.PENDING)

    def test_owner_cannot_rent_own_equipment(self):
        """Owner cannot submit a booking request for their own machine."""
        self.client.force_authenticate(user=self.owner)

        data = {
            'equipment_id': str(self.equipment.id),
            'start_date': str(date.today() + timedelta(days=1)),
            'end_date': str(date.today() + timedelta(days=2)),
            'billing_mode': 'DAY',
            'duration_units': 1
        }

        url = reverse('booking-create')
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_owner_accept_booking_workflow(self):
        """Owner accepts a pending booking request."""
        booking = Booking.objects.create(
            farmer=self.farmer,
            equipment=self.equipment,
            start_date=date.today() + timedelta(days=5),
            end_date=date.today() + timedelta(days=6),
            billing_mode=Booking.BillingMode.DAY,
            duration_units=1,
            unit_rate=Decimal('2500.00'),
            base_amount=Decimal('2500.00'),
            security_deposit=Decimal('1500.00'),
            platform_fee=Decimal('125.00'),
            total_amount=Decimal('4125.00'),
            booking_status=Booking.BookingStatus.PENDING
        )

        self.client.force_authenticate(user=self.owner)
        url = reverse('booking-accept', kwargs={'pk': booking.id})
        response = self.client.post(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        booking.refresh_from_db()
        self.assertEqual(booking.booking_status, Booking.BookingStatus.ACCEPTED)

    def test_anti_overlap_booking_collision_prevention(self):
        """System prevents overlapping bookings once a booking is accepted."""
        # 1. Existing Accepted booking: days 10 to 12
        Booking.objects.create(
            farmer=self.farmer,
            equipment=self.equipment,
            start_date=date.today() + timedelta(days=10),
            end_date=date.today() + timedelta(days=12),
            billing_mode=Booking.BillingMode.DAY,
            duration_units=2,
            unit_rate=Decimal('2500.00'),
            base_amount=Decimal('5000.00'),
            security_deposit=Decimal('1500.00'),
            platform_fee=Decimal('250.00'),
            total_amount=Decimal('6750.00'),
            booking_status=Booking.BookingStatus.ACCEPTED
        )

        # 2. Second farmer attempts to book overlapping dates: days 11 to 14
        self.client.force_authenticate(user=self.farmer)
        data = {
            'equipment_id': str(self.equipment.id),
            'start_date': str(date.today() + timedelta(days=11)),
            'end_date': str(date.today() + timedelta(days=14)),
            'billing_mode': 'DAY',
            'duration_units': 3
        }
        url = reverse('booking-create')
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("already has a confirmed rental", str(response.data))
