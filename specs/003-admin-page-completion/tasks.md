---
description: "Task list template for feature implementation"
---

# Tasks: Admin Page Completion

**Input**: Design documents from `/specs/003-admin-page-completion/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: The examples below include test tasks based on the project Constitution requiring tests for every functional requirement.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Single project**: `src/`, `tests/` at repository root

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [ ] T001 Define updated schema types in `src/types/database.types.ts` manually (or via generation if DB is updated first) to support the new metadata and entry fields.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T002 Create Supabase migration file `supabase/migrations/[timestamp]_admin_page_completion.sql` and add all `years` table column extensions (location, progression targets, completed flags).
- [ ] T003 Append to the Supabase migration file the changes for the `entries` table (add `starting_contest` and manage `semi_final` column transition).
- [ ] T004 Create the base `AdminView` layout structure with the routing/tabs for Metadata, Entries, Semi1, Semi2, and Final Ranking in `src/pages/AdminView.tsx`.
- [ ] T005 [P] Create a reusable `TabNavigation` component for the admin interface in `src/components/Admin/TabNavigation.tsx`.

**Checkpoint**: Foundation ready - user story implementation can now begin.

---

## Phase 3: User Story 1 - Metadata and Entry Setup (Priority: P1) 🎯 MVP

**Goal**: Configure event metadata and manage the list of all participating entries so foundational data exists.

**Independent Test**: Can be fully tested by creating metadata, saving it, verifying persistence, and adding entries with different starting contests.

### Tests for User Story 1

- [ ] T006 [P] [US1] Integration test for Metadata saving logic in `tests/components/MetadataForm.test.tsx`
- [ ] T007 [P] [US1] Integration test for Entry management in `tests/components/EntryManager.test.tsx`
- [ ] T008 [P] [US1] E2E test for Admin metadata and entry setup journey in `tests/e2e/admin-setup.spec.ts`

### Implementation for User Story 1

- [ ] T009 [US1] Create the `MetadataForm` component for year, location, start times, and progression targets in `src/components/Admin/MetadataForm.tsx`.
- [ ] T010 [US1] Implement validation logic in `MetadataForm` preventing target reduction if below current progressed count.
- [ ] T011 [US1] Create the `EntryManager` component to list, add, edit, and remove entries in `src/components/Admin/EntryManager.tsx`.
- [ ] T012 [US1] Implement the `starting-contest` dropdown logic within the `EntryManager`.
- [ ] T013 [US1] Integrate `MetadataForm` and `EntryManager` into their respective tabs in `src/pages/AdminView.tsx`.

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently.

---

## Phase 4: User Story 2 - Semifinal Progression and Validation (Priority: P1)

**Goal**: Mark exactly the right number of entries as progressed for a given semifinal.

**Independent Test**: Test saving progressions with incorrect counts (must fail) and correct counts (must succeed and mark completed).

### Tests for User Story 2

- [ ] T014 [P] [US2] Unit test for progression validation logic in `tests/unit/progressionValidation.test.ts`
- [ ] T015 [P] [US2] E2E test for saving Semifinal 1 and Semifinal 2 progressions in `tests/e2e/admin-semifinal-progression.spec.ts`

### Implementation for User Story 2

- [ ] T016 [US2] Create the `ProgressionManager` drag-and-drop component using `@dnd-kit/core` in `src/components/Admin/ProgressionManager.tsx`.
- [ ] T017 [US2] Implement progression validation hook/logic to ensure the selected count matches the target count exactly in `src/hooks/useProgressionValidation.ts`.
- [ ] T018 [US2] Connect the save action in `ProgressionManager` to update the `is_semi1_qualifier` and `is_semi2_qualifier` flags in the `results` table.
- [ ] T019 [US2] Update `years.semi1_completed` or `years.semi2_completed` to true upon successful progression save.
- [ ] T020 [US2] Integrate `ProgressionManager` instances into the Semi1 and Semi2 tabs in `src/pages/AdminView.tsx`.

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently.

---

## Phase 5: User Story 3 - Grand Final Activation and Ranking (Priority: P1)

**Goal**: Activate the Final Ranking tab only when both semifinals are completed, and set the final ranking among all eligible entries.

**Independent Test**: Verify Final tab is locked until both semis are completed, then successfully set and save the final ranking.

### Tests for User Story 3

- [ ] T021 [P] [US3] Unit test for Final Ranking activation logic in `tests/unit/finalActivation.test.ts`
- [ ] T022 [P] [US3] E2E test for Final Ranking activation and ranking save in `tests/e2e/admin-final-ranking.spec.ts`

### Implementation for User Story 3

- [ ] T023 [US3] Implement logic in `src/pages/AdminView.tsx` to lock the Final Ranking tab based on `years.semi1_completed` and `years.semi2_completed`.
- [ ] T024 [US3] Create the `FinalRankingManager` component using `@dnd-kit/core` in `src/components/Admin/FinalRankingManager.tsx`.
- [ ] T025 [US3] Fetch all progressed entries (`is_semi1_qualifier` OR `is_semi2_qualifier`) plus 'final' auto-qualifiers for the `FinalRankingManager`.
- [ ] T026 [US3] Connect the save action to update the `final_rank` in the `results` table.
- [ ] T027 [US3] Integrate `FinalRankingManager` into the Final Ranking tab in `src/pages/AdminView.tsx`.

**Checkpoint**: All user stories should now be independently functional.

---

## Phase 6: User Story 4 - Handling Disqualifications and Corrections (Priority: P2)

**Goal**: Allow "de-progressing" an entry or correcting progression lists gracefully.

**Independent Test**: De-progress an entry from a completed semifinal and verify final ranking correctly reflects the dropped entry without breaking.

### Tests for User Story 4

- [ ] T028 [P] [US4] Integration test for de-progression logic impacting the target count in `tests/components/ProgressionManager.test.tsx`
- [ ] T029 [P] [US4] E2E test for disqualification/correction flows in `tests/e2e/admin-disqualification.spec.ts`

### Implementation for User Story 4

- [ ] T030 [US4] Update `MetadataForm` and Supabase mutations to handle target decrease edge-case cleanly, automatically de-progressing if instructed (or blocking as per Clarification 1).
- [ ] T031 [US4] Update `EntryManager` so that changing `starting_contest` away from a semi automatically de-progresses the entry and adjusts the target count (Clarification 3).
- [ ] T032 [US4] Update `FinalRankingManager` to gracefully filter out any entries that are no longer progressed and retain the relative ranks of remaining entries in `src/components/Admin/FinalRankingManager.tsx`.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T033 [P] Verify optimistic locking / "Last write wins" behavior on save operations to ensure robust error handling without crashing (Clarification 2).
- [ ] T034 [P] Run accessibility (a11y) audit on the Admin tabs and drag-and-drop components.
- [ ] T035 Review database migration script and verify it correctly handles existing data gracefully.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-6)**: All depend on Foundational phase completion
  - Proceed sequentially in priority order (P1 → P1 → P1 → P2). US3 requires the DB structure and logic of US2 to be testable.
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### Parallel Opportunities

- All tests for a user story marked [P] can run in parallel
- Supabase migrations (Phase 2) can be drafted in parallel with basic UI tab layouts.

---

## Implementation Strategy

### MVP First (User Story 1 & 2)

1. Complete Phase 1 & 2 (Setup & Foundational)
2. Complete Phase 3 (US1) - Metadata and Entry Setup
3. Complete Phase 4 (US2) - Semifinal Progression
4. Validate these features end-to-end to ensure the core event setup flow works.

### Incremental Delivery

1. Follow MVP steps above.
2. Deliver Phase 5 (US3) - Final Ranking Activation.
3. Deliver Phase 6 (US4) - Disqualification edge cases.
4. Each story adds value and increases the robustness of the admin tools.