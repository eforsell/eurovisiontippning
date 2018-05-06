from django.db.models import Prefetch
from events.models import SemiFinal
from tippning.models import SemiBet, SemiScore, FinalBet, FinalScore


def create_semifinal_bets(entries, user):
    bets = []
    for entry in entries:
        sb, _ = SemiBet.objects.get_or_create(
            owner=user,
            entry=entry)
        bets.append(sb)
    return bets


def fetch_semifinal_data(order, user=None, create_bets=False):

    entries_bets = None
    entries = None
    bets = None
    has_bets = None
    points = None

    semi = (SemiFinal.objects
                     .filter(order=order)
                     .order_by('-start_time')
                     .prefetch_related(
                        'semientry_set',
                        'semientry_set__participant',
                        'semientry_set__participant__song__youtube',
                        Prefetch(
                            "semientry_set__semibet_set",
                            queryset=SemiBet.objects.filter(
                                owner=user
                                ),
                            to_attr='bets'
                            ),
                        Prefetch(
                            "semiscore_set",
                            queryset=SemiScore.objects.filter(
                                owner=user
                                )
                            )
                        ).first())

    entries = list(semi.semientry_set.all())
    entries.sort(key=lambda x: x.start_order)

    has_bets = False

    if semi.published:
        bets = [e.bets[0] for e in entries if len(e.bets) == 1]

        if len(bets) > 0:
            has_bets = True

        elif create_bets and not semi.has_started():
            bets = create_semifinal_bets(entries, user)
            has_bets = True

    if not has_bets:
        bets = [None] * len(entries)

    entries_bets = zip(entries, bets)

    points = semi_points(user, semi)

    data = {
        'semi': semi,
        'entries_bets': entries_bets,
        'entries': entries,
        'bets': bets,
        'has_bets': has_bets,
        'points': points
        }

    return data


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


def final_points_from_bets(user, final):
    total_entries = final.finalentry_set.count()

    if final.has_result():
        bets = (FinalBet.objects.filter(owner=user,
                                        entry__contest=final)
                                .prefetch_related('entry')
                                .order_by('entry__start_order'))
        points = 0
        for bet in bets:
            weight = 1 / (abs(bet.entry.rank - bet.rank) + 1)
            if bet.entry.rank == 1:
                rank_points = 100
            elif bet.entry.rank == 2:
                rank_points = 65
            elif bet.entry.rank == 3:
                rank_points = 45
            elif bet.entry.rank == 4:
                rank_points = 33
            elif bet.entry.rank == 5:
                rank_points = 25
            elif bet.entry.rank == 6:
                rank_points = 20
            elif bet.entry.rank == 7:
                rank_points = 15
            elif bet.entry.rank == 8:
                rank_points = 12
            elif bet.entry.rank == 9:
                rank_points = 9
            elif bet.entry.rank == 10:
                rank_points = 7
            elif bet.entry.rank == 11:
                rank_points = 6
            elif bet.entry.rank == total_entries:
                rank_points = 30
            else:
                rank_points = 5

            points += rank_points * weight

        finalscore = FinalScore(owner=user, contest=final, points=points)
        finalscore.save()

        return points

    return None


def final_points(user, final):
    if final.has_result():
        for finalscore in final.finalscore_set.all():
            if finalscore.owner == user:
                return finalscore.points

        return final_points_from_bets(user, final)
    else:
        return None
