-- Update search_public_users to exclude existing friends, pending requests, and self.
-- Also limit to 5 results as requested.

CREATE OR REPLACE FUNCTION public.search_public_users(query TEXT)
RETURNS TABLE(id UUID, name TEXT, email TEXT) AS $$
BEGIN
  RETURN QUERY
  SELECT p.id, p.name, p.email
  FROM public.profiles p
  WHERE p.is_private = false
    AND p.id != auth.uid()
    AND (p.email ILIKE '%' || query || '%' OR p.name ILIKE '%' || query || '%')
    AND NOT EXISTS (
      SELECT 1 FROM public.friends f
      WHERE (f.user_id = auth.uid() AND f.friend_id = p.id)
         OR (f.friend_id = auth.uid() AND f.user_id = p.id)
    )
  LIMIT 5;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;