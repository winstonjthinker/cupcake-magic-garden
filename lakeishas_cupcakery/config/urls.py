"""
URL configuration for config project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.views.generic import RedirectView
import debug_toolbar

# Custom admin site with our dashboard
admin.site.site_header = "Lakeisha's Cupcakery Admin"
admin.site.site_title = "Lakeisha's Cupcakery Admin Portal"
admin.site.index_title = "Welcome to Lakeisha's Cupcakery Admin Portal"

# Import views directly to avoid circular imports
from apps.admin_dashboard import views as admin_views

urlpatterns = [
    # Admin dashboard
    path('admin/', admin_views.admin_dashboard, name='admin_dashboard'),
    
    # Admin authentication
    path('admin/login/', admin_views.AdminLoginView.as_view(template_name='admin/login.html'), 
         name='admin_login'),
    path('admin/logout/', admin_views.AdminLogoutView.as_view(next_page='admin_login'), 
         name='admin_logout'),
    
    # Original Django admin as fallback
    path('admin/original/', admin.site.urls),
    
    # API endpoints
    path('api/auth/', include('apps.users.urls')),
    path('api/products/', include('apps.products.urls')),
    path('api/orders/', include('apps.orders.urls')),
    path('api/blog/', include('apps.blog.urls')),
    path('api/contact/', include('apps.contact.urls')),
    path('api/newsletter/', include('apps.newsletter.urls')),
    path('api/reviews/', include('apps.reviews.urls')),
]

# Serve media files in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += [path('__debug__/', include(debug_toolbar.urls))]
