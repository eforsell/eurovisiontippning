-- Update get_leaderboard logic
CREATE OR REPLACE FUNCTION public.get_leaderboard(p_year_id UUID)
RETURNS TABLE(userId TEXT, email TEXT, totalPoints INTEGER) AS $$
DECLARE
  v_semi1_completed BOOLEAN;
  v_semi2_completed BOOLEAN;
BEGIN
  SELECT 
    (SELECT COUNT(*) FROM results r WHERE r.year_id = p_year_id AND r.is_semi1_qualifier = true) >= y.semi1_progression_target,
    (SELECT COUNT(*) FROM results r WHERE r.year_id = p_year_id AND r.is_semi2_qualifier = true) >= y.semi2_progression_target
  INTO v_semi1_completed, v_semi2_completed
  FROM years y
  WHERE y.id = p_year_id;

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
CREATE OR REPLACE FUNCTION public.get_friend_leaderboard(user_uid UUID, p_year_id UUID)
RETURNS TABLE(id UUID, name TEXT, email TEXT, score INTEGER, rank INTEGER, score_breakdown JSON) AS $$
DECLARE
  v_semi1_completed BOOLEAN;
  v_semi2_completed BOOLEAN;
BEGIN
  SELECT 
    (SELECT COUNT(*) FROM results r WHERE r.year_id = p_year_id AND r.is_semi1_qualifier = true) >= y.semi1_progression_target,
    (SELECT COUNT(*) FROM results r WHERE r.year_id = p_year_id AND r.is_semi2_qualifier = true) >= y.semi2_progression_target
  INTO v_semi1_completed, v_semi2_completed
  FROM years y
  WHERE y.id = p_year_id;

  RETURN QUERY
  WITH user_friends AS (
    SELECT friend_id as uid FROM public.friends WHERE user_id = user_uid AND status = 'accepted'
    UNION
    SELECT user_id as uid FROM public.friends WHERE friend_id = user_uid AND status = 'accepted'
    UNION
    SELECT user_uid as uid -- include self
  ),
  user_points AS (
    SELECT 
      p.user_id,
      SUM(
        CASE 
          WHEN p.type = 'semi1' AND p.is_qualifier = true AND r.is_semi1_qualifier = true AND v_semi1_completed = true THEN 3
          ELSE 0
        END
      )::INTEGER as semi1_score,
      SUM(
        CASE 
          WHEN p.type = 'semi2' AND p.is_qualifier = true AND r.is_semi2_qualifier = true AND v_semi2_completed = true THEN 3
          ELSE 0
        END
      )::INTEGER as semi2_score,
      SUM(
        CASE 
          WHEN p.type = 'final' AND p.rank IS NOT NULL AND r.final_rank IS NOT NULL THEN
            GREATEST(0, 26 - ABS(p.rank - r.final_rank))
          ELSE 0
        END
      )::INTEGER as final_score
    FROM predictions p
    JOIN entries e ON p.entry_id = e.id
    LEFT JOIN results r ON r.entry_id = e.id
    WHERE e.year_id = p_year_id
    GROUP BY p.user_id
  ),
  friend_scores AS (
    SELECT
      f.uid,
      COALESCE(up.semi1_score, 0) as semi1_score,
      COALESCE(up.semi2_score, 0) as semi2_score,
      COALESCE(up.final_score, 0) as final_score,
      (COALESCE(up.semi1_score, 0) + COALESCE(up.semi2_score, 0) + COALESCE(up.final_score, 0)) as total_score
    FROM user_friends f
    LEFT JOIN user_points up ON up.user_id = f.uid
  )
  SELECT 
    p.id, 
    p.name, 
    p.email, 
    fs.total_score as score,
    (RANK() OVER (ORDER BY fs.total_score DESC))::INTEGER as rank,
    json_build_object(
      'semi1', fs.semi1_score,
      'semi2', fs.semi2_score,
      'final', fs.final_score
    ) as score_breakdown
  FROM friend_scores fs
  JOIN public.profiles p ON p.id = fs.uid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop the columns
ALTER TABLE public.years DROP COLUMN semi1_completed;
ALTER TABLE public.years DROP COLUMN semi2_completed;