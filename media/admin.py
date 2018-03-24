from django.contrib import admin
from django.urls import reverse
from django.utils.html import format_html

from .models import SpotifyMedia, YoutubeMedia, Artist, Song


@admin.register(SpotifyMedia)
class SpotifyMediaAdmin(admin.ModelAdmin):
    list_display = ['urn']
    search_fields = ('urn',)


@admin.register(YoutubeMedia)
class YoutubeMediaAdmin(admin.ModelAdmin):
    list_display = ['video_id']
    search_fields = ('video_id',)


@admin.register(Artist)
class ArtistAdmin(admin.ModelAdmin):
    list_display = ['name', 'created']
    search_fields = ('name',)


@admin.register(Song)
class SongAdmin(admin.ModelAdmin):
    list_display = ['name', 'link_to_artist', 'created']
    list_filter = ['artist']
    search_fields = ('name', 'artist',)

    def link_to_artist(self, obj):
            link = reverse("admin:media_artist_change",
                           args=[obj.artist.id])
            return format_html('<a href="{}">{}</a>',
                               link, obj.artist.name)
    link_to_artist.allow_tags = True
