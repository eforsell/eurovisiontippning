from django import template

from sharing.models import BetShares

register = template.Library()


@register.simple_tag
def create_betshares(user):
    if user.is_authenticated:
        BetShares.objects.get_or_create(owner=user)

    return None
