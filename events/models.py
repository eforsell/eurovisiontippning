from django.db import models
from django_countries.fields import CountryField

from media.models import Song

COMPETITION_TYPE_DICT = {
    'SEMI1': 1,
    'SEMI2': 2,
    'FINAL': 3,
}

COMPETITION_TYPES = [
    (COMPETITION_TYPE_DICT['SEMI1'], 'Semifinal 1'),
    (COMPETITION_TYPE_DICT['SEMI1'], 'Semifinal 2'),
    (COMPETITION_TYPE_DICT['FINAL'], 'Grand final'),
]


class Event(models.Model):
    description = models.TextField(blank=True, default='')

    country = CountryField()
    city_name = models.CharField(max_length=128)
    start_date = models.DateField()

    created = models.DateTimeField(auto_now_add=True)
    modified = models.DateTimeField(auto_now=True)

    def __str__(self):
        return '%s %s' % (self.city_name,
                               self.start_date.year)


class Competition(models.Model):
    competition_type = models.IntegerField(choices=COMPETITION_TYPES,
                                           default=1)
    event = models.ForeignKey(Event,
                              on_delete=models.CASCADE)
    start_time = models.DateTimeField()

    published = models.BooleanField(default=False)

    def __str__(self):
        return self.get_competition_type_display()

    def complete_start_order(self):
        incomplete_count = (self.competitionentry_set
                                .filter(start_order__isnull=True)
                                .count())
        return incomplete_count == 0


class Entry(models.Model):
    event = models.ForeignKey(Event,
                              on_delete=models.CASCADE)
    country = CountryField()
    song = models.ForeignKey(Song,
                             on_delete=models.CASCADE)

    class Meta:
        verbose_name_plural = "entries"

    def __str__(self):
        return '%s - %s' % (self.country, self.event)


class EntryScore(models.Model):
    entry = models.ForeignKey(Entry,
                              on_delete=models.CASCADE)
    competition = models.ForeignKey(Competition,
                                    on_delete=models.CASCADE)

    start_order = models.PositiveIntegerField(blank=True, null=True)
    points = models.PositiveIntegerField(blank=True, null=True)
    rank = models.PositiveIntegerField(blank=True, null=True)
