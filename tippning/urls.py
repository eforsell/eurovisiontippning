from django.urls import re_path
import tippning.views

app_name = 'tippning'

urlpatterns = [
    re_path(r'^semifinal/(\d+)/?$',
        tippning.views.semifinal, name="semifinal"),
    re_path(r'^update_semibet/?$',
        tippning.views.update_semibet, name="update_semibet"),
    re_path(r'^semifinal/lineup/(\d+)/(\d+)/?$',
        tippning.views.friend_semi_lineup, name="semifinal_lineup"),
    re_path(r'^semifinal/lineup/$',
        tippning.views.friend_semi_lineup, name="semifinal_lineup_helper"),
    re_path(r'^final/?$',
        tippning.views.final, name="final"),
    re_path(r'^update_finalbet/?$',
        tippning.views.update_finalbet, name="update_finalbet"),
    re_path(r'^final/lineup/(\d+)/?$',
        tippning.views.friend_final_lineup, name="final_lineup"),
    re_path(r'^final/lineup/$',
        tippning.views.friend_final_lineup, name="final_lineup_helper"),
    re_path(r'^resultat/?$',
        tippning.views.results, name="results"),
    re_path(r'^tips/?$',
        tippning.views.tips, name="tips"),
    re_path(r'^poang/?$',
        tippning.views.points, name="points"),
]
