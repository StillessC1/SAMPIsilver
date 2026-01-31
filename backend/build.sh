#!/bin/bash
set -o errexit
python manage.py migrate --noinput
python manage.py collectstatic --noinput
python manage.py seed 2>/dev/null || true
