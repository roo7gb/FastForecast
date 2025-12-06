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
  python manage.py import_csv PBurghPM25 "Daily data for PM2.5 particles in Pittsburgh, Allegheny County, PA" ./data/PBurghPM25D.csv
  python manage.py import_csv LawSO2 "Daily data for Sulfur Dioxide in Lawrenceville, Allegheny County, PA" ./data/LawSO2.csv
  python manage.py import_csv HarrisO3 "Daily data for Ozone in Harrison Tonwship, Allegheny County, PA" ./data/HarrisO3.csv
  python manage.py import_csv PkwyEastCO "Daily data for Carbon Monoxide in Parkway East, Allegheny County, PA" ./data/PkwyEastCO.csv

else
  echo "Database already seeded, skipping import."
fi

# Start Django server
python manage.py runserver 0.0.0.0:8000
