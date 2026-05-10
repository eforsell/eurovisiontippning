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

-- Mock users for testing friend flow and leaderboard
INSERT INTO auth.users (id, email, aud, role)
VALUES 
  ('11111111-1111-1111-1111-111111111111', 'mockfriend1@example.com', 'authenticated', 'authenticated'),
  ('22222222-2222-2222-2222-222222222222', 'mockfriend2@example.com', 'authenticated', 'authenticated');

INSERT INTO public.profiles (id, name, email, is_private)
VALUES
  ('11111111-1111-1111-1111-111111111111', 'Mock Friend 1', 'mockfriend1@example.com', false),
  ('22222222-2222-2222-2222-222222222222', 'Mock Friend 2', 'mockfriend2@example.com', false)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, is_private = EXCLUDED.is_private;

-- Mock predictions to test partitioned scores
-- We need the entry IDs. Since we don't have static IDs for entries in the insert, we'll look them up.
DO $$ 
DECLARE
  v_year_id UUID := '00000000-0000-0000-0000-000000002026';
  v_swe_id UUID;
  v_nor_id UUID;
  v_fin_id UUID;
  v_fra_id UUID;
BEGIN
  SELECT id INTO v_swe_id FROM public.entries WHERE country = 'Sweden' AND year_id = v_year_id;
  SELECT id INTO v_nor_id FROM public.entries WHERE country = 'Norway' AND year_id = v_year_id;
  SELECT id INTO v_fin_id FROM public.entries WHERE country = 'Finland' AND year_id = v_year_id;
  SELECT id INTO v_fra_id FROM public.entries WHERE country = 'France' AND year_id = v_year_id;

  -- Friend 1 predicts SWE and NOR (Semi1), FIN (Semi2), and ranks FRA as 1st (Final)
  INSERT INTO public.predictions (user_id, entry_id, type, is_qualifier, rank)
  VALUES
    ('11111111-1111-1111-1111-111111111111', v_swe_id, 'semi1', true, null),
    ('11111111-1111-1111-1111-111111111111', v_nor_id, 'semi1', false, null),
    ('11111111-1111-1111-1111-111111111111', v_fin_id, 'semi2', true, null),
    ('11111111-1111-1111-1111-111111111111', v_fra_id, 'final', null, 1);

  -- Friend 2 predicts differently
  INSERT INTO public.predictions (user_id, entry_id, type, is_qualifier, rank)
  VALUES
    ('22222222-2222-2222-2222-222222222222', v_swe_id, 'semi1', false, null),
    ('22222222-2222-2222-2222-222222222222', v_fin_id, 'semi2', false, null),
    ('22222222-2222-2222-2222-222222222222', v_fra_id, 'final', null, 2);
    
  -- We also need mock results to actually yield a score from these predictions
  INSERT INTO public.results (year_id, entry_id, is_semi1_qualifier, is_semi2_qualifier, final_rank)
  VALUES
    (v_year_id, v_swe_id, true, false, 5),
    (v_year_id, v_nor_id, false, false, null),
    (v_year_id, v_fin_id, false, true, 2),
    (v_year_id, v_fra_id, false, false, 1);
END $$;