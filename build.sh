#!/usr/bin/env bash
# Exit on error
set -o errexit

# Change to the Django project directory
cd lakeishas_cupcakery

# Install Python dependencies
pip install -r requirements.txt

# Run database migrations
python manage.py migrate --noinput

# Collect static files
python manage.py collectstatic --noinput
