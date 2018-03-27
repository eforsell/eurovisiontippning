from django.contrib import admin

from .models import Event, Final, SemiFinal, Entry, EntryScore


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


@admin.register(Entry)
class EntryAdmin(admin.ModelAdmin):
    list_display = ['song', 'artist', 'country', 'event']
    list_filter = ['country']

    def artist(self, obj):
        return obj.song.artist


@admin.register(EntryScore)
class EntryScoreAdmin(admin.ModelAdmin):
    list_display = ['entry', 'contest', 'start_order', 'points', 'rank']

    def artist(self, obj):
        return obj.song.artist
