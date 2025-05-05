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
from django.urls import re_path, include
from django.contrib import admin
from django.contrib.auth import views as auth_views
from django.views import defaults

import core.views
import login.views

urlpatterns = [
    re_path(r'^$', core.views.home, name='home'),
    path('personuppgiftspolicy/', core.views.privacy, name='privacy'),
    re_path(r'^logout/$', auth_views.LogoutView.as_view(), name='logout'),
    re_path(r'^databorttagning/$', login.views.confirm_deletion, name='confirm_deletion'),
    re_path(r'^databorttagning/(?P<fb>\d{1,1})$', login.views.confirm_deletion, name='confirm_deletion'),
    re_path(r'^facebook_deauthorize/$', login.views.FacebookDeauthorizeView.as_view(), name='facebook_deauthorize'),
    re_path(r'^user_delete/$', login.views.delete_user, name='user_delete'),
    path('admin/', admin.site.urls),
    re_path(r'^oauth/', include('social_django.urls', namespace='social')),
    re_path(r'^tippning/', include('tippning.urls')),
    re_path(r'^delningar/', include('sharing.urls')),
]

if settings.DEBUG is True:
    import debug_toolbar
    urlpatterns += [
        re_path(r'^__debug__/', include(debug_toolbar.urls)),
        re_path(r'^500/$', defaults.server_error),
        re_path(r'^404/([A-Za-z0-9\-\_\.]+)/$', defaults.page_not_found),
    ]
