from django.urls import path
from rest_framework.routers import DefaultRouter
from . import views

app_name = 'newsletter'

router = DefaultRouter()
# Register your viewsets here
# router.register(r'subscribers', views.SubscriberViewSet)

urlpatterns = [
    # Add your URL patterns here
] + router.urls
