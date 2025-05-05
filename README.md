# eurovisiontippning
A web app to bet on the outcome of the Eurovision Song Contest.

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
