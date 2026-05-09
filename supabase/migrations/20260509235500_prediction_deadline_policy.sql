-- T027: Update predictions policy to block if contest has started
-- First drop the all-encompassing policy
DROP POLICY IF EXISTS "Users can manage their own predictions" ON public.predictions;

-- Helper function: get_start_time (Updated to default to future if no contest found so we don't break on missing data in local MVP setup)
CREATE OR REPLACE FUNCTION public.get_start_time(target_entry_id UUID, p_type prediction_type)
RETURNS TIMESTAMP WITH TIME ZONE AS $$
DECLARE
  v_start_time TIMESTAMP WITH TIME ZONE;
BEGIN
  SELECT 
    CASE 
      WHEN p_type = 'semi1' THEN y.semi1_start
      WHEN p_type = 'semi2' THEN y.semi2_start
      ELSE y.final_start
    END INTO v_start_time
  FROM entries e
  JOIN years y ON e.year_id = y.id
  WHERE e.id = target_entry_id;
  
  IF v_start_time IS NULL THEN
    v_start_time := now() + interval '1 year';
  END IF;

  RETURN v_start_time;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Users can read their own predictions always
CREATE POLICY "Users can read their own predictions"
ON public.predictions FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Users can insert if before deadline
CREATE POLICY "Users can insert their own predictions before deadline"
ON public.predictions FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id AND now() < public.get_start_time(entry_id, type));

-- Users can update if before deadline
CREATE POLICY "Users can update their own predictions before deadline"
ON public.predictions FOR UPDATE
TO authenticated
USING (auth.uid() = user_id AND now() < public.get_start_time(entry_id, type))
WITH CHECK (auth.uid() = user_id AND now() < public.get_start_time(entry_id, type));

-- Users can delete if before deadline
CREATE POLICY "Users can delete their own predictions before deadline"
ON public.predictions FOR DELETE
TO authenticated
USING (auth.uid() = user_id AND now() < public.get_start_time(entry_id, type));