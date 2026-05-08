# Feature Specification: Eurovisiontippning App

**Feature Branch**: `001-eurovision-tippning`  
**Created**: 2026-05-08  
**Status**: Draft  
**Input**: User description: "Eurovisiontippning Implementation Plan..."

## Clarifications

### Session 2026-05-08
- Q: How should the Supabase authentication flow be presented to the user? → A: OAuth Redirect (Standard Supabase `signInWithOAuth` redirect flow).
- Q: What content and functionality should be available to an unauthorized user on the landing page? → A: Marketing & CTA (Hero section with contest info, "how it works," and Login buttons).
- Q: How should the user be informed of their data rights and how should the account deletion be handled? → A: Self-Service (Dedicated "Data Protection" page + "Delete Account" button in user settings).

## User Scenarios & Testing *(mandatory)*

### User Story 0 - Unauthorized Landing Page (Priority: P1)

As a visitor, I want to see information about the Eurovision prediction game and how it works so that I am motivated to log in and participate.

**Why this priority**: Essential for user acquisition and explaining the app's purpose.

**Independent Test**: Can be tested by navigating to the root URL while logged out and verifying the presence of marketing content and login buttons.

**Acceptance Scenarios**:

1. **Given** I am not logged in, **When** I visit the landing page, **Then** I see a hero section with the current year's theme, an explanation of the prediction rules, and a prominent login button.
2. **Given** I am on the landing page, **When** I click the login button, **Then** I am redirected to the Supabase OAuth provider selection.

---

### User Story 1 - Predict Semifinal Qualifiers (Priority: P1)

As a user, I want to select the 10 countries I believe will progress from each semifinal so that I can earn points based on my accuracy.

**Why this priority**: Core functionality of the prediction game. Without this, the primary use case is missing.

**Independent Test**: Can be tested by selecting 10 entries in a semifinal tab and verifying they persist in the database.

**Acceptance Scenarios**:

1. **Given** a list of entries for Semifinal 1, **When** I select 10 entries, **Then** the "Save" action is enabled.
2. **Given** 10 entries are already selected, **When** I try to select an 11th, **Then** the selection is prevented or the user is prompted to deselect another first.

---

### User Story 2 - Rank Final Entries via Drag & Drop (Priority: P1)

As a user, I want to rank the final entries from 1st to last using a mobile-friendly interface so that I can submit my prediction for the Grand Final.

**Why this priority**: Ranking is the most complex and engaging part of the Eurovision experience.

**Independent Test**: Can be tested by dragging an entry from the bottom to the top on a mobile device and verifying the order is saved correctly.

**Acceptance Scenarios**:

1. **Given** the list of finalists, **When** I drag and drop an entry to a new position, **Then** the list updates visually and the new rank is stored.
2. **Given** a touch device, **When** I use the touch sensor to drag an entry, **Then** the interaction is smooth and does not trigger accidental scrolling.

---

### User Story 3 - Social Sharing & Anti-Spoil (Priority: P2)

As a user, I want to share my predictions with friends but keep them hidden until the show starts to avoid spoilers and maintain the competitive integrity.

**Why this priority**: Social interaction drives engagement and retention.

**Independent Test**: Can be tested by attempting to view a friend's prediction before the contest `start_time` and verifying that the API/RLS blocks the request.

**Acceptance Scenarios**:

1. **Given** an accepted friend, **When** the contest has not yet started, **Then** I cannot see their specific rankings.
2. **Given** the contest has started, **When** I click on the entry, **Then** I can see how my friends ranked it.

---

### User Story 4 - Admin Data Import (Priority: P2)

As an administrator, I want to import yearly contest data via a JSON blob so that I can quickly set up the application for a new Eurovision season.

**Why this priority**: Ensures the app is maintainable year-over-year.

**Independent Test**: Can be tested by pasting a valid JSON object into the admin area and verifying that `years` and `entries` tables are populated.

**Acceptance Scenarios**:

1. **Given** a valid JSON structure, **When** I click import, **Then** all entries for that year are created in the database.

---

### User Story 5 - Privacy & Data Control (Priority: P3)

As a user, I want to understand how my data is used and have the ability to delete my account so that I have control over my personal information.

**Why this priority**: Required for legal compliance (GDPR) and user trust.

**Independent Test**: Can be tested by navigating to the "Data Protection" page to read the policy and using the "Delete Account" button to verify all user-specific data is wiped from Supabase.

**Acceptance Scenarios**:

1. **Given** I am logged in, **When** I visit my settings, **Then** I see a "Delete Account" button.
2. **Given** I click "Delete Account" and confirm, **When** the process completes, **Then** my profile and all associated predictions are permanently removed.

---

### Edge Cases

- **Tied Scores**: How does the leaderboard handle two users with the exact same point total? (Default: Alphabetical or shared rank).
- **Withdrawals**: What happens if an entry is withdrawn after users have already predicted it? (System MUST handle missing IDs gracefully).
- **Clock Drift**: Ensuring "Anti-Spoil" uses server time (Supabase `now()`) rather than client-side time.
- **Deletion Confirmation**: Prevent accidental account deletion via a two-step confirmation modal.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST allow user authentication via Google and Facebook OAuth using the Supabase OAuth Redirect flow.
- **FR-002**: System MUST enforce a limit of exactly 10 qualifier selections per semifinal.
- **FR-003**: System MUST provide a drag-and-drop interface for ranking the Grand Final entries (26 total).
- **FR-004**: System MUST implement "Anti-Spoil" logic via Supabase RLS policies, preventing reads of other users' predictions until the contest `start_time`.
- **FR-005**: System MUST calculate points for semifinals (3p per correct qualifier).
- **FR-006**: System MUST calculate points for the final using the weighted rank distance formula.
- **FR-007**: System MUST support dynamic theming (colors and logos) based on the current active year.
- **FR-008**: Landing page for unauthorized users MUST include marketing content (hero, rules) and login entry points.
- **FR-009**: System MUST provide a dedicated "Data Protection" page outlining data usage.
- **FR-010**: System MUST provide a self-service "Delete Account" feature that removes all user-associated data.

### Performance & UX Requirements

- **PR-001**: Page response time MUST be under 500ms for primary user actions.
- **UX-001**: All interactive elements MUST provide visual feedback (loading/success) within 100ms.
- **UX-002**: The drag-and-drop interface MUST be optimized for touch devices with a 0ms delay on activation.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Mobile users can complete ranking 26 final entries in under 60 seconds.
- **SC-002**: 100% of friend predictions are blocked by RLS until the exact start time defined in the `years` table.
- **SC-003**: Leaderboard calculates and updates for all users within 5 seconds of the admin entering the official results.
- **SC-004**: System handles up to 5,000 concurrent users during the peak voting window without service degradation.
- **SC-005**: 100% of user data is wiped from all tables within 10 seconds of an account deletion request.

## Assumptions

- **Connectivity**: Users have at least a 3G/LTE connection for real-time saving.
- **Auth**: Supabase Auth handles all token persistence and session management.
- **Data Source**: The admin will provide JSON in the expected schema format.
- **Mobile First**: The primary usage will be on smartphones during the live broadcast.
