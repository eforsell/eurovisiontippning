-- Add betting_started flag
ALTER TABLE years ADD COLUMN betting_started BOOLEAN NOT NULL DEFAULT false;

-- Update get_leaderboard logic
CREATE OR REPLACE FUNCTION public.get_leaderboard(p_year_id UUID)
RETURNS TABLE(userId TEXT, email TEXT, totalPoints INTEGER) AS $$
DECLARE
  v_semi1_completed BOOLEAN;
  v_semi2_completed BOOLEAN;
BEGIN
  SELECT semi1_completed, semi2_completed INTO v_semi1_completed, v_semi2_completed
  FROM years
  WHERE id = p_year_id;

  RETURN QUERY
  WITH user_points AS (
    SELECT 
      p.user_id,
      SUM(
        CASE 
          WHEN p.type = 'semi1' AND p.is_qualifier = true AND r.is_semi1_qualifier = true AND v_semi1_completed = true THEN 3
          WHEN p.type = 'semi2' AND p.is_qualifier = true AND r.is_semi2_qualifier = true AND v_semi2_completed = true THEN 3
          WHEN p.type = 'final' AND p.rank IS NOT NULL AND r.final_rank IS NOT NULL THEN
            GREATEST(0, 26 - ABS(p.rank - r.final_rank))
          ELSE 0
        END
      )::INTEGER as points
    FROM predictions p
    JOIN entries e ON p.entry_id = e.id
    LEFT JOIN results r ON r.entry_id = e.id
    WHERE e.year_id = p_year_id
    GROUP BY p.user_id
  )
  SELECT 
    up.user_id::TEXT, 
    COALESCE(u.email::TEXT, 'Unknown'), 
    up.points
  FROM user_points up
  JOIN auth.users u ON u.id = up.user_id
  ORDER BY up.points DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update get_friend_leaderboard logic
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
  real_scores AS (
    SELECT u.uid, COALESCE((
      SELECT SUM(
        CASE 
          WHEN p.type = 'semi1' AND p.is_qualifier = true AND r.is_semi1_qualifier = true AND y.semi1_completed = true THEN 3
          WHEN p.type = 'semi2' AND p.is_qualifier = true AND r.is_semi2_qualifier = true AND y.semi2_completed = true THEN 3
          WHEN p.type = 'final' AND p.rank IS NOT NULL AND r.final_rank IS NOT NULL THEN
            GREATEST(0, 26 - ABS(p.rank - r.final_rank))
          ELSE 0
        END
      )::INTEGER
      FROM public.predictions p
      JOIN public.entries e ON e.id = p.entry_id
      JOIN public.years y ON y.id = e.year_id
      LEFT JOIN public.results r ON r.entry_id = e.id
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
  FROM real_scores m
  JOIN public.profiles p ON p.id = m.uid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
