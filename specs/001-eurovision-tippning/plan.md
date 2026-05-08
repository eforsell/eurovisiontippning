# Implementation Plan: Eurovisiontippning App

**Branch**: `v5` | **Date**: 2026-05-08 | **Spec**: [specs/001-eurovision-tippning/spec.md]
**Input**: Feature specification from `/specs/001-eurovision-tippning/spec.md`

## Summary
Build a mobile-first Eurovision prediction app using React, Supabase, and Tailwind CSS. Key features include semifinal qualifier selection, drag-and-drop ranking for the final, and an "Anti-Spoil" mechanism enforced via Supabase RLS policies.

## Technical Context

**Language/Version**: TypeScript 5.x, React 18/19  
**Primary Dependencies**: Supabase, Tailwind CSS, shadcn/ui, @dnd-kit  
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
specs/001-eurovision-tippning/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
└── tasks.md             # Phase 2 output
```

### Source Code (repository root)

```text
supabase/
├── migrations/          # SQL migrations (Schema, RLS, Functions)
└── seed.sql             # Initial seed data for local development

src/
├── components/          # Reusable UI components (shadcn/ui + custom)
├── hooks/               # React hooks for data fetching & DND
├── lib/                 # Supabase client & utility functions
├── pages/               # Landing, Admin, and Tabbed contest views
├── store/               # Year-specific theme & state management
├── types/               # Generated database.types.ts
└── styles/              # Tailwind + dynamic CSS variable definitions

tests/
├── e2e/                 # Playwright (Mobile simulation & RLS checks)
└── unit/                # Vitest (Scoring logic & rank weighted distance)
```

**Structure Decision**: Single project structure using Vite.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| None | N/A | N/A |
