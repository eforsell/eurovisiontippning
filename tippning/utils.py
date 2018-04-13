from tippning.models import SemiBet, SemiScore


def semi_points_from_bets(user, semifinal):

    if semifinal.has_result():
        bets = (SemiBet.objects.filter(owner=user,
                                       entry__contest=semifinal)
                               .prefetch_related('entry')
                               .order_by('entry__start_order'))
        points = 0
        for bet in bets:
            if bet.progression and bet.entry.progression:
                points += 1

        semiscore = SemiScore(owner=user, contest=semifinal, points=points)
        semiscore.save()

        return points

    return None


def semi_points(user, semifinal):
    if semifinal.has_result():
        for semiscore in semifinal.semiscore_set.all():
            if semiscore.owner == user:
                return semiscore.points

        return semi_points_from_bets(user, semifinal)
    else:
        return None
