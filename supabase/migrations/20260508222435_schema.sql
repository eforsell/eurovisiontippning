-- Create years table
CREATE TABLE years (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  year INTEGER UNIQUE NOT NULL,
  semi1_start TIMESTAMP WITH TIME ZONE NOT NULL,
  semi2_start TIMESTAMP WITH TIME ZONE NOT NULL,
  final_start TIMESTAMP WITH TIME ZONE NOT NULL,
  primary_color TEXT NOT NULL,
  secondary_color TEXT NOT NULL,
  logo_url TEXT
);

-- Create entries table
CREATE TABLE entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  year_id UUID NOT NULL REFERENCES years(id) ON DELETE CASCADE,
  country TEXT NOT NULL,
  artist TEXT NOT NULL,
  song_title TEXT NOT NULL,
  start_position INTEGER NOT NULL,
  semi_final INTEGER CHECK (semi_final IN (1, 2)),
  youtube_id TEXT
);

-- Enable RLS
ALTER TABLE years ENABLE ROW LEVEL SECURITY;
ALTER TABLE entries ENABLE ROW LEVEL SECURITY;

-- Policies for years
CREATE POLICY "Years are viewable by authenticated users"
ON years FOR SELECT
TO authenticated
USING (true);

-- Admin policies (for future, assuming admin role or similar, for now we can just leave it as no insert/update/delete policy means denied by default unless bypass RLS)

-- Policies for entries
CREATE POLICY "Entries are viewable by authenticated users"
ON entries FOR SELECT
TO authenticated
USING (true);
