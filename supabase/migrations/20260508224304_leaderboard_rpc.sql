CREATE OR REPLACE FUNCTION public.get_leaderboard(p_year_id UUID)
RETURNS TABLE(userId TEXT, email TEXT, totalPoints INTEGER) AS $$
BEGIN
  RETURN QUERY
  WITH user_points AS (
    SELECT 
      p.user_id,
      SUM(
        CASE 
          WHEN p.type IN ('semi1', 'semi2') AND p.is_qualifier = true AND (
            (p.type = 'semi1' AND r.is_semi1_qualifier = true) OR
            (p.type = 'semi2' AND r.is_semi2_qualifier = true)
          ) THEN 3
          WHEN p.type = 'final' AND p.rank IS NOT NULL AND r.final_rank IS NOT NULL THEN
            GREATEST(0, 26 - ABS(p.rank - r.final_rank))
          ELSE 0
        END
      )::INTEGER as points
    FROM predictions p
    JOIN entries e ON p.entry_id = e.id
    JOIN results r ON r.entry_id = e.id
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