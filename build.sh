#!/usr/bin/env bash
# Exit on error
set -o errexit

echo "=========================================="
echo "Starting Build Process"
echo "=========================================="

# Install Python dependencies
echo "Installing Python dependencies..."
pip install -r lakeishas_cupcakery/requirements.txt
echo "✓ Dependencies installed"

# Change to the Django project directory for management commands
cd lakeishas_cupcakery

echo ""
echo "=========================================="
echo "Database Configuration Check"
echo "=========================================="

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
    echo "ERROR: DATABASE_URL environment variable is not set!"
    exit 1
else
    echo "✓ DATABASE_URL is configured"
fi

# Test database connection
echo "Testing database connection..."
python manage.py check --database default || {
    echo "ERROR: Database connection check failed!"
    exit 1
}
echo "✓ Database connection successful"

echo ""
echo "=========================================="
echo "Database Migrations"
echo "=========================================="

# Show current migration status
echo "Current migration status:"
python manage.py showmigrations || echo "Warning: Could not show migrations"

# Run database migrations with verbose output
echo ""
echo "Applying migrations..."
python manage.py migrate --verbosity 2 --noinput || {
    echo "ERROR: Migration failed!"
    echo "Attempting to show migration plan..."
    python manage.py migrate --plan || true
    exit 1
}

echo ""
echo "✓ Database migrations completed successfully"

# Show final migration status
echo ""
echo "Final migration status:"
python manage.py showmigrations | grep -E "^\[X\]|^\[ \]" | head -20 || true

echo ""
echo "=========================================="
echo "Collecting Static Files"
echo "=========================================="

# Collect static files
python manage.py collectstatic --noinput
echo "✓ Static files collected"

echo ""
echo "=========================================="
echo "Build Process Completed Successfully"
echo "=========================================="
