from django.conf.urls import url
import tippning.views

app_name = 'tippning'

urlpatterns = [
    url(r'^semifinal/(\d+)/?$', tippning.views.semifinal, name="semifinal"),
    url(r'^final/?$', tippning.views.final, name="final"),
]
