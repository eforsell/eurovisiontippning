# Implementation Plan: Admin Page Completion

**Branch**: `003-admin-page-completion` | **Date**: 2026-05-10 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/003-admin-page-completion/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

Complete the Admin page interface to allow configuration of event metadata, management of entries, setting of progressed entries from semifinals, and defining the grand final rankings. The solution will involve updating the existing `years` and `entries` tables in Supabase, building a tab-based UI, adding validation to ensure data integrity during target changes and rank saving, and using `@dnd-kit/core` for drag-and-drop ranking.

## Technical Context

**Language/Version**: TypeScript 5.x, React
**Primary Dependencies**: Supabase, Tailwind CSS, @dnd-kit
**Storage**: Supabase (PostgreSQL)
**Testing**: Vitest, Playwright
**Target Platform**: Vercel
**Project Type**: Web Application
**Performance Goals**: Instant client-side validation before submission, <200ms TTFB
**Constraints**: Client-side rendering, Supabase RLS policies for admin-only access
**Scale/Scope**: Admin usage only, low concurrency expected, high accuracy needed.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] **I. Code Quality**: Does the design follow functional React patterns and use TypeScript?
- [x] **II. Testing**: Are E2E (Playwright) or integration (Vitest) tests planned?
- [x] **III. UX**: Does it use Tailwind for themed styling and provide immediate feedback?
- [x] **IV. Performance**: Is the Supabase query optimized and RLS handled?

## Project Structure

### Documentation (this feature)

```text
specs/003-admin-page-completion/
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
├── migrations/         # Generated SQL schemas and RLS policies
├── functions/          # Supabase Edge Functions (if needed later)
└── config.toml         # Local Supabase configuration

src/
├── assets/             # Static files, CSS
├── components/         # Reusable UI (shadcn/ui goes here)
├── features/           # Domain logic (e.g., /bets, /auth, /leaderboard)
├── lib/                # Utilities (e.g., supabaseClient.ts setup)
├── pages/              # Top-level React views
└── App.tsx             # Main entry point and routing

tests/
├── components/         # Frontend unit tests
└── e2e/                # End-to-end tests
```

**Structure Decision**: The implementation will strictly follow the existing single-project Vite React SPA structure mapped to a Supabase backend. Admin-specific UI components will be housed under `src/pages/AdminView.tsx` and relevant `src/components/Admin/` subdirectories. Database modifications will be stored as migrations in `supabase/migrations/`.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| N/A       | N/A        | N/A                                 |
