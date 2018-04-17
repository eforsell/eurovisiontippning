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


# Social Auth secrets

SOCIAL_AUTH_GOOGLE_OAUTH2_KEY = os.environ['SOCIAL_AUTH_GOOGLE_OAUTH2_KEY']
SOCIAL_AUTH_GOOGLE_OAUTH2_SECRET = os.environ['SOCIAL_AUTH_GOOGLE_OAUTH2_SECRET']


# S3 Static Configuration
AWS_REGION = os.environ.get('AWS_REGION', '')
AWS_ACCESS_KEY_ID = os.environ.get('AWS_ACCESS_KEY', '')
AWS_SECRET_ACCESS_KEY = os.environ.get('AWS_SECRET_KEY', '')
AWS_STORAGE_BUCKET_NAME = os.environ.get('S3_BUCKET', '')
AWS_S3_CALLING_FORMAT = "boto.s3.connection.OrdinaryCallingFormat"
AWS_PRELOAD_METADATA = True


if AWS_STORAGE_BUCKET_NAME:
    STATIC_URL = 'https://s3-%s.amazonaws.com:443/%s/static/' % (AWS_REGION, AWS_STORAGE_BUCKET_NAME)
    MEDIA_URL = 'https://s3-%s.amazonaws.com:443/%s/media/' % (AWS_REGION, AWS_STORAGE_BUCKET_NAME)
    STATICFILES_LOCATION = 'static'
    MEDIAFILES_LOCATION = 'media'
    STATICFILES_STORAGE = 'eurovisiontippning.settings.customstorages.StaticStorage'
    DEFAULT_FILE_STORAGE = 'eurovisiontippning.settings.customstorages.MediaStorage'
else:
    STATIC_URL = '/static/'
    MEDIA_URL = '/media/'


def get_static_memcache():
    from urllib.parse import urlparse

    if os.environ.get('REDIS_URL', ''):
        redis_url = urlparse(os.environ.get('REDIS_URL'))
        return {
            "BACKEND": "redis_cache.RedisCache",
            'TIMEOUT': None,
            "LOCATION": "{0}:{1}".format(redis_url.hostname, redis_url.port),
            "OPTIONS": {
                "PASSWORD": redis_url.password,
                "DB": 0,
            }
        }
    return {
        'BACKEND': 'django.core.cache.backends.locmem.LocMemCache',
        'TIMEOUT': None,
        'OPTIONS': {
            'MAX_ENTRIES': 5000
        }
    }

CACHES = {
    'default': {
        'BACKEND': 'django.core.cache.backends.locmem.LocMemCache'
    },
    'collectfast': get_static_memcache(),
}

COLLECTFAST_CACHE = 'collectfast'
