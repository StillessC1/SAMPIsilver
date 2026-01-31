#!/bin/sh
set -e

# Switch into backend and run typical startup tasks
cd backend

python manage.py migrate --noinput || true
python manage.py collectstatic --noinput || true

# Start gunicorn
exec gunicorn config.wsgi:application --bind 0.0.0.0:${PORT:-8000} --workers 2
