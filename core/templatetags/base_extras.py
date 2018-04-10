from django import template
from django.urls import reverse

register = template.Library()


@register.simple_tag
def navactive(request, urls, *args, **kwargs):
    if request.path in (
            reverse(url, args=args, kwargs=kwargs) for url in urls.split()):
        return "active"
    return ""
