# Feature Specification: admin-import-scoring-visibility

**Feature Branch**: `004-admin-import-scoring-visibility`  
**Created**: 2026-05-10  
**Status**: Draft  
**Input**: User description: "The admin page needs to have a \"From JSON\" import button for entries with an info text on exactly how the json should be structured. When importing it should replace all existing entries. Further on the overall metadata there should be a toggle whether the betting has started or not (default False) so an admin can set up entries etc. in peace and quiet before launching a new year. For the scoring and the friends leaderboard, it needs to be expanded with Semi1 Semi2 and Final tabs where each shows the entries (ordered by start order) and how the user and all their friends have betted. The easiest is if each entry is clickable and expands downwards with a list of friends and either their progression bet (for semifianls) or rank bet (for grand final). Also, currently the scoring isn't working: It gives points for semi final progression bets before the outcome is known (and before the event has ended). The correct scoring is 3 points for each entry that a user has betted would progress that actually did progress. Thus it can only be calculated after the event has ended."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Admin Batch Setup (Priority: P1)

As an administrator, I want to import all entries for a new year from a JSON file so that I don't have to enter dozens of countries and songs manually.

**Why this priority**: Core utility for managing the annual event setup. Saves significant time and reduces manual entry errors.

**Independent Test**: Can be tested by providing a valid JSON file and verifying that the `entries` table is cleared and repopulated correctly.

**Acceptance Scenarios**:

1. **Given** the admin is on the Entry Manager tab, **When** they click "From JSON" and select a valid file, **Then** all existing entries are deleted and the new entries from the file are visible.
2. **Given** the admin is about to import, **When** they look at the import section, **Then** they see a clear description of the required JSON schema.

---

### User Story 2 - Betting Window Management (Priority: P1)

As an administrator, I want to toggle whether betting is active so that I can prepare the entries and show data before allowing users to start tipping.

**Why this priority**: Prevents users from tipping on incomplete or incorrect data during the setup phase.

**Independent Test**: Toggle the "Betting Started" switch and verify that non-admin users can/cannot access the tipping views.

**Acceptance Scenarios**:

1. **Given** "Betting Started" is False, **When** a regular user attempts to access the Semifinal or Final views, **Then** they are blocked or see a "Coming Soon" message.
2. **Given** "Betting Started" is True, **When** a regular user accesses the views, **Then** they can save their tips.

---

### User Story 3 - Show-Specific Friend Comparisons (Priority: P2)

As a user, I want to see how my friends have betted for each specific show (Semi 1, Semi 2, Final) so that I can compare our picks side-by-side during the broadcast.

**Why this priority**: Enhances the social experience and "second screen" utility during the live shows.

**Independent Test**: Open the Leaderboard, switch between show tabs, and click an entry to see the list of friends' bets.

**Acceptance Scenarios**:

1. **Given** the user is on the Leaderboard, **When** they select the "Semi 1" tab, **Then** they see all Semi 1 entries ordered by their performance/start order.
2. **Given** an entry in the list, **When** the user clicks it, **Then** it expands to show which friends bet on it to progress (for semis) or what rank they gave it (for the final).

---

### User Story 4 - Accurate Semi-Final Scoring (Priority: P1)

As a user, I want my score to reflect only the correct progression guesses after the semi-final results are official.

**Why this priority**: Essential for the integrity of the competition. Incorrect scoring leads to user frustration.

**Independent Test**: Set a user's progression bet, then set the actual show results, and verify the calculated score matches (3 points per correct guess).

**Acceptance Scenarios**:

1. **Given** a user has betted on a country to progress, **When** the results are not yet known, **Then** their score from that bet remains 0.
2. **Given** the results are finalized, **When** the country progressed and the user betted it would, **Then** the user receives 3 points.

### Edge Cases

- **Invalid JSON**: System should show an error message if the imported JSON is malformed or missing required fields.
- **Empty Import**: If an empty list is imported, the system should confirm if the admin really wants to delete all current entries.
- **Destructive Import**: System MUST show a prominent warning that importing JSON will delete all existing entries and user bets.
- **Late Tipping**: If "Betting Started" is toggled Off while a user is in the middle of tipping, the save should be rejected.

## Clarifications

### Session 2026-05-10
- Q: Where should the `betting_started` toggle be stored? → A: New column in existing `metadata` table.
- Q: Should JSON import delete existing user bets? → A: Yes, destructive with warning.
- Q: When should scoring be calculated? → A: Runtime calculated; only when results are official.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Admin page MUST provide an "Import from JSON" button for entries.
- **FR-002**: JSON import MUST replace all existing entries AND user bets (cascading delete) with a confirmation warning.
- **FR-003**: Admin UI MUST display the required JSON schema (e.g., country, artist, song, show, start_order).
- **FR-004**: Metadata table MUST include a `betting_started` boolean flag (default False).
- **FR-005**: Leaderboard page MUST feature tabs for "Semi 1", "Semi 2", and "Final".
- **FR-006**: Leaderboard show tabs MUST display entries sorted by their `start_order`.
- **FR-007**: Leaderboard entry rows MUST be expandable/collapsible.
- **FR-008**: Expanded entry view MUST list all friends and their specific bet for that entry (True/False for semis, numeric rank for final).
- **FR-009**: Scoring logic MUST award exactly 3 points for each correct semi-final progression bet.
- **FR-010**: Scoring logic MUST be calculated at runtime (e.g., via RPC) and MUST NOT award progression points for an entry unless that entry's actual result (`progressed` status) is non-null.

### Performance & UX Requirements

- **PR-001**: Leaderboard expansion MUST be responsive (<200ms) even with 20+ friends.
- **UX-001**: The "Betting Started" toggle MUST be easily accessible in the Admin Metadata section.
- **UX-002**: Regular users MUST see a clear status message if they try to bet before the window is open.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Admins can complete a full entry reset via JSON import in under 1 minute.
- **SC-002**: 100% of semi-final progression points are awarded correctly (3 pts per match) only after results are entered.
- **SC-003**: Users can view the specific bets of all their friends for any given entry within 2 clicks from the leaderboard.

## Assumptions

- The JSON schema will be strictly enforced; malformed data will be rejected.
- "Betting Started" is a global flag for the current year.
- Semi-final "progression" is a binary state (Yes/No) stored in the `entries` table once results are known.
- The scoring fix requires updating the scoring RPC or service logic to check for the presence of actual results before awarding points.
