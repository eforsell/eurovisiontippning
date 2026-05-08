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

## Decision: Chrome DevTools MCP for Agentic Verification
**Rationale**: Chrome DevTools MCP allows the coding agent to directly interact with the browser, inspect the DOM, read console logs, and verify network requests in real-time during development. This provides a more immediate and agent-friendly feedback loop for verifying UI, authentication state, and connectivity without writing rigid E2E test scripts upfront.

**Alternatives considered**:
- Playwright (requires writing and maintaining separate test scripts; while great for CI, MCP is better for autonomous agent-driven development and immediate feedback).
- Cypress (slower, less native support for multi-tab/social flows).
