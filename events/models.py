from django.db import models
from django_countries.fields import CountryField

from media.models import Song


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


class Contest(models.Model):
    event = models.ForeignKey(Event,
                              on_delete=models.CASCADE)
    start_time = models.DateTimeField()

    published = models.BooleanField(default=False)

    def complete_start_order(self):
        incomplete_count = (self.entryscore_set
                                .filter(start_order__isnull=True)
                                .count())
        return incomplete_count == 0


class Final(Contest):
    def __str__(self):
        return "Final - %s" % (str(self.event))


class SemiFinal(Contest):
    order = models.PositiveIntegerField()
    progression_count = models.PositiveIntegerField()

    def __str__(self):
        return "Semifinal %s - %s" % (self.order, str(self.event))


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
    contest = models.ForeignKey(Contest,
                                on_delete=models.CASCADE)

    start_order = models.PositiveIntegerField(blank=True, null=True)
    points = models.PositiveIntegerField(blank=True, null=True)
    rank = models.PositiveIntegerField(blank=True, null=True)

    def __str__(self):
        return "Score for %s" % (str(self.entry))
