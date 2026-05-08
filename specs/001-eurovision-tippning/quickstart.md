# Quickstart: Eurovisiontippning App

## Prerequisites
- Node.js (v20+)
- Supabase Account
- Vercel Account (for deployment)

## Setup

1. **Clone the repository** (if not already done).
2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Initialize shadcn/ui**:
   ```bash
   npx shadcn-ui@latest init
   ```
4. **Configure Environment Variables**:
   Create a `.env.local` file with:
   ```text
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```
4. **Initialize Supabase**:
   - Run the SQL migrations found in `supabase/migrations/` in your Supabase SQL Editor.
   - Configure Google and Facebook Auth providers in the Supabase Dashboard.
5. **Start Development Server**:
   ```bash
   npm run dev
   ```

## Admin Tasks
1. Navigate to `/admin`.
2. Paste the yearly contest JSON blob to populate `years` and `entries`.
3. Set the theme colors to match the Eurovision year.
