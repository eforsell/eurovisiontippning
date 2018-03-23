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
        url = response['image'].get('url').replace("sz=50", "sz=200")

    if url:
        social.set_extra_data({'photo': url})
