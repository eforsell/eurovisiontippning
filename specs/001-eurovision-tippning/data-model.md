# Data Model: Eurovisiontippning App

## Entities

### `years`
Represents a Eurovision contest year and its global settings.
- `id`: UUID (Primary Key)
- `year`: Integer (Unique, e.g., 2025)
- `semi1_start`: Timestamp (UTC)
- `semi2_start`: Timestamp (UTC)
- `final_start`: Timestamp (UTC)
- `primary_color`: String (Hex code)
- `secondary_color`: String (Hex code)
- `logo_url`: String (URL to year-specific logo)

### `entries`
A song/artist entry for a specific year.
- `id`: UUID (Primary Key)
- `year_id`: UUID (Foreign Key to `years.id`)
- `country`: String
- `artist`: String
- `song_title`: String
- `start_position`: Integer (For the specific event)
- `semi_final`: Integer (1, 2, or NULL for direct finalists)
- `youtube_id`: String

### `predictions`
User's prediction for an entry.
- `id`: UUID (Primary Key)
- `user_id`: UUID (Supabase Auth reference)
- `entry_id`: UUID (Foreign Key to `entries.id`)
- `is_qualifier`: Boolean (Used for semifinals)
- `rank`: Integer (1-26, used for final)
- `type`: Enum ('semi1', 'semi2', 'final')

### `notes`
Private user notes for an entry.
- `id`: UUID (Primary Key)
- `user_id`: UUID (Supabase Auth reference)
- `entry_id`: UUID (Foreign Key to `entries.id`)
- `note`: Text

### `friends`
User relationships.
- `user_id`: UUID (Reference to auth.users)
- `friend_id`: UUID (Reference to auth.users)
- `status`: Enum ('pending', 'accepted')

### `results`
Actual contest results (populated by admin).
- `year_id`: UUID (Foreign Key to `years.id`)
- `entry_id`: UUID (Foreign Key to `entries.id`)
- `final_rank`: Integer
- `is_semi1_qualifier`: Boolean
- `is_semi2_qualifier`: Boolean

## RLS Strategy (Anti-Spoil)

### `predictions` Table
- **Read**: `auth.uid() = user_id` OR (is_accepted_friend(auth.uid(), user_id) AND now() >= get_start_time(entry_id))
- **Insert/Update/Delete**: `auth.uid() = user_id`

### `notes` Table
- **All**: `auth.uid() = user_id` (Completely private)

### `entries` and `years` Tables
- **Read**: Everyone (Authenticated)
- **All other**: Admin only
