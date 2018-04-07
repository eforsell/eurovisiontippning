from django.shortcuts import render
from django.core.exceptions import ObjectDoesNotExist
from django.contrib.auth.decorators import login_required


def home(request):
    extra_data = None
    if request.user.is_authenticated:
        try:
            social_user = request.user.social_auth.get()
            extra_data = social_user.extra_data
        except ObjectDoesNotExist:
            pass

    return render(request, 'home.html', {
        'social_user_data': extra_data
        })
