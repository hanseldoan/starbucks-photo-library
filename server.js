// ============================================================
// Starbucks Photo Library — server.js
// ============================================================
// HOW TO RUN LOCALLY:
// 1. npm install
// 2. npm install puppeteer
// 3. cp .env.example .env   (fill in GITHUB_TOKEN if you want to publish)
// 4. node server.js
// 5. Open http://localhost:3000
// ============================================================
//
// LOCAL-FIRST WORKFLOW:
// This app scrapes into data/images.json and the review step syncs selected
// photos into plugin/code.js (bundled snapshot) so the local Figma plugin in
// this same repo is immediately updated. You can still push these file
// changes to GitHub afterward for archive/collaboration.
//
// The scraping logic below (sources, limits, label/name generation) is
// carried over from the original tool. If you already had the original
// checked out locally, it's worth a quick side-by-side sanity check after
// your first scrape here, since this file is a clean rewrite rather than a
// byte-for-byte copy.
// ============================================================

const express = require("express");
const puppeteer = require("puppeteer");
const archiver = require("archiver");
const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

const DATA_FILE = path.join(__dirname, "data", "images.json");
const PLUGIN_CODE_FILE = path.join(__dirname, "plugin", "code.js");
const BASE_URL = "https://about.starbucks.com";

// GitHub publish target — set these in .env (see .env.example).
// GITHUB_TOKEN needs "repo" (or fine-grained Contents: read/write) scope
// on this specific repository. Never commit a real token.
const GITHUB_OWNER = process.env.GITHUB_OWNER || "hanseldoan";
const GITHUB_REPO = process.env.GITHUB_REPO || "starbucks-photo-library";
const GITHUB_BRANCH = process.env.GITHUB_BRANCH || "main";
const GITHUB_TOKEN = process.env.GITHUB_TOKEN || null;
const GITHUB_DATA_PATH = "data/images.json";

// Shared secret for the scheduled scrape+publish endpoint below — set this
// in Render's env vars and in whatever scheduler calls it (Render Cron Job
// or a GitHub Actions workflow). Not a login credential, just a way to stop
// randos from hitting the endpoint and kicking off scrapes.
const CRON_SECRET = process.env.CRON_SECRET || null;

// Each source defines its own minimum dimension threshold and search keywords.
// This allows fine-grained control over image quality per source and improves
// searchability in the Figma plugin by tagging images with source-specific keywords.
const SOURCES = [
  {
    name: "stories",
    url: "https://about.starbucks.com/stories/",
    minDimension: 1000,
    keywords: ["story", "storytelling", "brand narrative"],
  },
  {
    name: "multimedia",
    url: "https://about.starbucks.com/multimedia/",
    minDimension: 1000,
    keywords: ["multimedia", "promotional", "assets", "campaign"],
  },
  {
    name: "history",
    url: "https://about.starbucks.com/history/",
    minDimension: 1000,
    keywords: ["history", "heritage", "brand story", "iconic"],
  },
  {
    name: "featured",
    url: "https://www.starbucks.com/menu/featured/",
    minDimension: 300,
    requireDimensionParse: false,
    keywords: ["menu", "featured", "product", "drink", "food"],
  },
];

const MAX_PAGES_PER_SOURCE = Number(process.env.MAX_PAGES_PER_SOURCE || 20); // max individual content pages per source
const MAX_INDEX_PAGES = Number(process.env.MAX_INDEX_PAGES || 50); // max pagination pages per source index
const REQUEST_DELAY = Number(process.env.REQUEST_DELAY_MS || 500); // ms between page loads

let isScraping = false;
let scrapeStatus = {
  isRunning: false,
  startedAt: null,
  finishedAt: null,
  lastError: null,
  lastWarning: null,
  lastMessage: "Idle",
  startCount: 0,
  endCount: 0,
};

// ============================================================
// MIDDLEWARE
// ============================================================

app.use(express.json({ limit: "10mb" }));
app.use((req, res, next) => {
  // Local admin UI should always load fresh JS/CSS after edits.
  res.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
  res.set("Pragma", "no-cache");
  res.set("Expires", "0");
  next();
});
app.use(express.static(path.join(__dirname, "public")));

// ============================================================
// HELPERS
// (carried over from the original scraper — unchanged)
// ============================================================

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function normalizeUrl(url, baseUrl = BASE_URL) {
  if (!url) return null;

  try {
    return new URL(url, baseUrl).toString();
  } catch {
    return null;
  }
}

function isBotChallengePage(title, bodyText = "") {
  const t = String(title || "").toLowerCase();
  const b = String(bodyText || "").toLowerCase();

  return (
    t.includes("just a moment") ||
    b.includes("checking your browser") ||
    b.includes("please enable javascript") ||
    b.includes("security check") ||
    b.includes("cloudflare")
  );
}

// Read dimensions encoded in filename: "image-2048x1365.jpg" → { width:2048, height:1365 }
function parseDimensionsFromUrl(url) {
  const match = url.match(/[_-](\d{3,5})x(\d{3,5})(?=[._-]|$)/i);
  if (match) {
    return { width: parseInt(match[1]), height: parseInt(match[2]) };
  }
  return null;
}

// Generate search labels from page title + URL
function generateLabels(title, pageUrl) {
  return (title + " " + pageUrl)
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length >= 4)
    .filter((w, i, arr) => arr.indexOf(w) === i);
}

// Collapse a messy scraped title (tabs/newlines from nested HTML) into one clean line.
function cleanTitle(title) {
  return title.trim().replace(/\s+/g, " ");
}

// Derive a readable name from the image filename itself, e.g.
// "SBX20230323-AMOS-Top-Takeaways-2048x1365.jpg" → "Amos Top Takeaways"
function filenameToName(url) {
  const file = url.split("/").pop().split("?")[0] || "";
  let name = file.replace(/\.(jpg|jpeg|png|webp)$/i, "");
  name = name.replace(/-\d{2,5}x\d{2,5}(-\d+)?$/i, ""); // strip trailing dimension suffix
  name = name.replace(/^(SBX\d+[-_]?|PA\d+_?\d*[-_]?|\d{4,8}[-_]?)/i, ""); // strip common source codes/dates
  name = name.replace(/[-_]+/g, " ").trim();
  name = name.replace(/\w\S*/g, (w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase());
  return name;
}

function figmaLabelFor(title, url) {
  const category = cleanTitle(title);
  const name = filenameToName(url);
  return name ? `${category} — ${name}` : category;
}

function readDataFile() {
  if (!fs.existsSync(DATA_FILE)) return [];
  try {
    return JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
  } catch {
    return [];
  }
}

function writeDataFile(images) {
  fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
  fs.writeFileSync(DATA_FILE, JSON.stringify(images, null, 2), "utf8");
}

function syncPluginSnapshot(images) {
  if (!fs.existsSync(PLUGIN_CODE_FILE)) {
    throw new Error(`Plugin file not found: ${PLUGIN_CODE_FILE}`);
  }

  const snapshotImages = images.map((img) => ({
    url: img.url,
    label: img.figmaLabel || img.title || img.url,
    timestamp: img.timestamp || null,
  }));

  const snapshotLastUpdated = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
  });

  const snapshotJson = JSON.stringify(snapshotImages, null, 2);
  let pluginCode = fs.readFileSync(PLUGIN_CODE_FILE, "utf8");

  pluginCode = pluginCode.replace(
    /const SNAPSHOT_LAST_UPDATED = "[^"]*";/,
    `const SNAPSHOT_LAST_UPDATED = "${snapshotLastUpdated}";`
  );

  pluginCode = pluginCode.replace(
    /const SNAPSHOT_IMAGES = \[[\s\S]*?\];/,
    `const SNAPSHOT_IMAGES = ${snapshotJson};`
  );

  fs.writeFileSync(PLUGIN_CODE_FILE, pluginCode, "utf8");
}

// ============================================================
// SCRAPER
// ============================================================

async function collectIndexPageUrls(page, source) {
  const urls = new Set([source.url]);
  let currentUrl = source.url;

  for (let i = 0; i < MAX_INDEX_PAGES && urls.size < MAX_PAGES_PER_SOURCE * 3; i++) {
    await page.goto(currentUrl, { waitUntil: "domcontentloaded", timeout: 20000 });
    const pageTitle = await page.title();
    const bodyText = await page.evaluate(() => (document.body ? document.body.innerText : ""));
    if (isBotChallengePage(pageTitle, bodyText)) {
      throw new Error(`Blocked by bot challenge at ${currentUrl}`);
    }

    const html = await page.content();
    const $ = cheerio.load(html);

    // Collect links to individual story/multimedia pages on this index page
    $("a[href]").each((_, el) => {
      const href = normalizeUrl($(el).attr("href"), source.url);
      if (href && href.startsWith(source.url) && href !== source.url) {
        urls.add(href.split("#")[0]);
      }
    });

    // Follow a "next page" pagination link if one exists
    const nextHref = $("a.next, a[rel='next']").first().attr("href");
    const nextUrl = normalizeUrl(nextHref, source.url);
    if (!nextUrl || nextUrl === currentUrl) break;
    currentUrl = nextUrl;
    await sleep(REQUEST_DELAY);
  }

  return Array.from(urls).slice(0, MAX_PAGES_PER_SOURCE);
}

async function scrapeContentPage(page, pageUrl, source) {
  await page.goto(pageUrl, { waitUntil: "domcontentloaded", timeout: 20000 });
  const pageTitle = await page.title();
  const bodyText = await page.evaluate(() => (document.body ? document.body.innerText : ""));
  if (isBotChallengePage(pageTitle, bodyText)) {
    throw new Error(`Blocked by bot challenge at ${pageUrl}`);
  }

  const html = await page.content();
  const $ = cheerio.load(html);

  const title = cleanTitle($("h1").first().text() || $("title").text() || pageUrl);
  const found = [];

  $("img[src]").each((_, el) => {
    const src = normalizeUrl($(el).attr("src"), pageUrl);
    if (!src) return;

    const dims = parseDimensionsFromUrl(src);
    
    // If this source requires dimension parsing and we couldn't parse it, skip
    if (source.requireDimensionParse !== false && !dims) return;
    
    // If we have dimensions, check against source's minimum threshold
    if (dims && dims.width < source.minDimension && dims.height < source.minDimension) return;

    // Generate base labels from page title and URL
    const labels = generateLabels(title, pageUrl);
    // Add source-specific keywords for enhanced searchability
    if (source.keywords) {
      source.keywords.forEach((keyword) => {
        if (!labels.includes(keyword)) {
          labels.push(keyword);
        }
      });
    }

    found.push({
      url: src,
      figmaLabel: figmaLabelFor(title, src),
      title,
      pageUrl,
      width: dims?.width,
      height: dims?.height,
      timestamp: new Date().toISOString(),
      labels,
      source: source.name,
    });
  });

  return found;
}

async function runScraper() {
  if (isScraping) {
    throw new Error("Scrape is already running");
  }

  const existing = readDataFile();

  isScraping = true;
  scrapeStatus = {
    ...scrapeStatus,
    isRunning: true,
    startedAt: new Date().toISOString(),
    finishedAt: null,
    lastError: null,
    lastWarning: null,
    lastMessage: "Scrape in progress",
    startCount: existing.length,
    endCount: existing.length,
  };

  console.log("\n=== Scrape started ===");
  // --no-sandbox is required in most Linux containers (Render, Docker, etc.) —
  // Chrome's default sandboxing needs kernel privileges those containers don't grant.
  const browser = await puppeteer.launch({
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
  const existingUrls = new Set(existing.map((img) => img.url));
  const allImages = [...existing];

  try {
    const page = await browser.newPage();
    const sourceFailures = [];

    for (const source of SOURCES) {
      try {
        console.log(`\n--- Source: ${source.name} ---`);
        const contentUrls = await collectIndexPageUrls(page, source);
        console.log(`Found ${contentUrls.length} pages to visit for ${source.name}`);

        for (const url of contentUrls) {
          try {
            const images = await scrapeContentPage(page, url, source);
            for (const img of images) {
              if (!existingUrls.has(img.url)) {
                existingUrls.add(img.url);
                allImages.push(img);
              }
            }
            console.log(`  ${url} -> ${images.length} images`);
          } catch (err) {
            console.error(`  Failed on ${url}: ${err.message}`);
          }
          await sleep(REQUEST_DELAY);
        }
      } catch (err) {
        sourceFailures.push(`${source.name}: ${err.message}`);
        console.error(`Source ${source.name} blocked/failed: ${err.message}`);
      }
    }

    writeDataFile(allImages);

    if (sourceFailures.length === SOURCES.length) {
      throw new Error(`All sources failed: ${sourceFailures.join(" | ")}`);
    }

    const warningMessage = sourceFailures.length
      ? `Some sources failed: ${sourceFailures.join(" | ")}`
      : null;

    scrapeStatus = {
      ...scrapeStatus,
      isRunning: false,
      finishedAt: new Date().toISOString(),
      lastError: null,
      lastWarning: warningMessage,
      lastMessage: warningMessage ? "Scrape complete with warnings" : "Scrape complete",
      endCount: allImages.length,
    };
    console.log(`\n=== Scrape complete. ${allImages.length} images saved. ===\n`);
    return allImages;
  } catch (err) {
    scrapeStatus = {
      ...scrapeStatus,
      isRunning: false,
      finishedAt: new Date().toISOString(),
      lastError: err.message,
      lastWarning: null,
      lastMessage: "Scrape failed",
    };
    console.error("Scraper error:", err.message);
    throw err;
  } finally {
    isScraping = false;
    if (browser) await browser.close();
  }
}

// ============================================================
// GITHUB PUBLISH
// ============================================================
// Commits the current data/images.json to the GitHub repo, so the Figma
// plugin (which fetches from GitHub, not this server) picks up the change.
// This is the network-based replacement for the old local-file sync.

async function publishToGitHub(images) {
  if (!GITHUB_TOKEN) {
    throw new Error(
      "GITHUB_TOKEN is not set. Add it to .env to enable publishing (see .env.example)."
    );
  }

  const apiUrl = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${GITHUB_DATA_PATH}`;
  const headers = {
    Authorization: `Bearer ${GITHUB_TOKEN}`,
    Accept: "application/vnd.github+json",
  };

  // Need the current file's SHA to update it (GitHub Contents API requirement)
  let sha;
  try {
    const current = await axios.get(`${apiUrl}?ref=${GITHUB_BRANCH}`, { headers });
    sha = current.data.sha;
  } catch (err) {
    if (err.response && err.response.status !== 404) throw err;
    // 404 is fine — means the file doesn't exist yet
  }

  const content = Buffer.from(JSON.stringify(images, null, 2), "utf8").toString("base64");

  const res = await axios.put(
    apiUrl,
    {
      message: `Publish ${images.length} photos — ${new Date().toISOString()}`,
      content,
      branch: GITHUB_BRANCH,
      ...(sha ? { sha } : {}),
    },
    { headers }
  );

  return res.data.commit;
}

// ============================================================
// API ROUTES
// ============================================================

app.get("/api/images", (req, res) => {
  res.json(readDataFile());
});

app.get("/api/scrape-status", (req, res) => {
  res.json(scrapeStatus);
});

app.post("/api/scrape", (req, res) => {
  if (isScraping) {
    return res.status(409).json({ message: "Scrape already in progress. Please wait." });
  }

  res.json({
    message: "Scraping started. Watch your terminal for progress.",
    startedAt: scrapeStatus.startedAt,
  });
  runScraper().catch(() => {});
});

app.post("/api/download", async (req, res) => {
  const { urls } = req.body;
  if (!urls || urls.length === 0) {
    return res.status(400).json({ error: "No URLs provided" });
  }

  console.log(`Building ZIP for ${urls.length} images...`);
  res.setHeader("Content-Type", "application/zip");
  res.setHeader("Content-Disposition", "attachment; filename=starbucks-images.zip");

  const archive = archiver("zip", { zlib: { level: 6 } });
  archive.pipe(res);

  for (const url of urls) {
    try {
      const response = await axios.get(url, { responseType: "stream", timeout: 15000 });
      archive.append(response.data, { name: url.split("/").pop().split("?")[0] });
    } catch (err) {
      console.error(`Failed to fetch ${url}: ${err.message}`);
    }
  }

  await archive.finalize();
  console.log("ZIP ready.");
});

// POST /api/publish — local-first review step: sync selected (or all)
// images into this repo's local data/images.json and plugin/code.js snapshot.
// This keeps the Figma plugin current on the same machine without requiring
// a GitHub API publish.
//
// Accepts either:
//   { urls: [...] }   — publish the subset of LOCAL data/images.json matching
//                        these URLs. Used by the Scraper tab, where the
//                        images genuinely originate from this server's local
//                        scrape data.
//   { images: [...] } — publish these exact image objects verbatim, with NO
//                        filtering against local data. Used by the Library
//                        tab's "remove and republish" flow: the client
//                        already has the true current published list (fetched
//                        fresh from GitHub) and just wants to write back a
//                        subset of it. Filtering that against local data was
//                        the bug — if local data/images.json ever diverges
//                        from what's actually published (e.g. after a
//                        redeploy resets the local file), the old code would
//                        silently drop any "remaining" photo that local
//                        didn't happen to have, removing photos nobody asked
//                        to remove.
app.post("/api/publish", async (req, res) => {
  const { urls, images } = req.body;

  let toPublish;
  if (images && images.length) {
    toPublish = images;
  } else {
    const all = readDataFile();
    toPublish = urls && urls.length ? all.filter((img) => urls.includes(img.url)) : all;
  }

  if (!toPublish || toPublish.length === 0) {
    return res.status(400).json({ error: "Nothing to publish" });
  }

  try {
    writeDataFile(toPublish);
    syncPluginSnapshot(toPublish);

    res.json({
      success: true,
      published: toPublish.length,
      mode: "local",
      message: "Local library and plugin snapshot updated.",
    });
  } catch (err) {
    console.error("Local publish error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// POST /api/cron/scrape-and-publish — the scheduled-scrape entry point.
// Runs a full scrape and, if it turns up anything, publishes the resulting
// database to GitHub automatically (no manual review step — this is meant
// for unattended/scheduled runs, not the normal human workflow in the UI).
//
// This replaces the old in-process node-cron timer, which only fired if
// the app happened to be running at the scheduled moment. On a host that
// spins down when idle (like Render's free tier), that's not reliable —
// so instead, something external (a Render Cron Job, or the
// .github/workflows/monthly-scrape.yml in this repo) calls this endpoint
// on a schedule, which also wakes the service up if it was asleep.
app.post("/api/cron/scrape-and-publish", async (req, res) => {
  if (!CRON_SECRET || req.get("X-Cron-Secret") !== CRON_SECRET) {
    return res.status(401).json({ error: "Missing or invalid X-Cron-Secret" });
  }

  res.json({ message: "Scheduled scrape started." });

  try {
    const images = await runScraper();
    if (images && images.length && GITHUB_TOKEN) {
      const commit = await publishToGitHub(images);
      console.log(`Scheduled scrape published ${images.length} images: ${commit.html_url}`);
    } else if (!GITHUB_TOKEN) {
      console.log("Scheduled scrape finished but GITHUB_TOKEN is not set — skipped publish.");
    }
  } catch (err) {
    console.error("Scheduled scrape+publish error:", err.message);
  }
});

// ============================================================
// START
// ============================================================

app.listen(PORT, () => {
  console.log(`\nStarbucks Photo Library → http://localhost:${PORT}`);
  console.log(`Data: ${DATA_FILE}\n`);
  if (!GITHUB_TOKEN) {
    console.log("Note: GITHUB_TOKEN not set — local sync works; GitHub API publish endpoints are disabled.\n");
  }
  if (!CRON_SECRET) {
    console.log("Note: CRON_SECRET not set — /api/cron/scrape-and-publish is disabled.\n");
  }
});
