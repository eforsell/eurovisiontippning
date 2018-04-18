from django.shortcuts import render
from django.db.models import Prefetch
from django.core.exceptions import ObjectDoesNotExist
from django.http import (HttpResponse, HttpResponseRedirect,
                         HttpResponseBadRequest, JsonResponse)

from events.models import Event, SemiFinal, Final
from tippning.models import SemiBet, FinalBet, SemiScore, FinalScore
from tippning.utils import semi_points


def semifinal(request, order):

    entries_bets = None
    entries = None
    bets = None
    has_bets = None
    points = None

    if request.user.is_authenticated:
        owner = request.user
    else:
        owner = None

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
                                owner=owner
                                ),
                            to_attr='bets'
                            ),
                        Prefetch(
                            "semiscore_set",
                            queryset=SemiScore.objects.filter(
                                owner=owner
                                )
                            )
                        ).first())

    if request.user.is_authenticated:

        entries = list(semi.semientry_set.all())
        entries.sort(key=lambda x: x.start_order)

        has_bets = False

        if semi.published:
            bets = [e.bets[0] for e in entries if len(e.bets) == 1]

            if not (len(bets) == 0 and semi.has_started()):
                has_bets = True

                if len(bets) == 0 and not semi.has_started():
                    # Create bets if there are none already:
                    bets = []
                    for entry in entries:
                        sb, _ = SemiBet.objects.get_or_create(owner=request.user,
                                                              entry=entry)

                    return HttpResponseRedirect("")

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

    entries = None
    has_bets = None

    if request.user.is_authenticated:
        owner = request.user
    else:
        owner = None

    final = (Final.objects
                  .order_by('-start_time')
                  .prefetch_related(
                     'finalentry_set',
                     'finalentry_set__participant',
                     'finalentry_set__participant__song__youtube',
                     Prefetch(
                         "finalentry_set__finalbet_set",
                         queryset=FinalBet.objects.filter(
                             owner=owner
                             ),
                         to_attr='bets'
                         ),
                     Prefetch(
                         "finalscore_set",
                         queryset=FinalScore.objects.filter(
                             owner=owner
                             )
                         )
                     ).first())

    if request.user.is_authenticated:
        entries = list(final.finalentry_set.all())

        has_bets = False

        if final.has_semi_entries:
            bets = [e.bets[0] for e in entries if len(e.bets) == 1]

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

                    return HttpResponseRedirect("")

        else:
            bets = [None] * len(entries)

        if any(bets):
            entries.sort(key=lambda x: (x.bets[0].rank is None,
                                        x.start_order is None,
                                        x.start_order))
        else:
            entries.sort(key=lambda x: (x.start_order is None, x.start_order))

    return render(request, 'final.html', {
        'final': final,
        'entries': entries,
        'has_bets': has_bets
        })


def update_finalbet(request):
    if request.method == 'POST' or not request.user.is_authenticated:
        entry_order = request.POST.getlist('entry_order[]')
        entry_order = [int(x) for x in entry_order]

        final_id = request.POST.get('final_id')
        finalbets = FinalBet.objects.filter(entry__contest__id=final_id,
                                            owner=request.user)

        for bet in finalbets:
            entry_rank = entry_order.index(bet.entry.id) + 1
            if bet.rank != entry_rank:
                bet.rank = entry_rank
                bet.save()

        return HttpResponse('Final order updated!')
    return HttpResponseBadRequest('Only accepts post')


def tips(request):
    return render(request, 'tips.html')


def points(request):
    return render(request, 'points.html')
