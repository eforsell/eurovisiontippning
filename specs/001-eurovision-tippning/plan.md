# Implementation Plan: Eurovisiontippning App

**Branch**: `v5` | **Date**: 2026-05-08 | **Spec**: [specs/001-eurovision-tippning/spec.md]
**Input**: Feature specification from `/specs/001-eurovision-tippning/spec.md`

## Summary
Build a mobile-first Eurovision prediction app using React, Supabase, and Tailwind CSS. Key features include semifinal qualifier selection, drag-and-drop ranking for the final, and an "Anti-Spoil" mechanism enforced via Supabase RLS policies.

## Technical Context

**Language/Version**: TypeScript 5.x, React 18/19  
**Primary Dependencies**: Supabase, Tailwind CSS, shadcn/ui, @dnd-kit  
**Storage**: Supabase (PostgreSQL)  
**Testing**: Vitest, Chrome DevTools MCP (Agentic Verification)  
**Target Platform**: Vercel
**Project Type**: Web Application  
**Performance Goals**: <200ms TTFB, 90+ Lighthouse score  
**Constraints**: Client-side only rendering, Supabase RLS policies  
**Scale/Scope**: 5000+ concurrent users during ESC final

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] **I. Code Quality**: Does the design follow functional React patterns and use TypeScript?
- [x] **II. Testing**: Are agentic verifications (Chrome DevTools MCP) or integration (Vitest) tests planned?
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
└── unit/                # Vitest (Scoring logic & rank weighted distance)
```

**Structure Decision**: Single project structure using Vite.

## Autonomous Agent Verification Strategy

To enable the coding agent to verify its own work without human oversight (especially regarding Auth, UI, and DB connectivity), the following workflows must be implemented:

1. **Local Supabase Environment**: 
   - The agent will use the Supabase CLI (`npx supabase start`) to run a local database instance.
   - Migrations and seeds will be applied and verified via `npx supabase db reset`.
   - **Type Generation**: The agent will automatically run `npx supabase gen types typescript --local > src/types/database.types.ts` to verify schema validity and ensure type safety.

2. **Authentication Verification (The Trickiest Part)**:
   - Since OAuth (Google/Facebook) is difficult for an autonomous agent to automate without human interaction, **Email/Password auth must be enabled in the local Supabase configuration specifically for automated testing.**
   - The agent will write an automated script (e.g., `tests/verify-auth.ts`) to programmatically create a test user, sign in, and verify session token retrieval.
   - This test user's session will be used to programmatically verify RLS policies.

3. **UI and Connectivity Verification**:
   - The agent will run the Vite development server in the background.
   - Using **Chrome DevTools MCP**, the agent will navigate the application, assert that no console errors are thrown, check network requests for failures, and verify DOM rendering.
   - For authenticated UI states, the agent will inject the test user's session into the browser context (e.g., via localStorage manipulation using MCP evaluate commands) before verifying the UI.

## Phased Implementation Strategy

This strategy outlines the sequence of development, mapping each phase to the relevant implementation details.

### Phase 1: Setup & Infrastructure
**Goal**: Establish the base project and connectivity.
- **Tasks**:
  - Initialize Vite + React + TS project.
  - Configure Tailwind CSS & shadcn/ui (see `research.md`).
  - Initialize local Supabase project (`npx supabase init`) & local migrations folder (see `data-model.md`).
  - Enable local Email/Password Auth for agent testing, alongside configuring Google/Facebook Auth for production.
  - Create and run the initial autonomous verification scripts (Auth and UI connectivity).

### Phase 2: Core Data & Admin
**Goal**: Implement data ingestion and dynamic theming.
- **Tasks**:
  - Create `years` and `entries` tables with RLS (see `data-model.md`).
  - Build Admin page for JSON import (see `contracts/admin-import.json`).
  - Implement dynamic theme hook/store using CSS variables (see `research.md`).

### Phase 3: Main UI & Prediction Logic
**Goal**: Build the primary user experience.
- **Tasks**:
  - Build Landing page (Unauthorized vs Authorized).
  - Implement Tabbed contest view (Semi 1, Semi 2, Final).
  - Integrate @dnd-kit for Final ranking (see `research.md`).
  - Setup `predictions` and `notes` tables with RLS (see `data-model.md`).

### Phase 4: Social, Scoring & Polish
**Goal**: Implement sharing, leaderboard, and compliance.
- **Tasks**:
  - Implement Friends system (see `data-model.md`).
  - Build "Anti-Spoil" view for friend predictions (see `data-model.md` RLS).
  - Implement scoring logic & Leaderboard (see `spec.md` for formulas).
  - Add Data Protection & Account Deletion (see `spec.md`).

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| None | N/A | N/A |
