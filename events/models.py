from datetime import datetime

from django.db import models
from django.utils.timezone import utc
from django_countries.fields import CountryField

from media.models import Song, YoutubeMedia, SpotifyMedia


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

    youtube = models.ForeignKey(YoutubeMedia,
                                on_delete=models.SET_NULL,
                                blank=True,
                                null=True)

    spotify = models.ForeignKey(SpotifyMedia,
                                on_delete=models.SET_NULL,
                                blank=True,
                                null=True)

    def complete_start_order(self):
        incomplete_count = (self.entryscore_set
                                .filter(start_order__isnull=True)
                                .count())
        return incomplete_count == 0

    def has_started(self):
        now = datetime.utcnow().replace(tzinfo=utc)
        return now > self.start_time

    def has_result(self, entries):
        return sum([1 for e in entries
                    if e.points is not None]) == len(entries)


class Final(Contest):
    has_semi_entries = models.BooleanField(default=False)

    def __str__(self):
        return "Final"

    def has_result(self):
        entries = self.finalentry_set.all()
        return super(Final, self).has_result(entries)


class SemiFinal(Contest):
    order = models.PositiveIntegerField()
    progression_count = models.PositiveIntegerField()

    def __str__(self):
        return "Semifinal %s" % (self.order)

    def has_result(self):
        progressed = 0
        entries = self.semientry_set.all()
        for e in entries:
            if e.progression:
                progressed += 1
        return progressed == self.progression_count


class Participant(models.Model):
    event = models.ForeignKey(Event,
                              on_delete=models.CASCADE)
    country = CountryField()
    song = models.ForeignKey(Song,
                             on_delete=models.CASCADE)

    def __str__(self):
        return '%s - %s' % (self.country, self.event)


class Entry(models.Model):
    participant = models.ForeignKey(Participant,
                                    on_delete=models.CASCADE)

    start_order = models.PositiveIntegerField(blank=True, null=True)
    points = models.PositiveIntegerField(blank=True, null=True)
    rank = models.PositiveIntegerField(blank=True, null=True)


class FinalEntry(Entry):
    contest = models.ForeignKey(Final,
                                on_delete=models.CASCADE)

    class Meta:
        verbose_name_plural = "final entries"

    def __str__(self):
        return "%s - %s" % (self.participant, self.contest)


class SemiEntry(Entry):
    contest = models.ForeignKey(SemiFinal,
                                on_delete=models.CASCADE)

    progression = models.BooleanField(default=False)

    class Meta:
        verbose_name_plural = "semi entries"

    def __str__(self):
        return "%s - %s" % (self.participant, self.contest)
