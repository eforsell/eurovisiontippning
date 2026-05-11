-- T029: Update final scoring formula
CREATE OR REPLACE FUNCTION public.get_rank_points(actual_rank INTEGER, total_entries INTEGER)
RETURNS INTEGER AS $$
BEGIN
  IF actual_rank = 1 THEN RETURN 100; END IF;
  IF actual_rank = 2 THEN RETURN 65; END IF;
  IF actual_rank = 3 THEN RETURN 45; END IF;
  IF actual_rank = 4 THEN RETURN 33; END IF;
  IF actual_rank = 5 THEN RETURN 25; END IF;
  IF actual_rank = 6 THEN RETURN 20; END IF;
  IF actual_rank = 7 THEN RETURN 15; END IF;
  IF actual_rank = 8 THEN RETURN 12; END IF;
  IF actual_rank = 9 THEN RETURN 9; END IF;
  IF actual_rank = 10 THEN RETURN 7; END IF;
  IF actual_rank = 11 THEN RETURN 6; END IF;
  IF actual_rank = total_entries THEN RETURN 30; END IF;
  RETURN 5;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

DROP FUNCTION IF EXISTS public.get_leaderboard(uuid);
CREATE OR REPLACE FUNCTION public.get_leaderboard(p_year_id UUID)
RETURNS TABLE(userId TEXT, email TEXT, totalPoints NUMERIC) AS $$
DECLARE
  v_semi1_completed BOOLEAN;
  v_semi2_completed BOOLEAN;
  v_total_finalists INTEGER;
BEGIN
  SELECT 
    (SELECT COUNT(*) FROM results r WHERE r.year_id = p_year_id AND r.is_semi1_qualifier = true) >= y.semi1_progression_target,
    (SELECT COUNT(*) FROM results r WHERE r.year_id = p_year_id AND r.is_semi2_qualifier = true) >= y.semi2_progression_target
  INTO v_semi1_completed, v_semi2_completed
  FROM years y
  WHERE y.id = p_year_id;

  SELECT COUNT(*) INTO v_total_finalists FROM results r WHERE r.year_id = p_year_id AND r.final_rank IS NOT NULL;

  RETURN QUERY
  WITH user_points AS (
    SELECT 
      p.user_id,
      SUM(
        CASE 
          WHEN p.type = 'semi1' AND p.is_qualifier = true AND r.is_semi1_qualifier = true AND v_semi1_completed = true THEN 3
          WHEN p.type = 'semi2' AND p.is_qualifier = true AND r.is_semi2_qualifier = true AND v_semi2_completed = true THEN 3
          WHEN p.type = 'final' AND p.rank IS NOT NULL AND r.final_rank IS NOT NULL THEN
            (public.get_rank_points(r.final_rank, v_total_finalists) * (1.0 / (ABS(p.rank - r.final_rank) + 1)))
          ELSE 0
        END
      )::NUMERIC as points
    FROM predictions p
    JOIN entries e ON p.entry_id = e.id
    LEFT JOIN results r ON r.entry_id = e.id
    WHERE e.year_id = p_year_id
    GROUP BY p.user_id
  )
  SELECT 
    up.user_id::TEXT, 
    COALESCE(u.email::TEXT, 'Unknown'), 
    ROUND(up.points, 1)
  FROM user_points up
  JOIN auth.users u ON u.id = up.user_id
  ORDER BY up.points DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP FUNCTION IF EXISTS public.get_friend_leaderboard(uuid, uuid);
CREATE OR REPLACE FUNCTION public.get_friend_leaderboard(user_uid UUID, p_year_id UUID)
RETURNS TABLE(id UUID, name TEXT, email TEXT, score NUMERIC, rank INTEGER, score_breakdown JSON) AS $$
DECLARE
  v_semi1_completed BOOLEAN;
  v_semi2_completed BOOLEAN;
  v_total_finalists INTEGER;
BEGIN
  SELECT 
    (SELECT COUNT(*) FROM results r WHERE r.year_id = p_year_id AND r.is_semi1_qualifier = true) >= y.semi1_progression_target,
    (SELECT COUNT(*) FROM results r WHERE r.year_id = p_year_id AND r.is_semi2_qualifier = true) >= y.semi2_progression_target
  INTO v_semi1_completed, v_semi2_completed
  FROM years y
  WHERE y.id = p_year_id;

  SELECT COUNT(*) INTO v_total_finalists FROM results r WHERE r.year_id = p_year_id AND r.final_rank IS NOT NULL;

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
      )::NUMERIC as semi1_score,
      SUM(
        CASE 
          WHEN p.type = 'semi2' AND p.is_qualifier = true AND r.is_semi2_qualifier = true AND v_semi2_completed = true THEN 3
          ELSE 0
        END
      )::NUMERIC as semi2_score,
      SUM(
        CASE 
          WHEN p.type = 'final' AND p.rank IS NOT NULL AND r.final_rank IS NOT NULL THEN
            (public.get_rank_points(r.final_rank, v_total_finalists) * (1.0 / (ABS(p.rank - r.final_rank) + 1)))
          ELSE 0
        END
      )::NUMERIC as final_score
    FROM predictions p
    JOIN entries e ON p.entry_id = e.id
    LEFT JOIN results r ON r.entry_id = e.id
    WHERE e.year_id = p_year_id
    GROUP BY p.user_id
  ),
  friend_scores AS (
    SELECT
      f.uid,
      COALESCE(ROUND(up.semi1_score, 1), 0) as semi1_score,
      COALESCE(ROUND(up.semi2_score, 1), 0) as semi2_score,
      COALESCE(ROUND(up.final_score, 1), 0) as final_score,
      (COALESCE(up.semi1_score, 0) + COALESCE(up.semi2_score, 0) + COALESCE(up.final_score, 0)) as total_score
    FROM user_friends f
    LEFT JOIN user_points up ON up.user_id = f.uid
  )
  SELECT 
    p.id, 
    p.name, 
    p.email, 
    ROUND(fs.total_score, 1) as score,
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