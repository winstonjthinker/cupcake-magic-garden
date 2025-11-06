# lakeishas_cupcakery/apps/contact/urls.py
from django.urls import path
from . import views

app_name = 'contact'

urlpatterns = [
    path('', views.ContactSubmissionCreateView.as_view(), name='contact-create'),
]