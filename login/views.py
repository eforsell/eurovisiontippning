import json
import random
import string
import base64, hmac, hashlib

from django.utils.decorators import method_decorator
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import csrf_exempt
from django.http import HttpResponse, JsonResponse
from django.views import View
from django.conf import settings
from django.shortcuts import render, redirect
from django.urls import reverse
from django.contrib.auth import logout 

from django.contrib.auth.models import User
from social_django.models import UserSocialAuth

import login.views


def confirm_deletion(request, fb=1):
    _fb = int(fb)

    if _fb == 0:
        text = 'Din användare all lagrad data har tagits bort. För att anända Eurovisiontippning.se måste du skapa en ny användare genom att logga in med hjälp av antingen Google eller Facebook.'
    else:
        text = 'Din koppling till Facebook och all lagrad data har tagits bort. För att anända Eurovisiontippning.se måste du på nytt logga in med hjälp av antingen Google eller Facebook.'
    return render(request, 'confirm_deletion.html', {
        'text': text
    })


@login_required
def delete_user(request):
  if request.method == 'POST':
    try:
        social_auth = UserSocialAuth.objects.get(user=request.user)
        social_auth.delete()
    except UserSocialAuth.DoesNotExist:
        pass

    try:
        request.user.delete()
    except:
        return HttpResponse(status=400, content='Couldn\'t delete user data')
    
    logout(request)    
    return redirect('confirm_deletion', fb=0)

  else:
    return HttpResponse(status=403, content='Not allowed')


@method_decorator(csrf_exempt, name='dispatch')
class FacebookDeauthorizeView(View):
    # From: https://stackoverflow.com/questions/48609148/handle-facebook-deauthorize-callback-in-python

    def post(self, request, *args, **kwargs):
        try:
            signed_request = request.POST['signed_request']
            encoded_sig, payload = signed_request.split('.')
        except (ValueError, KeyError):
            return HttpResponse(status=400, content='Invalid request')

        try:
            # Reference for request decoding: https://developers.facebook.com/docs/games/gamesonfacebook/login#parsingsr
            # For some reason, the request needs to be padded in order to be decoded. See https://stackoverflow.com/a/6102526/2628463
            decoded_payload = base64.urlsafe_b64decode(payload + "==").decode('utf-8')
            decoded_payload = json.loads(decoded_payload)

            if type(decoded_payload) is not dict or 'user_id' not in decoded_payload.keys():
                return HttpResponse(status=400, content='Invalid payload data')

        except (ValueError, json.JSONDecodeError):
            return HttpResponse(status=400, content='Could not decode payload')

        try:
            secret = settings.SOCIAL_AUTH_FACEBOOK_SECRET

            sig = base64.urlsafe_b64decode(encoded_sig + "==")
            expected_sig = hmac.new(bytes(secret, 'utf-8'), bytes(payload, 'utf-8'), hashlib.sha256)
        except:
            return HttpResponse(status=400, content='Could not decode signature')

        if not hmac.compare_digest(expected_sig.digest(), sig):
            return HttpResponse(status=400, content='Invalid request')

        user_id = decoded_payload['user_id']

        try:
            social_account = UserSocialAuth.objects.get(uid=user_id)
        except UserSocialAuth.DoesNotExist:
            return HttpResponse(status=200)

        # Own custom logic here
        try:
            UserSocialAuth.disconnect(social_account)
        except:
            HttpResponse(status=400, content='Could not disconnect account')

        code = ''.join(random.choices(string.ascii_uppercase + string.digits, k=10))

        return JsonResponse({'url': f"https://eurovisiontippning.se{reverse(login.views.confirm_deletion)}", 'confirmation_code': code})
