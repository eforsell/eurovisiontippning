from django.conf.urls import url
import sharing.views

app_name = 'sharing'

urlpatterns = [
    url(r'^anvandare/?$',
        sharing.views.share_users, name="share_users"),
    url(r'^deltavlingar/?$',
        sharing.views.share_contests, name="share_contests"),
    url(r'^update_betshares/?$',
        sharing.views.update_betshares, name="update_betshares"),
    url(r'^add_follow/?$',
        sharing.views.add_follow, name="add_follow"),
    url(r'^remove_follow/?$',
        sharing.views.remove_follow, name="remove_follow"),
]
