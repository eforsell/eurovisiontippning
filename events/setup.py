import json
from datetime import datetime
import pytz

from media.models import YoutubeMedia, SpotifyMedia, Song, Artist
from .models import Event, Final, SemiFinal, Participant, FinalEntry, SemiEntry


def loadJson(year):
    data = open('events/data/eurovision_%s.json' % (str(year)))
    return json.load(data)


def addEvent(json):
    data = json['event']
    event, created = Event.objects.update_or_create(
        description=data['description'],
        city_name=data['city_name'],
        country=data['country'],
        start_date=data['start_date'],
    )

    return event


def addContests(json, event):
    semis = []

    for contest in json['contests']:
        timezone = pytz.timezone(contest['start_time']['timezone'])
        start_time_naive = datetime.strptime(contest['start_time']['time'],
                                             "%Y-%m-%d %H:%M:%S")
        start_time_aware = timezone.localize(start_time_naive)

        youtube, _ = YoutubeMedia.objects.get_or_create(
            video_id=contest['youtube']['id'],
            playlist_id=contest['youtube']['list'],
        )

        spotify, _ = SpotifyMedia.objects.get_or_create(
            urn=contest['spotify'],
        )

        if contest['type'] == 'semi':
            semi, created = SemiFinal.objects.update_or_create(
                event=event,
                start_time=start_time_aware,
                order=contest['order'],
                progression_count=contest['progression_count'],
                youtube=youtube,
                spotify=spotify
            )

            semis.append(semi)
        elif contest['type'] == 'final':
            final, created = Final.objects.update_or_create(
                event=event,
                start_time=start_time_aware,
                youtube=youtube,
                spotify=spotify
            )

    semis.sort(key=lambda x: x.order)

    return final, semis[0], semis[1]


def addEntries(json, event, final, semi1, semi2):
    for data in json['entries']:

        artist, _ = Artist.objects.get_or_create(
            name=data['participant']['song']['artist']['name'],
        )

        youtube, _ = YoutubeMedia.objects.get_or_create(
            video_id=data['participant']['song']['youtube']['id'],
            playlist_id=data['participant']['song']['youtube']['list'],
        )

        spotify, _ = SpotifyMedia.objects.get_or_create(
            urn=data['participant']['song']['spotify'],
        )

        song, _ = Song.objects.get_or_create(
            name=data['participant']['song']['name'],
            artist=artist,
            spotify=spotify,
            youtube=youtube

        )

        participant, _ = Participant.objects.update_or_create(
            event=event,
            country=data['participant']['country'],
            song=song
        )

        if data['contest'] == 'semi1':
            entry, created = SemiEntry.objects.update_or_create(
                contest=semi1,
                start_order=data['start_order'],
                participant=participant
            )

        elif data['contest'] == 'semi2':
            entry, created = SemiEntry.objects.update_or_create(
                contest=semi2,
                start_order=data['start_order'],
                participant=participant
            )

        elif data['contest'] == 'final':
            entry, created = FinalEntry.objects.update_or_create(
                contest=final,
                start_order=data['start_order'],
                participant=participant
            )


def addYear(year):
    json = loadJson(year)
    event = addEvent(json)
    final, semi1, semi2 = addContests(json, event)
    addEntries(json, event, final, semi1, semi2)
