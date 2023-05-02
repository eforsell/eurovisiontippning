"""
The json is the output from the Youtube playlistItems call on one of the
contest playlists from the official Eurovision.tv channel.

curl \
  'https://youtube.googleapis.com/youtube/v3/playlistItems?part=id&part=contentDetails&part=snippet&maxResults=30&playlistId=PLmWYEDTNOGUKL2aNx4HqVFLnAty4MnwiB&key=[YOUR_API_KEY]' \
  --header 'Authorization: Bearer [YOUR_ACCESS_TOKEN]' \
  --header 'Accept: application/json' \
  --compressed
"""

import json
import re

year = 2023
contest = 'final'

def convert(s):
    newS = ""
    for l in s :
        if re.match(r'[🇦-🇿]', l, re.UNICODE):
            l = chr(ord(l) - ord('🇦') + ord('a'))
        newS += l
    return newS


with open(f'{contest}_{year}.json') as f:
    a = f.read()

b = json.loads(a)

semi1pl = 'PLmWYEDTNOGUKL2aNx4HqVFLnAty4MnwiB'


entries = []
for i, entry in enumerate(b['items']):
    info = {
        'contest': f'{contest}',
        'start_order': i + 1,
        'participant': {
            'song': {
                'artist': {},
                'youtube': {
                    'list': entry['snippet']['playlistId']
                },
                'spotify': ""
            }
        }
    }
    
    title = entry['snippet']['title']
    country = convert(
        ''.join(re.findall(u'[\U0001F1E6-\U0001F1FF]', title))
    ).upper()
    info['participant']['country'] = country
    info['participant']['song']['name'] = title.split(' - ')[1].split(' | ')[0]
    info['participant']['song']['artist']['name'] = title.split(' - ')[0]
    info['participant']['song']['youtube']['id'] = entry['snippet']['resourceId']['videoId']
    

    entries.append(info)

with open(f'{contest}_{year}_formatted.json', 'w') as f:
    json.dump({'entries': entries}, f, indent=4)
