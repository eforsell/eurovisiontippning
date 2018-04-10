from django.db import models
from django.core.validators import MaxValueValidator
from django.contrib.auth.models import User

from events.models import Participant, FinalEntry, SemiEntry


class EntryBet(models.Model):
    owner = models.ForeignKey(User,
                              on_delete=models.CASCADE)

    def __str__(self):
        return "%s" % (self.owner)


class FinalBet(EntryBet):
    entry = models.ForeignKey(FinalEntry,
                              on_delete=models.CASCADE)
    rank = models.PositiveIntegerField(blank=True, null=True)


class SemiBet(EntryBet):
    entry = models.ForeignKey(SemiEntry,
                              on_delete=models.CASCADE)
    progression = models.BooleanField(default=False)


class ParticipantReview(models.Model):
    owner = models.ForeignKey(User,
                              on_delete=models.CASCADE)
    participant = models.ForeignKey(Participant,
                                    on_delete=models.CASCADE)
    own_score = models.PositiveIntegerField(default=0, validators=[
        MaxValueValidator(10)])
