<!--
Sync Impact Report:
- Version change: 1.0.0 → 2.0.0
- List of modified principles:
  - I. Code Quality & Maintainability: Shifted from Django to React/Supabase architecture.
  - II. Comprehensive Testing Standards: Replaced pytest with Vitest/Playwright context.
- Added sections:
  - II. Target Tech Stack & Architecture
- Removed sections:
  - None
- Templates requiring updates:
  - .specify/templates/plan-template.md (✅ updated)
  - .specify/templates/spec-template.md (✅ updated)
  - .specify/templates/tasks-template.md (✅ updated)
- Follow-up TODOs:
  - None
-->

# eurovisiontippning Constitution

## Core Principles

### I. Code Quality & Maintainability
All code must be modular, readable, and type-safe. We use TypeScript for all frontend and serverless logic. Components must be functional and follow React best practices, utilizing hooks for state management and Supabase client for data orchestration. We prioritize reusable UI components and consistent styling via Tailwind CSS.

### II. Comprehensive Testing Standards
Testing is a non-negotiable part of our development lifecycle. Every functional requirement must have a corresponding E2E or integration test. We use Vitest for unit/integration testing of logic and Playwright for E2E user journeys. Code without tests will not be merged.

### III. Consistent User Experience (UX)
The application must provide a consistent, responsive, and accessible experience. We use Tailwind CSS with dynamic CSS variables for year-specific themes. Interactive elements must provide immediate feedback (e.g., loading states, optimistic updates). Accessibility (a11y) is a core requirement (WCAG 2.1 AA).

### IV. Performance & Scalability Requirements
Performance is a feature. We utilize Vite for fast builds and optimized production bundles. Supabase provides the scalable backend and database, while Vercel handles global edge hosting. We prioritize minimizing bundle size and optimizing database queries/policies.

## Target Tech Stack & Architecture

- **Frontend**: React (Vite) + TypeScript
- **Styling**: Tailwind CSS with dynamic CSS variables for year-specific themes
- **Drag & Drop**: @dnd-kit/core and @dnd-kit/sortable for ranking entries
- **Backend/Database**: Supabase (PostgreSQL) with Row Level Security (RLS)
- **Auth**: Supabase Auth (Google, Facebook providers)
- **Hosting**: Vercel

## Governance & Technical Decision Making

### Amendment Procedure
The Constitution is a living document. Any team member can propose an amendment by creating a Pull Request. Proposals must include a clear rationale and an assessment of the impact on existing code and workflows. Amendments require approval from the project lead.

### Technical Decision Making
Technical decisions must be guided by these principles. When faced with architectural choices, the solution that best aligns with Code Quality, Testing, UX, and Performance must be prioritized. If a decision requires a trade-off between principles, it must be documented and justified in the implementation plan.

### Compliance Review
Every Pull Request must be reviewed against this Constitution. Reviewers are responsible for ensuring that the code adheres to our quality, testing, UX, and performance standards. Violations must be addressed before approval.

## Governance
This Constitution supersedes all other informal practices. All contributors must adhere to these principles. Use the project's implementation plans to document how these principles are applied to specific features.

**Version**: 2.0.0 | **Ratified**: 2026-05-08 | **Last Amended**: 2026-05-08
