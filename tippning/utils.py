from django.db.models import Prefetch
from events.models import SemiFinal, Final
from tippning.models import SemiBet, SemiScore, FinalBet, FinalScore


def create_semifinal_bets(entries, user):
    bets = []
    for entry in entries:
        sb, _ = SemiBet.objects.get_or_create(
            owner=user,
            entry=entry)
        bets.append(sb)
    return bets


def create_final_bets(entries, user):
    bets = []
    for entry in entries:
        sb, _ = FinalBet.objects.get_or_create(
                                    owner=user,
                                    entry=entry,
                                    rank=entry.start_order)
        bets.append(sb)
    return bets


def fetch_semifinal_data(order, user=None, create_bets=False):

    entries_bets = None
    entries = None
    bets = None
    has_bets = None
    points = None
    correct_progressions = None
    selected_progressions = None

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

    if user is not None:
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

        if has_bets:
            selected_progressions = len(
                [b for b in bets if b.progression is True])
        else:
            selected_progressions = 0

        entries_bets = zip(entries, bets)

        points, correct_progressions = semi_points(user, semi)

    data = {
        'semi': semi,
        'entries_bets': entries_bets,
        'entries': entries,
        'bets': bets,
        'has_bets': has_bets,
        'points': points,
        'correct_progressions': correct_progressions,
        'selected_progressions': selected_progressions,
        }

    return data


def fetch_final_data(user=None, create_bets=False):

    entries = None
    has_bets = None
    points = None

    final = (Final.objects
                  .order_by('-start_time')
                  .prefetch_related(
                     'finalentry_set',
                     'finalentry_set__participant',
                     'finalentry_set__participant__song__youtube',
                     Prefetch(
                         "finalentry_set__finalbet_set",
                         queryset=FinalBet.objects.filter(
                             owner=user
                             ),
                         to_attr='bets'
                         ),
                     Prefetch(
                         "finalscore_set",
                         queryset=FinalScore.objects.filter(
                             owner=user
                             )
                         )
                     ).first())

    if user is not None:
        entries = list(final.finalentry_set.all())

        has_bets = False
        had_bets = False

        if final.has_semi_entries:
            bets = [e.bets[0] for e in entries if len(e.bets) == 1]

            if len(bets) > 0:
                has_bets = True
                had_bets = True

            elif create_bets and not final.has_started():
                bets = create_final_bets(entries, user)
                has_bets = True

        if not has_bets:
            bets = [None] * len(entries)

        if had_bets:
            entries.sort(key=lambda x: (x.bets[0].rank is None,
                                        x.start_order is None,
                                        x.bets[0].rank,
                                        x.start_order))
        else:
            entries.sort(key=lambda x: (x.start_order is None, x.start_order))

        points = final_points(user, final)

    data = {
        'final': final,
        'entries': entries,
        'has_bets': has_bets,
        'points': points,
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
                points += 3

        semiscore = SemiScore(owner=user, contest=semifinal, points=points)
        semiscore.save()

        return points

    return None


def semi_points(user, semifinal):
    points = None
    correct = None
    if semifinal.has_result():
        for semiscore in semifinal.semiscore_set.all():
            if semiscore.owner == user:
                points = semiscore.points
                break

        if points is None:
            points = semi_points_from_bets(user, semifinal)

        correct = int(points/3)

    return points, correct


def final_points_from_bets(user, final):
    total_entries = final.finalentry_set.count()

    if final.has_result():
        bets = (FinalBet.objects.filter(owner=user,
                                        entry__contest=final)
                                .prefetch_related('entry')
                                .order_by('entry__start_order'))
        points = 0
        for bet in bets:
            if bet is not None:
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


def fetch_results(user, final=None, semis=None):
    if final is None:
        final = (Final.objects
                      .order_by('-start_time')
                      .prefetch_related(
                        "event",
                        "finalentry_set",
                        Prefetch(
                            "finalscore_set",
                            queryset=FinalScore.objects.filter(
                                owner=user
                                ).select_related(
                                'score_ptr',
                                'owner'
                                )
                            ))
                      .first())

    if semis is None:
        semis = (SemiFinal.objects
                          .filter(event=final.event)
                          .prefetch_related(
                            "semientry_set",
                            Prefetch(
                                "semiscore_set",
                                queryset=SemiScore.objects.filter(
                                    owner=user
                                    ).select_related(
                                    'score_ptr',
                                    'owner'
                                    )
                                ))
                          .order_by('order'))

    if user is not None:
        tot = 0
        fp = final_points(user, final)
        if fp is not None:
            tot += fp
        s1p, _ = semi_points(user, semis[0])
        if s1p is not None:
            tot += s1p
        s2p, _ = semi_points(user, semis[1])
        if s2p is not None:
            tot += s2p
        fp = final_points(user, final)
        s1p, _ = semi_points(user, semis[0])
        s2p, _ = semi_points(user, semis[1])
    else:
        fp = None
        s1p = None
        s2p = None

    data = {
        'final': {
            'contest': final,
            'points': fp
        },
        'semi1': {
            'contest': semis[0],
            'points': s1p
        },
        'semi2': {
            'contest': semis[1],
            'points': s2p
        },
        'total_points': tot
    }

    return data
