#!/usr/bin/env bash
# Manual Migration Script for Render Shell
# Run this script if automatic migrations fail during deployment
# Usage: ./migrate.sh

set -e

echo "=========================================="
echo "Manual Migration Script"
echo "=========================================="

# Navigate to Django project directory
cd lakeishas_cupcakery

echo ""
echo "1. Checking database connection..."
python manage.py check --database default || {
    echo "ERROR: Cannot connect to database!"
    echo "Please verify DATABASE_URL is set correctly."
    exit 1
}
echo "✓ Database connection OK"

echo ""
echo "2. Current migration status:"
python manage.py showmigrations

echo ""
echo "3. Applying migrations..."
python manage.py migrate --verbosity 2

echo ""
echo "4. Final migration status:"
python manage.py showmigrations

echo ""
echo "=========================================="
echo "Migration Complete!"
echo "=========================================="

# Optional: Create superuser
read -p "Do you want to create a superuser? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "Creating superuser..."
    python manage.py createsuperuser
fi

echo ""
echo "All done! You can now access the admin panel."
