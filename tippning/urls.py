from django.conf.urls import url
import tippning.views

app_name = 'tippning'

urlpatterns = [
    url(r'^semifinal/(\d+)/?$',
        tippning.views.semifinal, name="semifinal"),
    url(r'^update_semibet/?$',
        tippning.views.update_semibet, name="update_semibet"),
    url(r'^semifinal/lineup/(\d+)/(\d+)/?$',
        tippning.views.friend_semi_lineup, name="semifinal_lineup"),
    url(r'^semifinal/lineup/$',
        tippning.views.friend_semi_lineup, name="semifinal_lineup_helper"),
    url(r'^final/?$',
        tippning.views.final, name="final"),
    url(r'^update_finalbet/?$',
        tippning.views.update_finalbet, name="update_finalbet"),
    url(r'^final/lineup/(\d+)/?$',
        tippning.views.friend_final_lineup, name="final_lineup"),
    url(r'^final/lineup/$',
        tippning.views.friend_final_lineup, name="final_lineup_helper"),
    url(r'^resultat/?$',
        tippning.views.results, name="results"),
    url(r'^tips/?$',
        tippning.views.tips, name="tips"),
    url(r'^poang/?$',
        tippning.views.points, name="points"),
]
