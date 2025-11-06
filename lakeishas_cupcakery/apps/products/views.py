# lakeishas_cupcakery/apps/products/views.py
from rest_framework import viewsets, filters, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.filters import SearchFilter, OrderingFilter
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Q
from django.shortcuts import get_object_or_404

from .models import Product, Category
from .serializers import ProductSerializer, CategorySerializer

class CategoryViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows categories to be viewed or edited.
    """
    queryset = Category.objects.filter(is_active=True)
    serializer_class = CategorySerializer
    permission_classes = [permissions.AllowAny]  # Allow unauthenticated read access
    lookup_field = 'slug'
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'description']
    ordering_fields = ['name', 'created_at']
    ordering = ['name']

    def get_permissions(self):
        """
        Instantiates and returns the list of permissions that this view requires.
        """
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [permissions.IsAdminUser()]
        return [permissions.AllowAny()]

    def perform_destroy(self, instance):
        """
        Instead of deleting the category, mark it as inactive.
        """
        instance.is_active = False
        instance.save()
    
    @action(detail=True, methods=['get'])
    def products(self, request, slug=None):
        """
        Get all products in this category.
        """
        category = self.get_object()
        products = Product.objects.filter(category=category, is_available=True)
        serializer = ProductSerializer(products, many=True, context={'request': request})
        return Response(serializer.data)

class ProductViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows products to be viewed or edited.
    """
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [permissions.AllowAny]  # Allow unauthenticated read access
    lookup_field = 'slug'
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category', 'is_featured', 'is_available']
    search_fields = ['name', 'description']
    ordering_fields = ['price', 'created_at', 'name']
    ordering = ['-created_at']
    
    def get_permissions(self):
        """
        Instantiates and returns the list of permissions that this view requires.
        """
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [permissions.IsAdminUser()]
        return [permissions.AllowAny()]

    def get_queryset(self):
        """
        Optionally filter by category if provided in query params.
        """
        queryset = Product.objects.all()
        category_slug = self.request.query_params.get('category')
        
        if category_slug:
            queryset = queryset.filter(category__slug=category_slug)
            
        # Only show available products to non-staff users
        if not self.request.user.is_staff:
            queryset = queryset.filter(is_available=True)
            
        return queryset.select_related('category')
    
    def get_permissions(self):
        """
        Instantiates and returns the list of permissions that this view requires.
        """
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsAdminUser()]
        return [IsAuthenticatedOrReadOnly()]
    
    @action(detail=True, methods=['post'])
    def toggle_featured(self, request, slug=None):
        """
        Toggle the featured status of a product.
        """
        product = self.get_object()
        product.is_featured = not product.is_featured
        product.save()
        return Response({'status': 'featured' if product.is_featured else 'not featured'})

class CategoryProductViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows viewing products by category.
    """
    serializer_class = ProductSerializer
    permission_classes = [permissions.AllowAny]  # Allow unauthenticated read access
    
    def get_queryset(self):
        category_slug = self.kwargs.get('category_slug')
        category = get_object_or_404(Category, slug=category_slug, is_active=True)
        return Product.objects.filter(category=category, is_available=True)

class FeaturedProductList(viewsets.ReadOnlyModelViewSet):
    """
    API endpoint that lists all featured products.
    """
    serializer_class = ProductSerializer
    permission_classes = [permissions.AllowAny]  # Allow unauthenticated read access
    pagination_class = None  # No pagination for featured products
    
    def get_queryset(self):
        return Product.objects.filter(is_featured=True, is_available=True).select_related('category')

from rest_framework.views import APIView
from rest_framework.response import Response

class ProductSearchView(APIView):
    """
    API endpoint that allows searching products.
    """
    permission_classes = [permissions.AllowAny]  # Allow unauthenticated read access
    
    def get(self, request, *args, **kwargs):
        query = request.query_params.get('q', '').strip()
        if not query:
            return Response([])
            
        queryset = Product.objects.filter(
            is_available=True
        ).filter(
            Q(name__icontains=query) | 
            Q(description__icontains=query) |
            Q(category__name__icontains=query)
        ).select_related('category')
        
        serializer = ProductSerializer(queryset, many=True, context={'request': request})
        return Response(serializer.data)