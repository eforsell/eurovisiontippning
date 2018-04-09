from django import template
from django.core.exceptions import ObjectDoesNotExist

register = template.Library()


@register.simple_tag
def get_social_data(user, key):
    if user.is_authenticated:
        try:
            social_user = user.social_auth.get()
        except ObjectDoesNotExist:
            return None

    try:
        data = social_user.extra_data[key]
        return data
    except KeyError:
        return None
