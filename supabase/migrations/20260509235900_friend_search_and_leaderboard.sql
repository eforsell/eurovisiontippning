-- T029: Friend search RPC
CREATE OR REPLACE FUNCTION public.search_public_users(query TEXT)
RETURNS TABLE(id UUID, name TEXT, email TEXT) AS $$
BEGIN
  RETURN QUERY
  SELECT p.id, p.name, p.email
  FROM public.profiles p
  WHERE p.is_private = false
    AND (p.email ILIKE '%' || query || '%' OR p.name ILIKE '%' || query || '%')
  LIMIT 20;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- T030: Update leaderboard calculation
CREATE OR REPLACE FUNCTION public.get_friend_leaderboard(user_uid UUID)
RETURNS TABLE(id UUID, name TEXT, email TEXT, score INTEGER, rank INTEGER) AS $$
BEGIN
  RETURN QUERY
  WITH user_friends AS (
    SELECT friend_id as uid FROM public.friends WHERE user_id = user_uid AND status = 'accepted'
    UNION
    SELECT user_id as uid FROM public.friends WHERE friend_id = user_uid AND status = 'accepted'
    UNION
    SELECT user_uid as uid -- include self
  ),
  mock_scores AS (
    -- In a real scenario, scores are calculated based on `results` and `predictions`.
    -- For now, we mock the score sum per user.
    SELECT u.uid, COALESCE((
      SELECT sum(10) -- placeholder for actual logic
      FROM public.predictions p
      WHERE p.user_id = u.uid
    ), 0)::INTEGER as calculated_score
    FROM user_friends u
  )
  SELECT 
    p.id, 
    p.name, 
    p.email, 
    m.calculated_score,
    (RANK() OVER (ORDER BY m.calculated_score DESC))::INTEGER as rank
  FROM mock_scores m
  JOIN public.profiles p ON p.id = m.uid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;