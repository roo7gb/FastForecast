#!/bin/bash
set -e

# Apply database migrations
python manage.py makemigrations api

# Run database migrations
python manage.py migrate --noinput

# Seed data if table is empty
if ! python manage.py shell -c "from api.models import Series; exit(0) if Series.objects.exists() else exit(1)"; then
  echo "Seeding database from CSV..."
  python manage.py import_csv AvalonPM25 "Daily data for PM2.5 particles in Avalon, Allegheny County, PA" ./data/AvalonPM25TD.csv
else
  echo "Database already seeded, skipping import."
fi

# Start Django server
python manage.py runserver 0.0.0.0:8000
