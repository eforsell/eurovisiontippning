from django.conf.urls import url
import tippning.views

app_name = 'tippning'

urlpatterns = [
    url(r'^semifinal/(\d+)/?$',
        tippning.views.semifinal, name="semifinal"),
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
]
