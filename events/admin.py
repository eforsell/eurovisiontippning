from django.contrib import admin

from .models import Event, Competition, Entry, EntryScore


@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    date_hierarchy = 'start_date'
    list_display = ['city_name', 'country', 'year']
    list_filter = ['country']

    def year(self, obj):
        return obj.start_date.year


@admin.register(Competition)
class CompetitionAdmin(admin.ModelAdmin):
    date_hierarchy = 'start_time'
    list_display = ['competition_type', 'event', 'year']
    list_filter = ['competition_type']

    def year(self, obj):
        return obj.start_time.year


@admin.register(Entry)
class EntryAdmin(admin.ModelAdmin):
    list_display = ['song', 'artist', 'country', 'event']
    list_filter = ['country']

    def artist(self, obj):
        return obj.song.artist


@admin.register(EntryScore)
class EntryScoreAdmin(admin.ModelAdmin):
    list_display = ['entry', 'competition', 'start_order', 'points', 'rank']

    def artist(self, obj):
        return obj.song.artist
