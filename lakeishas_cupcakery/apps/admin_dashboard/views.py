from django.contrib.auth import views as auth_views, get_user_model
from django.contrib.auth.mixins import LoginRequiredMixin, UserPassesTestMixin
from django.views.generic import View, TemplateView, ListView, CreateView, UpdateView, DeleteView
from django.shortcuts import render, redirect, get_object_or_404
from django.urls import reverse_lazy, reverse
from django.views.decorators.cache import never_cache
from django.utils.decorators import method_decorator
from django.conf import settings
from django.contrib.admin.views.decorators import staff_member_required
from django.contrib import messages
from django.db.models import Count, Sum, Q
from django.utils import timezone
from datetime import timedelta
import json

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
        return reverse_lazy('admin_dashboard')

class AdminLogoutView(auth_views.LogoutView):
    """Custom logout view for admin dashboard"""
    next_page = 'admin_login'

def admin_required(view_func):
    """Decorator that ensures the user is a staff member"""
    def wrapper(request, *args, **kwargs):
        if not request.user.is_authenticated or not request.user.is_staff:
            return redirect('admin_login')
        return view_func(request, *args, **kwargs)
    return wrapper

class AdminBaseView(TemplateView):
    """Base view for admin sections"""
    @method_decorator(never_cache)
    @method_decorator(staff_member_required(login_url='admin_login'))
    def dispatch(self, *args, **kwargs):
        return super().dispatch(*args, **kwargs)
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context.update({
            'site_header': "Lakeisha's Cupcakery Admin",
            'site_title': getattr(self, 'page_title', 'Admin'),
            'user': self.request.user,
            'current_section': getattr(self, 'section_name', ''),
        })
        return context

class AdminDashboardView(AdminBaseView):
    """Main admin dashboard view"""
    template_name = 'admin/django_admin_dashboard.html'
    page_title = 'Dashboard'
    section_name = 'dashboard'
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        
        # Get recent orders
        recent_orders = Order.objects.select_related('user').order_by('-created_at')[:5]
        
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
        })
        return context

# Product Management Views
class ProductListView(AdminBaseView, ListView):
    model = Product
    template_name = 'admin/products/list.html'
    context_object_name = 'products'
    page_title = 'Product Management'
    section_name = 'products'
    paginate_by = 10
    
    def get_queryset(self):
        queryset = super().get_queryset().select_related('category')
        search = self.request.GET.get('search')
        category = self.request.GET.get('category')
        
        if search:
            queryset = queryset.filter(
                Q(name__icontains=search) | 
                Q(description__icontains=search) |
                Q(sku__icontains=search)
            )
        
        if category:
            queryset = queryset.filter(category_id=category)
            
        return queryset.order_by('name')
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['categories'] = Category.objects.all()
        return context

class ProductCreateView(AdminBaseView, CreateView):
    model = Product
    template_name = 'admin/products/form.html'
    fields = ['name', 'description', 'price', 'sale_price', 'category', 
              'stock_quantity', 'image', 'is_featured', 'is_available']
    page_title = 'Add New Product'
    section_name = 'products'
    
    def get_success_url(self):
        messages.success(self.request, 'Product created successfully!')
        return reverse('admin_products')

class ProductUpdateView(AdminBaseView, UpdateView):
    model = Product
    template_name = 'admin/products/form.html'
    fields = ['name', 'description', 'price', 'sale_price', 'category', 
              'stock_quantity', 'image', 'is_featured', 'is_available']
    page_title = 'Edit Product'
    section_name = 'products'
    
    def get_success_url(self):
        messages.success(self.request, 'Product updated successfully!')
        return reverse('admin_products')

class ProductDeleteView(AdminBaseView, DeleteView):
    model = Product
    template_name = 'admin/confirm_delete.html'
    page_title = 'Delete Product'
    section_name = 'products'
    
    def get_success_url(self):
        messages.success(self.request, 'Product deleted successfully!')
        return reverse('admin_products')

# User Management Views
class UserListView(AdminBaseView, ListView):
    model = User
    template_name = 'admin/users/list.html'
    context_object_name = 'users'
    page_title = 'User Management'
    section_name = 'users'
    paginate_by = 15
    
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

class UserCreateView(AdminBaseView, CreateView):
    model = User
    template_name = 'admin/users/form.html'
    fields = ['email', 'first_name', 'last_name', 'is_staff', 'is_active']
    page_title = 'Add New User'
    section_name = 'users'
    
    def get_success_url(self):
        messages.success(self.request, 'User created successfully!')
        return reverse('admin_users')
    
    def form_valid(self, form):
        # Set a default password (user will need to reset it)
        user = form.save(commit=False)
        user.set_unusable_password()
        user.save()
        return super().form_valid(form)

class UserUpdateView(AdminBaseView, UpdateView):
    model = User
    template_name = 'admin/users/form.html'
    fields = ['email', 'first_name', 'last_name', 'is_staff', 'is_active']
    page_title = 'Edit User'
    section_name = 'users'
    
    def get_success_url(self):
        messages.success(self.request, 'User updated successfully!')
        return reverse('admin_users')

# Blog Management Views
class PostListView(AdminBaseView, ListView):
    model = Post
    template_name = 'admin/blog/list.html'
    context_object_name = 'posts'
    page_title = 'Blog Management'
    section_name = 'blog'
    paginate_by = 10
    
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
        return reverse('admin_blog')

class PostUpdateView(AdminBaseView, UpdateView):
    model = Post
    template_name = 'admin/blog/form.html'
    fields = ['title', 'slug', 'content', 'featured_image', 'status', 'tags']
    page_title = 'Edit Post'
    section_name = 'blog'
    
    def get_success_url(self):
        messages.success(self.request, 'Post updated successfully!')
        return reverse('admin_blog')

# System Settings View
class SystemSettingsView(AdminBaseView, TemplateView):
    template_name = 'admin/settings/general.html'
    page_title = 'System Settings'
    section_name = 'settings'
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        # Add any system settings or configurations here
        return context

# Analytics View
class AnalyticsView(AdminBaseView, TemplateView):
    template_name = 'admin/analytics/dashboard.html'
    page_title = 'Analytics Dashboard'
    section_name = 'analytics'
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        
        # Sales data for charts
        today = timezone.now().date()
        thirty_days_ago = today - timedelta(days=30)
        
        # Daily sales for the last 30 days
        daily_sales = Order.objects.filter(
            created_at__date__gte=thirty_days_ago,
            status='completed'
        ).values('created_at__date').annotate(
            total_sales=Sum('total_amount'),
            order_count=Count('id')
        ).order_by('created_at__date')
        
        # Format data for chart.js
        dates = [entry['created_at__date'].strftime('%Y-%m-%d') for entry in daily_sales]
        sales_data = [float(entry['total_sales'] or 0) for entry in daily_sales]
        order_counts = [entry['order_count'] for entry in daily_sales]
        
        # Top selling products
        top_products = OrderItem.objects.select_related('product').values(
            'product__name'
        ).annotate(
            total_quantity=Sum('quantity'),
            total_revenue=Sum('price')
        ).order_by('-total_quantity')[:5]
        
        context.update({
            'dates_json': json.dumps(dates),
            'sales_data_json': json.dumps(sales_data),
            'order_counts_json': json.dumps(order_counts),
            'top_products': top_products,
            'total_revenue': sum(sales_data),
            'total_orders': sum(order_counts),
            'avg_order_value': sum(sales_data) / len(sales_data) if sales_data else 0,
        })
        
        return context

# URL name mappings
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
