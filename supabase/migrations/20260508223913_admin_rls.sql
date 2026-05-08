CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM auth.users
    WHERE id = auth.uid() AND (email = 'admin@example.com' OR raw_user_meta_data->>'is_admin' = 'true')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Policies for years
CREATE POLICY "Admins can insert years" ON years FOR INSERT TO authenticated WITH CHECK (public.is_admin());
CREATE POLICY "Admins can update years" ON years FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admins can delete years" ON years FOR DELETE TO authenticated USING (public.is_admin());

-- Policies for entries
CREATE POLICY "Admins can insert entries" ON entries FOR INSERT TO authenticated WITH CHECK (public.is_admin());
CREATE POLICY "Admins can update entries" ON entries FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admins can delete entries" ON entries FOR DELETE TO authenticated USING (public.is_admin());