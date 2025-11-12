from datetime import timedelta
from django.contrib import messages
from django.contrib.auth import views as auth_views, get_user_model, login
from django.contrib.auth.mixins import LoginRequiredMixin, UserPassesTestMixin
from django.contrib.auth.decorators import login_required
from django.views.generic import View, TemplateView, ListView, CreateView, UpdateView, DeleteView, RedirectView
from django.views.generic.base import TemplateView
from django.shortcuts import render, redirect, get_object_or_404
from django.urls import reverse_lazy, reverse
from django.utils import timezone
from django.db.models import Sum, Count, F, Q, ExpressionWrapper, DecimalField
from django.http import JsonResponse
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger

# Import your models
from apps.products.models import Product, Category
from apps.orders.models import Order, OrderItem
from apps.blog.models import BlogPost as Post, BlogCategory, BlogComment as Comment
from apps.users.models import User
from django.db.models import Case, When, Value, IntegerField, Q
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from django.urls import reverse_lazy, reverse
from django.views.decorators.http import require_http_methods, require_POST
from django.utils.decorators import method_decorator
from django.http import JsonResponse, HttpResponse, HttpResponseRedirect
from django.views.decorators.cache import never_cache
from django.utils.decorators import method_decorator
from django.conf import settings
from django.contrib.admin.views.decorators import staff_member_required
from django.contrib import messages
from django.core.cache import cache
from django.db.models import Count, Sum, Q, F, Prefetch
from django.db.models.functions import TruncMonth, ExtractMonth, ExtractYear, ExtractDay, Concat, Coalesce
from django.utils import timezone
from datetime import datetime, timedelta
import json
import csv
import logging
from io import BytesIO

try:
    import xlwt
    XLS_SUPPORT = True
except ImportError:
    XLS_SUPPORT = False
    logging.warning("xlwt module not found. Excel export will be disabled.")

logger = logging.getLogger(__name__)

from apps.products.models import Product, Category
from apps.orders.models import Order, OrderItem
from apps.blog.models import BlogPost as Post
from apps.users.models import User

User = get_user_model()

class AdminLoginView(auth_views.LoginView):
    """Custom login view for admin dashboard"""
    template_name = 'admin/login.html'
    redirect_authenticated_user = True
    
    def get_success_url(self):
        return reverse_lazy('admin_dashboard:dashboard')

class AdminLogoutView(auth_views.LogoutView):
    """Custom logout view for admin dashboard"""
    next_page = 'admin_dashboard:login'

def admin_required(view_func):
    """Decorator that ensures the user is a staff member"""
    def wrapper(request, *args, **kwargs):
        if not request.user.is_authenticated or not request.user.is_staff:
            return redirect('admin_dashboard:login')
        return view_func(request, *args, **kwargs)
    return wrapper

class AdminBaseMixin:
    """Mixin for admin views with common functionality"""
    login_url = 'admin_dashboard:login'
    
    @method_decorator(never_cache)
    @method_decorator(staff_member_required(login_url='admin_dashboard:login'))
    def dispatch(self, *args, **kwargs):
        return super().dispatch(*args, **kwargs)
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context.update({
            'site_header': "Lakeisha's Cupcakery Admin",
            'site_title': getattr(self, 'page_title', 'Admin'),
            'user': self.request.user,
            'current_section': getattr(self, 'section_name', ''),
            'view': self,  # Make view available in templates
        })
        return context

class AdminBaseView(AdminBaseMixin, TemplateView):
    """Base view for admin template views"""
    pass

class AdminListView(AdminBaseMixin, ListView):
    """Base view for admin list views"""
    paginate_by = 15
    
    def get_queryset(self):
        queryset = super().get_queryset()
        if not hasattr(self, 'object_list'):
            self.object_list = queryset
        return queryset.order_by('-id')

class AdminDashboardView(AdminBaseView):
    """Main admin dashboard view"""
    login_url = 'admin_dashboard:login'
    template_name = 'admin/django_admin_dashboard.html'
    page_title = 'Dashboard'
    section_name = 'dashboard'
    
    def get_monthly_revenue(self):
        """Get monthly revenue data for the past 6 months"""
        today = timezone.now().date()
        six_months_ago = today - timedelta(days=180)
        
        # Get monthly revenue data
        monthly_data = Order.objects.filter(
            created_at__date__gte=six_months_ago
        ).annotate(
            month=TruncMonth('created_at')
        ).values('month').annotate(
            total=Sum('total')
        ).order_by('month')
        
        # Format data for chart
        labels = []
        data = []
        
        for month in monthly_data:
            labels.append(month['month'].strftime('%b %Y'))
            data.append(float(month['total'] or 0))
            
        return {
            'labels': labels,
            'datasets': [{
                'label': 'Monthly Revenue',
                'data': data,
                'backgroundColor': 'rgba(75, 192, 192, 0.2)',
                'borderColor': 'rgba(75, 192, 192, 1)',
                'borderWidth': 1
            }]
        }
        
    def get_product_categories(self):
        """Get product category distribution"""
        categories = Category.objects.annotate(
            product_count=Count('products')
        ).values('name', 'product_count')
        
        return {
            'labels': [cat['name'] for cat in categories],
            'data': [cat['product_count'] for cat in categories]
        }
        
    def get_top_products(self, limit=5):
        """Get top selling products"""
        return Product.objects.annotate(
            total_sold=Sum('order_items__quantity')
        ).filter(
            total_sold__gt=0
        ).order_by('-total_sold')[:limit]

    def get_featured_products(self):
        """Get featured products for the dashboard"""
        return Product.objects.filter(
            is_featured=True,
            is_available=True
        ).select_related('category').order_by('-created_at')[:5]

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        
        # Get recent orders with related user data
        recent_orders = Order.objects.select_related('user').order_by('-created_at')[:5]
        
        # Get featured products
        featured_products = self.get_featured_products()
        
        # Get stats
        today = timezone.now().date()
        week_ago = today - timedelta(days=7)
        
        # Order stats
        total_orders = Order.objects.count()
        recent_orders_count = Order.objects.filter(created_at__date__gte=week_ago).count()
        
        # Revenue stats
        total_revenue = Order.objects.aggregate(total=Sum('total'))['total'] or 0
        recent_revenue = Order.objects.filter(
            created_at__date__gte=week_ago
        ).aggregate(total=Sum('total'))['total'] or 0
        
        # Product stats
        total_products = Product.objects.count()
        
        # User stats
        total_customers = User.objects.filter(is_staff=False).count()
        new_customers = User.objects.filter(
            date_joined__date__gte=week_ago, 
            is_staff=False
        ).count()
        
        # Format data for charts
        monthly_revenue = self.get_monthly_revenue()
        product_categories = self.get_product_categories()
        top_products = self.get_top_products()
        
        context.update({
            'recent_orders': recent_orders,
            'total_orders': total_orders,
            'recent_orders_count': recent_orders_count,
            'total_revenue': total_revenue,
            'recent_revenue': recent_revenue,
            'total_products': total_products,
            'total_customers': total_customers,
            'new_customers': new_customers,
            'today': today,
            'week_ago': week_ago,
            'monthly_revenue': monthly_revenue,
            'product_categories': product_categories,
            'top_products': top_products,
            'featured_products': featured_products,
        })
        return context
        
    def get_monthly_revenue(self):
        # Get revenue for the last 6 months
        six_months_ago = timezone.now() - timedelta(days=180)
        
        # Group by month and sum the totals
        monthly_data = Order.objects.filter(
            created_at__gte=six_months_ago
        ).annotate(
            month=TruncMonth('created_at')
        ).values('month').annotate(
            total=Sum('total')
        ).order_by('month')
        
        # Format data for chart
        labels = []
        data = []
        
        for item in monthly_data:
            labels.append(item['month'].strftime('%b %Y'))
            data.append(float(item['total']))
            
        return {
            'labels': labels,
            'data': data,
        }
        
    def get_product_categories(self):
        # Get product count by category
        categories = Category.objects.annotate(
            product_count=Count('products')
        ).values('name', 'product_count')
        
        # Format data for chart
        labels = [cat['name'] for cat in categories]
        data = [cat['product_count'] for cat in categories]
        
        return {
            'labels': labels,
            'data': data,
        }
        
    def get_top_products(self):
        # Get top 5 selling products
        top_products = OrderItem.objects.values(
            'product__name'
        ).annotate(
            total_quantity=Sum('quantity')
        ).order_by('-total_quantity')[:5]
        
        # Format data for chart
        labels = [item['product__name'] for item in top_products]
        data = [item['total_quantity'] for item in top_products]
        
        return {
            'labels': labels,
            'data': data,
        }

# Product Management Views
class ProductListView(AdminListView):
    model = Product
    template_name = 'admin/products/list.html'
    context_object_name = 'products'
    page_title = 'Product Management'
    section_name = 'products'
    
    @property
    def unfiltered_queryset(self):
        if not hasattr(self, '_unfiltered_queryset'):
            self._unfiltered_queryset = Product.objects.select_related('category').order_by('name')
        return self._unfiltered_queryset
    
    def get_queryset(self):
        # Start with a fresh copy of the unfiltered queryset
        queryset = self.unfiltered_queryset.all()
        
        # Apply filters
        search_query = self.request.GET.get('q')
        if search_query:
            queryset = queryset.filter(
                Q(name__icontains=search_query) | 
                Q(description__icontains=search_query) |
                Q(sku__icontains=search_query) |
                Q(category__name__icontains=search_query)
            )
        
        category = self.request.GET.get('category')
        if category:
            queryset = queryset.filter(category_id=category)
            
        is_available = self.request.GET.get('is_available')
        if is_available in ['true', 'false']:
            queryset = queryset.filter(is_available=(is_available == 'true'))
            
        is_featured = self.request.GET.get('is_featured')
        if is_featured in ['true', 'false']:
            queryset = queryset.filter(is_featured=(is_featured == 'true'))
            
        order_by = self.request.GET.get('order_by', 'name')
        if order_by.lstrip('-') in ['name', 'price', 'created_at', 'updated_at']:
            queryset = queryset.order_by(order_by)
            
        return queryset
        
    def get(self, request, *args, **kwargs):
        # Handle export requests first
        export_format = request.GET.get('export')
        if export_format:
            return self.export_products(export_format)
            
        # Ensure we have the unfiltered queryset
        _ = self.unfiltered_queryset
            
        # Get the filtered and paginated queryset
        self.object_list = self.get_queryset()
        
        # Get the context
        context = self.get_context_data()
        return self.render_to_response(context)
    
    
    
    def get_context_data(self, **kwargs):
        context = {}
        
        # Add the view instance to the context
        context['view'] = self
        
        # Add categories for filter dropdown
        context['categories'] = Category.objects.all()
        
        # Add search query to context
        context['search_query'] = self.request.GET.get('q', '')
        context['current_category'] = self.request.GET.get('category', '')
        context['is_available'] = self.request.GET.get('is_available', '')
        context['is_featured'] = self.request.GET.get('is_featured', '')
        context['current_order'] = self.request.GET.get('order_by', 'name')
        
        # Add filter counts
        context['total_products'] = self.unfiltered_queryset.count()
        context['available_products'] = self.unfiltered_queryset.filter(is_available=True).count()
        context['featured_products'] = self.unfiltered_queryset.filter(is_featured=True).count()
        
        # Add pagination
        paginator = Paginator(self.object_list, self.paginate_by)
        page = self.request.GET.get('page')
        
        try:
            products = paginator.page(page)
        except PageNotAnInteger:
            products = paginator.page(1)
        except EmptyPage:
            products = paginator.page(paginator.num_pages)
            
        context['products'] = products
        
        # Add export formats
        export_formats = [
            {'name': 'CSV', 'value': 'csv'},
            {'name': 'JSON', 'value': 'json'},
        ]
        if XLS_SUPPORT:
            export_formats.insert(1, {'name': 'Excel', 'value': 'xls'})
        context['export_formats'] = export_formats
        
        return context
    
    def get(self, request, *args, **kwargs):
        # Handle export requests
        export_format = request.GET.get('export')
        if export_format:
            return self.export_products(export_format)
        return super().get(request, *args, **kwargs)
    
    def export_products(self, format_type):
        """Export products in the specified format"""
        queryset = self.get_queryset()
        
        # Prepare data
        data = []
        for product in queryset:
            data.append({
                'Name': product.name,
                'SKU': product.sku or '',
                'Category': product.category.name if product.category else '',
                'Price': str(product.price),
                'Sale Price': str(product.sale_price) if product.sale_price else '',
                'Stock Status': 'In Stock' if product.is_available else 'Out of Stock',
                'Featured': 'Yes' if product.is_featured else 'No',
                'Description': product.description or '',
                'Created At': product.created_at.strftime('%Y-%m-%d %H:%M:%S'),
                'Updated At': product.updated_at.strftime('%Y-%m-%d %H:%M:%S'),
            })
        
        # Handle different export formats
        if format_type == 'csv':
            return self.export_to_csv(data)
        elif format_type == 'xls':
            if XLS_SUPPORT:
                return self.export_to_excel(data)
            else:
                messages.error(self.request, 'Excel export is not available. Please install the xlwt package.')
                return HttpResponseRedirect(reverse('admin_dashboard:products'))
        elif format_type == 'json':
            return self.export_to_json(data)
        else:
            messages.error(self.request, 'Invalid export format')
            return HttpResponseRedirect(reverse('admin_dashboard:products'))
    
    def export_to_csv(self, data):
        """Export data to CSV format"""
        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = 'attachment; filename="products_export_{}.csv"'.format(
            datetime.now().strftime('%Y%m%d_%H%M%S')
        )
        
        if data:
            writer = csv.DictWriter(response, fieldnames=data[0].keys())
            writer.writeheader()
            for row in data:
                writer.writerow(row)
        
        return response
    
    def export_to_excel(self, data):
        """Export data to Excel format"""
        response = HttpResponse(content_type='application/ms-excel')
        response['Content-Disposition'] = 'attachment; filename="products_export_{}.xls"'.format(
            datetime.now().strftime('%Y%m%d_%H%M%S')
        )
        
        wb = xlwt.Workbook(encoding='utf-8')
        ws = wb.add_sheet('Products')
        
        # Add headers
        if data:
            headers = list(data[0].keys())
            for col_num, header in enumerate(headers):
                ws.write(0, col_num, header, xlwt.easyxf('font: bold on'))
            
            # Add data rows
            for row_num, row_data in enumerate(data, 1):
                for col_num, value in enumerate(row_data.values()):
                    ws.write(row_num, col_num, value)
        
        wb.save(response)
        return response
    
    def export_to_json(self, data):
        """Export data to JSON format"""
        response = HttpResponse(json.dumps(data, indent=2), content_type='application/json')
        response['Content-Disposition'] = 'attachment; filename="products_export_{}.json"'.format(
            datetime.now().strftime('%Y%m%d_%H%M%S')
        )
        return response

class ProductCreateView(AdminBaseView, CreateView):
    model = Product
    template_name = 'admin/products/form.html'
    fields = ['name', 'description', 'price', 'sale_price', 'category', 
              'image', 'is_featured', 'is_available']
    page_title = 'Add New Product'
    section_name = 'products'
    
    def get_success_url(self):
        messages.success(self.request, 'Product created successfully!')
        return reverse('admin_dashboard:products')

class ProductUpdateView(AdminBaseView, UpdateView):
    model = Product
    template_name = 'admin/products/form.html'
    fields = ['name', 'description', 'price', 'sale_price', 'category', 
              'image', 'is_featured', 'is_available']
    page_title = 'Edit Product'
    section_name = 'products'
    
    def get_success_url(self):
        messages.success(self.request, 'Product updated successfully!')
        return reverse('admin_dashboard:products')

class ProductDeleteView(AdminBaseView, DeleteView):
    model = Product
    template_name = 'admin/confirm_delete.html'
    page_title = 'Delete Product'
    section_name = 'products'
    
class UserCreateView(AdminBaseMixin, CreateView):
    model = User
    template_name = 'admin/users/form.html'
    fields = ['email', 'first_name', 'last_name', 'is_staff', 'is_active', 'is_superuser']
    page_title = 'Add New User'
    section_name = 'users'
    
    def form_valid(self, form):
        # Set a temporary password that the user will need to reset
        user = form.save(commit=False)
        user.set_unusable_password()
        user.save()
        messages.success(self.request, 'User created successfully. They will need to set their password via email.')
        return super().form_valid(form)
    
    def get_success_url(self):
        return reverse('admin_dashboard:users')


class UserUpdateView(AdminBaseMixin, UpdateView):
    model = User
    template_name = 'admin/users/form.html'
    fields = ['email', 'first_name', 'last_name', 'is_staff', 'is_active', 'is_superuser']
    page_title = 'Edit User'
    section_name = 'users'
    
    def get_success_url(self):
        messages.success(self.request, 'User updated successfully.')
        return reverse('admin_dashboard:users')


class UserListView(AdminListView):
    model = User
    template_name = 'admin/users/list.html'
    context_object_name = 'users'
    page_title = 'User Management'
    section_name = 'users'
    
    def get_queryset(self):
        queryset = super().get_queryset()
        search = self.request.GET.get('search')
        user_type = self.request.GET.get('type')
        
        if search:
            queryset = queryset.filter(
                Q(email__icontains=search) | 
                Q(first_name__icontains=search) |
                Q(last_name__icontains=search)
            )
        
        if user_type == 'staff':
            queryset = queryset.filter(is_staff=True)
        elif user_type == 'customer':
            queryset = queryset.filter(is_staff=False)
            
        return queryset.order_by('-date_joined')

class OrderListView(AdminListView):
    model = Order
    template_name = 'admin/orders/list.html'
    context_object_name = 'orders'
    page_title = 'Order Management'
    section_name = 'orders'
    
    def get_queryset(self):
        queryset = super().get_queryset().select_related('user').order_by('-created_at')
        
        # Search functionality
        search_query = self.request.GET.get('q')
        if search_query:
            queryset = queryset.filter(
                Q(order_number__icontains=search_query) |
                Q(user__email__icontains=search_query) |
                Q(billing_name__icontains=search_query) |
                Q(status__icontains=search_query)
            )
            
        # Filter by status
        status = self.request.GET.get('status')
        if status:
            queryset = queryset.filter(status=status)
            
        return queryset
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        
        # Add status counts for filter tabs
        context['status_counts'] = {
            'all': self.get_queryset().count(),
            'pending': self.get_queryset().filter(status='pending').count(),
            'processing': self.get_queryset().filter(status='processing').count(),
            'completed': self.get_queryset().filter(status='completed').count(),
            'cancelled': self.get_queryset().filter(status='cancelled').count(),
        }
        
        # Add current status filter
        context['current_status'] = self.request.GET.get('status', 'all')
        
        # Add search query
        context['search_query'] = self.request.GET.get('q', '')
        
        return context


class PostListView(AdminListView):
    model = Post
    template_name = 'admin/blog/list.html'
    context_object_name = 'posts'
    page_title = 'Blog Management'
    section_name = 'blog'
    
    def get_queryset(self):
        queryset = super().get_queryset().select_related('author')
        search = self.request.GET.get('search')
        status = self.request.GET.get('status')
        
        if search:
            queryset = queryset.filter(
                Q(title__icontains=search) | 
                Q(content__icontains=search) |
                Q(author__email__icontains=search)
            )
        
        if status == 'published':
            queryset = queryset.filter(status='published')
        elif status == 'draft':
            queryset = queryset.filter(status='draft')
            
        return queryset.order_by('-created_at')

class PostCreateView(AdminBaseView, CreateView):
    model = Post
    template_name = 'admin/blog/form.html'
    fields = ['title', 'slug', 'content', 'featured_image', 'status', 'tags']
    page_title = 'Add New Post'
    section_name = 'blog'
    
    def form_valid(self, form):
        form.instance.author = self.request.user
        return super().form_valid(form)
    
    def get_success_url(self):
        messages.success(self.request, 'Post created successfully!')
        return reverse_lazy('admin_dashboard:blog_list')

class PostUpdateView(AdminBaseView, UpdateView):
    model = Post
    template_name = 'admin/blog/form.html'
    fields = ['title', 'slug', 'content', 'featured_image', 'status', 'tags']
    page_title = 'Edit Post'
    section_name = 'blog'

    def get_success_url(self):
        messages.success(self.request, 'Post updated successfully.')
        return reverse_lazy('admin_dashboard:blog_list')


class PostDeleteView(AdminBaseView, DeleteView):
    model = Post
    template_name = 'admin/confirm_delete.html'
    page_title = 'Delete Post'
    section_name = 'blog'

    def get_success_url(self):
        messages.success(self.request, 'Post deleted successfully.')
        return reverse_lazy('admin_dashboard:blog_list')

# System Settings View
class SystemSettingsView(AdminBaseView, TemplateView):
    template_name = 'admin/settings.html'
    page_title = 'Site Settings'
    section_name = 'settings'
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        
        # Get all timezones
        from pytz import common_timezones
        
        # Shipping zones (example data)
        shipping_zones = [
            {
                'code': 'local',
                'name': 'Local',
                'rates': {
                    'standard': 5.00,
                    'express': 10.00
                }
            },
            {
                'code': 'domestic',
                'name': 'Domestic',
                'rates': {
                    'standard': 10.00,
                    'express': 20.00
                }
            },
            {
                'code': 'international',
                'name': 'International',
                'rates': {
                    'standard': 25.00,
                    'express': 50.00
                }
            }
        ]
        
        # Email templates (example data)
        email_templates = [
            {
                'id': 'order_confirmation',
                'name': 'Order Confirmation',
                'subject': 'Your Order #{{ order_number }} has been received!',
                'description': 'Sent when a customer places an order'
            },
            {
                'id': 'order_shipped',
                'name': 'Order Shipped',
                'subject': 'Your Order #{{ order_number }} is on its way!',
                'description': 'Sent when an order is marked as shipped'
            },
            {
                'id': 'password_reset',
                'name': 'Password Reset',
                'subject': 'Reset your password',
                'description': 'Sent when a user requests a password reset'
            },
            {
                'id': 'welcome',
                'name': 'Welcome Email',
                'subject': 'Welcome to {{ site_name }}!',
                'description': 'Sent when a new user registers'
            },
            {
                'id': 'newsletter',
                'name': 'Newsletter',
                'subject': '{{ newsletter_subject }}',
                'description': 'Newsletter email template'
            }
        ]
        
        # Get current settings from Django settings or database
        # This is just an example - you would typically use Django's settings or a custom settings model
        current_settings = {
            'SITE_TITLE': getattr(settings, 'SITE_TITLE', "Lakeisha's Cupcakery"),
            'SITE_DESCRIPTION': getattr(settings, 'SITE_DESCRIPTION', "Delicious homemade cupcakes for every occasion"),
            'SITE_LOGO': getattr(settings, 'SITE_LOGO', None),
            'FAVICON': getattr(settings, 'FAVICON', None),
            'ADMIN_EMAIL': getattr(settings, 'DEFAULT_FROM_EMAIL', 'admin@example.com'),
            'TIME_ZONE': getattr(settings, 'TIME_ZONE', 'UTC'),
            'STORE_NAME': getattr(settings, 'STORE_NAME', "Lakeisha's Cupcakery"),
            'STORE_EMAIL': getattr(settings, 'STORE_EMAIL', 'info@lakeishascupcakery.com'),
            'STORE_PHONE': getattr(settings, 'STORE_PHONE', '+1 (555) 123-4567'),
            'STORE_ADDRESS': getattr(settings, 'STORE_ADDRESS', '123 Bakery Street\nSweetville, SV 12345'),
            'CURRENCY': getattr(settings, 'CURRENCY', 'USD'),
            'CURRENCY_SYMBOL': getattr(settings, 'CURRENCY_SYMBOL', '$'),
            'STORE_STATUS': getattr(settings, 'STORE_STATUS', True),
            'SHIPPING_METHODS': getattr(settings, 'SHIPPING_METHODS', ['standard', 'express', 'pickup']),
            'FREE_SHIPPING_ENABLED': getattr(settings, 'FREE_SHIPPING_ENABLED', True),
            'FREE_SHIPPING_MIN_AMOUNT': getattr(settings, 'FREE_SHIPPING_MIN_AMOUNT', 50.00),
            'FREE_SHIPPING_APPLIES_TO': getattr(settings, 'FREE_SHIPPING_APPLIES_TO', 'all'),
            'PAYMENT_METHODS': getattr(settings, 'PAYMENT_METHODS', ['credit_card', 'paypal', 'bank_transfer']),
            'STRIPE_PUBLISHABLE_KEY': getattr(settings, 'STRIPE_PUBLISHABLE_KEY', ''),
            'STRIPE_SECRET_KEY': getattr(settings, 'STRIPE_SECRET_KEY', ''),
            'PAYPAL_SANDBOX': getattr(settings, 'PAYPAL_SANDBOX', True),
            'PAYPAL_CLIENT_ID': getattr(settings, 'PAYPAL_CLIENT_ID', ''),
            'PAYPAL_SECRET': getattr(settings, 'PAYPAL_SECRET', ''),
            'EMAIL_HOST': getattr(settings, 'EMAIL_HOST', ''),
            'EMAIL_PORT': getattr(settings, 'EMAIL_PORT', 587),
            'EMAIL_HOST_USER': getattr(settings, 'EMAIL_HOST_USER', ''),
            'EMAIL_HOST_PASSWORD': getattr(settings, 'EMAIL_HOST_PASSWORD', ''),
            'EMAIL_USE_TLS': getattr(settings, 'EMAIL_USE_TLS', True),
            'EMAIL_NOTIFICATIONS': getattr(settings, 'EMAIL_NOTIFICATIONS', True),
            'META_TITLE': getattr(settings, 'META_TITLE', ''),
            'META_DESCRIPTION': getattr(settings, 'META_DESCRIPTION', ''),
            'META_KEYWORDS': getattr(settings, 'META_KEYWORDS', ''),
            'SOCIAL_SHARE_IMAGE': getattr(settings, 'SOCIAL_SHARE_IMAGE', None),
            'GOOGLE_SITE_VERIFICATION': getattr(settings, 'GOOGLE_SITE_VERIFICATION', ''),
            'BING_WEBMASTER_TOOLS': getattr(settings, 'BING_WEBMASTER_TOOLS', ''),
            'ENABLE_SITEMAP': getattr(settings, 'ENABLE_SITEMAP', True),
            'SOCIAL_FACEBOOK': getattr(settings, 'SOCIAL_FACEBOOK', ''),
            'SOCIAL_INSTAGRAM': getattr(settings, 'SOCIAL_INSTAGRAM', ''),
            'SOCIAL_TWITTER': getattr(settings, 'SOCIAL_TWITTER', ''),
            'SOCIAL_PINTEREST': getattr(settings, 'SOCIAL_PINTEREST', ''),
            'SOCIAL_YOUTUBE': getattr(settings, 'SOCIAL_YOUTUBE', ''),
            'SOCIAL_TIKTOK': getattr(settings, 'SOCIAL_TIKTOK', ''),
            'SOCIAL_SHARING_BUTTONS': getattr(settings, 'SOCIAL_SHARING_BUTTONS', True),
            'SOCIAL_SHARE_PRODUCT': getattr(settings, 'SOCIAL_SHARE_PRODUCT', True),
            'SOCIAL_SHARE_BLOG': getattr(settings, 'SOCIAL_SHARE_BLOG', True),
        }
        
        context.update({
            'settings': current_settings,
            'timezones': common_timezones,
            'shipping_zones': shipping_zones,
            'email_templates': email_templates,
            'categories': Category.objects.all(),
        })
        
        return context
    
    def post(self, request, *args, **kwargs):
        from django.http import JsonResponse
        
        # Handle form submission for settings
        if request.headers.get('x-requested-with') == 'XMLHttpRequest':
            # Handle AJAX requests (e.g., saving individual settings)
            action = request.POST.get('action')
            
            if action == 'save_setting':
                setting_name = request.POST.get('name')
                setting_value = request.POST.get('value')
                
                # In a real app, you would save this to your settings model or database
                # For this example, we'll just return a success response
                return JsonResponse({
                    'success': True,
                    'message': f'Setting {setting_name} updated successfully.'
                })
            
            elif action == 'export_settings':
                # Export settings to a JSON file
                from django.core import serializers
                from django.conf import settings as django_settings
                
                # Get all settings that don't start with an underscore
                settings_dict = {k: v for k, v in vars(django_settings).items() 
                               if not k.startswith('_') and k.isupper()}
                
                # Remove sensitive data
                for key in ['SECRET_KEY', 'DATABASES', 'PASSWORD_HASHERS', 'AUTH_PASSWORD_VALIDATORS']:
                    settings_dict.pop(key, None)
                
                return JsonResponse(settings_dict)
            
            return JsonResponse({'error': 'Invalid action'}, status=400)
        
        # Handle regular form submission
        # In a real app, you would save all the form data to your settings model or database
        messages.success(request, 'Settings saved successfully.')
        return redirect('admin_dashboard:settings')

# Analytics View
class AnalyticsView(AdminBaseView, TemplateView):
    template_name = 'admin/analytics.html'
    page_title = 'Analytics Dashboard'
    section_name = 'analytics'
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        
        # Date range for analytics (last 30 days by default)
        end_date = timezone.now().date()
        start_date = end_date - timedelta(days=30)
        
        # Get date range from URL parameters if provided
        date_from = self.request.GET.get('date_from')
        date_to = self.request.GET.get('date_to')
        
        if date_from:
            try:
                start_date = timezone.datetime.strptime(date_from, '%Y-%m-%d').date()
            except (ValueError, TypeError):
                pass
                
        if date_to:
            try:
                end_date = timezone.datetime.strptime(date_to, '%Y-%m-%d').date()
            except (ValueError, TypeError):
                pass
        
        # Generate date range for charts
        date_range = [(start_date + timedelta(days=x)).strftime('%Y-%m-%d') 
                     for x in range((end_date - start_date).days + 1)]
        
        # Get order data for the date range
        orders = Order.objects.filter(
            created_at__date__range=[start_date, end_date],
            status='completed'
        ).annotate(date=TruncMonth('created_at')).values('date').annotate(
            total_orders=Count('id'),
            total_revenue=Sum('total')
        ).order_by('date')
        
        # Prepare data for charts
        orders_data = [0] * len(date_range)
        for i, date in enumerate(date_range):
            order = next((o for o in orders if o['date'].strftime('%Y-%m-%d') == date), None)
            if order:
                orders_data[i] = float(order['total_orders'])
        
        # Get traffic data (this would come from your analytics tool in a real app)
        # For demo purposes, we'll generate some fake data
        import random
        visits_data = [random.randint(50, 200) for _ in date_range]
        
        # Top products
        top_products = Product.objects.annotate(
            total_sold=Sum(
                'order_items__quantity',
                filter=Q(order_items__order__created_at__date__range=[start_date, end_date])
            ),
            total_revenue=Sum(
                ExpressionWrapper(
                    F('order_items__product_price') * F('order_items__quantity'),
                    output_field=DecimalField(max_digits=12, decimal_places=2)
                ),
                filter=Q(order_items__order__created_at__date__range=[start_date, end_date])
            )
        ).filter(total_sold__gt=0).order_by('-total_sold')[:5]
        
        # Traffic sources (demo data)
        traffic_sources = {
            'labels': ['Direct', 'Organic Search', 'Social', 'Email', 'Referral'],
            'data': [35, 40, 15, 5, 5]
        }
        
        # Referrers data
        referrers = {
            'labels': ['google.com', 'facebook.com', 'instagram.com', 'pinterest.com', 'twitter.com'],
            'data': [150, 85, 120, 60, 40]
        }
        
        # Update context with all the data
        context.update({
            'start_date': start_date,
            'end_date': end_date,
            'date_range': json.dumps(date_range),
            'visits_data': json.dumps(visits_data),
            'orders_data': json.dumps(orders_data),
            'top_products': top_products,
            'traffic_sources': traffic_sources,
            'referrers': referrers,
            'total_visits': sum(visits_data),
            'total_orders': sum(orders_data),
            'total_revenue': sum(order['total_revenue'] or 0 for order in orders),
            'conversion_rate': round((sum(orders_data) / sum(visits_data)) * 100, 1) if sum(visits_data) > 0 else 0,
            'visit_change': 12.5,  # Example change percentage
            'order_change': 8.2,   # Example change percentage
            'revenue_change': 15.7, # Example change percentage
            'conversion_change': 3.2, # Example change percentage
            'recent_activity': [
                {
                    'type': 'order',
                    'icon': 'shopping-cart',
                    'description': 'New order #1234 from John Doe',
                    'time': '2 hours ago'
                },
                {
                    'type': 'user',
                    'icon': 'user-plus',
                    'description': 'New user registered: jane@example.com',
                    'time': '5 hours ago'
                },
                {
                    'type': 'product',
                    'icon': 'box',
                    'description': 'Product \"Chocolate Cupcake\" is low in stock',
                    'time': '1 day ago'
                },
                {
                    'type': 'blog',
                    'icon': 'edit',
                    'description': 'New blog post published: \"10 Tips for Perfect Cupcakes\"',
                    'time': '2 days ago'
                },
            ]
        })
        
        return context
    
    def post(self, request, *args, **kwargs):
        # Handle AJAX request for activity feed refresh
        if request.headers.get('x-requested-with') == 'XMLHttpRequest':
            import random
            from django.http import JsonResponse
            
            activities = [
                {
                    'type': 'order',
                    'icon': 'shopping-cart',
                    'description': f'New order #{random.randint(1000, 9999)} from Customer',
                    'time': 'Just now'
                },
                {
                    'type': 'user',
                    'icon': 'user-plus',
                    'description': f'New user registered: user{random.randint(100,999)}@example.com',
                    'time': '5 minutes ago'
                },
                {
                    'type': 'product',
                    'icon': 'box',
                    'description': 'Product inventory updated',
                    'time': '30 minutes ago'
                },
            ]
            return JsonResponse({'activities': activities})
        return JsonResponse({'error': 'Invalid request'}, status=400)

class SettingsExportView(AdminBaseMixin, View):
    """Export current system settings as a JSON file"""
    def get(self, request, *args, **kwargs):
        current_settings = {
            'SITE_TITLE': getattr(settings, 'SITE_TITLE', "Lakeisha's Cupcakery"),
            'SITE_DESCRIPTION': getattr(settings, 'SITE_DESCRIPTION', "Delicious homemade cupcakes for every occasion"),
            'SITE_LOGO': getattr(settings, 'SITE_LOGO', None),
            'FAVICON': getattr(settings, 'FAVICON', None),
            'ADMIN_EMAIL': getattr(settings, 'DEFAULT_FROM_EMAIL', 'admin@example.com'),
            'TIME_ZONE': getattr(settings, 'TIME_ZONE', 'UTC'),
            'STORE_NAME': getattr(settings, 'STORE_NAME', "Lakeisha's Cupcakery"),
            'STORE_EMAIL': getattr(settings, 'STORE_EMAIL', 'info@lakeishascupcakery.com'),
            'STORE_PHONE': getattr(settings, 'STORE_PHONE', '+1 (555) 123-4567'),
            'STORE_ADDRESS': getattr(settings, 'STORE_ADDRESS', '123 Bakery Street\nSweetville, SV 12345'),
            'CURRENCY': getattr(settings, 'CURRENCY', 'USD'),
            'CURRENCY_SYMBOL': getattr(settings, 'CURRENCY_SYMBOL', '$'),
            'STORE_STATUS': getattr(settings, 'STORE_STATUS', True),
            'SHIPPING_METHODS': getattr(settings, 'SHIPPING_METHODS', ['standard', 'express', 'pickup']),
            'FREE_SHIPPING_ENABLED': getattr(settings, 'FREE_SHIPPING_ENABLED', True),
            'FREE_SHIPPING_MIN_AMOUNT': getattr(settings, 'FREE_SHIPPING_MIN_AMOUNT', 50.00),
            'FREE_SHIPPING_APPLIES_TO': getattr(settings, 'FREE_SHIPPING_APPLIES_TO', 'all'),
            'PAYMENT_METHODS': getattr(settings, 'PAYMENT_METHODS', ['credit_card', 'paypal', 'bank_transfer']),
            'STRIPE_PUBLISHABLE_KEY': getattr(settings, 'STRIPE_PUBLISHABLE_KEY', ''),
            'STRIPE_SECRET_KEY': getattr(settings, 'STRIPE_SECRET_KEY', ''),
            'PAYPAL_SANDBOX': getattr(settings, 'PAYPAL_SANDBOX', True),
            'PAYPAL_CLIENT_ID': getattr(settings, 'PAYPAL_CLIENT_ID', ''),
            'PAYPAL_SECRET': getattr(settings, 'PAYPAL_SECRET', ''),
            'EMAIL_HOST': getattr(settings, 'EMAIL_HOST', ''),
            'EMAIL_PORT': getattr(settings, 'EMAIL_PORT', 587),
            'EMAIL_HOST_USER': getattr(settings, 'EMAIL_HOST_USER', ''),
            'EMAIL_HOST_PASSWORD': getattr(settings, 'EMAIL_HOST_PASSWORD', ''),
            'EMAIL_USE_TLS': getattr(settings, 'EMAIL_USE_TLS', True),
            'EMAIL_NOTIFICATIONS': getattr(settings, 'EMAIL_NOTIFICATIONS', True),
            'META_TITLE': getattr(settings, 'META_TITLE', ''),
            'META_DESCRIPTION': getattr(settings, 'META_DESCRIPTION', ''),
            'META_KEYWORDS': getattr(settings, 'META_KEYWORDS', ''),
            'SOCIAL_SHARE_IMAGE': getattr(settings, 'SOCIAL_SHARE_IMAGE', None),
            'GOOGLE_SITE_VERIFICATION': getattr(settings, 'GOOGLE_SITE_VERIFICATION', ''),
            'BING_WEBMASTER_TOOLS': getattr(settings, 'BING_WEBMASTER_TOOLS', ''),
            'ENABLE_SITEMAP': getattr(settings, 'ENABLE_SITEMAP', True),
            'SOCIAL_FACEBOOK': getattr(settings, 'SOCIAL_FACEBOOK', ''),
            'SOCIAL_INSTAGRAM': getattr(settings, 'SOCIAL_INSTAGRAM', ''),
            'SOCIAL_TWITTER': getattr(settings, 'SOCIAL_TWITTER', ''),
            'SOCIAL_PINTEREST': getattr(settings, 'SOCIAL_PINTEREST', ''),
            'SOCIAL_YOUTUBE': getattr(settings, 'SOCIAL_YOUTUBE', ''),
            'SOCIAL_TIKTOK': getattr(settings, 'SOCIAL_TIKTOK', ''),
            'SOCIAL_SHARING_BUTTONS': getattr(settings, 'SOCIAL_SHARING_BUTTONS', True),
            'SOCIAL_SHARE_PRODUCT': getattr(settings, 'SOCIAL_SHARE_PRODUCT', True),
            'SOCIAL_SHARE_BLOG': getattr(settings, 'SOCIAL_SHARE_BLOG', True),
        }
        response = HttpResponse(json.dumps(current_settings, indent=2), content_type='application/json')
        response['Content-Disposition'] = 'attachment; filename="settings_export_{}.json"'.format(
            datetime.now().strftime('%Y%m%d_%H%M%S')
        )
        return response

class SettingsActionView(AdminBaseView, View):
    """Handle settings actions like reset, clear cache, import/export"""
    
    @method_decorator(require_POST)
    def dispatch(self, request, *args, **kwargs):
        return super().dispatch(request, *args, **kwargs)
    
    def post(self, request, *args, **kwargs):
        action = kwargs.get('action')
        is_json = request.headers.get('Content-Type', '').startswith('application/json')
        is_ajax = request.headers.get('X-Requested-With') == 'XMLHttpRequest'
        wants_json = is_json or is_ajax
        
        if action == 'reset':
            # Reset settings to defaults
            # In a real app, you would implement this logic
            messages.success(request, 'Settings have been reset to default values.')
            if wants_json:
                return JsonResponse({'success': True})
            return redirect('admin_dashboard:settings')
            
        elif action == 'clear_cache':
            cache.clear()
            messages.success(request, 'Cache has been cleared successfully.')
            if wants_json:
                return JsonResponse({'success': True})
            return redirect('admin_dashboard:settings')
            
        elif action == 'export':
            # Export settings to a file
            from django.conf import settings as django_settings
            import json
            
            # Get all settings that don't start with an underscore
            settings_dict = {k: v for k, v in vars(django_settings).items() 
                           if not k.startswith('_') and k.isupper()}
            
            # Remove sensitive data
            for key in ['SECRET_KEY', 'DATABASES', 'PASSWORD_HASHERS', 'AUTH_PASSWORD_VALIDATORS']:
                settings_dict.pop(key, None)
            
            response = JsonResponse(settings_dict)
            response['Content-Disposition'] = 'attachment; filename=settings_export.json'
            return response
            
        elif action == 'import':
            # Import settings from a file
            if 'settings_file' not in request.FILES:
                if wants_json:
                    return JsonResponse({'success': False, 'message': 'No file was uploaded.'}, status=400)
                messages.error(request, 'No file was uploaded.')
                return redirect('admin_dashboard:settings')
                
            try:
                import json
                from django.conf import settings as django_settings
                
                file = request.FILES['settings_file']
                if not file.name.endswith('.json'):
                    raise ValueError('Invalid file format. Please upload a JSON file.')
                
                data = json.loads(file.read().decode('utf-8'))
                
                # In a real app, you would validate and save these settings
                # For this example, we'll just show a success message
                if wants_json:
                    return JsonResponse({'success': True, 'count': len(data)})
                messages.success(request, f'Successfully imported {len(data)} settings.')
                return redirect('admin_dashboard:settings')
                
            except Exception as e:
                if wants_json:
                    return JsonResponse({'success': False, 'message': f'Error importing settings: {str(e)}'}, status=400)
                messages.error(request, f'Error importing settings: {str(e)}')
                return redirect('admin_dashboard:settings')
        
        messages.error(request, 'Invalid action.')
        return redirect('admin_dashboard:settings')


class ActivityFeedView(View):
    """API endpoint for loading activity feed data"""
    
    def get(self, request, *args, **kwargs):
        # In a real app, you would fetch actual activity data from your database
        import random
        from django.utils import timezone
        from datetime import timedelta
        
        activities = []
        now = timezone.now()
        
        # Generate some sample activities
        activity_types = [
            {'type': 'order', 'icon': 'shopping-cart', 'description': 'New order #{n} from {name}'},
            {'type': 'user', 'icon': 'user-plus', 'description': 'New user registered: {email}'},
            {'type': 'product', 'icon': 'box', 'description': 'Product "{product}" is low in stock'},
            {'type': 'blog', 'icon': 'edit', 'description': 'New blog post published: "{title}"'},
            {'type': 'review', 'icon': 'star', 'description': 'New {rating}-star review for "{product}"'},
        ]
        
        # Generate random activities
        for i in range(10):
            activity = random.choice(activity_types).copy()
            time_ago = now - timedelta(
                hours=random.randint(0, 23),
                minutes=random.randint(0, 59),
                seconds=random.randint(0, 59)
            )
            
            # Replace placeholders with random data
            if '{n}' in activity['description']:
                activity['description'] = activity['description'].replace('{n}', str(random.randint(1000, 9999)))
            if '{name}' in activity['description']:
                names = ['John Doe', 'Jane Smith', 'Robert Johnson', 'Emily Davis', 'Michael Brown']
                activity['description'] = activity['description'].replace('{name}', random.choice(names))
            if '{email}' in activity['description']:
                domains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'example.com']
                activity['description'] = activity['description'].replace('{email}', f'user{random.randint(100,999)}@{random.choice(domains)}')
            if '{product}' in activity['description']:
                products = ['Chocolate Cupcake', 'Vanilla Cupcake', 'Red Velvet', 'Carrot Cake', 'Lemon Drizzle']
                activity['description'] = activity['description'].replace('{product}', random.choice(products))
            if '{title}' in activity['description']:
                titles = [
                    '10 Tips for Perfect Cupcakes',
                    'The History of Cupcakes',
                    'Gluten-Free Baking Guide',
                    'Seasonal Flavors for Fall',
                    'Decorating Ideas for Beginners'
                ]
                activity['description'] = activity['description'].replace('{title}', random.choice(titles))
            if '{rating}' in activity['description']:
                activity['description'] = activity['description'].replace('{rating}', str(random.randint(1, 5)))
            
            activities.append({
                'type': activity['type'],
                'icon': activity['icon'],
                'description': activity['description'],
                'time': time_ago
            })
        
        # Sort by time (newest first)
        activities.sort(key=lambda x: x['time'], reverse=True)
        
        # Format times as "X time ago"
        for activity in activities:
            delta = now - activity['time']
            if delta.days > 0:
                if delta.days == 1:
                    activity['time'] = '1 day ago'
                else:
                    activity['time'] = f'{delta.days} days ago'
            elif delta.seconds >= 3600:
                hours = delta.seconds // 3600
                if hours == 1:
                    activity['time'] = '1 hour ago'
                else:
                    activity['time'] = f'{hours} hours ago'
            elif delta.seconds >= 60:
                minutes = delta.seconds // 60
                if minutes == 1:
                    activity['time'] = '1 minute ago'
                else:
                    activity['time'] = f'{minutes} minutes ago'
            else:
                activity['time'] = 'Just now'
        
        return JsonResponse({'activities': activities[:5]})


class WelcomeView(TemplateView):
    """Welcome page view with login and API Root buttons"""
    template_name = 'admin/welcome.html'
    page_title = 'Welcome'
    section_name = 'welcome'
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context.update({
            'site_header': "Welcome to Cupcakery Admin",
            'site_title': "Cupcakery Admin",
            'current_section': 'welcome',
            'user': self.request.user if hasattr(self.request, 'user') else None,
            'messages': [],
        })
        return context
    
    def get(self, request, *args, **kwargs):
        # Ensure user is not authenticated when accessing welcome page
        if request.user.is_authenticated:
            return redirect('admin_dashboard:dashboard')
        return super().get(request, *args, **kwargs)

# URL name mappings
welcome = WelcomeView.as_view()
admin_dashboard = AdminDashboardView.as_view()
product_list = ProductListView.as_view()
product_create = ProductCreateView.as_view()
product_update = ProductUpdateView.as_view()
product_delete = ProductDeleteView.as_view()
user_list = UserListView.as_view()
user_create = UserCreateView.as_view()
user_update = UserUpdateView.as_view()
post_list = PostListView.as_view()
post_create = PostCreateView.as_view()
post_update = PostUpdateView.as_view()
system_settings = SystemSettingsView.as_view()
analytics_dashboard = AnalyticsView.as_view()
