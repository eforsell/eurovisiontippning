CREATE TABLE results (
  year_id UUID NOT NULL REFERENCES years(id) ON DELETE CASCADE,
  entry_id UUID NOT NULL REFERENCES entries(id) ON DELETE CASCADE,
  final_rank INTEGER,
  is_semi1_qualifier BOOLEAN,
  is_semi2_qualifier BOOLEAN,
  PRIMARY KEY (year_id, entry_id)
);

ALTER TABLE results ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Results are viewable by everyone"
ON results FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Admins can insert results"
ON results FOR INSERT
TO authenticated
WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update results"
ON results FOR UPDATE
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());