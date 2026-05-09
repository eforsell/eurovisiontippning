# Research: UI, Navigation, and Admin Enhancements

## 1. Securing Admin Operations
**Decision**: Use Supabase Row Level Security (RLS) policies based on user roles stored in the database, avoiding client-side "security by obscurity".
**Rationale**: The user explicitly demanded proper access control. By enforcing `is_admin = true` on the `profiles` table within RLS policies, we guarantee that no regular user can insert, update, or delete contest metadata, even if they discover the endpoints.
**Alternatives considered**: Custom JWT claims (more complex to manage via Supabase Auth without edge functions). We will stick to a `profiles` table lookup in RLS.

## 2. Preventing Mobile Scroll Interference in Drag-and-Drop
**Decision**: Configure the `@dnd-kit` touch sensor with an activation constraint (e.g., `delay: 250, tolerance: 5` or `distance: 5`).
**Rationale**: This allows the user to scroll the page normally by swiping, while a deliberate long-press or direct horizontal/vertical drag activates the drag-and-drop feature, preventing accidental scroll locking or pull-to-refresh.
**Alternatives considered**: CSS `touch-action: none` on the entire list (makes the page unscrollable).

## 3. Privacy-Aware Friend Search
**Decision**: Implement a Supabase RPC (Stored Procedure) or an optimized view for friend searching that strictly filters `WHERE is_private = false AND (email ILIKE '%query%' OR name ILIKE '%query%')`.
**Rationale**: RLS policies can block read access to private profiles, but a dedicated RPC simplifies the partial matching logic without exposing all public emails to full sequential scans by malicious clients.
**Alternatives considered**: Allowing client-side filtering (violates privacy as all data must be downloaded).

## 4. Leaderboard Tie-Handling
**Decision**: Use SQL Window Functions (`RANK() OVER (ORDER BY score DESC)`) for calculating leaderboard positions.
**Rationale**: The `RANK()` function natively handles tied scores by assigning the same rank to identical values and skipping the next rank number (e.g., 1, 1, 3, 4), satisfying the specific requirement without complex frontend logic.
**Alternatives considered**: Client-side sorting and ranking calculation (slower and error-prone for paginated data).

## 5. Timezone Countdown Logic
**Decision**: Store all contest deadlines in UTC (`timestamptz` in PostgreSQL). The frontend will calculate the difference between the target UTC time and the user's local `Date.now()` for the countdown.
**Rationale**: Prevents users from manipulating deadlines by changing their local timezone. The voting closure check MUST happen server-side during the submission RPC/insert policy.
**Alternatives considered**: Server-rendered countdowns (too much latency).