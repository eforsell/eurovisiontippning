---
description: "Task list for Contest State Enhancements"
---

# Tasks: Contest State Enhancements

**Input**: Design documents from `/specs/005-contest-state-enhancements/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, quickstart.md

**Tests**: E2E (Playwright) and unit/integration (Vitest) tests are mandated by the constitution.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Exact file paths included in descriptions.

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [ ] T001 Verify active branch is `005-contest-state-enhancements` via `git branch --show-current`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T002 Generate new Supabase migration for `final_start_position` in `supabase/migrations/`
- [ ] T003 Generate new Supabase migration to update `get_friends_leaderboard` RPC to return score breakdowns in `supabase/migrations/`
- [ ] T004 Update `src/types/database.types.ts` to include `final_start_position` on the `entries` table and the new RPC return type.

**Checkpoint**: Foundation ready - database schema updated, user story implementation can now begin.

---

## Phase 3: User Story 1 - Contest Lock States (Priority: P1)

**Goal**: Prevent users from modifying predictions and admins from progressing a contest once its start time has passed.

**Independent Test**: Ensure user predictions are locked visually and functionally once the contest start time is reached, and the admin progression button is disabled.

### Implementation for User Story 1

- [ ] T005 [P] [US1] Create Playwright E2E test `tests/e2e/betting-window-lock.spec.ts` verifying clicking is disabled but styles remain when a contest has started.
- [ ] T006 [P] [US1] Create Playwright E2E test `tests/e2e/admin-progression-lock.spec.ts` verifying the progression button is disabled before a contest starts.
- [ ] T007 [US1] Update `src/components/Admin/ProgressionManager.tsx` (or equivalent admin view component) to disable the progression action if the current time is before the contest start time.
- [ ] T008 [US1] Update `src/components/Ranking/EntryList.tsx` (or equivalent component handling entry cards) to conditionally remove drag-and-drop handles and apply `pointer-events-none` via Tailwind if the contest has started.
- [ ] T009 [US1] Update `src/components/Ranking/EntryItem.tsx` (or equivalent entry card component) to ensure visual styling is retained when locked.

**Checkpoint**: User predictions and admin actions are correctly locked based on contest start time. Tests passing.

---

## Phase 4: User Story 2 - Semifinal Results Visibility (Priority: P1)

**Goal**: Display official results, scores, and visual indicators of progression/elimination on semifinal tippning and sharing pages. Filter entries on sharing pages to the specific contest.

**Independent Test**: Progress entries as an admin, then verify scores and progress styling appear on the semifinal tippning page.

### Implementation for User Story 2

- [ ] T010 [P] [US2] Create Vitest component test `tests/components/EntryItemVisibility.test.tsx` for scoring and opacity/border styling.
- [ ] T011 [P] [US2] Create Playwright E2E test `tests/e2e/sharing-view-filter.spec.ts` to verify only the relevant contest entries are shown.
- [ ] T012 [US2] Update `src/pages/SemifinalView.tsx` (and relevant sharing views) to ensure entries are strictly filtered to the corresponding contest.
- [ ] T013 [US2] Update `src/components/Ranking/EntryList.tsx` to conditionally pass down scores and progression status to `EntryItem.tsx` if the semifinal is marked as progressed.
- [ ] T014 [US2] Update `src/components/Ranking/EntryItem.tsx` to display the score when available.
- [ ] T015 [US2] Update `src/components/Ranking/EntryItem.tsx` to add Tailwind classes for reduced opacity and dashed borders when an entry has failed to progress.

**Checkpoint**: Semifinal results are clearly visible and styling indicates progression status. Sharing views are correctly filtered. Tests passing.

---

## Phase 5: User Story 3 - Grand Final Results and Order (Priority: P1)

**Goal**: Use `final_start_position` for sorting the Grand Final. Show final points and rank when the Grand Final is completed.

**Independent Test**: Set final finishing orders and verify that entries on the Grand Final page sort by final rank and display their total points and final rank.

### Implementation for User Story 3

- [ ] T016 [P] [US3] Create Vitest unit test `tests/unit/finalSorting.test.ts` for the `final_start_position` vs final rank sorting logic.
- [ ] T017 [P] [US3] Create Playwright E2E test `tests/e2e/final-results-display.spec.ts` verifying final rank and points are visible on the Grand Final page.
- [ ] T018 [US3] Update frontend sorting logic in `src/pages/FinalView.tsx` (or the relevant hook like `useEntries.ts`) to sort by `final_start_position` (nulls at the end) instead of the original `start_position` for the Grand Final context.
- [ ] T019 [US3] Update `src/components/Ranking/EntryItem.tsx` to display `final_start_position` instead of the original `start_position` when viewed in the Grand Final context.
- [ ] T020 [US3] Update sorting logic in `src/pages/FinalView.tsx` to sort by final rank when finishing orders and points are available.
- [ ] T021 [US3] Update `src/components/Ranking/EntryItem.tsx` to display final points and final ranking when available in the Grand Final context.
- [ ] T022 [US3] Ensure the sharing view for the Grand Final uses the exact same sorting and display logic as `FinalView.tsx`.

**Checkpoint**: Grand Final correctly uses the new start position and displays final rankings and points. Tests passing.

---

## Phase 6: User Story 4 - Friends Score Breakdown and Mock Data (Priority: P2)

**Goal**: Allow expanding a friend on the leaderboard to see their score partitioned by contest. Provide mock data for testing.

**Independent Test**: Expand a friend on the leaderboard and verify the score is broken down by semi1, semi2, and final. Check the database seed for mock friend relationships.

### Implementation for User Story 4

- [ ] T023 [P] [US4] Create Playwright E2E test `tests/e2e/leaderboard-breakdown.spec.ts` verifying expanding a row displays the correct sum of individual contest scores.
- [ ] T024 [P] [US4] Update `supabase/seed.sql` to include mock users, friend relationships with `eskil.forsell@gmail.com` (both pending and accepted), and mock predictions spanning Semi 1, Semi 2, and Final for these users.
- [ ] T025 [US4] Modify `src/components/Leaderboard/LeaderboardRow.tsx` (or equivalent leaderboard component) to be expandable.
- [ ] T026 [US4] Implement logic in the expandable section of the leaderboard row to display the score breakdown fetched from the updated RPC.

**Checkpoint**: Leaderboard supports score breakdown per contest, and seed data facilitates local testing. Tests passing.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T027 Update Edge Case handling: Ensure `src/pages/SemifinalView.tsx` and `src/pages/FinalView.tsx` display an error toast and revert UI state if a prediction update is rejected by the backend due to deadline passing.
- [ ] T028 Run `npm run typecheck` and fix any TypeScript errors introduced by the changes.
- [ ] T029 Run `npm run lint` and fix any linter errors.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel.
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2)
- **User Story 2 (P1)**: Can start after Foundational (Phase 2)
- **User Story 3 (P1)**: Can start after Foundational (Phase 2)
- **User Story 4 (P2)**: Can start after Foundational (Phase 2)

### Parallel Opportunities

- All Foundational tasks must be completed sequentially due to DB migration -> Type generation dependency.
- Once Foundational phase completes, User Stories 1, 2, 3, and 4 can start in parallel.
- T024 (seed data update) can be done at any point after Foundation, independently of UI work.
- Tests (T005, T006, T010, T011, T016, T017, T023) can be written in parallel with or before their respective implementations.

---

## Implementation Strategy

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready (DB schema supports `final_start_position` and leaderboard RPC).
2. Add User Story 1 → Test independently → Predictions lock correctly at deadline.
3. Add User Story 2 → Test independently → Semifinal scores and progress highlights show up.
4. Add User Story 3 → Test independently → Grand Final sorts by new start position and shows final ranks.
5. Add User Story 4 → Test independently → Leaderboard expands to show score breakdown.
6. Polish → Fix any edge cases, types, and linting.