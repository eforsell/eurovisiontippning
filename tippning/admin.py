from django.contrib import admin

from .models import FinalBet, SemiBet, ParticipantReview


@admin.register(FinalBet)
class FinalBetAdmin(admin.ModelAdmin):
    list_display = ['owner', 'entry', 'rank']
    list_filter = ['entry__contest']


@admin.register(SemiBet)
class SemiBetAdmin(admin.ModelAdmin):
    list_display = ['owner', 'entry', 'progression']
    list_filter = ['entry__contest', 'owner']


@admin.register(ParticipantReview)
class ParticipantReviewAdmin(admin.ModelAdmin):
    list_display = ['owner', 'participant', 'own_score']
