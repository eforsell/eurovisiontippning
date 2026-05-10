# Feature Specification: Contest State Enhancements

**Feature Branch**: `005-contest-state-enhancements`  
**Created**: May 10, 2026  
**Status**: Draft  
**Input**: User description: "Here is a list of things to fix: - When a semi final has closed (e.g. the start time has passed), do not use a pop up to alert users to this fact when they try to click an entry. Instead disable clicking entirely, but take care to keep the styling to show which entries the user betted would progress. - In the Sharing views entries MUST be filtered to only show entries for the corresponding contest. So semifinal 1 entries for semi1, same logic for semi2, and for the final the final entries along with entries that progressed from either semifinal. - I realize we've forgotten one important thing: An entry starting in the semifinal and progresses to the grand final will have two start orders: one for each contest. We need to add a new column for this in the entries table. And use the new final_start_position to show start position whenever the grand final is concerned. The new column should be nullable just as the current start_position as the final start order is not revealed right away. - In the admin view, semi final progression should be disabled until the semi final has started (so the betting has closed) - When the entries from a semi final have been marked as progressed, so the score is available the score should be shown on the tippning page for that semi final. The table should also clearly higlight which entries did actually progress, a suggested way to do this is to add opacity to the entries that didn't progress and change their outer border to --- instead of solid. - When the entries for the grand final have their actual finishing order so the total points are available this too needs to be shown on the tippning page. The final ranking should also be shown on the entry cards and they should now be sorted according to this final rank instead of starting order. - The changes to the views on the tippning page should be applied as appropritate to the sharing pages too. - On the friends leaderboard each friend should be expandable and when expanded partition the total score into the score from each contest. - I want to be able to try out the friends search, add, remove, go private flow in the UI. Add some mock friends in our database seed and make some already friends with, and some having sent pending friend requests to eskil.forsell@gmail.com so I can try out different things."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Contest Lock States (Priority: P1)

Users interacting with contests that have already started should not be able to modify their predictions, and admins should not be able to progress a semifinal until betting has closed.

**Why this priority**: Crucial for the integrity of the betting/tippning game, ensuring no changes are made after the contest begins.

**Independent Test**: Ensure user predictions are locked visually and functionally once the contest start time is reached, and the admin progression button is disabled.

**Acceptance Scenarios**:

1. **Given** a semifinal has closed, **When** a user clicks an entry to change their prediction, **Then** clicking is disabled, no pop-up is shown, but the user's prediction styling remains visible.
2. **Given** a semifinal has not yet started, **When** an admin views the contest, **Then** the option to mark semifinal progression is disabled.

---

### User Story 2 - Semifinal Results Visibility (Priority: P1)

Users should see the official results of a semifinal on the tippning and sharing pages once the admin has marked the progressed entries.

**Why this priority**: This gives users feedback on their predictions and shows the actual outcome of the semifinal.

**Independent Test**: Progress entries as an admin, then verify scores and progress styling appear on the semifinal tippning page.

**Acceptance Scenarios**:

1. **Given** semifinal entries have been marked as progressed, **When** a user views the semifinal tippning page, **Then** the score is displayed, progressed entries are highlighted, and non-progressed entries have reduced opacity and a dashed border.
2. **Given** a user is on a sharing view for semifinal 1, **When** they look at the entries, **Then** only semifinal 1 entries are visible.

---

### User Story 3 - Grand Final Results and Order (Priority: P1)

The Grand Final requires its own start position ordering, and users need to see the final points and final ranking once the contest is completed.

**Why this priority**: The Grand Final is the climax of the application, requiring accurate start positions and final ranking displays.

**Independent Test**: Set final finishing orders and verify that entries on the Grand Final page sort by final rank and display their total points and final rank.

**Acceptance Scenarios**:

1. **Given** an entry that progressed to the Grand Final, **When** viewing the Grand Final page, **Then** it displays its `final_start_position` instead of its semifinal start position.
2. **Given** the Grand Final is completed and finishing orders are available, **When** a user views the Grand Final tippning page, **Then** the total points and final ranking are displayed on the entry cards, and the cards are sorted by final rank.
3. **Given** the Grand Final is completed, **When** a user views the Grand Final sharing page, **Then** the same final score visibility and ranking sort are applied.

---

### User Story 4 - Friends Score Breakdown and Mock Data (Priority: P2)

Users should be able to expand a friend on the leaderboard to see their score partitioned by contest, and the developer needs mock friend data to test the friend management flow.

**Why this priority**: Enhances the social competition aspect by showing detailed score breakdowns.

**Independent Test**: Expand a friend on the leaderboard and verify the score is broken down by semi1, semi2, and final. Check the database seed for mock friend relationships with `eskil.forsell@gmail.com`.

**Acceptance Scenarios**:

1. **Given** a user on the friends leaderboard, **When** they expand a friend's row, **Then** the total score is partitioned into the score from each contest.
2. **Given** a developer seeding the database, **When** the seed is applied, **Then** the database contains mock users who are already friends with `eskil.forsell@gmail.com` and some who have sent pending friend requests.

### Edge Cases

- What happens if a user is currently clicking/modifying a prediction at the exact second the contest start time passes? → Handled by showing an error toast and reverting the UI state based on backend rejection.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST disable click interactions on entries for any contest where the start time has passed, without showing a pop-up alert.
- **FR-002**: The system MUST retain prediction styling for entries on closed contests.
- **FR-003**: The system MUST disable the semifinal progression action in the admin view until the contest start time has passed.
- **FR-004**: The system MUST filter entries on sharing views to only show entries belonging to that specific contest.
- **FR-005**: The system MUST add a `final_start_position` (nullable) to the entries data model.
- **FR-006**: The system MUST display the `final_start_position` as the start position for entries when viewing the Grand Final context.
- **FR-007**: The system MUST display user scores on the semifinal tippning page once semifinal entries are marked as progressed.
- **FR-008**: The system MUST visually highlight progressed entries and visually de-emphasize non-progressed entries (e.g., lower opacity, dashed border) on the semifinal tippning page.
- **FR-009**: The system MUST display final points and final ranking on entry cards on the Grand Final tippning page once finishing orders are populated.
- **FR-010**: The system MUST sort entry cards by final rank on the Grand Final tippning page when finishing orders are populated. If not populated, entries without a `final_start_position` MUST be appended at the end with a 'TBD' position indicator.
- **FR-011**: The system MUST apply score visibility, highlighting, ranking, and sorting changes to the sharing pages identically to the tippning pages.
- **FR-012**: The system MUST allow expanding a user on the friends leaderboard to view their score partitioned by contest (Semi 1, Semi 2, Final).
- **FR-013**: The system MUST include mock friend data (existing friends and pending requests) linked to `eskil.forsell@gmail.com` in the database seed, including generated mock predictions and scores to enable full testing of the leaderboard partitioning UI.

### Performance & UX Requirements

- **UX-001**: The transition of a contest from open to closed must be clear from the lack of interactive cursor styling and disabled clicks, ensuring no confusing popups appear.
- **UX-002**: Visually de-emphasized entries must maintain sufficient contrast to be readable.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users cannot submit or alter predictions after a contest's designated start time.
- **SC-002**: Admins cannot finalize a semifinal's progression until the contest has started.
- **SC-003**: Entries on sharing views perfectly match the respective contest without leaking entries from other semifinals.
- **SC-004**: Expanded leaderboard friends successfully display score breakdowns matching the sum of the total score.
- **SC-005**: The `final_start_position` correctly orders entries in the Grand Final view.

## Assumptions

- We assume `final_start_position` will be populated by an admin or an external data sync before the Grand Final betting begins.
- We assume that "sharing views" refer to public or direct links where users share their predictions. assume that "sharing views" refer to public or direct links where users share their predictions.eakdowns matching the sum of the total score.
- **SC-005**: The `final_start_position` correctly orders entries in the Grand Final view.

## Assumptions

- We assume `final_start_position` will be populated by an admin or an external data sync before the Grand Final betting begins.
- We assume that "sharing views" refer to public or direct links where users share their predictions. assume that "sharing views" refer to public or direct links where users share their predictions.