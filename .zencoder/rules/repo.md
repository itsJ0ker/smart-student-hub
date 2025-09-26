# Smart Student Hub — Repo Guidelines

## Project Overview
Smart Student Hub is a Next.js (App Router) + Supabase project designed to deliver personalized student engagement, analytics, and gamified learning. The frontend runs on Next.js 14 with Tailwind CSS and React hooks; the backend relies on Supabase for authentication, database, functions, and migrations. The repository also integrates PWA tooling via `next-pwa`.

## Key Tech Stack
- **Next.js 14 (App Router)**: primary framework for pages, API routes, and server actions.
- **React & TypeScript**: UI components and hooks, `use client` components where necessary.
- **Supabase**: database, auth, migrations (`supabase/migrations`), edge functions.
- **Tailwind CSS**: utility-first styling.
- **Vercel**: expected deployment target; ensure production-ready configurations.

## Structure Highlights
- **`src/app`**: App Router pages and API routes. Prefer this over legacy Pages Router.
- **`src/components`**: React component library for dashboards, AI features, forms.
- **`src/lib`**: reusable utilities like Supabase client and auth context.
- **`migrations/`**: SQL migrations for Supabase database schema.
- **`supabase/`**: Supabase project configuration and seed scripts.

## Development Practices
1. **Prefer App Router APIs**: Remove or migrate legacy `src/pages/api` handlers unless explicitly needed.
2. **Idempotent Migrations**: Guard schema changes with existence checks; wrap seed data in `DO` blocks.
3. **Type Safety**: Use TypeScript typings for Supabase responses and component props.
4. **Tailwind Consistency**: Stick to existing design tokens; avoid inline styles when a utility class exists.
5. **Auth Awareness**: Most features require an authenticated user—handle null `user` states gracefully.
6. **PWA Config**: Verify `next-pwa` settings before enabling; keep service worker logic in sync with Next.js updates.
7. **Testing**: Favor unit tests with Jest/React Testing Library where practical; keep fixtures in `__tests__/`.

## Local Setup
1. Install dependencies: `npm install`
2. Run Supabase locally: `supabase start`
3. Apply migrations: `supabase db reset`
4. Start dev server: `npm run dev`

## Deployment Checklist
- Remove development-only flags from `next.config.js`.
- Ensure migrations are idempotent and tested on a blank database.
- Update environment variables in Vercel/Supabase dashboards.
- Run `npm run build` to verify production readiness.

## Contribution Notes
- Follow conventional commits (e.g., `fix:`, `feat:`).
- Keep pull requests focused; one feature or fix per PR.
- Document notable architectural decisions in the repo Wiki or `DECISIONS.md` (if present).

## Contact & Support
- Primary Maintainer: Joker (GitHub: @Joker)
- Issues tracked via GitHub Issues; label appropriately (`bug`, `enhancement`, `migration`, etc.).

Keep the student experience delightful—prioritize performance, accessibility, and reliability.