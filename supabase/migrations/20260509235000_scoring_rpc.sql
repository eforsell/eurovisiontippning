-- Backend scoring RPC
CREATE OR REPLACE FUNCTION public.calculate_scores(target_contest_id TEXT)
RETURNS BOOLEAN AS $$
DECLARE
  c_type TEXT;
  c_qualifiers JSONB;
  c_final_order JSONB;
BEGIN
  -- T024: Conditionally execute only when 10 qualifiers or final_order is full
  SELECT type, qualifiers, final_order INTO c_type, c_qualifiers, c_final_order
  FROM contests
  WHERE id = target_contest_id;

  IF c_type = 'semi' THEN
    IF jsonb_array_length(c_qualifiers) != 10 THEN
      RAISE EXCEPTION 'Cannot calculate scores for semifinal: Exactly 10 qualifiers are required.';
    END IF;
    -- Proceed with semi scoring logic (placeholder)
  ELSIF c_type = 'final' THEN
    -- Assuming a full final has 26 entries
    IF jsonb_array_length(c_final_order) < 25 THEN
      RAISE EXCEPTION 'Cannot calculate scores for final: Full final_order is required.';
    END IF;
    -- Proceed with final scoring logic (placeholder)
  END IF;

  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;