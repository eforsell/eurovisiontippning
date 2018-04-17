import dj_database_url
from .base import *

SECRET_KEY = os.environ['DJANGO_SECRET_KEY']
DEBUG = False


# Database
# https://docs.djangoproject.com/en/2.0/ref/settings/#databases

db_from_env = dj_database_url.config(conn_max_age=60)
DATABASES = {
    'default': db_from_env
}

# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/2.0/howto/static-files/

STATIC_URL = '/static/'


# Social Auth secrets

SOCIAL_AUTH_GOOGLE_OAUTH2_KEY = os.environ['SOCIAL_AUTH_GOOGLE_OAUTH2_KEY']
SOCIAL_AUTH_GOOGLE_OAUTH2_SECRET = os.environ['SOCIAL_AUTH_GOOGLE_OAUTH2_SECRET']
