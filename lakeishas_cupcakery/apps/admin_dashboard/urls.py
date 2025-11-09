from django.urls import path
from django.contrib.auth import views as auth_views
from . import views

app_name = 'admin_dashboard'

urlpatterns = [
    # Dashboard
    path('', views.AdminDashboardView.as_view(), name='dashboard'),
    
    # Authentication
    path('login/', views.AdminLoginView.as_view(), name='login'),
    path('logout/', views.AdminLogoutView.as_view(), name='logout'),
    
    # Product Management
    path('products/', views.ProductListView.as_view(), name='products'),
    path('products/add/', views.ProductCreateView.as_view(), name='product_add'),
    path('products/<int:pk>/edit/', views.ProductUpdateView.as_view(), name='product_edit'),
    path('products/<int:pk>/delete/', views.ProductDeleteView.as_view(), name='product_delete'),
    
    # User Management
    path('users/', views.UserListView.as_view(), name='users'),
    path('users/add/', views.UserCreateView.as_view(), name='user_add'),
    path('users/<int:pk>/edit/', views.UserUpdateView.as_view(), name='user_edit'),
    
    # Blog Management
    path('blog/', views.PostListView.as_view(), name='blog'),
    path('blog/add/', views.PostCreateView.as_view(), name='post_add'),
    path('blog/<int:pk>/edit/', views.PostUpdateView.as_view(), name='post_edit'),
    
    # System Settings
    path('settings/', views.SystemSettingsView.as_view(), name='settings'),
    
    # Analytics
    path('analytics/', views.AnalyticsView.as_view(), name='analytics'),
]
