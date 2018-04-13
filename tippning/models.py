from django.db import models
from django.core.validators import MaxValueValidator
from django.contrib.auth.models import User

from events.models import Participant, Final, SemiFinal, FinalEntry, SemiEntry


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

    def points(self):
        if self.entry.progression is not None:
            return 1 if self.entry.progression == self.progression else 0
        else:
            return None


class ParticipantReview(models.Model):
    owner = models.ForeignKey(User,
                              on_delete=models.CASCADE)
    participant = models.ForeignKey(Participant,
                                    on_delete=models.CASCADE)
    own_score = models.PositiveIntegerField(default=0, validators=[
        MaxValueValidator(10)])


class Score(models.Model):
    owner = models.ForeignKey(User,
                              on_delete=models.CASCADE)
    points = models.PositiveIntegerField()

    def __str__(self):
        return "%s" % (self.owner)


class SemiScore(Score):
    contest = models.ForeignKey(SemiFinal,
                                on_delete=models.CASCADE)


class FinalScore(Score):
    contest = models.ForeignKey(Final,
                                on_delete=models.CASCADE)
