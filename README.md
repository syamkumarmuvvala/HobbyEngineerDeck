# HobbyEngineerDeck

Web app for hobbyist engineers to publish courses, write in public, and discuss builds. This repo ships the marketing site, auth, and the blog.

## Stack

- Next.js App Router (TypeScript)
- Tailwind CSS + shadcn/ui
- Supabase Auth and Storage (publishable key, not the legacy anon JWT)
- Prisma 7 over Supabase Postgres
- Tiptap v3 for the post editor

## Local setup

1. Copy `.env.example` to `.env.local` and fill values from your Supabase project (**Settings → API Keys**: publishable + secret; **Connect**: pooled `DATABASE_URL` on port 6543 with `pgbouncer=true`, and `DIRECT_URL` on 5432).
2. `npm install`
3. `npx prisma migrate dev`
4. `npm run dev`

Create a public Storage bucket named `blog-covers` (public read, authenticated write).

Auth site URL: `http://localhost:3000`. Redirect: `http://localhost:3000/auth/callback`.

Email/password is enough to start. For Google, add a Google Cloud OAuth client (Web) with redirect `https://<project-ref>.supabase.co/auth/v1/callback`, then paste the client ID and secret into Supabase Auth → Google.

Promote a writer by setting `User.role` to `MENTOR` or `ADMIN` in the Table Editor.

## Vercel

Set the same env vars as `.env.example`. After deploy, add `https://<your-domain>/auth/callback` to Supabase Auth redirect URLs and set the Site URL to the production origin.
