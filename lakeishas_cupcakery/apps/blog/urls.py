# lakeishas_cupcakery/apps/blog/urls.py
from django.urls import path, include
from rest_framework_nested import routers
from rest_framework.routers import DefaultRouter
from . import views

app_name = 'blog'

# Main router
router = DefaultRouter()
router.register(r'categories', views.BlogCategoryViewSet, basename='blog-category')
router.register(r'posts', views.BlogPostViewSet, basename='blog-post')

# Nested router for comments under posts
posts_router = routers.NestedSimpleRouter(router, r'posts', lookup='post')
posts_router.register(r'comments', views.BlogCommentViewSet, basename='blog-comment')

urlpatterns = [
    path('', include(router.urls)),
    path('', include(posts_router.urls)),
    
    # Additional endpoints
    path('featured-posts/', views.BlogPostViewSet.as_view({'get': 'featured'}), name='featured-posts'),
    path('recent-posts/', views.BlogPostViewSet.as_view({'get': 'recent'}), name='recent-posts'),
    path('categories/<slug:slug>/posts/', views.BlogCategoryViewSet.as_view({'get': 'posts'}), name='category-posts'),
]