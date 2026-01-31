#!/bin/sh
set -e

# Если база ещё не готова — не валим запуск (иначе будет 503)
python manage.py migrate --noinput || true
python manage.py collectstatic --noinput || true

# ВАЖНО: запускаем CMD из Dockerfile (gunicorn)
exec "$@"
