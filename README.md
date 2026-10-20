# SE20B Store

A Next.js product catalog with Supabase authentication and user-specific favorites.

## Setup

1. Install dependencies with `npm install`.
2. Create `.env.local` in the project root with the Supabase project URL and anon key:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

3. Run the SQL in [`supabase/favorites.sql`](./supabase/favorites.sql) in the Supabase SQL Editor. Row Level Security keeps each user's favorites private.
4. Start the app with `npm run dev`.

## Features

- Server-rendered product catalog with URL-driven search and category filtering.
- Pre-rendered product detail pages at `/products/[id]`.
- Product APIs at `/api/products` and `/api/products/[id]`.
- Supabase sign-in and registration, plus a protected `/account` page.
- Protected `/favorites` page with favorites stored per authenticated user.

## Validation

Run `npm run lint` and `npm run build` to check the project.
