from datetime import datetime

from django.db import models
from django.utils import timezone
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
        now = datetime.utcnow().replace(tzinfo=timezone.utc)
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
        ranked_entries = [e for e in entries if e.rank is not None]
        return len(entries) == len(ranked_entries)

    def add_semientries(self):
        semifinals = (SemiFinal.objects.filter(event=self.event)
                                       .prefetch_related(
                                        'semientry_set'
                                        ))

        semi_results = []
        for semi in semifinals:
            has_result = semi.has_result()
            semi_results.append(has_result)
            if has_result:
                semientries = semi.semientry_set.all()
                for semientry in semientries:
                    if semientry.progression:
                        finalentry, _ = FinalEntry.objects.get_or_create(
                            participant=semientry.participant,
                            contest=self)

        if all(semi_results):
            self.has_semi_entries = True
            self.save()

    def update_start_order(self):
        entries = self.finalentry_set.all()
        for entry in entries:

            if entry.start_order is None:
                entry.input_start_order()
            else:
                print("Current start order for %s is %s." %
                      (entry.participant.country.name, entry.start_order))
                try:
                    update = str(input("Do you want to update (y/N)? "))
                    if update.lower() == "y":
                        entry.input_start_order()
                    elif update.lower() == "n":
                        continue
                except ValueError:
                    print("Sorry, I didn't understand that.")
                    continue

            print("")

    def update_rank(self):
        entries = self.finalentry_set.all().order_by('start_order')
        for entry in entries:

            if entry.rank is None:
                entry.input_rank()
            else:
                print("Current final rank for %s. %s is %s." %
                      (entry.start_order,
                       entry.participant.country.name,
                       entry.rank))
                try:
                    update = str(input("Do you want to update (y/N)? "))
                    if update.lower() == "y":
                        entry.input_rank()
                    elif update.lower() == "n":
                        continue
                except ValueError:
                    print("Sorry, I didn't understand that.")
                    continue

            print("")


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

    def input_start_order(self):
        country_name = self.participant.country.name
        while True:
            try:
                new_order = input("Input start order for %s: " %
                                  (country_name))

                if new_order.lower() == "q":
                    return None
                else:
                    new_order = int(new_order)
            except ValueError:
                print("Sorry, I didn't understand that.")
                continue
            else:
                break

        self.start_order = new_order
        self.save()

    def input_rank(self):
        while True:
            try:
                new_rank = input("Input final rank for %s. %s: " %
                                 (self.start_order,
                                  self.participant.country.name))

                if new_rank.lower() == "q":
                    return None
                else:
                    new_rank = int(new_rank)
            except ValueError:
                print("Sorry, I didn't understand that.")
                continue
            else:
                break

        self.rank = new_rank
        self.save()


class SemiEntry(Entry):
    contest = models.ForeignKey(SemiFinal,
                                on_delete=models.CASCADE)

    progression = models.BooleanField(default=False)

    class Meta:
        verbose_name_plural = "semi entries"

    def __str__(self):
        return "%s - %s" % (self.participant, self.contest)
