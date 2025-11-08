# lakeishas_cupcakery/apps/products/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_nested import routers
from . import views

app_name = 'products'

# Main router
router = DefaultRouter()
router.register(r'categories', views.CategoryViewSet, basename='category')
router.register(r'products', views.ProductViewSet, basename='product')

# Nested router for category products
category_router = routers.NestedSimpleRouter(router, r'categories', lookup='category')
category_router.register(r'products', views.CategoryProductViewSet, basename='category-products')

urlpatterns = [
    # Main API endpoints
    path('', include(router.urls)),
    path('', include(category_router.urls)),
    
    # Search endpoint (using a regular view)
    path('search/', views.ProductSearchView.as_view(), name='product-search'),
]