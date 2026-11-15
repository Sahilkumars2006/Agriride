from django.core.management.base import BaseCommand
from apps.users.models import User

class Command(BaseCommand):
    help = 'Seeds initial demonstration accounts for Farmer, Owner, and Admin roles'

    def handle(self, *args, **options):
        # 1. Admin Account
        admin_email = 'admin@agriride.org'
        if not User.objects.filter(email=admin_email).exists():
            admin_user = User.objects.create_superuser(
                email=admin_email,
                username='agriride_admin',
                password='Admin@1234',
                first_name='Admin',
                last_name='AgriRide',
                phone='+91 99999 00001',
                role=User.Role.ADMIN
            )
            self.stdout.write(self.style.SUCCESS(f'Created Admin user: {admin_email}'))
        else:
            self.stdout.write(f'Admin user {admin_email} already exists.')

        # 2. Equipment Owner Account
        owner_email = 'owner.dhillon@agriride.org'
        if not User.objects.filter(email=owner_email).exists():
            owner_user = User.objects.create_user(
                email=owner_email,
                username='gurpreet_dhillon',
                password='Owner@1234',
                first_name='Gurpreet',
                last_name='Dhillon',
                phone='+91 98765 43210',
                role=User.Role.OWNER,
                address='Samrala Village, Ludhiana District, Punjab'
            )
            self.stdout.write(self.style.SUCCESS(f'Created Owner user: {owner_email}'))
        else:
            self.stdout.write(f'Owner user {owner_email} already exists.')

        # 3. Farmer Account
        farmer_email = 'farmer.demo@agriride.org'
        if not User.objects.filter(email=farmer_email).exists():
            farmer_user = User.objects.create_user(
                email=farmer_email,
                username='jaswinder_farmer',
                password='Farmer@1234',
                first_name='Jaswinder',
                last_name='Singh',
                phone='+91 98111 22334',
                role=User.Role.FARMER,
                address='Khanna Village, Ludhiana District, Punjab'
            )
            self.stdout.write(self.style.SUCCESS(f'Created Farmer user: {farmer_email}'))
        else:
            self.stdout.write(f'Farmer user {farmer_email} already exists.')

        self.stdout.write(self.style.SUCCESS('All demonstration user accounts successfully seeded.'))
