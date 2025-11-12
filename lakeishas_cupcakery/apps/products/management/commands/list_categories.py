from django.core.management.base import BaseCommand
from apps.products.models import Category

class Command(BaseCommand):
    help = 'List all product categories'

    def handle(self, *args, **options):
        categories = Category.objects.all()
        if not categories.exists():
            self.stdout.write(self.style.WARNING('No categories found.'))
            return

        self.stdout.write(self.style.SUCCESS('Available categories:'))
        for category in categories:
            self.stdout.write(f"- {category.name} (slug: {category.slug}, active: {category.is_active})")
