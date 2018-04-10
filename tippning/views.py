from django.shortcuts import render
from django.core.exceptions import ObjectDoesNotExist

from events.models import SemiFinal


def semifinal(request, order):

    semi = SemiFinal.objects.filter(order=order).order_by('-start_time').get()
    entries = semi.semientry_set.order_by('start_order')
    # entry.participant.song.youtube.video_id
    # entry.participant.country.name

    # result
    # bet, bet.points
    # total_points

    return render(request, 'semifinal.html', {
        'semi': semi,
        'entries': entries,
        })


def final(request):

    return render(request, 'final.html', {

        })


def tips(request):

    return render(request, 'tips.html', {

        })
