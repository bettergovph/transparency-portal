# AGENTS.md

Guidance for AI coding agents working on this repository or a fork of it.

## What this is

A static site that shows citizens every FY 2027 budget project for one LGU or one DPWH
district engineering office, and the enacted budgets of 2020–2026 for the same area. It
has no backend: every figure comes from the public BetterGov.PH Budget API
(`https://budget.bettergov.ph/api/v1`, reference at `/docs`). A fork changes one file,
`portal.config.ts`.

## Commands

```bash
npm install
npm run dev            # Vite on port 5132 (strictPort; see vite.config.ts)
npm run setup          # writes portal.config.ts from the live API (pipeable; --list-offices, --list-districts, --out=)
npm run check          # runs the config against the live API; exits 1 on a broken config
npm run check -- --config=examples/deo.config.ts
npm run lint
npm run build          # tsc -b, then vite build → dist/
npm run build:poster   # needs `npm run dev` running; writes docs/poster/*.png
npm run deploy:cloudflare
```

There is no test suite. A change is verified by `npm run lint`, `npm run build`,
`npm run check` (on `portal.config.ts` and every file in `examples/`), and by looking at
the changed pages in a browser at desktop width and at 390 px.

## Where things are

| Path | What it is |
| --- | --- |
| `portal.config.ts` | The one file a fork edits. The default is a worked example (Province of Bohol). |
| `src/config.ts` | The config contract: every field documented, `configProblems()` checks it. A new field goes here, in the README and, if `npm run setup` should ask for it, in `scripts/setup.ts`. |
| `src/api/` | `client.ts` (fetch, memoised; every page of every list) and `types.ts` (only the fields the portal reads). |
| `src/lib/scope.ts` | Config → the 2027 projects, each with the reasons it is listed. |
| `src/lib/gaa.ts` | Config → the 2020–2026 programs that name the places (every department, every page). |
| `src/pages/` | `Home` (2027: figures, offices with their districts, statuses, every project), `Enacted` (`/gaa`, 2020–2026), `Project`, `About`. |
| `src/components/` | Masthead and footer (`Chrome`), the offices section, shared bits (status chip, disclaimers, `Await`). |
| `src/styles/` | `theme.css` (the budget.bettergov.ph tokens and type roles) and `app.css`. No CSS framework. |
| `scripts/` | `setup.ts`, `check.ts`, `build-poster.ts` (run with tsx). |
| `docs/` | `api.md` (routes used, quirks, gaps), `reporting.md` (the citizen-report link contract), `deploy.md`, `poster/`. |

## Data rules a change must keep

These come from the API and the comparison behind it. Breaking one misleads readers.

- **Show the API's figures; compute nothing it does not publish.** Amounts are integer
  pesos. `null` means "this version has no such line", never zero; print a dash.
- **The NEP and the House bill are two versions of one budget: compare them, never add
  them.** Sums over a set are per version.
- **Candidates, not findings.** "In the House bill only" and "In the NEP only" are
  insertion and deletion *candidates*. Never write "inserted", "padded", "anomalous" or
  anything that implies wrongdoing. Flag unconfirmed matches (`held`) wherever a row shows.
- **Offices first, districts under them.** DPWH lists money by district engineering
  office. A shared (Tier B) office's money is shown once, whole, and never divided
  between the districts it serves. Keep tiers, co-served districts and the note on money
  that is on no district card.
- **Representatives are shown so readers can find their district**, never as the source
  of a project. Keep the API's `representatives_note` next to them.
- **Disclaimers are printed from the API responses** (`disclaimers`, `meta.notice`), not
  retyped, so the wording cannot drift. Every page with figures keeps them.
- **Nothing is hidden silently.** Exclusions need a reason and are listed on the About
  page; the About page lists every query with its count and a link to check it.
- **Enacted budgets (2020–2026) are appropriations**: the authority to spend, not
  spending. A year counts only where its `amount > 0` (the API's `count` carries old lines
  forward at ₱0). Years are shown side by side; the 2027 figures are not law and are never
  added to them. Use each department's `programs` list, all pages, never `/gaa/search`
  (capped at 100, no paging). `npm run check` reconciles the rows against the API's
  `matched_amount` for every department and year; keep that passing.
- **API quirks** (details in `docs/api.md`): the 2027 `office` filter needs the office
  name as published ("Bohol 1st District Engineering Office"); a place's `region` is
  applied in the client because irrigation lines have no region; the GAA has no region
  at all.

## Copy rules

Readers are citizens, not analysts.

- Plain words. "NEP", "House bill" (not "HGAB" or "the President's proposal"), "as
  published". Explain a term once, where it first appears.
- Headings state a fact with its number ("174 projects for Bohol in the 2027 budget"),
  not a slogan. At most two sentences per block of explanation.
- No API field names, codes or developer notes in reader-facing text. The API's
  `rules`, `residual_note` and `fy2027_vs_proposal.note` are written for developers;
  paraphrase them.
- Compact layouts: a section that takes a screenful to say little should be cut down.

## Code conventions

- React 19 function components, TypeScript strict, React Router. Three runtime
  dependencies; add one only when it clearly earns its weight (the site should stay small).
- Match the surrounding code: its comment density (comments say why), naming and idiom.
- Keep `src/config.ts`, `src/lib/*` and `src/api/*` free of browser- and Vite-only APIs:
  the scripts import them under Node.
- Type and colour come from `theme.css`: Figtree for display, Inter for text, JetBrains
  Mono for labels only (never sentences), BetterGov blue `#0b4fd9` as the accent.
- Filters live in the URL so a filtered list can be shared.

## Do not

- Do not add a backend, database, analytics or tracking. The portal is static by design.
- Do not collect citizen reports in the portal. They go to one central service on
  budget.bettergov.ph through the link contract in `docs/reporting.md`.
- Do not commit secrets (`.env`, API tokens). The portal needs none.
- Do not let an image model draw data or text on posters; typeset it in code
  (`scripts/build-poster.ts`).
