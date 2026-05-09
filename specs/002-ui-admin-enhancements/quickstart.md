# Quickstart

If you are joining the development of this feature (`002-ui-admin-enhancements`), please follow this guide to understand the scope and technical decisions.

## 1. Understand the Goal
This feature brings crucial UI and UX improvements, specifically:
- Hamburger navigation and an Account view.
- Friend search (with privacy controls) and tied-score handling in leaderboards.
- Strict Supabase Row Level Security (RLS) for Admin endpoints, fulfilling the requirement for robust access control.
- Timezone-aware UTC countdowns for voting deadlines.
- Mobile scroll fixes for the drag-and-drop song ranking lists.

## 2. Review the Design
- **Data Model**: Read `specs/002-ui-admin-enhancements/data-model.md` to see the new fields added to `profiles`, the schema for `contests`, and the strict RLS rules required.
- **Admin Import**: Review the expected JSON schema in `specs/002-ui-admin-enhancements/contracts/admin-import.json`. The frontend must validate admin input against this schema before pushing data to Supabase.
- **Research**: Read `specs/002-ui-admin-enhancements/research.md` to understand why certain technical approaches were chosen (e.g., SQL Window Functions for leaderboards, `@dnd-kit` touch sensors).

## 3. Development Workflow
1. Apply the database migrations first to ensure the backend supports the new `is_private` and `is_admin` flags, as well as the strict RLS policies.
2. Create the backend RPCs for searching friends and calculating the leaderboard.
3. Update the frontend UI starting with the generic components (Hamburger Menu, headings contrast).
4. Update the ranking lists to fix the mobile touch sensors.
5. Create the Account page and integrate the Supabase Auth deletion and privacy toggles.
6. Overhaul the Admin page to use the new JSON validator and direct Supabase mutation methods, verifying RLS blocks non-admins.