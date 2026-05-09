# Feature Specification: Admin Page Completion

**Feature Branch**: `003-admin-page-completion`  
**Created**: May 10, 2026  
**Status**: Draft  
**Input**: User description: "The admin page needs to be completed. An admin user should be able to manage both year metadata, as well as entry metadata and have a complete interface to mark entries from the semifinals as "progressed" and set the ranking of the grand final. The layout needs to be intuitive: A tab for metadata containing year, location (e.g. Stockholm), start times from each semifinal and the number of entries that progress from each semifinal (default 10). A tab for entries where an admin can edit an entry, add entries, or remove entries. Each entry should be have a "starting-contest" dropdown which is either semi1, semi2 or final. Other tabs should be semi1 progression, semi2 progression and final ranking. There should be some automatic logic rooted in admin page changes: When a semifinal has a set of progressed entries set it is "completed" and points can be shown. All progressed entries should then be shown on the final page and be included in the set of entries users can rank for the final. The final itself should only be active when both semi finals have had their entries marked as progressed. IMPORTANT: There can be cases where the entries for the final changes (e.g. a previously progressed semi final entry is disqualified). The admin page needs to allow the admin to "de-progress" an entry in this case. This action should automatically reduce the number of entry progressions from the semi final (so if prevously 10, now its 9. Also, the admin UI should allow for the correction of progressed entries, e.g. if the admin clicks, and saves, the wrong entries. It is CRUCIAL that the final ranking gracefully handles a changed set of entries. The admin page should also have some validation: A semifinal progression ranking can't be saved unless the correct number of entries are saved."

## Clarifications

### Session 2026-05-10

- Q: What happens when an admin decreases the progression target in the metadata tab below the number of currently progressed entries? → A: Prevent the target decrease and show a validation error instructing the admin to de-progress entries first.
- Q: How does the system handle concurrent saves if multiple admins are editing progressions simultaneously? → A: Last write wins. The last save overwrites any previous saves without warning.
- Q: What happens if an admin changes a "starting-contest" of an entry that has already been marked as progressed in a semifinal? → A: Automatically de-progress the entry from the old semifinal and update its starting contest. The old semifinal's target progression count is adjusted if needed.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Metadata and Entry Setup (Priority: P1)

As an admin, I want to configure the general event metadata and manage the list of all participating entries so that the application has the foundational data required for the event.

**Why this priority**: Without foundational data like the entries and event details, no other part of the system (including predictions or rankings) can function.

**Independent Test**: Can be fully tested by creating metadata, saving it, and verifying it persists, followed by adding a few entries mapped to different starting contests (semi1, semi2, final).

**Acceptance Scenarios**:

1. **Given** I am on the Metadata tab, **When** I enter the year, location, start times, and progression target numbers (default 10) and save, **Then** the metadata is successfully updated.
2. **Given** I am on the Entries tab, **When** I add a new entry and assign its "starting-contest" to 'semi1', **Then** the entry appears in the global list of entries and is available for the 'semi1' contest.

---

### User Story 2 - Semifinal Progression and Validation (Priority: P1)

As an admin, I want to mark exactly the right number of entries as "progressed" for a given semifinal so that the semifinal can be marked complete and those entries become available for the final.

**Why this priority**: Capturing the correct results from the semifinals unlocks the public visibility of points and activates the final round.

**Independent Test**: Can be fully tested by attempting to save the progression list for a semifinal with an incorrect number of entries, confirming failure, and then saving with the correct number to see the status update.

**Acceptance Scenarios**:

1. **Given** the progression target for semi1 is 10, **When** I mark 9 entries as progressed and try to save, **Then** the system rejects the save and displays a validation error.
2. **Given** the progression target for semi1 is 10, **When** I mark exactly 10 entries as progressed and save, **Then** the save is successful, the semifinal is marked as "completed", and the entries are passed to the final.

---

### User Story 3 - Grand Final Activation and Ranking (Priority: P1)

As an admin, I want the Final Ranking tab to activate only when both semifinals are completed, and I want to set the final ranking among all eligible entries.

**Why this priority**: The culmination of the event relies on setting the final ranking based on the verified list of progressed and auto-qualifying entries.

**Independent Test**: Can be tested by verifying the Final tab is locked until both semifinals are completed, and then successfully setting and saving a ranking on the Final tab.

**Acceptance Scenarios**:

1. **Given** only semi1 is marked completed, **When** I view the admin tabs, **Then** the Final Ranking tab remains inactive or locked.
2. **Given** both semi1 and semi2 are marked completed, **When** I navigate to the Final Ranking tab, **Then** the tab is active and I can rank all progressed entries plus any direct final entries.

---

### User Story 4 - Handling Disqualifications and Corrections (Priority: P2)

As an admin, I want to be able to "de-progress" an entry or correct the list of progressed entries from a completed semifinal, so that I can handle real-world disqualifications or human entry errors gracefully.

**Why this priority**: Unexpected events (like a disqualification) or admin mistakes must not break the system, especially when final rankings may have already been started.

**Independent Test**: Can be tested by de-progressing an entry from a completed semifinal and verifying that the final ranking correctly reflects the dropped entry without breaking.

**Acceptance Scenarios**:

1. **Given** a completed semifinal with 10 progressions, **When** I "de-progress" one of those entries, **Then** the progression target for that semifinal is automatically reduced to 9.
2. **Given** the final ranking has already been partially set, **When** an entry is de-progressed, **Then** the final ranking gracefully updates by removing the disqualified entry while preserving the ranking of the others.

### Edge Cases

- What happens when an admin decreases the progression target in the metadata tab below the number of currently progressed entries?
  - **Clarification**: The system MUST prevent the target decrease and show a validation error instructing the admin to de-progress entries first.
- How does the system handle concurrent saves if multiple admins are editing progressions simultaneously?
  - **Clarification**: Last write wins. The last save overwrites any previous saves without warning.
- What happens if an admin changes a "starting-contest" of an entry that has already been marked as progressed in a semifinal?
  - **Clarification**: Automatically de-progress the entry from the old semifinal and update its starting contest. The old semifinal's target progression count is adjusted if needed.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST provide an Admin interface organized by tabs: Metadata, Entries, Semi1 Progression, Semi2 Progression, Final Ranking.
- **FR-002**: System MUST allow admins to manage metadata including year, location, start times for each semifinal, and the target number of entries to progress from each semifinal (default 10).
- **FR-003**: System MUST allow admins to add, edit, and remove entries.
- **FR-004**: System MUST allow admins to assign each entry a "starting-contest" value of semi1, semi2, or final.
- **FR-005**: System MUST allow admins to mark entries from a semifinal as "progressed".
- **FR-006**: System MUST prevent saving a semifinal progression unless the number of marked entries exactly matches the target progression count for that semifinal.
- **FR-007**: System MUST consider a semifinal "completed" when its progression ranking is successfully saved, enabling user points/results to be shown.
- **FR-008**: System MUST automatically make progressed entries available for final ranking and show them on the final page.
- **FR-009**: System MUST keep the final ranking active only when both semifinals are marked as completed.
- **FR-010**: System MUST allow an admin to "de-progress" a previously progressed entry.
- **FR-011**: System MUST automatically reduce the target progression count for a semifinal if an entry is "de-progressed" from it to reflect the new valid count (e.g., from 10 to 9).
- **FR-012**: System MUST allow admins to correct a previously saved semifinal progression list (e.g. swapping one entry for another).
- **FR-013**: System MUST gracefully handle changes in the set of final entries (due to de-progression, disqualification, or correction) in the final ranking interface without causing errors.

### Performance & UX Requirements

- **PR-001**: Progression validation MUST be processed instantly on the client side before submission.
- **UX-001**: The UI MUST clearly indicate when the Final Ranking tab is locked and explain what needs to be done to unlock it.
- **UX-002**: The UI MUST provide clear error messages if validation fails on the progression targets.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: An admin can successfully configure the entire event (metadata, entries, progressions, final ranking) without manual database intervention.
- **SC-002**: The system prevents 100% of invalid semifinal progression saves (e.g. saving 9 when the target is 10).
- **SC-003**: The final ranking interface continues to function correctly (no crashes) in 100% of cases when the underlying progressed entries change due to corrections or disqualifications.

## Assumptions

- We assume "gracefully handle" for a changed set of entries means any unaffected entries retain their previous ranking state, and removed entries are safely dropped from the list.
- We assume "points can be shown" means the completion state unlocks the visibility of public prediction scores for that specific semifinal.
- We assume only authenticated administrators have access to these tabs and actions.