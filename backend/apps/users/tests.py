from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from apps.users.models import User

class AuthenticationTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.farmer_user = User.objects.create_user(
            email='farmer.test@agriride.org',
            username='farmertest',
            password='TestPassword@123',
            role=User.Role.FARMER,
            first_name='Karan',
            last_name='Singh'
        )
        self.admin_user = User.objects.create_superuser(
            email='admin.test@agriride.org',
            username='admintest',
            password='AdminPassword@123',
            role=User.Role.ADMIN
        )

    def test_valid_registration(self):
        """Test valid farmer user registration."""
        url = reverse('auth-register')
        data = {
            'email': 'newfarmer.test@agriride.org',
            'username': 'newfarmer',
            'first_name': 'Harpreet',
            'last_name': 'Kaur',
            'phone': '+91 98765 00000',
            'role': 'FARMER',
            'password': 'StrongPassword@123',
            'confirm_password': 'StrongPassword@123'
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn('tokens', response.data)
        self.assertEqual(response.data['user']['role'], 'FARMER')

    def test_duplicate_email_registration(self):
        """Test registration fails with duplicate email."""
        url = reverse('auth-register')
        data = {
            'email': 'farmer.test@agriride.org',  # already exists
            'username': 'unique_user',
            'role': 'FARMER',
            'password': 'StrongPassword@123',
            'confirm_password': 'StrongPassword@123'
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('email', response.data)

    def test_disallow_admin_self_registration(self):
        """Test user cannot register as ADMIN via public registration endpoint."""
        url = reverse('auth-register')
        data = {
            'email': 'fakeadmin@agriride.org',
            'username': 'fakeadmin',
            'role': 'ADMIN',
            'password': 'StrongPassword@123',
            'confirm_password': 'StrongPassword@123'
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('role', response.data)

    def test_valid_login(self):
        """Test login with valid email and password returns JWT tokens."""
        url = reverse('auth-login')
        data = {
            'email': 'farmer.test@agriride.org',
            'password': 'TestPassword@123'
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('tokens', response.data)
        self.assertIn('access', response.data['tokens'])
        self.assertIn('refresh', response.data['tokens'])
        self.assertEqual(response.data['user']['email'], 'farmer.test@agriride.org')

    def test_invalid_login(self):
        """Test login with invalid password fails."""
        url = reverse('auth-login')
        data = {
            'email': 'farmer.test@agriride.org',
            'password': 'WrongPassword@123'
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_authenticated_profile_access(self):
        """Test GET /api/v1/auth/me/ with Bearer token."""
        login_url = reverse('auth-login')
        login_res = self.client.post(login_url, {
            'email': 'farmer.test@agriride.org',
            'password': 'TestPassword@123'
        }, format='json')
        token = login_res.data['tokens']['access']

        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')
        profile_url = reverse('auth-me')
        response = self.client.get(profile_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['email'], 'farmer.test@agriride.org')

    def test_farmer_denied_admin_endpoint(self):
        """Test role-based access control: Farmer cannot access admin user list."""
        login_url = reverse('auth-login')
        login_res = self.client.post(login_url, {
            'email': 'farmer.test@agriride.org',
            'password': 'TestPassword@123'
        }, format='json')
        token = login_res.data['tokens']['access']

        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')
        admin_url = reverse('admin-users-list')
        response = self.client.get(admin_url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_admin_allowed_admin_endpoint(self):
        """Test role-based access control: Admin can access admin user list."""
        login_url = reverse('auth-login')
        login_res = self.client.post(login_url, {
            'email': 'admin.test@agriride.org',
            'password': 'AdminPassword@123'
        }, format='json')
        token = login_res.data['tokens']['access']

        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')
        admin_url = reverse('admin-users-list')
        response = self.client.get(admin_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
