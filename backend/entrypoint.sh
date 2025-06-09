#!/bin/sh

python manage.py makemigrations
python manage.py migrate
# python manage.py runserver 0.0.0.0:8000

# daphne -b 0.0.0.0 -p 8000 backend.asgi:application
uvicorn backend.asgi:application --host 0.0.0.0 --port 8000 --reload