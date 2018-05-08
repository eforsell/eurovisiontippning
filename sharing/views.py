from django.contrib.auth.models import User
from django.shortcuts import render
from django.core.exceptions import ObjectDoesNotExist
from django.http import (HttpResponse, HttpResponseBadRequest)
from sharing.models import BetShares


def share_users(request):
    return render(request, 'users.html')


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
