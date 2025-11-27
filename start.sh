#!/usr/bin/env bash
# Exit on error
set -o errexit

echo "Current directory: $(pwd)"
ls -la

# Check if we need to change directory
if [ -d "lakeishas_cupcakery" ]; then
    echo "Found lakeishas_cupcakery directory, entering..."
    cd lakeishas_cupcakery
else
    echo "lakeishas_cupcakery directory not found, assuming we are already inside..."
fi

# Start Gunicorn
echo "Starting Gunicorn..."
exec gunicorn config.wsgi:application --bind 0.0.0.0:$PORT
