-- Create friendship status enum
CREATE TYPE friendship_status AS ENUM ('pending', 'accepted');

-- Create friends table
CREATE TABLE friends (
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  friend_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status friendship_status NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  PRIMARY KEY (user_id, friend_id),
  CHECK (user_id != friend_id)
);

ALTER TABLE friends ENABLE ROW LEVEL SECURITY;

-- Policy: users can view their friendships
CREATE POLICY "Users can view their friendships"
ON friends FOR SELECT
TO authenticated
USING (auth.uid() = user_id OR auth.uid() = friend_id);

-- Policy: users can create friend requests
CREATE POLICY "Users can insert friend requests"
ON friends FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Policy: users can accept or reject requests sent to them
CREATE POLICY "Users can update requests sent to them"
ON friends FOR UPDATE
TO authenticated
USING (auth.uid() = friend_id)
WITH CHECK (auth.uid() = friend_id);

-- Policy: users can delete their friendships
CREATE POLICY "Users can delete their friendships"
ON friends FOR DELETE
TO authenticated
USING (auth.uid() = user_id OR auth.uid() = friend_id);

-- Helper function: is_accepted_friend
CREATE OR REPLACE FUNCTION public.is_accepted_friend(uid UUID, target_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM friends
    WHERE status = 'accepted'
    AND ((user_id = uid AND friend_id = target_id) OR (user_id = target_id AND friend_id = uid))
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Helper function: get_start_time
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
  
  RETURN v_start_time;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add read policy for Anti-Spoil
-- The existing ALL policy gives user access to their own rows.
-- This SELECT policy grants access to friends if the contest has started.
CREATE POLICY "Friends can view predictions after start time"
ON predictions FOR SELECT
TO authenticated
USING (
  public.is_accepted_friend(auth.uid(), user_id) AND 
  now() >= public.get_start_time(entry_id, type)
);