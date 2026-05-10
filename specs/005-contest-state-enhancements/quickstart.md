# Quickstart: Contest State Enhancements

## Overview
This feature introduces strict state management for contests. When a contest starts, prediction modifications are locked without annoying popups. It also introduces the `final_start_position` for Grand Final entries, improves result visibility with scores and highlights on Tippning/Sharing pages, and adds score breakdowns to the friends leaderboard.

## Key Areas to Modify
1. **Supabase Migrations**: Create a new migration for `final_start_position` on `entries`.
2. **Supabase Seed**: Add mock users, friend relationships (pending/accepted), and predictions for `eskil.forsell@gmail.com`.
3. **Frontend Components**:
   - `AdminView`: Disable progression buttons if the contest hasn't started.
   - `Entry` / `Ranking`: Implement locked states, show actual scores, add visual indicators for progressed/eliminated entries.
   - `LeaderboardView`: Make rows expandable to show score breakdowns.
   - `Sharing Views`: Ensure entries are strictly filtered by the specific contest and sorted correctly.