"""
WSGI config for agriride project.

It exposes the WSGI callable as a module-level variable named ``application``.
"""

import os
from pathlib import Path
from django.core.wsgi import get_wsgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'agriride.settings')

application = get_wsgi_application()

# Alias for Vercel Serverless Function runner
app = application

# Automatic database initialization on Vercel cold starts
if os.getenv('VERCEL'):
    try:
        from django.core.management import call_command
        from apps.users.models import User
        if not User.objects.exists():
            call_command('migrate', interactive=False)
            call_command('seed_demo_users')
            call_command('seed_equipment_data')
            call_command('seed_demo_bookings')
    except Exception as e:
        try:
            from django.core.management import call_command
            call_command('migrate', interactive=False)
            call_command('seed_demo_users')
            call_command('seed_equipment_data')
            call_command('seed_demo_bookings')
        except Exception as seed_err:
            print("Vercel auto-migration log:", seed_err)
