from django.shortcuts import render
from django.contrib.auth.models import User
from django.http import (HttpResponse, HttpResponseBadRequest)

from events.models import Final
from tippning.models import SemiBet, FinalBet
from tippning.utils import fetch_semifinal_data, fetch_final_data


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


def update_semibet(request):
    if request.method == 'POST' and request.user.is_authenticated:
        semibet_id = request.POST.get('semibet_id')
        semibet = SemiBet.objects.get(id=semibet_id)
        if semibet.entry.contest.has_started():
            return HttpResponseBadRequest('Semifinal has started')
        semibet.progression = (not semibet.progression)
        semibet.save()
        return HttpResponse('Semifinal bet updated!')
    return HttpResponseBadRequest('Only accepts post')


def friend_semi_lineup(request, order, user_id):
    user = User.objects.get(id=user_id)
    semi_data = fetch_semifinal_data(order, user)

    if not semi_data['semi'].has_started():
        message = (
            '<div class="alert alert-warning" role="alert">'
            '<i style="margin-right:10px;" class="fa fa-clock-o fa-lg"></i>'
            'Tippningen är fortfarande öppen.</div>')
        return HttpResponse(message)

    if not semi_data['has_bets']:
        message = (
            '<div class="alert alert-warning" role="alert">'
            '<i style="margin-right:10px;" class="fa fa-user-times"></i>'
            'Användaren har inte tippat i denna deltävling.</div>')
        return HttpResponse(message)

    return HttpResponse(
        render(request, 'includes/semi_lineup.html', {
            'semi': semi_data['semi'],
            'entries_bets': semi_data['entries_bets'],
            'entries': semi_data['entries'],
            'bets': semi_data['bets'],
            'has_bets': semi_data['has_bets'],
            'points': semi_data['points'],
            'correct_progressions': semi_data['correct_progressions'],
            'selected_progressions': semi_data['selected_progressions'],
            'youtube': False,
            'ajax': True,
            })
        )


def final(request):

    if request.user.is_authenticated:
        owner = request.user
    else:
        owner = None

    final_data = fetch_final_data(owner, create_bets=True)

    return render(request, 'final.html', {
        'final': final_data['final'],
        'entries': final_data['entries'],
        'has_bets': final_data['has_bets'],
        'points': final_data['points'],
        })


def update_finalbet(request):
    if request.method == 'POST' and request.user.is_authenticated:
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


def friend_final_lineup(request, user_id):
    user = User.objects.get(id=user_id)
    final_data = fetch_final_data(user)

    if not final_data['final'].has_started():
        message = (
            '<div class="alert alert-warning" role="alert">'
            '<i style="margin-right:10px;" class="fa fa-clock-o fa-lg"></i>'
            'Tippningen är fortfarande öppen.</div>')
        return HttpResponse(message)

    if not final_data['has_bets']:
        message = (
            '<div class="alert alert-warning" role="alert">'
            '<i style="margin-right:10px;" class="fa fa-user-times"></i>'
            'Användaren har inte tippat i denna deltävling.</div>')
        return HttpResponse(message)

    return HttpResponse(
        render(request, 'includes/final_lineup.html', {
                'final': final_data['final'],
                'entries': final_data['entries'],
                'has_bets': final_data['has_bets'],
                'points': final_data['points'],
                'youtube': False,
                'ajax': True,
                })
        )


def share_users(request):
    return render(request, 'sharing/users.html')


def tips(request):
    return render(request, 'tips.html')


def points(request):
    return render(request, 'points.html')
