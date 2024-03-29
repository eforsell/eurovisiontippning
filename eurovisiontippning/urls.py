"""eurovisiontippning URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/2.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.urls import path
from django.conf import settings
from django.conf.urls import url, include
from django.contrib import admin
from django.contrib.auth import views as auth_views
from django.views import defaults

import core.views
import login.views

urlpatterns = [
    url(r'^$', core.views.home, name='home'),
    path('personuppgiftspolicy/', core.views.privacy, name='privacy'),
    url(r'^logout/$', auth_views.LogoutView.as_view(), name='logout'),
    url(r'^databorttagning/$', login.views.confirm_deletion, name='confirm_deletion'),
    url(r'^databorttagning/(?P<fb>\d{1,1})$', login.views.confirm_deletion, name='confirm_deletion'),
    url(r'^facebook_deauthorize/$', login.views.FacebookDeauthorizeView.as_view(), name='facebook_deauthorize'),
    url(r'^user_delete/$', login.views.delete_user, name='user_delete'),
    path('admin/', admin.site.urls),
    url(r'^oauth/', include('social_django.urls', namespace='social')),
    url(r'^tippning/', include('tippning.urls')),
    url(r'^delningar/', include('sharing.urls')),
]

if settings.DEBUG is True:
    import debug_toolbar
    urlpatterns += [
        url(r'^__debug__/', include(debug_toolbar.urls)),
        url(r'^500/$', defaults.server_error),
        url(r'^404/([A-Za-z0-9\-\_\.]+)/$', defaults.page_not_found),
    ]
