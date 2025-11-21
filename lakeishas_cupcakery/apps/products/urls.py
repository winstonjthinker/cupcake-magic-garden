# lakeishas_cupcakery/apps/products/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_nested import routers
from . import views

app_name = 'products'

# Main router
router = DefaultRouter()
router.register(r'categories', views.CategoryViewSet, basename='category')
# Do not register ProductViewSet on the router to avoid /products/products/ prefix

# Nested router for category products
category_router = routers.NestedSimpleRouter(router, r'categories', lookup='category')
category_router.register(r'products', views.CategoryProductViewSet, basename='category-products')

urlpatterns = [
    # Expose products at /api/products/ directly
    path('', views.ProductViewSet.as_view({'get': 'list', 'post': 'create'}), name='product-list'),

    # Search endpoint (must be before slug)
    path('search/', views.ProductSearchView.as_view(), name='product-search'),

    # Main API endpoints (Categories)
    path('', include(router.urls)),
    path('', include(category_router.urls)),

    # Product detail (catch-all slug) - must be last
    path('<slug:slug>/', views.ProductViewSet.as_view({'get': 'retrieve', 'put': 'update', 'patch': 'partial_update', 'delete': 'destroy'}), name='product-detail'),
]