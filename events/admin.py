from django.contrib import admin

from .models import Event, Final, SemiFinal, Participant, FinalEntry, SemiEntry


@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    date_hierarchy = 'start_date'
    list_display = ['city_name', 'country', 'year']
    list_filter = ['country']

    def year(self, obj):
        return obj.start_date.year


@admin.register(Final)
class FinalAdmin(admin.ModelAdmin):
    date_hierarchy = 'start_time'
    list_display = ['event', 'year']

    def year(self, obj):
        return obj.start_time.year


@admin.register(SemiFinal)
class SemiFinalAdmin(admin.ModelAdmin):
    date_hierarchy = 'start_time'
    list_display = ['order', 'event', 'year']
    list_filter = ['order']

    def year(self, obj):
        return obj.start_time.year


@admin.register(Participant)
class ParticipantAdmin(admin.ModelAdmin):
    list_display = ['song', 'artist', 'country', 'event']
    list_filter = ['country', 'event']

    def artist(self, obj):
        return obj.song.artist


@admin.register(FinalEntry)
class FinalEntryAdmin(admin.ModelAdmin):
    list_display = ['participant', 'contest', 'start_order', 'points', 'rank']
    list_filter = ['contest']

    def artist(self, obj):
        return obj.song.artist


def make_progressed(modeladmin, request, queryset):
    queryset.update(progression=True)
make_progressed.short_description = "Mark entries as progressed"


@admin.register(SemiEntry)
class SemiEntryAdmin(admin.ModelAdmin):
    list_display = ['participant', 'contest', 'event', 'start_order', 'points',
                    'rank', 'progression']
    list_filter = ['contest__order', 'contest__event']
    search_fields = ('contest', 'contest__event')
    actions = [make_progressed]

    def event(self, obj):
            return (str(obj.contest.event))

    def artist(self, obj):
        return obj.song.artist
