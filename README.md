# Starbucks Photo Library

A scraper + Figma plugin pair for keeping a local library of high-res
Starbucks brand images available in Figma.

```text
Collaborator
    ↓
Web-based Image Scraper (this app)
    ↓
Photo Database (data/images.json, versioned in this repo)
    ↓
GitHub: starbucks-photo-library
    ↓
Figma Plugin (fetches the database live from GitHub)
    ↓
Plugin users get the latest photos
```

## Why this exists

This project now uses a local-first workflow: scrape and review in the web UI,
then sync selected photos directly into the local Figma plugin snapshot in
this same repo. After that, push to GitHub when you want an archive or to
share updates.

## Structure

```text
server.js          Express app: scraping, ZIP download, local plugin sync
public/index.html  Web UI: scan, review/select, download, sync
data/images.json   The photo database — source of truth, versioned via git
plugin/
  manifest.json    Figma plugin manifest
  code.js          Plugin logic — fetches data/images.json from GitHub at load
  ui.html          Plugin UI (search + grid), unchanged from the original
```

## Running the scraper locally

```bash
npm install
cp .env.example .env   # optional: fill in GITHUB_TOKEN only if using GitHub API publish endpoints
node server.js
open http://localhost:3000
```

Workflow: **Scan for Photos** → review the results → select the ones you
want → **Sync Selected to Plugin**. This updates both `data/images.json` and
the plugin snapshot in `plugin/code.js` locally. Then commit/push to GitHub
when you want to archive/share the latest version.

`GITHUB_TOKEN` should be a fine-grained personal access token scoped to just
this repo with Contents: Read and write. Only needed for publishing —
scanning and downloading work without it.

## Figma plugin

Load `plugin/` as an unpublished/local Figma plugin as usual
(`manifest.json` at the root of that folder). It fetches the current
`data/images.json` from this repo's `main` branch on every load, so once
someone publishes new photos, everyone using the plugin sees them the next
time they open it — no plugin reinstall needed.

## Hosting the scraper — Render (free tier)

Chosen over Vercel because Vercel's serverless functions don't fit this
workload well (10–60s execution limit, ~300MB Puppeteer/Chromium bundle
over Vercel's function size limit, read-only filesystem). Chosen over
Fly.io because Fly.io no longer has a real free tier for new accounts as
of late 2024 — new signups get a short trial, then it's paid.

Render's free web service tier runs a real, long-lived Node process
(container-based, not a short-lived function), which is what Puppeteer
needs. Two things to know going in:

- **Spin-down:** the free service sleeps after 15 minutes with no incoming
  requests, then takes 30–60s to wake up on the next one. Fine for
  "click Scan in the UI, wait a bit." For the scheduled monthly scrape,
  see below — it's set up to wake the service itself.
- **512 MB RAM:** workable for one scrape running at a time (which is how
  this app already works — sequential, not parallel), but worth watching
  if it ever seems unstable.

### Deploy steps

1. Push this repo to GitHub (already done if you used the migration
   script).
2. In Render: **New → Web Service**, connect this repo. `render.yaml` in
   this repo defines the build/start commands and free plan — Render
   should pick it up automatically as a Blueprint.
3. In the Render dashboard, set the environment variables Render didn't
   auto-fill: `GITHUB_TOKEN` (fine-grained PAT, Contents: read/write,
   scoped to this repo only) and `CRON_SECRET` (any random string).
4. Once deployed, open the Render URL — same UI as running locally, just
   hosted.

### Scheduled scraping

The old local-only version used an in-process timer (`node-cron`) that
only fired if someone's laptop happened to have the server running at the
right moment. That doesn't work on a host that sleeps when idle, so it's
been replaced with a protected endpoint,
`POST /api/cron/scrape-and-publish`, guarded by the `CRON_SECRET` header.

`.github/workflows/monthly-scrape.yml` calls that endpoint on the 1st of
each month using GitHub Actions' free scheduled-workflow minutes — set
repo secrets `RENDER_APP_URL` and `CRON_SECRET` (Settings → Secrets and
variables → Actions) and it's live. `render.yaml` also has a commented-out
Render Cron Job alternative, if you'd rather trigger it from Render
directly — just confirm Render Cron Jobs are actually included on the free
plan before relying on it, since that wasn't confirmed at the time this
was written.

## Original repo

`hanseldoan/starbucksfigmapluginphotos` remains untouched as a fallback and
was never modified during this migration.
