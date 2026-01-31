#!/bin/sh
set -e

# Run migrations and collectstatic (ignore errors to avoid failing on first deploy)
python manage.py migrate --noinput || true
python manage.py collectstatic --noinput || true

# Start Gunicorn
exec gunicorn config.wsgi:application --bind 0.0.0.0:${PORT:-8000} --workers 2
