from django.core.management.base import BaseCommand
from apps.products.models import Category

REQUIRED_CATEGORIES = [
    {
        'name': 'Cupcakes',
        'description': 'Delicious handcrafted cupcakes in a variety of flavors',
        'is_active': True
    },
    {
        'name': 'Cakes',
        'description': 'Beautiful custom cakes for all occasions',
        'is_active': True
    },
    {
        'name': 'Cakesicles',
        'description': 'Cake pops on a stick with delicious coatings',
        'is_active': True
    },
    {
        'name': 'Sweet Treats',
        'description': 'Other delightful confections and desserts',
        'is_active': True
    },
]

class Command(BaseCommand):
    help = 'Ensure that all required product categories exist'

    def handle(self, *args, **options):
        created_count = 0
        for category_data in REQUIRED_CATEGORIES:
            category, created = Category.objects.get_or_create(
                name=category_data['name'],
                defaults={
                    'description': category_data['description'],
                    'is_active': category_data['is_active']
                }
            )
            if created:
                self.stdout.write(self.style.SUCCESS(f'Created category: {category.name}'))
                created_count += 1
            else:
                # Update existing category if needed
                updated = False
                if category.description != category_data['description']:
                    category.description = category_data['description']
                    updated = True
                if category.is_active != category_data['is_active']:
                    category.is_active = category_data['is_active']
                    updated = True
                if updated:
                    category.save()
                    self.stdout.write(self.style.SUCCESS(f'Updated category: {category.name}'))

        if created_count == 0:
            self.stdout.write(self.style.SUCCESS('All required categories already exist'))
        else:
            self.stdout.write(self.style.SUCCESS(f'Successfully created {created_count} categories'))
