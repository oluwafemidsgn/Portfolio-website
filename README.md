# Oduneye Oluwafemi — Portfolio

A single-page creative-designer portfolio implemented from Figma:
[figma.com/design/xfCSZopS2LorEVTf3CN7iI](https://www.figma.com/design/xfCSZopS2LorEVTf3CN7iI/Oluwafemidsgn-web?node-id=1-87).

## Stack

- **Next.js 15** (App Router) + **React 19**
- **TypeScript**
- **Tailwind CSS v4** (design tokens via `@theme` in `app/globals.css`)
- **Geist** (via `next/font`) as a free stand-in for Nohemi — swap in a
  licensed Nohemi font file once you have it (see below).

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Project structure

```
app/
  layout.tsx          # HTML shell, fonts, metadata
  page.tsx            # Home page — composes every section
  globals.css         # Tailwind v4 + design tokens + grid utilities
components/
  site-nav.tsx        # Top nav with email
  hero.tsx            # Large name + tagline + info panel
  info-panel.tsx      # ROLE / AVAILABILITY / LOCATION + live clock
  project-thumb.tsx   # Reusable caption-under-thumbnail tile
  projects-section.tsx
  about-section.tsx
  services-section.tsx
  playground-section.tsx
  cta-section.tsx
  email-banner.tsx    # Giant black mailto banner
  site-footer.tsx     # Name + blurb + social thumbs + reel panel
```

## Design tokens

Defined once in `app/globals.css` and consumed as Tailwind utility colors
(`bg-paper`, `text-body`, `bg-mute`, etc.):

| Token | Hex     | Purpose                          |
| ----- | ------- | -------------------------------- |
| ink   | #000000 | titles, email banner background  |
| paper | #ffffff | page background, banner text     |
| strong| #484848 | strong labels                    |
| body  | #bcbcbc | body copy                        |
| mute  | #d9d9d9 | placeholder thumbs, muted text   |

## Replacing the Nohemi font

Nohemi is a paid display font by Pangram Pangram and isn't on Google Fonts.
The portfolio currently ships with **Geist** as a close geometric sans
stand-in. Once you have a Nohemi license:

1. Drop the font files into `public/fonts/`.
2. In `app/layout.tsx`, replace the `next/font/google` import with
   `next/font/local` and point it at your local files.
3. Keep the variable name `--font-geist` (or rename and update
   `--font-display` / `--font-sans` in `app/globals.css`).

## Replacing placeholders

Project tiles, about portrait, playground feature panel, and footer reel
are rendered as `bg-mute` placeholders matching the Figma. Replace them
by passing an image as `children` to `<ProjectThumb>`:

```tsx
<ProjectThumb date="2025.02" title="LUMEN" type="Brand identity">
  <img
    src="/projects/lumen.jpg"
    alt=""
    className="h-full w-full object-cover"
  />
</ProjectThumb>
```

## Scripts

- `npm run dev` — development server (Turbopack)
- `npm run build` — production build
- `npm run start` — run the production build
- `npm run lint` — Next lint
