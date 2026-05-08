# Implementation Plan: [FEATURE]

**Branch**: `[###-feature-name]` | **Date**: [DATE] | **Spec**: [link]
**Input**: Feature specification from `/specs/[###-feature-name]/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

[Extract from feature spec: primary requirement + technical approach from research]

## Technical Context

**Language/Version**: [e.g., TypeScript 5.x, React 18/19]  
**Primary Dependencies**: [e.g., Supabase, Tailwind CSS, @dnd-kit]  
**Storage**: [Supabase (PostgreSQL)]  
**Testing**: [e.g., Vitest, Playwright]  
**Target Platform**: [Vercel]
**Project Type**: [Web Application]  
**Performance Goals**: [e.g., <200ms TTFB, 90+ Lighthouse score]  
**Constraints**: [e.g., Client-side only rendering, Supabase RLS policies]  
**Scale/Scope**: [e.g., 5000+ concurrent users during ESC final]

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [ ] **I. Code Quality**: Does the design follow functional React patterns and use TypeScript?
- [ ] **II. Testing**: Are E2E (Playwright) or integration (Vitest) tests planned?
- [ ] **III. UX**: Does it use Tailwind for themed styling and provide immediate feedback?
- [ ] **IV. Performance**: Is the Supabase query optimized and RLS handled?

## Project Structure

### Documentation (this feature)

```text
specs/[###-feature]/
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

**Structure Decision**: [Document the selected structure and reference the real
directories captured above]

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [e.g., 4th project] | [current need] | [why 3 projects insufficient] |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient] |
