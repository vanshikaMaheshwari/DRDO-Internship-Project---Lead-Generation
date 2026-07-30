# Automated Vendor/Supplier Lead Discovery System Using Live Data Sources and Trust-Based Scoring 

A live vendor/lead discovery tool. It scrapes public **government procurement
and MSME registry sources**, turns what it finds into structured leads, and
scores each one by a single **trust score** — how reliable the source is,
how complete the scraped record is, and how fresh the data is.

This project started as a Wix Astro template and has been re-platformed into
a standalone stack for a DRDO internship submission: **no Wix dependency
remains anywhere in the code.**

---

## Architecture

```
square-lead/
├── client/     React + Vite frontend (same UI/components as before)
└── server/     Node/Express backend + live web scraper + JSON datastore
```

- **Before**: React pages called a Wix-hosted `BaseCrudService` backed by
  Wix Data collections and Wix Member auth, built/deployed via `wix build`.
- **Now**: The same pages call an identical-shaped `BaseCrudService` (see
  `client/src/integrations/cms/service.ts`) that talks to a plain REST API
  (see `server/src/routes/`), backed by a local JSON datastore
  (`server/src/db/index.js`, using `lowdb`). This was the one file that let
  every page keep working almost unchanged.

### Live web scraping (`server/src/scraper/`)

- `sources.config.js` — the list of live sources to scrape. Ships
  configured against **CPPP eProcurement** (India's Central Public
  Procurement Portal, public tender listings) and **data.gov.in** (Open
  Government Data platform, MSME dataset catalog). Add more government/MSME
  registry URLs here.
- `htmlTableScraper.js` — fetches a page and auto-detects registry tables by
  matching column headers against keyword synonyms (company/organisation,
  industry/sector, location/district, contact). This makes it generalize
  across different portals instead of being hard-wired to one site's exact
  markup.
- `robots.js` — checks `robots.txt` before every fetch and skips
  disallowed paths.
- `engine.js` — orchestrates a scrape run: fetch → extract → dedupe →
  compute trust score → upsert into `leads` → log the run.
- `trustScore.js` — computes each lead's trust score:
  `40% source reliability + 35% data completeness + 25% freshness`. Source
  reliability itself adjusts after every run based on scrape success rate.
- `scheduler.js` — re-runs all sources automatically on a cron schedule
  (default every 6 hours, configurable via `SCRAPE_CRON` in `server/.env`).

You can trigger a scrape three ways:
```bash
npm run scrape                 # one-off run from the CLI
curl -X POST localhost:4000/api/scrape/run   # on-demand via API
# or just leave the server running — the scheduler handles it
```

### Trust score only

`leadScore` and the AI "reason codes" field from the original template have
been removed. **Trust score is now the single quality metric** shown across
the Leads list, Lead Detail page, Dashboard, and States pages.

---

## Setup

Requires Node.js 18+.

```bash
npm run install:all   # installs both client/ and server/
npm run dev            # runs backend (:4000) + frontend (:5173) together
```

Then open `http://localhost:5173`. On first run there won't be any leads
yet — run a scrape:

```bash
npm run scrape
```

or click through to trigger one from the app (wire a button to
`POST /api/scrape/run` — a `triggerLiveScrape()` helper already exists in
`client/src/integrations/cms/service.ts` for this).

### Environment variables

- `client/.env` (copy from `.env.example`): `VITE_API_BASE_URL` — where the
  frontend finds the API. Defaults to `http://localhost:4000/api`.
- `server/.env` (copy from `.env.example`): `PORT`, `SCRAPE_CRON`,
  `DISABLE_SCHEDULER`.

---

## Known limitations (read before your demo)

1. **Some government portals render results with client-side JavaScript.**
   The current scraper uses `axios` + `cheerio`, which only sees the raw
   HTML response — it won't see content injected by JS after page load. If
   a source in `sources.config.js` returns `success_no_table` (check
   `GET /api/scrape/runs`), that source likely needs a headless browser.
   The clean upgrade path: swap `politeFetch()` in `htmlTableScraper.js`
   for a Playwright page load for that specific source, keeping the same
   `extractFromTables()` heuristic on the rendered HTML.
2. **Government site markup changes over time.** The header-keyword
   detection in `htmlTableScraper.js` is deliberately generic to absorb
   small markup changes, but you should open each configured `url` in a
   browser before a demo to confirm it still renders a plain HTML table.
3. **This was built and tested in a sandboxed environment without general
   internet access to government domains**, so the scraper logic is
   correct and complete but has not been run live against
   `eprocure.gov.in` / `data.gov.in` from this environment. Run
   `npm run scrape` locally first and check the console output /
   `GET /api/scrape/runs` before your demo, and adjust selectors/sources if
   a portal's structure has changed.
4. **The JSON datastore (`lowdb`) is for a single-machine demo,** not
   concurrent production use. Swapping in Postgres/MongoDB is a natural
   next step (see suggestions below) — `db/index.js` isolates all storage
   logic behind the `Collection` object, so that swap only touches one file.

---

## Suggested next improvements

- Swap `lowdb` for Postgres/SQLite-with-`better-sqlite3` once you need
  concurrent writes or bigger datasets.
- Add a `ScrapeRuns` dashboard panel in the UI (the API already exists:
  `GET /api/scrape/runs`) so trust-score changes are explainable during a
  demo/evaluation.
- Add per-source rate-limit and retry/backoff config instead of the fixed
  800ms delay in `politeFetch`.
- Add a Playwright-based adapter for JS-rendered sources, selected
  per-source in `sources.config.js` (e.g. `renderer: 'playwright'`).
- Deduplicate more robustly (fuzzy match on company name, not just exact
  lowercase match) since government listings often have minor name
  variants.
- Add authentication back in (JWT/session-based, not tied to any vendor)
  if this needs to be a multi-user tool for a sales team.
