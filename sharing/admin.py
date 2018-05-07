from django.contrib import admin

from .models import BetShares


@admin.register(BetShares)
class BetSharesAdmin(admin.ModelAdmin):
    list_display = ['owner', 'share_bets', 'share_code']
