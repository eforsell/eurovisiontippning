from django.conf.urls import url
import tippning.views

app_name = 'tippning'

urlpatterns = [
    url(r'^semifinal/(\d+)/?$',
        tippning.views.semifinal, name="semifinal"),
    url(r'^semifinal/lineup/(\d+)/(\d+)/?$',
        tippning.views.semifinal_lineup, name="semifinal_lineup"),
    url(r'^semifinal/lineup/$',
        tippning.views.semifinal_lineup, name="semifinal_lineup_helper"),
    url(r'^update_semibet/?$',
        tippning.views.update_semibet, name="update_semibet"),
    url(r'^final/?$',
        tippning.views.final, name="final"),
    url(r'^update_finalbet/?$',
        tippning.views.update_finalbet, name="update_finalbet"),
    url(r'^tips/?$',
        tippning.views.tips, name="tips"),
    url(r'^poang/?$',
        tippning.views.points, name="points"),
    url(r'^delningar/anvandare/?$',
        tippning.views.share_users, name="share_users"),
    url(r'^delningar/deltavlingar/?$',
        tippning.views.points, name="share_contests"),
]
