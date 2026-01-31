import os
import sys
import django

# Ensure backend directory is on PYTHONPATH so `config` package is importable
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.contrib.auth import get_user_model
User = get_user_model()

username = os.environ.get('DJANGO_SUPERUSER_USERNAME', 'admin')
email = os.environ.get('DJANGO_SUPERUSER_EMAIL', 'admin@example.com')
password = os.environ.get('DJANGO_SUPERUSER_PASSWORD', 'AdminPass1234')

if User.objects.filter(username=username).exists():
    print('Admin user already exists')
else:
    User.objects.create_superuser(username=username, email=email, password=password)
    print('Admin user created')
