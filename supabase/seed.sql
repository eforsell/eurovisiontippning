-- Seed mock 2026 Eurovision data
WITH new_year AS (
  INSERT INTO public.years (id, year, semi1_start, semi2_start, final_start, primary_color, secondary_color, logo_url, location, semi1_progression_target, semi2_progression_target, semi1_completed, semi2_completed)
  VALUES (
    '00000000-0000-0000-0000-000000002026', 
    2026, 
    '2027-05-13T19:00:00Z', 
    '2027-05-15T19:00:00Z', 
    '2027-05-17T19:00:00Z', 
    '#673ab7', 
    '#ffc107', 
    '/logo.png',
    'TBD',
    10,
    10,
    false,
    false
  )
  RETURNING id
)
INSERT INTO public.entries (year_id, country, artist, song_title, start_position, starting_contest, youtube_id)
VALUES
((SELECT id FROM new_year), 'Sweden', 'Artist Name', 'Song Title', 1, 'semi1', 'xxxxxx'),
((SELECT id FROM new_year), 'Norway', 'Another Artist', 'Another Song', 2, 'semi1', 'yyyyyy'),
((SELECT id FROM new_year), 'Finland', 'Third Artist', 'Third Song', 3, 'semi2', 'zzzzzz'),
((SELECT id FROM new_year), 'France', 'Fourth Artist', 'Fourth Song', 4, 'final', 'wwwwww');