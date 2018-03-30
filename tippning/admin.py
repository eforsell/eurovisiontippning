from django.contrib import admin

from .models import FinalBet, SemiBet, ParticipantReview


@admin.register(FinalBet)
class FinalBetAdmin(admin.ModelAdmin):
    list_display = ['owner', 'entry', 'rank_bet']
    list_filter = ['entry__contest']


@admin.register(SemiBet)
class SemiBetAdmin(admin.ModelAdmin):
    list_display = ['owner', 'entry', 'advance_bet']
    list_filter = ['entry__contest']


@admin.register(ParticipantReview)
class ParticipantReviewAdmin(admin.ModelAdmin):
    list_display = ['owner', 'participant', 'own_score']
