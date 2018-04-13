from django.contrib import admin

from .models import FinalBet, SemiBet, FinalScore, SemiScore, ParticipantReview


@admin.register(FinalBet)
class FinalBetAdmin(admin.ModelAdmin):
    list_display = ['owner', 'entry', 'rank']
    list_filter = ['entry__contest']


@admin.register(SemiBet)
class SemiBetAdmin(admin.ModelAdmin):
    list_display = ['owner', 'entry', 'progression']
    list_filter = ['entry__contest', 'owner']


@admin.register(FinalScore)
class FinalScoreAdmin(admin.ModelAdmin):
    list_display = ['owner', 'event', 'contest', 'points']
    list_filter = ['contest', 'contest__event', 'owner']

    def event(self, obj):
            return (str(obj.contest.event))


@admin.register(SemiScore)
class SemiScoreAdmin(admin.ModelAdmin):
    list_display = ['owner', 'event', 'contest', 'points']
    list_filter = ['contest', 'contest__event', 'owner']

    def event(self, obj):
            return (str(obj.contest.event))


@admin.register(ParticipantReview)
class ParticipantReviewAdmin(admin.ModelAdmin):
    list_display = ['owner', 'participant', 'own_score']
