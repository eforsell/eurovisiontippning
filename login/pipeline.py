def get_user_avatar(backend, details, response, uid, user, *args, **kwargs):
    social = kwargs.get('social') or backend.storage.user.get_social_auth(
        backend.name,
        uid
    )
    url = None
    if backend.name == 'facebook':
        url = ("http://graph.facebook.com/%s/picture?type=large"
               % response['id'])
    elif getattr(backend, 'name', None) == 'google-oauth2':
        try:
            url = response['picture']
        except KeyError:
            pass

    if url:
        social.set_extra_data({'photo': url})
