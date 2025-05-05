from django.urls import re_path
import sharing.views

app_name = 'sharing'

urlpatterns = [
    re_path(r'^anvandare/?$',
        sharing.views.share_users, name="share_users"),
    re_path(r'^deltavlingar/?$',
        sharing.views.share_contests, name="share_contests"),
    re_path(r'^resultat/?$',
        sharing.views.share_results, name="share_results"),
    re_path(r'^update_betshares/?$',
        sharing.views.update_betshares, name="update_betshares"),
    re_path(r'^add_follow/?$',
        sharing.views.add_follow, name="add_follow"),
    re_path(r'^remove_follow/?$',
        sharing.views.remove_follow, name="remove_follow"),
]
