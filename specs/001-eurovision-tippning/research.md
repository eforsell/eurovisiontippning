# Research: Eurovisiontippning App

## Decision: Supabase for Auth and Backend
**Rationale**: Supabase provides a seamless experience for PostgreSQL with built-in Auth (Google/Facebook) and Row Level Security (RLS). This aligns with the "Anti-Spoil" requirement by enforcing data access at the database level based on contest start times.

**Alternatives considered**: 
- Firebase (rejected due to NoSQL structure making complex scoring queries harder).
- Custom Express/Node + Postgres (rejected to minimize infrastructure management and leverage built-in Auth/RLS).

## Decision: @dnd-kit for Ranking
**Rationale**: @dnd-kit is modern, modular, and provides excellent touch support through its `TouchSensor`. This is critical for the mobile-first requirement of ranking 26 final entries.

**Alternatives considered**:
- react-beautiful-dnd (now deprecated/maintained by community, less flexible than dnd-kit).
- native HTML5 Drag and Drop (poor mobile support).

## Decision: Tailwind CSS and shadcn/ui for UI Components
**Rationale**: By using dynamic CSS variables within Tailwind and shadcn/ui, we can easily swap themes (primary/secondary colors) per year without changing the component styles. shadcn/ui provides accessible, unstyled components (Radix UI) that we can fully control and theme, which is perfect for our year-specific dynamic branding.

**Alternatives considered**:
- Styled Components (added bundle size, less performant for rapid theme switching).
- Material UI (harder to theme dynamically with pure CSS variables compared to Tailwind).

## Decision: Playwright for E2E Testing
**Rationale**: Playwright offers robust cross-browser testing and is particularly good at simulating mobile environments, which is essential for verifying the drag-and-drop functionality and RLS "Anti-Spoil" timing.

**Alternatives considered**:
- Cypress (slower in CI, less native support for multi-tab/social flows).
