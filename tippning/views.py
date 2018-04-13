from django.shortcuts import render
from django.db.models import Prefetch
from django.core.exceptions import ObjectDoesNotExist
from django.http import HttpResponse, HttpResponseBadRequest, JsonResponse

from events.models import Event, SemiFinal, Final
from tippning.models import SemiBet, FinalBet, SemiScore, FinalScore
from tippning.utils import semi_points


def semifinal(request, order):

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
                                owner=request.user
                                ),
                            to_attr='bets'
                            ),
                        Prefetch(
                            "semiscore_set",
                            queryset=SemiScore.objects.filter(
                                owner=request.user
                                )
                            )
                        ).first())

    entries = list(semi.semientry_set.all())
    entries.sort(key=lambda x: x.start_order)

    has_bets = False

    if request.user.is_authenticated and semi.published:
        bets = [e.bets[0] for e in entries if len(e.bets) == 1]

        if not (len(bets) == 0 and semi.has_started()):
            has_bets = True

            if len(bets) == 0 and not semi.has_started():
                # Create bets if there are none already:
                bets = []
                for entry in entries:
                    sb, _ = SemiBet.objects.get_or_create(owner=request.user,
                                                          entry=entry)
                    bets.append(sb)

    if not has_bets:
        bets = [None] * len(entries)

    entries_bets = zip(entries, bets)

    points = semi_points(request.user, semi)

    return render(request, 'semifinal.html', {
        'semi': semi,
        'entries_bets': entries_bets,
        'entries': entries,
        'bets': bets,
        'has_bets': has_bets,
        'points': points
        })


def update_semibet(request):
    if request.method == 'POST' or not request.user.is_authenticated:
        semibet_id = request.POST.get('semibet_id')
        semibet = SemiBet.objects.get(id=semibet_id)
        semibet.progression = (not semibet.progression)
        semibet.save()
        return HttpResponse('Semifinal bet updated!')
    return HttpResponseBadRequest('Only accepts post')


def final(request):

    final = (Final.objects
                  .order_by('-start_time')
                  .prefetch_related(
                     'finalentry_set'
                     )
                  .first())
    entries = (final.finalentry_set
                    .order_by('start_order')
                    .prefetch_related(
                        'participant',
                        'participant__song__youtube'
                        ))

    has_bets = False

    if request.user.is_authenticated and final.has_semi_entries:
        bets = (FinalBet.objects.filter(owner=request.user,
                                        entry__contest=final)
                                .order_by('rank'))

        if not (len(bets) == 0 and final.has_started()):
            has_bets = True

            if len(bets) == 0 and not final.has_started():
                # Create bets if there are none already:
                bets = []
                for entry in entries:
                    sb, _ = FinalBet.objects.get_or_create(
                                                owner=request.user,
                                                entry=entry,
                                                rank=entry.start_order)
                    bets.append(sb)

    else:
        bets = [None] * len(entries)

    entries_bets = zip(entries, bets)

    return render(request, 'final.html', {
        'final': final,
        'entries_bets': entries_bets,
        'entries': entries,
        'bets': bets,
        'has_bets': has_bets
        })


def tips(request):

    return render(request, 'tips.html', {

        })
