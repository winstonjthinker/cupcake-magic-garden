#!/usr/bin/env bash
# Exit on error
set -o errexit

# Install Python dependencies
pip install -r lakeishas_cupcakery/requirements.txt

# Change to the Django project directory for management commands
cd lakeishas_cupcakery

# Run database migrations
# Run database migrations
echo "Starting database migrations..."
python manage.py migrate --noinput
echo "Database migrations completed."

# Collect static files
python manage.py collectstatic --noinput
