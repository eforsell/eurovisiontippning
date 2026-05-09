# Phase 0: Research

## Data Model Enhancements
**Decision**: We will extend the existing `years` table to include `location` (TEXT), `semi1_progression_target` (INTEGER, default 10), `semi2_progression_target` (INTEGER, default 10), `semi1_completed` (BOOLEAN, default false), and `semi2_completed` (BOOLEAN, default false). For the `entries` table, the spec mentions a "starting-contest" dropdown ('semi1', 'semi2', 'final'). The current `semi_final` column is `INTEGER CHECK (semi_final IN (1, 2))`. We will drop this constraint and add a new constraint allowing 1, 2, or 3 (3 = final), or add a `starting_contest` TEXT column. To be explicit, we'll keep `semi_final` and change it to `starting_contest` (TEXT) or allow NULL. Let's use a new `starting_contest` column of type `TEXT CHECK (starting_contest IN ('semi1', 'semi2', 'final'))`.
**Rationale**: Reusing and extending existing tables is better than creating parallel structures. The `years` table is effectively our event metadata table.
**Alternatives considered**: Creating a separate `event_metadata` table, but `years` already serves this purpose perfectly.

## State Management and Validation
**Decision**: We will use standard React hooks and the Supabase client for data fetching and mutations. Validation logic for the progression counts (e.g., exactly matching the target progression count) and edge case handling (e.g., target decrease prevention) will be handled primarily on the client side before submission, supplemented by potential PostgreSQL functions if atomic operations are needed.
**Rationale**: Matches the project's React architecture and provides instant feedback (PR-001).

## Drag and Drop / Ranking UI
**Decision**: Use `@dnd-kit/core` and `@dnd-kit/sortable` for the progression lists and final ranking UI.
**Rationale**: `@dnd-kit` is explicitly mandated in the project Constitution (Target Tech Stack) for ranking entries.
**Alternatives considered**: Manual up/down buttons (inferior UX) or `react-beautiful-dnd` (deprecated).

## Contract / Data Exchange
**Decision**: Since this is a direct React-to-Supabase architecture, we do not need external API contracts in `/contracts/`. The DB schema acts as our contract. We will generate the TypeScript definitions from the Supabase schema.
**Rationale**: Native Supabase pattern.