#!/usr/bin/env bash
# Exit on error
set -o errexit

echo "Installing backend dependencies..."
pip install -r requirements.txt

echo "Collecting static assets with WhiteNoise..."
python manage.py collectstatic --noinput

echo "Applying database migrations..."
python manage.py migrate

echo "Seeding demonstration data..."
python manage.py seed_demo_users
python manage.py seed_equipment_data
python manage.py seed_demo_bookings

echo "Backend build completed successfully!"
