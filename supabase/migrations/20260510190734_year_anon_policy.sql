-- Allow anonymous users to view years (needed for theme context on landing page)
CREATE POLICY "Years are viewable by anonymous users"
ON years FOR SELECT
TO anon
USING (true);
