from django.contrib.auth.models import User
from django.db.models import Prefetch
from django.shortcuts import render
from django.core.exceptions import ObjectDoesNotExist
from django.http import (HttpResponse, HttpResponseBadRequest)
from events.models import SemiFinal, Final
from tippning.models import SemiBet, FinalBet, SemiScore, FinalScore
from tippning.utils import semi_points, final_points
from sharing.models import BetShares


def share_users(request):
    return render(request, 'users.html')


def share_contests(request):
    if request.user.is_authenticated:
        user = request.user
        friends = user.betshares.follows.all()
        user_ids = [user.id] + [f.id for f in friends]
    else:
        user = None
        user_ids = [None]

    semi1 = (SemiFinal.objects
                      .filter(order=1)
                      .order_by('-start_time')
                      .prefetch_related(
                         'semientry_set',
                         'semientry_set__participant',
                         Prefetch(
                             "semientry_set__semibet_set",
                             queryset=(SemiBet.objects
                                              .filter(
                                                owner_id__in=user_ids,
                                                progression=True
                                                )
                                              .prefetch_related(
                                                'owner',
                                                'owner__social_auth',
                                                  )
                                       ),
                             to_attr='bets'
                             )
                         ).first())

    semi2 = (SemiFinal.objects
                      .filter(order=2)
                      .order_by('-start_time')
                      .prefetch_related(
                         'semientry_set',
                         'semientry_set__participant',
                         Prefetch(
                             "semientry_set__semibet_set",
                             queryset=(SemiBet.objects
                                              .filter(
                                                owner_id__in=user_ids,
                                                progression=True
                                                )
                                              .prefetch_related(
                                                'owner',
                                                'owner__social_auth',
                                                  )
                                       ),
                             to_attr='bets'
                             )
                         ).first())

    final = (Final.objects
                  .order_by('-start_time')
                  .prefetch_related(
                     'finalentry_set',
                     'finalentry_set__participant',
                     Prefetch(
                         "finalentry_set__finalbet_set",
                         queryset=(FinalBet.objects
                                           .filter(
                                             owner_id__in=user_ids,
                                             )
                                           .prefetch_related(
                                             'owner',
                                             'owner__social_auth',
                                               )
                                   ),
                         to_attr='bets'
                         )
                     ).first())

    return render(request, 'contests.html', {
        'semi1': semi1,
        'semi2': semi2,
        'final': final,
        'youtube': False
        })


def share_results(request):
    if request.user.is_authenticated:
        user = request.user
        friends = user.betshares.follows.prefetch_related('social_auth').all()
        user_ids = [user.id] + [f.id for f in friends]
    else:
        return render(request, 'friend_results.html')

    final = (Final.objects
                  .order_by('-start_time')
                  .prefetch_related(
                    "event",
                    "finalentry_set",
                    Prefetch(
                        "finalscore_set",
                        queryset=FinalScore.objects.filter(
                            owner_id__in=user_ids
                            ).select_related(
                            'score_ptr',
                            'owner'
                            )
                        ))
                  .first())

    semis = (SemiFinal.objects
                      .filter(event=final.event)
                      .prefetch_related(
                        "semientry_set",
                        Prefetch(
                            "semiscore_set",
                            queryset=SemiScore.objects.filter(
                                owner_id__in=user_ids
                                ).select_related(
                                'score_ptr',
                                'owner',
                                )
                            ))
                      .order_by('order'))

    semi1 = semis[0]
    semi2 = semis[1]

    friend_data = []
    for friend in [user] + list(friends):
        tot = 0
        fp = final_points(friend, final)
        if fp is not None:
            tot += fp
        s1p, _ = semi_points(friend, semi1)
        if s1p is not None:
            tot += s1p
        s2p, _ = semi_points(friend, semi2)
        if s2p is not None:
            tot += s2p

        try:
            photo = friend.social_auth.all()[0].extra_data['photo']
        except:
            photo = None

        data = {
            'friend': friend,
            'photo': photo,
            'semi1': s1p,
            'semi2': s2p,
            'final': fp,
            'total': tot
        }

        friend_data.append(data)

    friend_data.sort(key=lambda x: (-x['total']))

    return render(request, 'friend_results.html', {
        'friend_data': friend_data,
        'final': final,
        'semi1': semis[0],
        'semi2': semis[1]
        })


def update_betshares(request):
    if request.method == 'POST' and request.user.is_authenticated:
        try:
            betshares = request.user.betshares
        except ObjectDoesNotExist:
            betshares = BetShares(owner=request.user)

        share_bets = request.POST.get('share_bets')
        if share_bets == "true":
            share_bets = True
        elif share_bets == "false":
            share_bets = False

        betshares.share_bets = share_bets
        betshares.save()

        if share_bets:
            return HttpResponse(
                '<p class="share-list">Min delningskod:</p>'
                '<div class="input-group input-group-sm">'
                '<input id="shareid" class="form-control" readonly="readonly" '
                'onClick="this.setSelectionRange(0, this.value.length)" '
                'value="%s"/></div>' % (betshares.share_code))
        else:
            return HttpResponse('')

    return HttpResponseBadRequest('Only accepts post')


def add_follow(request):
    if request.method == 'POST' and request.user.is_authenticated:
        share_code = request.POST.get('share_code')
        share_code = int(share_code)
        try:
            betshare = BetShares.objects.get(share_code=share_code)
        except ObjectDoesNotExist:
            return HttpResponseBadRequest('Incorrect code')

        friend = betshare.owner
        try:
            betshares = request.user.betshares
        except ObjectDoesNotExist:
            betshares = BetShares(owner=request.user)
            betshares.save()

        betshares.follows.add(friend)

        return HttpResponse('Success!')

    return HttpResponseBadRequest('Only accepts post')


def remove_follow(request):
    if request.method == 'POST' and request.user.is_authenticated:
        friend_id = request.POST.get('user_id')
        friend = User.objects.get(id=friend_id)

        betshare = request.user.betshares
        betshare.follows.remove(friend)

        return HttpResponse('Success!')

    return HttpResponseBadRequest('Only accepts post')
