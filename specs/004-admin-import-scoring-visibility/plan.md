# Implementation Plan: admin-import-scoring-visibility

**Branch**: `004-admin-import-scoring-visibility` | **Date**: 2026-05-10 | **Spec**: [specs/004-admin-import-scoring-visibility/spec.md](specs/004-admin-import-scoring-visibility/spec.md)
**Input**: Feature specification from `/specs/004-admin-import-scoring-visibility/spec.md`

## Summary

Enhance the admin and user experience by implementing a destructive JSON import for entries, adding a `betting_started` toggle to control when tipping is active, expanding the Leaderboard to show per-show entries with friends' bets, and fixing the scoring logic to only award points when official results are confirmed.

## Technical Context

**Language/Version**: TypeScript 5.x, React 18/19
**Primary Dependencies**: Supabase, Tailwind CSS, @dnd-kit
**Storage**: Supabase (PostgreSQL)
**Testing**: Vitest, Playwright
**Target Platform**: Vercel
**Project Type**: Web Application
**Performance Goals**: <200ms TTFB, 90+ Lighthouse score
**Constraints**: Client-side only rendering, Supabase RLS policies
**Scale/Scope**: 5000+ concurrent users during ESC final

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] **I. Code Quality**: Does the design follow functional React patterns and use TypeScript?
- [x] **II. Testing**: Are E2E (Playwright) or integration (Vitest) tests planned?
- [x] **III. UX**: Does it use Tailwind for themed styling and provide immediate feedback?
- [x] **IV. Performance**: Is the Supabase query optimized and RLS handled?

## Project Structure

### Documentation (this feature)

```text
specs/004-admin-import-scoring-visibility/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
# Architecture: Vite React SPA + Supabase BaaS

supabase/
├── migrations/         # SQL for new betting_started column & scoring RPC update

src/
├── components/         # MetadataForm.tsx (toggle), EntryManager.tsx (import)
├── hooks/              # Data fetching for leaderboard expansions
├── pages/              # LeaderboardView.tsx (tabs), SemifinalView/FinalView (access control)
├── services/           # scoringService.ts (conditional points logic)
└── types/              # Updated database.types.ts

tests/
├── components/         # Tests for new import/toggle UI
├── e2e/                # Tests covering betting window access and scoring
└── unit/               # Tests for conditional scoring logic
```

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| None | N/A | N/A |
