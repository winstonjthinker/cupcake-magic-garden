from django.contrib import admin
from .models import Product

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('name', 'price', 'is_available', 'is_featured', 'created_at')
    list_editable = ('is_available', 'is_featured')
    list_per_page = 25
    search_fields = ('name', 'description')
    ordering = ('-created_at',)
    list_filter = ('is_available', 'is_featured')


