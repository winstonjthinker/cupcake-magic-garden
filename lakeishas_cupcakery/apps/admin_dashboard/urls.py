from django.urls import path, include
from django.contrib.auth import views as auth_views
from django.views.decorators.http import require_POST
from django.views.generic import RedirectView
from django.urls import reverse_lazy
from . import views
from django.contrib import admin

app_name = 'admin_dashboard'

urlpatterns = [
    path('admin/', admin.site.urls),
    # Dashboard
    path('dashboard/', views.AdminDashboardView.as_view(), name='dashboard'),
    
    # Authentication
    path('login/', views.AdminLoginView.as_view(), name='login'),
    path('logout/', views.AdminLogoutView.as_view(), name='logout'),
    
    # Product Management
    path('products/', views.ProductListView.as_view(), name='products'),
    path('products/add/', views.ProductCreateView.as_view(), name='product_add'),
    path('products/<int:pk>/edit/', views.ProductUpdateView.as_view(), name='product_edit'),
    path('products/<int:pk>/delete/', views.ProductDeleteView.as_view(), name='product_delete'),
    
    # Order Management
    path('orders/', views.OrderListView.as_view(), name='orders'),
    
    # Blog Management
    path('blog/', views.PostListView.as_view(), name='blog_list'),
    path('blog/add/', views.PostCreateView.as_view(), name='blog_add'),
    path('blog/<int:pk>/edit/', views.PostUpdateView.as_view(), name='post_edit'),
    path('blog/<int:pk>/delete/', views.PostDeleteView.as_view(), name='post_delete'),
    
    # User Management
    path('users/', views.UserListView.as_view(), name='users'),
    path('users/add/', views.UserCreateView.as_view(), name='user_add'),
    path('users/<int:pk>/edit/', views.UserUpdateView.as_view(), name='user_edit'),
    
    # System Settings
    path('settings/', views.SystemSettingsView.as_view(), name='settings'),
    path('settings/export/', views.SettingsExportView.as_view(), name='settings_export'),
    path('settings/action/<str:action>/', require_POST(views.SettingsActionView.as_view()), name='settings_action'),
    
    # Analytics
    path('analytics/', views.AnalyticsView.as_view(), name='analytics'),
    path('analytics/activity/', views.ActivityFeedView.as_view(), name='activity_feed'),
]
