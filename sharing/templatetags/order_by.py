from django.template import Library

register = Library()


@register.filter_function
def order_by_start_order(entries):
    entries = list(entries)
    entries.sort(key=lambda x: (x.start_order is None, x.start_order))
    return entries
