from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from . import api_views

app_name = 'users'

urlpatterns = [
    # Authentication endpoints
    path('register/', api_views.UserRegisterView.as_view(), name='register'),
    path('login/', api_views.UserLoginView.as_view(), name='login'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # User profile endpoints
    path('profile/', api_views.UserProfileView.as_view(), name='profile'),
    path('change-password/', api_views.ChangePasswordView.as_view(), name='change_password'),
    
    # Admin endpoints
    path('users/', api_views.UserListView.as_view(), name='user_list'),
]
