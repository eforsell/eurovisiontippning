# Tasks: UI, Navigation, and Admin Enhancements

**Input**: Design documents from `/specs/002-ui-admin-enhancements/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 Create Supabase migration file for profile fields (`is_private`, `is_admin`) in `supabase/migrations/`
- [x] T002 [P] Create `HamburgerMenu` shell component in `src/components/Navigation/HamburgerMenu.tsx`
- [x] T003 [P] Add generic high-contrast heading classes to `tailwind.config.js` or `src/styles/index.css`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

- [x] T004 Apply database migration for `profiles` table to add `is_private` and `is_admin` columns.
- [x] T005 Update RLS policies on `profiles` to enforce read/write restrictions based on privacy and admin status.
- [x] T006 Update `contests` table RLS policies to restrict INSERT/UPDATE/DELETE to `is_admin = true` users.
- [x] T007 Implement the `set_account_private()` database trigger/RPC to wipe friend links when an account goes private.
- [x] T008 Update `@dnd-kit` touch sensors configuration in `src/components/Ranking/SortableItem.tsx` (or parent context) to prevent scroll interference.

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel.

---

## Phase 3: User Story 1 - Improved Mobile & Visual UX (Priority: P1)

**Goal**: Better visual contrast, centered text in semifinals without checkboxes, and working drag-and-drop on mobile.

**Independent Test**: Open the app on a mobile device to verify smooth drag-and-drop, and check text contrast/alignment.

### Implementation for User Story 1

- [x] T009 [P] [US1] Apply high-contrast heading classes to all page components (`src/pages/*.tsx`).
- [x] T010 [P] [US1] Remove checkboxes from the semifinal song lists in `src/pages/SemifinalView.tsx`.
- [x] T011 [P] [US1] Center the song text in the semifinal lists in `src/pages/SemifinalView.tsx`.
- [x] T012 [US1] Verify `@dnd-kit` touch sensor changes (from T008) function correctly on mobile view.

**Checkpoint**: User Story 1 should be fully functional and testable independently.

---

## Phase 4: User Story 2 - Navigation & Account Management (Priority: P1)

**Goal**: Hamburger menu for navigation and a dedicated Account page for profile management and deletion.

**Independent Test**: Navigate using the hamburger menu, change privacy settings, and test account deletion.

### Implementation for User Story 2

- [x] T013 [P] [US2] Implement `HamburgerMenu` UI and routing logic in `src/components/Navigation/HamburgerMenu.tsx`.
- [x] T014 [US2] Create the `AccountView` page in `src/pages/AccountView.tsx`.
- [x] T015 [US2] Integrate Supabase Auth deletion logic into the `AccountView` "Delete account" button.
- [x] T016 [US2] Implement the "Private Account" toggle in `AccountView` to update the `is_private` profile flag.
- [x] T017 [US2] Update the Privacy Policy page (`src/pages/DataProtectionPage.tsx`) to explain account deletion via Account settings.
- [x] T018 [US2] Update the main application layout (`src/components/Layout.tsx` or similar) to include the `HamburgerMenu`.

**Checkpoint**: Navigation and account management flows are complete.

---

## Phase 5: User Story 5 - Admin Controls & Validation (Priority: P1)

**Goal**: Safely import JSON data with validation, adjust contest details, mark qualifiers, and trigger final scoring.

**Independent Test**: Log in as admin, test valid/invalid JSON imports, edit contest metadata, and mark qualifiers to trigger point calculations.

### Implementation for User Story 5

- [x] T019 [P] [US5] Implement JSON schema validation in `src/pages/AdminView.tsx` against `specs/002-ui-admin-enhancements/contracts/admin-import.json`.
- [x] T020 [US5] Add a warning/confirmation dialog before processing the admin JSON import.
- [x] T021 [US5] Implement UI forms in `AdminView` to manually edit `contests` details (start time, name).
- [x] T022 [US5] Implement UI in `AdminView` to mark exactly 10 entries as "qualified" for a semifinal.
- [x] T023 [US5] Implement UI in `AdminView` to set the final placement order for the final.
- [x] T024 [US5] Update the backend scoring RPC to conditionally execute ONLY when 10 qualifiers are marked (semis) or `final_order` is full (finals).

**Checkpoint**: Admin controls are fully secured and functional.

---

## Phase 6: User Story 3 - Timezone-Aware Deadlines & Final Unlocking (Priority: P2)

**Goal**: See a countdown to voting closure and lock the final until all semifinalists are known.

**Independent Test**: Verify countdown timers and test that the final list is locked before semifinals are complete.

### Implementation for User Story 3

- [x] T025 [P] [US3] Implement a real-time, timezone-aware UTC countdown component.
- [x] T026 [US3] Integrate the countdown component into `src/pages/SemifinalView.tsx`.
- [x] T027 [US3] Add a Supabase RLS Insert/Update policy on the `predictions`/`bets` table to block submissions if `now() > contests.start_time`.
- [x] T028 [US3] Update `src/pages/FinalView.tsx` to check if both semifinals have 10 qualifiers; disable viewing/drag-and-drop if false.

**Checkpoint**: Deadlines are strictly enforced both client-side and server-side.

---

## Phase 7: User Story 4 - Friend Search & Leaderboard (Priority: P2)

**Goal**: Search for friends by email/name and view a friend-specific leaderboard with tied-rank handling.

**Independent Test**: Search for a friend, add them, and verify the friend-specific leaderboard calculates tied ranks correctly.

### Implementation for User Story 4

- [x] T029 [P] [US4] Create a Supabase RPC for friend search (`search_public_users`) implementing partial matching on name/email and filtering out `is_private = true`.
- [x] T030 [P] [US4] Update the leaderboard calculation RPC to use SQL `RANK() OVER (ORDER BY score DESC)` for tie-handling.
- [x] T031 [US4] Update the Friend Search UI in `src/pages/LeaderboardView.tsx` or `src/components/Social/FriendList.tsx` to use the new search RPC.
- [x] T032 [US4] Update the Leaderboard UI to display the new rank numbers properly.

**Checkpoint**: Social features are complete and privacy-respecting.

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [x] T033 [P] Verify heading contrasts against WCAG AA standards across all views.
- [x] T034 [P] Test drag-and-drop functionality on physical mobile devices (iOS/Android browsers).
- [x] T035 Review Admin RLS policies to ensure no metadata tampering is possible via direct API calls.

---

## Dependencies & Execution Order

### Phase Dependencies
- **Setup (Phase 1)**: Start immediately.
- **Foundational (Phase 2)**: Depends on Setup. BLOCKS all user stories.
- **User Stories (Phase 3-7)**: All depend on Foundational phase.
  - US1, US2, and US5 (P1) should be prioritized and can be executed in parallel.
  - US3 and US4 (P2) can follow once P1 stories are stable.
- **Polish (Phase 8)**: Depends on all user stories.

### Parallel Opportunities
- All Setup tasks (T001-T003) can be worked on concurrently.
- RLS policy updates (T005, T006) and frontend touch sensor fixes (T008) in Phase 2 can happen in parallel.
- UI styling (US1), Menu development (US2), and Admin validation logic (US5) can be split among developers simultaneously.