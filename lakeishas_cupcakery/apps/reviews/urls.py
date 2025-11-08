from django.urls import path
from rest_framework.routers import DefaultRouter
from . import views

app_name = 'reviews'

router = DefaultRouter()
# Register your viewsets here
# router.register(r'reviews', views.ReviewViewSet)

urlpatterns = [
    # Add your URL patterns here
] + router.urls
