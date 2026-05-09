-- Seed mock 2026 Eurovision data
WITH new_year AS (
  INSERT INTO public.years (id, year, semi1_start, semi2_start, final_start, primary_color, secondary_color, logo_url)
  VALUES (
    '00000000-0000-0000-0000-000000002026', 
    2026, 
    '2027-05-13T19:00:00Z', 
    '2027-05-15T19:00:00Z', 
    '2027-05-17T19:00:00Z', 
    '#673ab7', 
    '#ffc107', 
    'https://eurovision.tv/assets/logo-2025.png'
  )
  RETURNING id
)
INSERT INTO public.entries (year_id, country, artist, song_title, start_position, semi_final, youtube_id)
VALUES
((SELECT id FROM new_year), 'Sweden', 'Artist Name', 'Song Title', 1, 1, 'xxxxxx'),
((SELECT id FROM new_year), 'Norway', 'Another Artist', 'Another Song', 2, 1, 'yyyyyy'),
((SELECT id FROM new_year), 'Finland', 'Third Artist', 'Third Song', 3, 2, 'zzzzzz'),
((SELECT id FROM new_year), 'France', 'Fourth Artist', 'Fourth Song', 4, NULL, 'wwwwww');