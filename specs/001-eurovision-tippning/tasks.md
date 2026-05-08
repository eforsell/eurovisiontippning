---
description: "Task list for Eurovisiontippning App implementation"
---

# Tasks: Eurovisiontippning App

**Input**: Design documents from `/specs/001-eurovision-tippning/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/admin-import.json, quickstart.md

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US0, US1, US2)
- Exact file paths are included in descriptions.

---

## Phase 1: Setup & Infrastructure (Shared)

**Purpose**: Project initialization, testing framework, and base structural connectivity.

- [ ] T001 Initialize Vite React + TypeScript project in root.
- [ ] T002 [P] Install and configure Tailwind CSS in `tailwind.config.js` and `src/styles/index.css`.
- [ ] T003 [P] Initialize shadcn/ui and configure base settings in `components.json`.
- [ ] T004 Initialize local Supabase project (`supabase/`).
- [ ] T005 [P] Setup Vitest testing framework in `vitest.config.ts`.
- [ ] T006 Add `src/lib/supabase.ts` for the Supabase client initialization.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core data schemas, authentication testing enablement, and dynamic theming context.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [ ] T007 Create initial migration `supabase/migrations/00000000000000_schema.sql` for `years` and `entries` tables.
- [ ] T008 [P] Configure local Supabase Email/Password Auth for agent testing in `supabase/config.toml`.
- [ ] T009 Write autonomous verification script `tests/verify-auth.ts` to programmatically test auth login.
- [ ] T010 [P] Generate TypeScript types from local schema to `src/types/database.types.ts`.
- [ ] T011 Create `seed.sql` with mock 2025 Eurovision data (based on admin-import contract) in `supabase/seed.sql`.
- [ ] T012 Implement `src/store/ThemeContext.tsx` to handle dynamic CSS variables based on the active year.
- [ ] T013 Create base `src/components/Layout.tsx` providing the theme context to children.

**Checkpoint**: Foundation ready - UI development and stories can begin.

---

## Phase 3: User Story 0 - Unauthorized Landing Page (Priority: P1)

**Goal**: Display marketing content and login buttons to unauthorized users.
**Independent Test**: Navigate to root URL while logged out to see CTA and login buttons.

### Implementation for User Story 0

- [ ] T014 [US0] Create `src/pages/LandingPage.tsx` with hero section and contest info.
- [ ] T015 [US0] Create `src/components/Auth/LoginButton.tsx` linking to Supabase OAuth.
- [ ] T016 [US0] Update `src/App.tsx` (or main router) to render LandingPage for unauthenticated users.
- [ ] T017 [US0] Add Chrome DevTools MCP verification script `tests/verify-landing.ts` to assert CTA visibility.

**Checkpoint**: Unauthorized users can view the landing page and initiate login.

---

## Phase 4: User Story 1 - Predict Semifinal Qualifiers (Priority: P1) 🎯 MVP

**Goal**: Allow users to select exactly 10 countries per semifinal to progress.
**Independent Test**: Select 10 entries in the UI and verify persistence in Supabase.

### Implementation for User Story 1

- [ ] T018 [P] [US1] Create migration `supabase/migrations/..._predictions.sql` for `predictions` table and basic RLS.
- [ ] T019 [P] [US1] Regenerate types `src/types/database.types.ts`.
- [ ] T020 [US1] Create `src/hooks/useEntries.ts` to fetch entries for the active year.
- [ ] T021 [US1] Create `src/hooks/usePredictions.ts` to fetch and mutate user predictions.
- [ ] T022 [US1] Build `src/pages/SemifinalView.tsx` listing entries with selection toggles.
- [ ] T023 [US1] Implement exactly-10 validation logic inside `SemifinalView.tsx` or its custom hook.
- [ ] T024 [US1] Add Chrome DevTools MCP verification script `tests/verify-semifinal.ts` (injecting auth session).

**Checkpoint**: Users can predict their 10 semifinal qualifiers.

---

## Phase 5: User Story 2 - Rank Final Entries via Drag & Drop (Priority: P1)

**Goal**: Rank final entries using a touch-friendly drag-and-drop interface.
**Independent Test**: Reorder list items on mobile simulation and verify the new order is saved.

### Implementation for User Story 2

- [ ] T025 [P] [US2] Install `@dnd-kit/core`, `@dnd-kit/sortable`, and `@dnd-kit/utilities`.
- [ ] T026 [US2] Create `src/components/Ranking/SortableItem.tsx` utilizing dnd-kit.
- [ ] T027 [US2] Build `src/pages/FinalView.tsx` configuring `TouchSensor` and `PointerSensor` for dnd-kit.
- [ ] T028 [US2] Connect `FinalView.tsx` to `usePredictions.ts` to persist rank changes (1-26).
- [ ] T029 [US2] Add Chrome DevTools MCP verification script `tests/verify-ranking.ts`.

**Checkpoint**: Users can rank the Grand Final entries.

---

## Phase 6: User Story 3 - Social Sharing & Anti-Spoil (Priority: P2)

**Goal**: Share predictions with friends, hidden until the contest start time.
**Independent Test**: RLS blocks read access to friend predictions before `start_time`.

### Implementation for User Story 3

- [ ] T030 [P] [US3] Create migration `supabase/migrations/..._friends.sql` for `friends` table.
- [ ] T031 [P] [US3] Update `predictions` RLS in SQL to enforce Anti-Spoil (friends + timestamp check).
- [ ] T032 [P] [US3] Regenerate types `src/types/database.types.ts`.
- [ ] T033 [US3] Create `src/hooks/useFriends.ts` for managing friend requests/status.
- [ ] T034 [US3] Build `src/components/Social/FriendList.tsx` for searching and adding friends.
- [ ] T035 [US3] Build `src/components/Social/FriendPredictionModal.tsx` to view un-spoiled predictions.
- [ ] T036 [US3] Write script `tests/verify-rls.ts` to authenticate two mock users and assert RLS Anti-Spoil blocks.

**Checkpoint**: Friend predictions are visible only when the contest has started.

---

## Phase 7: User Story 4 - Admin Data Import (Priority: P2)

**Goal**: Provide an admin interface to paste JSON and populate the year/entries data.
**Independent Test**: Paste JSON in the admin form and verify database population.

### Implementation for User Story 4

- [ ] T037 [US4] Create `src/pages/AdminView.tsx` with a JSON textarea input.
- [ ] T038 [US4] Implement `src/services/adminService.ts` to parse `admin-import.json` structure and upsert `years`/`entries`.
- [ ] T039 [US4] Create `supabase/migrations/..._admin_rls.sql` ensuring only admins can insert to `years`/`entries`.

**Checkpoint**: Administrators can import new contest data.

---

## Phase 8: User Story 5 - Privacy & Data Control (Priority: P3)

**Goal**: Provide data usage transparency and an account deletion feature.
**Independent Test**: Clicking "Delete Account" removes the auth user and all cascading data.

### Implementation for User Story 5

- [ ] T040 [P] [US5] Create `src/pages/DataProtectionPage.tsx` outlining GDPR compliance.
- [ ] T041 [US5] Create migration `supabase/migrations/..._cascade.sql` ensuring user deletion cascades to `predictions`, `friends`, and `notes`.
- [ ] T042 [US5] Build `src/components/Settings/DeleteAccountDialog.tsx` with two-step confirmation.
- [ ] T043 [US5] Implement deletion logic calling Supabase `admin.deleteUser()` via an edge function or RPC.

**Checkpoint**: Users can self-service delete their accounts.

---

## Phase 9: Scoring Logic & Polish

**Purpose**: Leaderboard calculations, unit testing, and cross-cutting UX improvements.

- [ ] T044 [P] Create migration `supabase/migrations/..._results.sql` for the `results` table.
- [ ] T045 [P] Regenerate types `src/types/database.types.ts`.
- [ ] T046 Write Vitest unit tests in `tests/unit/scoring.test.ts` for the rank distance formula.
- [ ] T047 Implement scoring calculation logic in `src/services/scoringService.ts`.
- [ ] T048 Build `src/pages/LeaderboardView.tsx` to display aggregated points.
- [ ] T049 Run accessibility (a11y) audit via Chrome DevTools MCP and fix violations.
- [ ] T050 Verify responsive design for tab navigation and final rankings.
