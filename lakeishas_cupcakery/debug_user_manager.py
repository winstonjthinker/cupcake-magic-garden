import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.contrib.auth import get_user_model
User = get_user_model()

from django.apps import apps

try:
    print(f"Raw Setting: {django.conf.settings.AUTH_USER_MODEL}")
    user_model = apps.get_model(django.conf.settings.AUTH_USER_MODEL)
    print(f"Conf Model: {user_model.__module__}.{user_model.__name__}")
except Exception as e:
    print(f"Conf Error: {e}")

print(f"Active Model: {User.__module__}.{User.__name__}")
print(f"Active Label: {User._meta.label}")
print(f"Active App: {User._meta.app_label}")
