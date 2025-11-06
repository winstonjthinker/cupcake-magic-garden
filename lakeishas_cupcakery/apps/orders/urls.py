from django.urls import path
from rest_framework.routers import DefaultRouter
from . import views

app_name = 'orders'

router = DefaultRouter()
# Register your viewsets here
# router.register(r'orders', views.OrderViewSet)

urlpatterns = [
    # Add your URL patterns here
] + router.urls
