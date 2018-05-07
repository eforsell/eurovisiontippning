from random import randint

from django.db import models

from django.contrib.auth.models import User


def get_share_code():
    return randint(100000000, 999999999)


class BetShares(models.Model):
    owner = models.OneToOneField(User,
                                 on_delete=models.CASCADE)

    share_bets = models.BooleanField(default=False)
    share_code = models.PositiveIntegerField(blank=True, null=True)

    follows = models.ManyToManyField(User,
                                     blank=True,
                                     related_name='followers')

    def save(self, **kwargs):
        if self.share_bets is True and self.share_code is None:
            self.share_code = get_share_code()

        if not self.share_bets and self.share_code is not None:
            self.share_code = None
            follower_betshares = BetShares.objects.filter(follows=self.owner)
            for betshare in follower_betshares:
                betshare.follows.remove(self.owner)

        super(BetShares, self).save()
