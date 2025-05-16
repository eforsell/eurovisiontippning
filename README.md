# eurovisiontippning

A web app to bet on the outcome of the Eurovision Song Contest.

## Set up dev environment

1. Create a `dev.py` file in the `eurovisiontippning/settings` folder.
2. Add baseline setup:

   ```python
    from .base import *

    SECRET_KEY = 'abc123'
    DEBUG = True

    DATABASES = {
        'default': {
            "ENGINE": "django.db.backends.sqlite3",
            "NAME": "sqlite"
        }
    }

    SOCIAL_AUTH_REDIRECT_IS_HTTPS = False
    ```

3. To log in using Social Auth set the config variables in the new file (see prod settings). You can find them either on Heroku or in the corresponding developer portal.

4. Set an environment variable to point to the dev settings:

    ```bash
    export DJANGO_SETTINGS_MODULE=mysite.settings
    ```

5. Then migrate to init db:

    ```bash
    python manage.py migrate
    ```

6. Create a superuser:

    ```bash
    python manage.py createsuperuser
    ```

7. Most likely you'll want to seed the DB with a mock year by following step 3 below locally.
8. And run the server with:

    ```bash
    python manage.py runserver
    ```

## Prep for new contest

To easily create info for a new contest follow these steps.

### 1. Get data from YouTube

By using the [YouTube API Explorer](https://developers.google.com/youtube/v3/docs/playlistItems/list) you can easily get a formatted JSON from each of the two playlists that Eurovision.tv publish on their [YouTube channel](https://www.youtube.com/@EurovisionSongContest/playlists).

Save these into files called `semi[1/2]_[YYYY].json` and then edit the data in the [`load_from_youtbue.py`](./events/data/load_from_youtube.py) and run once for each file. Combine the new files into a `eurovision_[YYYY].json` and add the contest information.

### 2. Deploy the new changes

Simply push the latest changes to Github as it's set up to auto-deploy to Heroku.

### 3. Seed the database based on the new file

Use the [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli) to enter the [Django shell](https://docs.djangoproject.com/en/5.2/ref/django-admin/): `heroku run python manage.py shell --app eurovisiontippning`.

Then, run the following Python script:

```python
from events.setup import addYear
addYear(2025)
```

After that, go to the [Django admin console](https://eurovisiontippning.se/admin), log in, and for each of the newly added contests check the "Published" box.

### 4. Publish new contests

Go to the admin console and check the "published" checkbox on each of the new semifinals as well as the final.

### 5. Mark semifinal entries as progressed

When the results from a semifinal is in, mark the entries that progressed to the final as "progressed" in the admin interface.

### 6. Add semifinals to the final

When a semifinal has had its entries marked as progressed you can add them to the final by entering the Django shell:

```bash
heroku --app=eurovisiontippning ./manage.py shell
```

Then import the Final model and select the latest one:

```python
from events.models import Final
final = latest_final = Final.objects.select_related('event').order_by('-event__start_date').first()

# Verify
final.event
```

Now you can add the semi entries with:

```python
final.add_semientries()
```

And then finally, to set the start order:

```python
final.update_start_order()
```

### 7. Add results from final

When the final is over you can again use the Heroku shell and proceed to add the ranking to the entries by selecting the latest final as above and running:

```python
final.update_rank()
```
