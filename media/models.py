from django.db import models


class SpotifyMedia(models.Model):
    urn = models.CharField(max_length=256)

    def __str__(self):
        return self.urn


class YoutubeMedia(models.Model):
    video_id = models.CharField(max_length=256, blank=True, null=True)
    playlist_id = models.CharField(max_length=256, blank=True, null=True)

    def __str__(self):
        return self.video_id


class Artist(models.Model):
    name = models.CharField(max_length=2048)

    spotify = models.ForeignKey(SpotifyMedia,
                                on_delete=models.CASCADE,
                                blank=True,
                                null=True)

    created = models.DateTimeField(auto_now_add=True)
    modified = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name


class Song(models.Model):
    name = models.CharField(max_length=2048)
    artist = models.ForeignKey(Artist, on_delete=models.CASCADE)

    spotify = models.ForeignKey(SpotifyMedia,
                                on_delete=models.CASCADE,
                                blank=True,
                                null=True)
    youtube = models.ForeignKey(YoutubeMedia,
                                on_delete=models.CASCADE,
                                blank=True,
                                null=True)

    created = models.DateTimeField(auto_now_add=True)
    modified = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name
