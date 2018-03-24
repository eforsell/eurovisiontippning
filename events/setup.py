from .models import EventType
from django.core.exceptions import ObjectDoesNotExist


def setup():
    event_types = [
        ('Semifinal 1', ''),
        ('Seminfinal 2', ''),
        ('Final', '')
    ]

    for et in event_types:
        try:
            event_type = EventType.objects.get(name=et[0])
        except ObjectDoesNotExist:
            event_type = EventType(name=et[0], description=et[1])
            event_type.save()
