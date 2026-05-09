# Data Model: UI, Navigation, and Admin Enhancements

## Profile / User Data

The `profiles` table (linked to `auth.users`) needs updates for privacy, identification, and admin access.

**Table**: `profiles`
- `id` (uuid, primary key, references `auth.users`)
- `name` (text, nullable)
- `email` (text)
- `is_private` (boolean, default: false)
- `is_admin` (boolean, default: false)

**RLS Policies**:
- `SELECT`: Users can read their own profile. Users can read public profiles (`is_private = false`). Admins can read all profiles.
- `UPDATE`: Users can update their own `name` and `is_private` fields. Users CANNOT update `is_admin`.
- `DELETE`: Users can delete their own profile (with cascading deletes for friends/bets).

## Friend Connections

**Table**: `friends`
- `user_id` (uuid, references `profiles`)
- `friend_id` (uuid, references `profiles`)
- `status` (text: 'pending', 'accepted')

**Database Triggers / RPCs**:
- `set_account_private()`: An RPC or trigger that fires when a user sets `is_private = true`. It must delete all rows in `friends` where `user_id` or `friend_id` matches the user.

## Contest Metadata

**Table**: `contests` (or `semifinals` / `finals`)
- `id` (uuid)
- `name` (text)
- `type` (text: 'semi', 'final')
- `start_time` (timestamptz) - Used for strict deadline closure.
- `qualifiers` (jsonb array of entry IDs) - For semis.
- `final_order` (jsonb array of entry IDs) - For finals.

**RLS Policies**:
- `SELECT`: Publicly readable.
- `INSERT/UPDATE/DELETE`: Restricted strictly to users where `EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND is_admin = true)`.

## Validations & Calculations
- **Voting Closure**: Insert/Update policies on the `bets` (or `predictions`) table MUST include a condition `AND (SELECT start_time FROM contests WHERE id = bets.contest_id) > now()`.
- **Score Calculation**: The point calculation RPC should only execute if `array_length(qualifiers, 1) = 10` for semis, or `final_order` is fully populated for finals.