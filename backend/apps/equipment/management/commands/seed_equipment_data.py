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
        owner = User.objects.filter(email='owner.dhillon@agriride.org').first()
        if not owner:
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

        # 3. Equipment Listings Data (All 10 matching machinery catalog)
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
                    '/images/equipment/mahindra-novo-755.jpg'
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
                    '/images/equipment/john-deere-5310.jpg'
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
                    '/images/equipment/preet-987-harvester.jpg'
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
                    '/images/equipment/dji-agras-t40.jpg'
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
                    '/images/equipment/shaktiman-rotavator.jpg'
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
                    '/images/equipment/swaraj-855-fe.jpg'
                ]
            },
            {
                'name': 'Aspee Tractor Mounted 400L Boom Sprayer',
                'category_id': 'sprayers',
                'brand': 'Aspee Agro',
                'model': 'HTP-400 Giant Master Boom',
                'year': 2023,
                'power': 'PTO Driven 540 RPM',
                'fuel_type': 'PTO Hydraulic',
                'price_per_hour': Decimal('220.00'),
                'price_per_day': Decimal('1350.00'),
                'security_deposit': Decimal('1000.00'),
                'location': 'Belagavi, Karnataka',
                'state': 'Karnataka',
                'available': True,
                'operator_included': False,
                'fuel_policy': 'Attachment only',
                'description': '400 Litre polyethylene chemical tank with 32-foot folding boom arm and anti-drip ceramic nozzles. Excellent for sugarcane, cotton, and horticulture crop protection.',
                'specs': {
                    'tankCapacity': '400 Litres Heavy Duty Polyethylene',
                    'boomLength': '32 Feet (10 meters) Foldable',
                    'nozzles': '20 Ceramic Anti-Drip Spray Tips'
                },
                'rating': 4.7,
                'reviews_count': 14,
                'featured': False,
                'images': [
                    '/images/equipment/aspee-boom-sprayer.jpg'
                ]
            },
            {
                'name': 'National Automatic Seed-Cum-Fertilizer Drill',
                'category_id': 'sowing',
                'brand': 'National Agro',
                'model': '9-Tyne Zero-Till Precision Master',
                'year': 2023,
                'power': '35+ HP Tractor Required',
                'fuel_type': 'Attachment',
                'price_per_hour': Decimal('190.00'),
                'price_per_day': Decimal('1200.00'),
                'security_deposit': Decimal('700.00'),
                'location': 'Karnal, Haryana',
                'state': 'Haryana',
                'available': True,
                'operator_included': False,
                'fuel_policy': 'Attachment only',
                'description': '9-row zero-tillage seed drill with dual separate hopper boxes for seed and fertilizer. Ensures uniform seed depth and accurate spacing, saving 25% seed cost.',
                'specs': {
                    'numberOfRows': '9 Rows Adjustable (6 to 9 inches)',
                    'hopperCapacity': '50 kg Seeds + 60 kg Fertilizer'
                },
                'rating': 4.85,
                'reviews_count': 17,
                'featured': False,
                'images': [
                    '/images/equipment/national-seed-drill.jpg'
                ]
            },
            {
                'name': 'Kubota MU4501 4WD Orchard & Puddling Specialist',
                'category_id': 'tractors',
                'brand': 'Kubota',
                'model': 'MU4501 4WD Quad-4 Engine',
                'year': 2023,
                'power': '45 HP',
                'fuel_type': 'Diesel',
                'price_per_hour': Decimal('360.00'),
                'price_per_day': Decimal('2400.00'),
                'security_deposit': Decimal('1500.00'),
                'location': 'Warangal, Telangana',
                'state': 'Telangana',
                'available': False,
                'operator_included': True,
                'fuel_policy': 'Delivered Full (Return Full)',
                'description': 'Japanese-engineered 45 HP 4WD tractor famous for best-in-class fuel economy, planetary bevel gear 4WD axle, and ultra-tight turning radius. Specifically suited for paddy puddling and cotton cultivation.',
                'specs': {
                    'engineCapacity': '2434 cc 4-Cylinder E-CDIS Engine',
                    'transmission': '8 Forward + 4 Reverse Synchromesh',
                    'ptoPower': '38.3 HP Independent Dual Speed',
                    'liftingCapacity': '1640 kg',
                    'driveType': '4WD with Bevel Gear Water-Sealed Front Axle'
                },
                'rating': 4.92,
                'reviews_count': 26,
                'featured': False,
                'images': [
                    '/images/equipment/kubota-mu4501.jpg'
                ]
            },
            {
                'name': 'Garuda Aerospace Kisan Drone 16L',
                'category_id': 'drones',
                'brand': 'Garuda Aerospace',
                'model': 'Kisan Drone Type-C Certified',
                'year': 2024,
                'power': 'Electric 6-Rotor Hexacopter',
                'fuel_type': 'Dual LiPo Smart Battery',
                'price_per_hour': Decimal('700.00'),
                'price_per_day': Decimal('4200.00'),
                'security_deposit': Decimal('2000.00'),
                'location': 'Anand, Gujarat',
                'state': 'Gujarat',
                'available': True,
                'operator_included': True,
                'fuel_policy': 'Includes Certified Drone Pilot',
                'description': 'Precision drone specifically built for crop nutrients and pesticide foliar application. Equipped with terrain-following radar and return-to-home autonomous failsafe.',
                'specs': {
                    'sprayTank': '16 Litres Liquid payload',
                    'flightTime': '22 minutes per battery pair',
                    'radar': 'Millimeter Wave Obstacle Avoidance'
                },
                'rating': 4.88,
                'reviews_count': 15,
                'featured': False,
                'images': [
                    '/images/equipment/garuda-kisan-drone.jpg'
                ]
            }
        ]

        for item in machines:
            images = item.pop('images')
            cat_id = item.pop('category_id')
            cat = Category.objects.get(id=cat_id)
            
            eq, _ = Equipment.objects.update_or_create(
                name=item['name'],
                owner=owner,
                defaults={**item, 'category': cat}
            )

            # Refresh images to ensure updated machinery photos are saved
            eq.images.all().delete()
            for idx, img_url in enumerate(images):
                EquipmentImage.objects.create(
                    equipment=eq,
                    image_url=img_url,
                    is_primary=(idx == 0)
                )

        self.stdout.write(self.style.SUCCESS(f'Successfully seeded and updated {len(machines)} agricultural equipment listings.'))
