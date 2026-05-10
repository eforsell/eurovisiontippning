# Implementation Plan: Contest State Enhancements

**Branch**: `005-contest-state-enhancements` | **Date**: May 10, 2026 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `specs/005-contest-state-enhancements/spec.md`

## Summary

Enhance the state management of contests to strictly enforce deadlines by disabling interaction once a contest starts. Improve visibility of results by showing scores and final rankings on tippning and sharing pages, adding a `final_start_position` for the Grand Final. Finally, partition leaderboard scores by contest and add mock data for friend management testing.

## Technical Context

**Language/Version**: TypeScript, React
**Primary Dependencies**: Supabase, Tailwind CSS, @dnd-kit
**Storage**: Supabase (PostgreSQL)
**Testing**: Vitest, Playwright
**Target Platform**: Vercel
**Project Type**: Web Application
**Constraints**: Supabase RLS policies, existing database schema, existing component structure.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] **I. Code Quality**: Does the design follow functional React patterns and use TypeScript?
- [x] **II. Testing**: Are E2E (Playwright) or integration (Vitest) tests planned?
- [x] **III. UX**: Does it use Tailwind for themed styling and provide immediate feedback?
- [x] **IV. Performance**: Is the Supabase query optimized and RLS handled?

## Project Structure

### Documentation (this feature)

```text
specs/005-contest-state-enhancements/
├── plan.md              # This file
├── research.md          # Technical decisions and rationale
├── data-model.md        # Database schema changes
├── quickstart.md        # Quick context for implementation
└── tasks.md             # Implementation tasks (generated later)
```

### Source Code (repository root)

```text
supabase/
├── migrations/         # Add new migration for final_start_position
├── seed.sql            # Add mock friends and predictions

src/
├── components/
│   ├── Admin/          # Update to disable progression if contest hasn't started
│   ├── Ranking/        # Update Entry cards for disabled state and score visibility
│   └── Leaderboard/    # Update to support expanding rows and score partitioning
├── hooks/              # Update hooks (e.g., useFriends, useEntries) for new data
├── pages/              # Update Tippning and Sharing views for filtering and sorting
└── services/           # Update queries if needed
```

## Complexity Tracking

*No violations of the constitution.*
