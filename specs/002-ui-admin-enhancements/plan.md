# Implementation Plan: UI, Navigation, and Admin Enhancements

**Branch**: `002-ui-admin-enhancements` | **Date**: 2026-05-09 | **Spec**: specs/002-ui-admin-enhancements/spec.md
**Input**: Feature specification from `/specs/002-ui-admin-enhancements/spec.md`

## Summary

This feature significantly upgrades the user experience, navigation, privacy controls, and admin security. It introduces a hamburger menu for navigation, mobile-friendly drag-and-drop using `@dnd-kit` touch sensors, timezone-aware voting deadlines, and a robust friend search system with an opt-in private account setting. Admins receive strict RLS-secured endpoints for importing and modifying contest data, ensuring no unauthenticated user can tamper with the application's state.

## Technical Context

**Language/Version**: TypeScript, React
**Primary Dependencies**: Supabase, Tailwind CSS, @dnd-kit, Lucide React (icons)
**Storage**: Supabase (PostgreSQL)
**Testing**: Vitest (Unit), Playwright (E2E)
**Target Platform**: Vercel
**Project Type**: Web Application
**Performance Goals**: Fast client-side rendering, smooth 60fps drag-and-drop on mobile.
**Constraints**: All admin and deadline logic must be strictly enforced via Supabase RLS and RPCs.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] **I. Code Quality**: Does the design follow functional React patterns and use TypeScript? Yes, uses standard functional components and types.
- [x] **II. Testing**: Are E2E (Playwright) or integration (Vitest) tests planned? Yes, Vitest for scoring logic and Playwright for UI interactions.
- [x] **III. UX**: Does it use Tailwind for themed styling and provide immediate feedback? Yes, Tailwind will be used for high-contrast headers and styling.
- [x] **IV. Performance**: Is the Supabase query optimized and RLS handled? Yes, heavy emphasis on RLS security and optimized RPCs for friend searching.

## Project Structure

### Documentation (this feature)

```text
specs/002-ui-admin-enhancements/
├── plan.md              # This file
├── research.md          # Architectural decisions
├── data-model.md        # Database schema and RLS requirements
├── quickstart.md        # Setup guide
├── contracts/
│   └── admin-import.json # JSON Schema for contest data import
└── tasks.md             # Implementation tasks
```

### Source Code Integration

- `supabase/migrations/`: New migrations for `profiles.is_private`, `profiles.is_admin`, RPCs for friend search, and updated strict RLS policies.
- `src/components/Navigation/`: New HamburgerMenu component.
- `src/pages/AdminView.tsx`: Updated with JSON validation and manual override forms.
- `src/pages/AccountView.tsx`: New page for privacy settings and account deletion.
- `src/components/Ranking/`: Update `@dnd-kit` sensors for mobile scrolling.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| None      | N/A        | N/A                                 |