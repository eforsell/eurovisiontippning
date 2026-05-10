---
description: "Task list for admin-import-scoring-visibility"
---

# Tasks: admin-import-scoring-visibility

**Input**: Design documents from `/specs/004-admin-import-scoring-visibility/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 Fix all existing linting and testing errors across the project to ensure a clean state before starting.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

- [ ] T002 Generate new Supabase migration `admin_import_scoring`.
- [ ] T003 Update migration file to add `betting_started` (BOOLEAN NOT NULL DEFAULT false) to `years` table.
- [ ] T004 Update migration file to refine the `get_leaderboard` RPC logic (check `semi1_completed` / `semi2_completed` before trying to award points according to the entry's `progressed` status).
- [ ] T005 [P] Run local database migration and regenerate TypeScript definitions in `src/types/database.types.ts`.
- [x] T006 [P] Update `scoringService.ts` to correctly mirror the RPC scoring logic updates for frontend display calculations.

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Admin Batch Setup (Priority: P1)

**Goal**: Import all entries for a new year from a JSON file, replacing existing entries.

**Independent Test**: Can be tested by providing a valid JSON file and verifying that the `entries` table is cleared and repopulated correctly.

### Tests for User Story 1

- [x] T007 [P] [US1] Unit test for JSON parsing and validation logic in `tests/components/EntryManager.test.tsx` or new utility test file.

### Implementation for User Story 1

- [x] T008 [US1] Add JSON schema description text to the UI in `src/components/Admin/EntryManager.tsx`.
- [x] T009 [US1] Implement file upload and client-side JSON validation against schema in `src/components/Admin/EntryManager.tsx`.
- [x] T010 [US1] Implement destructive replace logic in `src/services/adminService.ts` (delete existing entries for the year, insert new ones).
- [x] T011 [US1] Add a prominent warning dialog before executing the destructive import in `src/components/Admin/EntryManager.tsx`.
- [x] T012 [P] [US1] Ensure no new lint/test errors have been introduced.

**Checkpoint**: Admin Batch Setup should be fully functional and testable independently

---

## Phase 4: User Story 4 - Accurate Semi-Final Scoring (Priority: P1)

**Goal**: Score reflects only the correct progression guesses after the semi-final results are official.

**Independent Test**: Set a user's progression bet, then set the actual show results, and verify the calculated score matches.

### Tests for User Story 4

- [x] T013 [P] [US4] Update unit tests in `tests/unit/scoring.test.ts` to ensure points are 0 if the semi is not completed.

### Implementation for User Story 4

- [x] T014 [US4] Verify the updated `get_leaderboard` RPC returns correct scores based on the `semi_completed` flags.
- [x] T015 [P] [US4] Ensure no new lint/test errors have been introduced.

**Checkpoint**: Scoring should now be fully accurate and dependent on official results.

---

## Phase 5: User Story 2 - Betting Window Management (Priority: P1)

**Goal**: Toggle whether betting is active so that entries can be prepared before allowing users to tip.

**Independent Test**: Toggle the "Betting Started" switch and verify that non-admin users can/cannot access the tipping views.

### Tests for User Story 2

- [x] T016 [P] [US2] E2E test for betting window access control in `tests/e2e/betting-window.spec.ts`.

### Implementation for User Story 2

- [x] T017 [US2] Add a switch/checkbox for `betting_started` in `src/components/Admin/MetadataForm.tsx`.
- [x] T018 [US2] Update `handleMetadataSave` to persist the new `betting_started` flag.
- [x] T019 [US2] Implement access control logic in `src/pages/SemifinalView.tsx` and `src/pages/FinalView.tsx` to block tipping (e.g., disable saves or show "Coming Soon") if `betting_started` is false.
- [x] T020 [P] [US2] Ensure no new lint/test errors have been introduced.

**Checkpoint**: Betting window can be actively managed by admins.

---

## Phase 6: User Story 3 - Show-Specific Friend Comparisons (Priority: P2)

**Goal**: See how friends have betted for each specific show (Semi 1, Semi 2, Final) to compare picks side-by-side.

**Independent Test**: Open the Leaderboard, switch between show tabs, and click an entry to see the list of friends' bets.

### Tests for User Story 3

- [x] T021 [P] [US3] Unit/Integration test for expandable rows and friend data fetching in `tests/components/LeaderboardView.test.tsx`.

### Implementation for User Story 3

- [x] T022 [US3] Update `src/pages/LeaderboardView.tsx` to include Tabs for "Semi 1", "Semi 2", and "Final".
- [x] T023 [US3] Filter and sort entries by `start_order` for the selected tab in `LeaderboardView.tsx`.
- [x] T024 [US3] Implement an expandable row component for entries in the Leaderboard.
- [x] T025 [US3] Fetch and display friends' specific bets (progression or rank) within the expanded entry view.
- [x] T026 [US3] Ensure that entry expansion is responsive, even with multiple friends and entries.
- [x] T027 [P] [US3] Ensure no new lint/test errors have been introduced.

**Checkpoint**: Users can compare friends' bets per entry.

---

## Phase N: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [x] T028 [P] Run full accessibility (a11y) check on new admin and leaderboard UI components.
- [x] T029 Run final full suite of linting, type-checking, and tests to verify everything is green.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Must run first to ensure a clean starting state.
- **Foundational (Phase 2)**: Depends on Setup. BLOCKS all user stories as it sets up the DB schema and types.
- **User Stories (Phase 3-6)**: All depend on Foundational phase completion. They can generally proceed in parallel, but US4 relies heavily on the Foundational RPC changes.
- **Polish (Final Phase)**: Depends on all user stories being complete.

### Parallel Opportunities

- Foundational DB/Type generation (T005) and frontend scoring service updates (T006) can happen concurrently after the SQL is written.
- Tests (T007, T013, T016, T021) can be written in parallel with or prior to their respective implementations.
- US1, US2, and US3 UI implementations can be parallelized as they touch different views (Admin vs Leaderboard).

## Implementation Strategy

### MVP First (US1, US4, US2)

1. Complete Setup and Foundational tasks.
2. Implement US1 (Admin Batch Setup) to allow data seeding.
3. Implement US4 (Accurate Scoring) to fix the core logic bug.
4. Implement US2 (Betting Window) to secure the app state.
5. Stop and validate the core integrity of the application.

### Incremental Polish

1. Finally, add US3 (Show-Specific Friend Comparisons) to enhance the social experience once the core is stable.
