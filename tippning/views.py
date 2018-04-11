from django.shortcuts import render
from django.core.exceptions import ObjectDoesNotExist
from django.http import HttpResponse, HttpResponseBadRequest, JsonResponse

from events.models import SemiFinal
from tippning.models import SemiBet


def semifinal(request, order):

    semi = (SemiFinal.objects
                     .filter(order=order)
                     .order_by('-start_time')
                     .prefetch_related(
                        'semientry_set'
                        )
                     .get())
    entries = (semi.semientry_set
                   .order_by('start_order')
                   .prefetch_related(
                        'participant',
                        'participant__song__youtube'
                        ))

    has_bets = False

    if request.user.is_authenticated and semi.published:
        bets = (SemiBet.objects.filter(owner=request.user,
                                       entry__contest=semi)
                               .order_by('entry__start_order'))

        if not (len(bets) == 0 and semi.has_started()):
            has_bets = True

            if len(bets) == 0 and not semi.has_started():
                # Create bets if there are none already:
                bets = []
                for entry in entries:
                    sb, _ = SemiBet.objects.get_or_create(owner=request.user,
                                                          entry=entry)
                    bets.append(sb)

    else:
        bets = [None] * len(entries)

    entries_bets = zip(entries, bets)
    # entry.participant.song.youtube.video_id
    # entry.participant.country.name

    # result
    # bet, bet.points
    # total_points

    return render(request, 'semifinal.html', {
        'semi': semi,
        'entries_bets': entries_bets,
        'entries': entries,
        'bets': bets,
        'has_bets': has_bets
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

    return render(request, 'final.html', {

        })


def tips(request):

    return render(request, 'tips.html', {

        })
