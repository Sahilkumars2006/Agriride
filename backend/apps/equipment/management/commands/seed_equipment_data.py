from django.core.management.base import BaseCommand
from decimal import Decimal
from apps.users.models import User
from apps.equipment.models import Category, Equipment, EquipmentImage

class Command(BaseCommand):
    help = 'Seeds categories and realistic agricultural equipment into the database'

    def handle(self, *args, **options):
        # 1. Seed Categories
        categories_data = [
            ('tractors', 'Tractors', 'High-torque 4WD, utility & mini tractors', 'Tractor'),
            ('harvesters', 'Combine Harvesters', 'Multi-crop self-propelled combine harvesters', 'Wheat'),
            ('drones', 'Agricultural Drones', 'DGCA-certified precision payload spray drones', 'Compass'),
            ('tillage', 'Tillage & Cultivation', 'Heavy duty rotavators, disc harrows and plows', 'Layers'),
            ('sowing', 'Sowing & Planting', 'Precision seed-cum-fertilizer drills and planters', 'Sprout'),
            ('sprayers', 'Crop Care & Sprayers', 'Tractor-mounted boom sprayers and orchard equipment', 'Droplets'),
        ]

        for cat_id, name, desc, icon in categories_data:
            Category.objects.update_or_create(
                id=cat_id,
                defaults={'name': name, 'description': desc, 'icon': icon}
            )
        self.stdout.write(self.style.SUCCESS('Categories seeded successfully.'))

        # 2. Find or Create Owner
        owner = User.objects.filter(role=User.Role.OWNER).first()
        if not owner:
            owner = User.objects.create_user(
                email='owner.dhillon@agriride.org',
                username='gurpreet_dhillon',
                password='Owner@1234',
                role=User.Role.OWNER,
                first_name='Gurpreet',
                last_name='Dhillon',
                phone='+91 98765 43210',
                address='Samrala Village, Ludhiana, Punjab'
            )

        # 3. Equipment Listings Data
        machines = [
            {
                'name': 'Mahindra Novo 755 DI (74 HP 4WD)',
                'category_id': 'tractors',
                'brand': 'Mahindra',
                'model': 'Novo 755 DI CRDI',
                'year': 2023,
                'power': '74 HP',
                'fuel_type': 'Diesel',
                'price_per_hour': Decimal('450.00'),
                'price_per_day': Decimal('3200.00'),
                'security_deposit': Decimal('2000.00'),
                'location': 'Ludhiana, Punjab',
                'state': 'Punjab',
                'available': True,
                'operator_included': True,
                'fuel_policy': 'Delivered Full (Return Full)',
                'description': 'High-torque 4WD heavy duty tractor equipped with Digisense smart telematics, AC cabin, and dual clutch. Ideal for deep plowing, heavy rotavator operations, and laser levelling across large acreage.',
                'specs': {
                    'engineCapacity': '3500 cc, 4 Cylinders Turbocharged',
                    'transmission': '15 Forward + 15 Reverse Synchromesh',
                    'ptoPower': '66 HP @ 540 & 1000 RPM',
                    'liftingCapacity': '2600 kg hydraulic lift',
                    'driveType': '4 Wheel Drive (4WD)'
                },
                'rating': 4.9,
                'reviews_count': 38,
                'featured': True,
                'images': [
                    'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=1200&q=80',
                    'https://images.unsplash.com/photo-1595246140625-573b715d11dc?auto=format&fit=crop&w=1200&q=80'
                ]
            },
            {
                'name': 'John Deere 5310 GearPro (55 HP)',
                'category_id': 'tractors',
                'brand': 'John Deere',
                'model': '5310 GearPro PowrReverser',
                'year': 2022,
                'power': '55 HP',
                'fuel_type': 'Diesel',
                'price_per_hour': Decimal('380.00'),
                'price_per_day': Decimal('2600.00'),
                'security_deposit': Decimal('1500.00'),
                'location': 'Karnal, Haryana',
                'state': 'Haryana',
                'available': True,
                'operator_included': False,
                'fuel_policy': 'Charged as per actuals',
                'description': 'Reliable 55 HP utility tractor with power steering, oil immersed disc brakes, and dual PTO. Super fuel efficient and perfectly balanced for wetland puddling, haulage, and sowing.',
                'specs': {
                    'engineCapacity': '2900 cc, 3 Cylinder Turbocharged',
                    'transmission': '12 Forward + 4 Reverse Collarshift',
                    'ptoPower': '49.5 HP Independent',
                    'liftingCapacity': '2000 kg'
                },
                'rating': 4.8,
                'reviews_count': 29,
                'featured': True,
                'images': [
                    'https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?auto=format&fit=crop&w=1200&q=80'
                ]
            },
            {
                'name': 'Preet 987 Self-Propelled Combine Harvester',
                'category_id': 'harvesters',
                'brand': 'Preet',
                'model': '987 Multi-Crop Master',
                'year': 2023,
                'power': '101 HP',
                'fuel_type': 'Diesel',
                'price_per_hour': Decimal('1400.00'),
                'price_per_day': Decimal('9500.00'),
                'security_deposit': Decimal('5000.00'),
                'location': 'Amritsar, Punjab',
                'state': 'Punjab',
                'available': True,
                'operator_included': True,
                'fuel_policy': 'Driver & Fuel Included',
                'description': 'Heavy duty multi-crop combine harvester with 14-foot cutter bar, high-volume grain tank, and straw spreader. Highly tuned for zero grain-loss during wheat and paddy peak harvesting.',
                'specs': {
                    'cutterBarWidth': '14 Feet (4.27 m)',
                    'grainTankCapacity': '2.4 m³ (approx 1800 kg)',
                    'enginePower': '101 HP @ 2200 RPM Heavy Duty'
                },
                'rating': 5.0,
                'reviews_count': 42,
                'featured': True,
                'images': [
                    'https://images.unsplash.com/photo-1586771107445-d3ca888129ff?auto=format&fit=crop&w=1200&q=80'
                ]
            },
            {
                'name': 'DJI Agras T40 Precision Agriculture Drone',
                'category_id': 'drones',
                'brand': 'DJI Agriculture',
                'model': 'Agras T40 Flagship',
                'year': 2024,
                'power': 'Electric Dual Centrifugal',
                'fuel_type': 'Smart LiPo Battery (Includes Generator)',
                'price_per_hour': Decimal('950.00'),
                'price_per_day': Decimal('5800.00'),
                'security_deposit': Decimal('3000.00'),
                'location': 'Nashik, Maharashtra',
                'state': 'Maharashtra',
                'available': True,
                'operator_included': True,
                'fuel_policy': 'Includes DGCA-Certified Pilot',
                'description': 'State-of-the-art agricultural drone carrying a 40 kg spray payload or 50 kg spreading payload. Capable of covering up to 40 acres per hour with millimeter-accurate droplet penetration.',
                'specs': {
                    'sprayPayload': '40 Litres Liquid Capacity',
                    'coverageRate': '40 Acres / Hour',
                    'certifications': 'DGCA Type Certified'
                },
                'rating': 4.95,
                'reviews_count': 31,
                'featured': True,
                'images': [
                    'https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=1200&q=80'
                ]
            },
            {
                'name': 'Shaktiman Champion Series Rotavator (7 Feet)',
                'category_id': 'tillage',
                'brand': 'Shaktiman',
                'model': 'Champion CH 205 Multi-Speed',
                'year': 2023,
                'power': 'Compatible with 45-65 HP',
                'fuel_type': 'PTO Driven',
                'price_per_hour': Decimal('180.00'),
                'price_per_day': Decimal('1100.00'),
                'security_deposit': Decimal('800.00'),
                'location': 'Indore, Madhya Pradesh',
                'state': 'Madhya Pradesh',
                'available': True,
                'operator_included': False,
                'fuel_policy': 'Attachment only',
                'description': '7-foot heavy duty multi-speed rotary tiller with 48 boron steel L-type blades. Delivers optimal soil pulverization in single pass, saving fuel and time for wheat and soybean sowing.',
                'specs': {
                    'workingWidth': '7 Feet (205 cm)',
                    'bladesCount': '48 Boron Steel Curved Blades'
                },
                'rating': 4.75,
                'reviews_count': 19,
                'featured': False,
                'images': [
                    'https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&w=1200&q=80'
                ]
            },
            {
                'name': 'Swaraj 855 FE High-Torque (52 HP)',
                'category_id': 'tractors',
                'brand': 'Swaraj',
                'model': '855 FE 5-Star',
                'year': 2022,
                'power': '52 HP',
                'fuel_type': 'Diesel',
                'price_per_hour': Decimal('340.00'),
                'price_per_day': Decimal('2300.00'),
                'security_deposit': Decimal('1200.00'),
                'location': 'Varanasi, Uttar Pradesh',
                'state': 'Uttar Pradesh',
                'available': True,
                'operator_included': True,
                'fuel_policy': 'Farmer provides diesel',
                'description': 'Legendary Indian workhorse tractor known for pure mechanical reliability, 3-cylinder high displacement engine, power steering, and effortless handling of plows and heavy trolleys.',
                'specs': {
                    'engineCapacity': '3307 cc Water-Cooled',
                    'liftingCapacity': '2000 kg'
                },
                'rating': 4.84,
                'reviews_count': 22,
                'featured': False,
                'images': [
                    'https://images.unsplash.com/photo-1595246140625-573b715d11dc?auto=format&fit=crop&w=1200&q=80'
                ]
            }
        ]

        for item in machines:
            images = item.pop('images')
            cat_id = item.pop('category_id')
            cat = Category.objects.get(id=cat_id)
            
            eq, created = Equipment.objects.update_or_create(
                name=item['name'],
                owner=owner,
                defaults={**item, 'category': cat}
            )

            # Add images
            if created or not eq.images.exists():
                for idx, img_url in enumerate(images):
                    EquipmentImage.objects.create(
                        equipment=eq,
                        image_url=img_url,
                        is_primary=(idx == 0)
                    )

        self.stdout.write(self.style.SUCCESS(f'Seeded {len(machines)} agricultural equipment listings.'))
