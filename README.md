# Eurovisiontippning

A web app to bet on the outcome of the Eurovision Song Contest.

## Tech Stack
- **Frontend**: React, TypeScript, Vite, TailwindCSS
- **Backend/Database**: Supabase (PostgreSQL, Auth, RLS)

## Set up dev environment

1. Clone the repository and install dependencies:
   ```bash
   npm install
   ```

2. Set up environment variables. Create a `.env.local` file in the root of your project:
   ```env
   SUPABASE_URL=your_supabase_project_url
   SUPABASE_ANON_KEY=your_supabase_anon_key
   ```
   *You can find these values in your Supabase project dashboard under Settings -> API.*

3. Start the development server:
   ```bash
   npm run dev
   ```

## Database and Supabase Setup

This project uses Supabase. To develop locally or run the project against a live Supabase instance, ensure the schema and database policies are applied.

1. Install the [Supabase CLI](https://supabase.com/docs/guides/cli).
2. Start local Supabase services:
   ```bash
   supabase start
   ```
   This will automatically apply migrations from `supabase/migrations/` and the seed data from `supabase/seed.sql`.

*Note: If you run Supabase locally, the URL and ANON key will be printed to your console. Update your `.env.local` with those values.*

## Prep for new contest

To easily create info for a new contest, run the database seed or manually insert data into the Supabase tables (`events`, `entries`, `contests`) using the Supabase studio. 

Admin users can progress entries between semi-finals and the final directly from the application's Admin interface.

## Build for Production

To build the app for production (e.g., to deploy on Vercel):
```bash
npm run build
```

This generates static files in the `dist/` directory.
