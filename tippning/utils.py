from tippning.models import SemiBet


def semi_points(user, semifinal):
    bets = (SemiBet.objects.filter(owner=user,
                                   entry__contest=semifinal)
                           .prefetch_related('entry')
                           .order_by('entry__start_order'))

    if semifinal.has_result():
        points = 0
        for bet in bets:
            if bet.progression and bet.entry.progression:
                points += 1

        return points

    return None
