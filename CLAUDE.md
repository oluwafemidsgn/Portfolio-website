# CLAUDE.md

## Project Overview

This repository contains Oduneye Oluwafemi's portfolio site built with:

- Next.js App Router (React 19 + TypeScript)
- Tailwind CSS v4
- Framer Motion
- SQLite via `better-sqlite3`

The site includes:

- Public pages: home, about, projects index, case-study detail, playground, contact
- Admin CMS for case studies + homepage sections
- Motion system (custom cursor, loader/counter transitions, scroll reveals)
- Theme system (global light/dark mode)

## High-Level Architecture

- `app/`
  - Public routes: `page.tsx`, `about/page.tsx`, `projects/page.tsx`, `projects/[slug]/page.tsx`, `playground/page.tsx`, `contact/page.tsx`
  - Admin routes: `admin/` (login, case studies, homepage content sections)
  - Shared root shell in `app/layout.tsx`
- `components/`
  - Page sections and content blocks
  - `components/motion/` for animation primitives (`loader`, `cursor`, `frame`, reveal helpers)
  - `components/playground-studio/` for interactive playground canvas UI
  - `components/theme/` for theme pre-hydration + toggle
- `lib/`
  - `db.ts`: SQLite connection, schema creation, and safe additive migrations
  - `auth.ts`: cookie/session-based admin auth
  - Repositories: `case-studies.ts`, `home-content.ts`
  - `seed.ts`: idempotent seed data for local/dev bootstrap
- `data/`
  - SQLite db (`portfolio.db` + WAL/SHM files)

## What Has Been Implemented

### 1) Public Site Expansion

- Built complete About page experience with structured sections and motion.
- Built Projects index with richer card grid and published-only listing.
- Built case-study detail pages with proper case-study reading structure and media-heavy blocks.
- Added Contact page matching site aesthetic.
- Added dedicated Playground page with interactive studio-like canvas.

### 2) Interactive Playground System

Implemented `components/playground-studio/*`:

- Tool palette: move, pen, brush, pencil, eraser
- Background color palette (theme-aware options included)
- Draggable media cards with dynamic initial layout
- Drawing overlay (SVG rendering + pointer capture layer)
- Card modal with experiment details and optional live URL CTA
- Mini snake game panel with local high-score persistence

Key fixes made:

- Brush/drawing bug fixed by moving pointer capture to a plain overlay `div` (SVG blank-area pointer-event issue).
- Hydration mismatch fix in snake panel by removing render-time randomness and randomizing only in `useEffect`.
- Updated old token usages (`--ink`/`--paper`) to canonical theme tokens where needed.

### 3) CMS Enhancements

#### Case Studies CMS

- Existing CRUD flows for create/update/publish/unpublish/delete.
- Added **Duplicate** action:
  - New server action `duplicateCaseStudy` in `app/admin/actions.ts`
  - New repository helper `duplicate()` in `lib/case-studies.ts`
  - Duplicate creates a draft copy with `(Copy)` title suffix and unique slug
  - Admin redirects to cloned record edit page

#### Homepage CMS sections

Homepage sections managed under `app/admin/homepage/*` and `lib/home-content.ts`:

- Hero projects
- Playground items
- Recommendations

Each section supports create/edit/delete/reorder and now **duplicate**:

- `duplicateHeroProject` + `duplicateHeroAction`
- `duplicatePlaygroundItem` + `duplicatePlaygroundAction`
- `duplicateRecommendation` + `duplicateRecommendationAction`

Duplicate UI buttons were added to section list tables/cards and styled consistently with existing admin actions.

### 4) Theme System (Global Light/Dark)

- Added pre-hydration theme script: `components/theme/theme-script.tsx`
  - Applies `data-theme` to `<html>` before React hydration
  - Reads persisted `localStorage` preference; falls back to `prefers-color-scheme`
- Added navigation theme toggle: `components/theme/theme-toggle.tsx`
- Updated site nav to include toggle in both desktop + mobile patterns.
- Global color tokens now correctly support full-site palette inversion across routes.

### 5) Loader / Route Transition System

Current loader architecture:

- `components/motion/loader.tsx` is rendered inside each public page.
- On **every page mount**, it animates counter `00 -> 100`.
- First mount in tab session uses longer duration (`~2200ms`); subsequent mounts use shorter (`~900ms`) via `sessionStorage` flag.
- `prefers-reduced-motion` disables overlay.
- Uses `requestAnimationFrame` loop with strict-mode-safe idempotent guard (`startedRef`) to prevent `00` freeze.

Public pages that render loader:

- `/`
- `/about`
- `/projects`
- `/projects/[slug]`
- `/playground`
- `/contact`

### 6) DB/Schema Reliability Work

- Separated schema application into stable flow so table creation/migrations reliably run in dev/HMR.
- Added additive migration helper (`addColumnIfMissing`) used for schema changes like `playground_items.live_url`.
- Ensured seed logic remains idempotent and does not overwrite existing edited rows.

## Important Data Model Notes

Core tables:

- `case_studies`
- `hero_projects`
- `playground_items`
- `recommendations`

Relevant content additions:

- Playground items support `liveUrl` (for modal live link CTA).
- Homepage entities rely on `display_order` with move up/down swap semantics.

## Auth + Admin Notes

- Admin is cookie-auth protected (`/admin/login`).
- Required env vars:
  - `ADMIN_PASSWORD`
  - `ADMIN_SESSION_SECRET`

Unauthenticated requests to admin routes are expected to return redirects.

## Verification Summary (Recent)

Repeatedly verified:

- Public routes return HTTP `200`
- Admin routes return auth redirects when logged out (`307`)
- No linter errors in edited files after major changes
- Theme script present in served HTML and dark selectors present in compiled CSS

## Local Commands

- Install deps: `npm install`
- Dev server: `npm run dev`
- Build: `npm run build`
- Start production: `npm run start`
- Lint: `npm run lint`

## Deployment Guidance

- SQLite under `data/` is fine for local/single-instance usage.
- For multi-instance production, move content storage to a hosted DB.
- Keep `ADMIN_PASSWORD` and `ADMIN_SESSION_SECRET` set in production environment.
