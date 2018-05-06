from django.shortcuts import render
from django.db.models import Prefetch
from django.contrib.auth.models import User
from django.http import (HttpResponse, HttpResponseRedirect,
                         HttpResponseBadRequest)

from events.models import Final
from tippning.models import SemiBet, FinalBet, FinalScore
from tippning.utils import fetch_semifinal_data, final_points


def semifinal(request, order):

    if request.user.is_authenticated:
        owner = request.user
    else:
        owner = None

    semi_data = fetch_semifinal_data(order, owner, create_bets=True)

    return render(request, 'semifinal.html', {
        'semi': semi_data['semi'],
        'entries_bets': semi_data['entries_bets'],
        'entries': semi_data['entries'],
        'bets': semi_data['bets'],
        'has_bets': semi_data['has_bets'],
        'points': semi_data['points'],
        })


def semifinal_lineup(request, order, user_id):
    user = User.objects.get(id=user_id)
    semi_data = fetch_semifinal_data(order, user)

    return HttpResponse(
        render(request, 'includes/semi_lineup.html', {
            'semi': semi_data['semi'],
            'entries_bets': semi_data['entries_bets'],
            'entries': semi_data['entries'],
            'bets': semi_data['bets'],
            'has_bets': semi_data['has_bets'],
            'points': semi_data['points'],
            })
        )


def update_semibet(request):
    if request.method == 'POST' or not request.user.is_authenticated:
        semibet_id = request.POST.get('semibet_id')
        semibet = SemiBet.objects.get(id=semibet_id)
        if semibet.entry.contest.has_started():
            return HttpResponseBadRequest('Semifinal has started')
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

                    return HttpResponseRedirect(request.path_info)

        else:
            bets = [None] * len(entries)

        if any(bets):
            entries.sort(key=lambda x: (x.bets[0].rank is None,
                                        x.start_order is None,
                                        x.bets[0].rank,
                                        x.start_order))
        else:
            entries.sort(key=lambda x: (x.start_order is None, x.start_order))

    points = final_points(request.user, final)

    return render(request, 'final.html', {
        'final': final,
        'entries': entries,
        'has_bets': has_bets,
        'points': points
        })


def update_finalbet(request):
    if request.method == 'POST' or not request.user.is_authenticated:
        entry_order = request.POST.getlist('entry_order[]')
        entry_order = [int(x) for x in entry_order]

        final_id = request.POST.get('final_id')
        final = Final.objects.get(id=final_id)
        if final.has_started():
            return HttpResponseBadRequest('Final has started')
        finalbets = FinalBet.objects.filter(entry__contest__id=final_id,
                                            owner=request.user)

        for bet in finalbets:
            entry_rank = entry_order.index(bet.entry.id) + 1
            if bet.rank != entry_rank:
                bet.rank = entry_rank
                bet.save()

        return HttpResponse('Final order updated!')
    return HttpResponseBadRequest('Only accepts post')


def share_users(request):
    return render(request, 'sharing/users.html')


def tips(request):
    return render(request, 'tips.html')


def points(request):
    return render(request, 'points.html')
