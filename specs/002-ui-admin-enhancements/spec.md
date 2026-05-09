# Feature Specification: UI, Navigation, and Admin Enhancements

**Feature Branch**: `002-ui-admin-enhancements`
**Created**: 2026-05-09
**Status**: Draft
**Input**: User description: "Det här fokuserar på design och funktionalitet..."

## Clarifications

### Session 2026-05-09
- Q: How should friend search matching work considering privacy? → A: Partial matching on names and emails, combined with an option in account settings to make the account "private" (prevents requests, hides from search, removes current friend links).
- Q: How should the leaderboard handle users with the exact same score? → A: Share the same rank number (e.g., 1, 1, 3, 4).

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Improved Mobile & Visual UX (Priority: P1)

As a user, I want better visual contrast, centered text in semifinals without checkboxes, and working drag-and-drop on mobile devices so that I can easily use the app.

**Why this priority**: Core interaction for mobile users is currently broken or hard to use.

**Independent Test**: Can be tested by opening the app on a mobile device and verifying drag-and-drop works smoothly, and visually checking text contrast and alignment.

**Acceptance Scenarios**:
1. **Given** I am on a semifinal page, **When** I view the song list, **Then** text is centered and there are no checkboxes.
2. **Given** I am on any page, **When** I read headings, **Then** the text contrast is strong enough to be easily readable.
3. **Given** I am on the final page and mock a mobile device using Chrome dev tools, **When** I drag and drop a song, **Then** the item moves smoothly without screen scrolling issues.

---

### User Story 2 - Navigation & Account Management (Priority: P1)

As a user, I want a hamburger menu to navigate between pages (Tippning, Friends, Privacy, Account, Admin) and a dedicated Account page to manage my profile and delete my account.

**Why this priority**: Essential for user autonomy, privacy compliance, and discoverability of features.

**Independent Test**: Can be tested by clicking the hamburger menu, navigating to all listed sections, and testing the account deletion flow.

**Acceptance Scenarios**:
1. **Given** I am logged in, **When** I click the top-right hamburger menu, **Then** I see links for "Tippning", "Friends/Leaderboard", "Privacy Policy", and "Account".
2. **Given** I am an admin, **When** I open the menu, **Then** I also see the "Admin" link.
3. **Given** I am on the Account page, **When** I click "Delete account", **Then** my account and associated data are removed.
4. **Given** I am on any page, **When** I click the top header , **Then** I am returned to the home page.
5. **Given** I am on the Account page, **When** I toggle "Private Account", **Then** my account is hidden from search, requests are blocked, and existing friends are removed.

---

### User Story 3 - Timezone-Aware Deadlines & Final Unlocking (Priority: P2)

As a user, I want to see a countdown to when voting closes for semifinals, and I shouldn't be able to vote in the final until all finalists are known.

**Why this priority**: Clarifies the rules of the game and prevents invalid predictions.

**Independent Test**: Can be tested by changing system time or contest start times to verify countdowns and the locking/unlocking of the final tab.

**Acceptance Scenarios**:
1. **Given** a semifinal is upcoming, **When** I view the semifinal page, **Then** I see a timezone-aware countdown to the closing time.
2. **Given** the countdown reaches zero, **When** I try to vote, **Then** voting is closed.
3. **Given** the semifinals do not have results yet, **When** I view the final page, **Then** the list is locked and cannot be rearranged.
4. **Given** both semifinals have 10 qualifiers each, **When** I view the final page, **Then** all 26 songs are available and drag-and-drop is enabled.

---

### User Story 4 - Friend Search & Leaderboard (Priority: P2)

As a user, I want to search for friends by email or name, and see a leaderboard comparing my score with my friends.

**Why this priority**: Enhances the social aspect of the app.

**Independent Test**: Can be tested by searching for a known friend's email/name and viewing the friends-only leaderboard.

**Acceptance Scenarios**:
1. **Given** I am on the friends page, **When** I type a partial email or name in the search bar, **Then** I see matching public users to add as friends.
2. **Given** I have added friends, **When** I view the friend leaderboard, **Then** I see my friends and myself ranked by score.
3. **Given** two users have the same score, **When** I view the leaderboard, **Then** they share the same rank number (e.g., 1, 1, 3).

---

### User Story 5 - Admin Controls & Validation (Priority: P1)

As an admin, I want to safely import JSON data with validation, manually adjust contest details, mark qualifiers, and set final results to calculate points accurately.

**Why this priority**: Admins need robust tools to manage the contest data and trigger score calculations without causing data corruption.

**Independent Test**: Can be tested by logging in as admin, importing valid/invalid JSON, editing contest fields, and marking qualifiers to trigger score updates.

**Acceptance Scenarios**:
1. **Given** I am on the Admin page, **When** I paste invalid JSON and click Import, **Then** the system rejects it and shows the required structure.
2. **Given** I click Import with valid JSON, **When** I proceed, **Then** I see a warning that existing metadata will be overwritten.
3. **Given** I am viewing the active contest, **When** I change its details manually, **Then** the updates are saved.
4. **Given** the final has finished, **When** I set the final order, **Then** the final scoring calculation is triggered.

### Edge Cases

- What happens when a user's local timezone differs drastically from the server/event timezone? (Must use strict UTC comparisons for closing logic).
- How does system handle a user deleting their account while they are on a friend's leaderboard?
- What happens if the admin marks more or fewer than 10 qualifiers for a semifinal?
- How does the app handle a user trying to access the admin route without admin privileges via direct URL?
- What happens if a user makes their account private while they have pending friend requests? (Requests are cancelled/removed).

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST display a hamburger menu in the top right containing links to "Tippning", "Leaderboard/Vänner", "Privacy Policy", "Konto" (Account), and conditionally "Admin".
- **FR-002**: System MUST provide an Account page with a "Delete account" action.
- **FR-003**: System MUST explain on the Privacy page that account deletion is available via the Account settings.
- **FR-004**: System MUST allow searching for public friends using partial matches on email or name.
- **FR-005**: System MUST display a friend-specific leaderboard on the friends page.
- **FR-006**: System MUST center text and remove checkboxes for songs on the semifinal pages.
- **FR-007**: System MUST provide strong contrast (darker text) for all headings across the app.
- **FR-008**: System MUST support smooth drag-and-drop reordering on mobile devices.
- **FR-009**: System MUST display a timezone-aware countdown to the voting deadline on semifinal pages.
- **FR-010**: System MUST enforce voting closure strictly based on the contest start time, accounting for timezones.
- **FR-011**: System MUST disable viewing and reordering on the final page until both semifinals have their 10 qualifiers determined.
- **FR-012**: System MUST validate the structure of JSON data before allowing an admin import.
- **FR-013**: System MUST display a warning confirmation prompt before overwriting data via JSON import.
- **FR-014**: System MUST allow admins to manually edit details of the active semifinal or final.
- **FR-015**: System MUST allow admins to mark exactly 10 entries as "qualified" for each semifinal.
- **FR-016**: System MUST allow admins to set the final placement order for the final.
- **FR-017**: System MUST only calculate points for a semifinal after 10 entries have been marked as qualified.
- **FR-018**: System MUST only calculate points for the final after the final placement order has been set.
- **FR-019**: System MUST allow users to set their account to "private" in Account settings.
- **FR-020**: System MUST hide private accounts from search, block incoming friend requests, and bidirectionally remove all existing friend links.
- **FR-021**: System MUST assign tied users the same rank on the leaderboard and increment subsequent ranks accordingly (e.g., 1, 1, 3).

### Performance & UX Requirements

- **UX-001**: Drag-and-drop MUST NOT trigger pull-to-refresh or page scrolling when actively dragging an item on mobile.
- **UX-002**: The countdown timer MUST update in real-time without requiring a page refresh.
- **UX-003**: Headings MUST meet standard accessibility contrast ratios (e.g., WCAG AA).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can successfully reorder the final list on a mobile device without accidental scrolling.
- **SC-002**: Users can find and add friends using email or name (unless private).
- **SC-003**: Points are only calculated and distributed when the exact required conditions are met (10 qualifiers for semi, final order for final).
- **SC-004**: The final voting list becomes automatically unlocked only when both semifinals are completed.
- **SC-005**: Admins receive immediate feedback if imported JSON does not match the required schema.

## Assumptions

- We assume the existing UI framework (React) and drag-and-drop library can be configured to prevent mobile scroll interference.
- We assume that user emails/names are searchable within the bounds of privacy configurations.
- Timezone awareness will be handled using UTC for all internal logic and deadlines, converting to local time only for display.