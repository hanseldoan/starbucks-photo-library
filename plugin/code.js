// ============================================================
// Starbucks Stock Images — plugin main thread
// ============================================================
// Unlike the original plugin, the photo list is NOT hardcoded here.
// It's fetched at load time from the starbucks-photo-library GitHub repo's
// data/images.json (published there by the scraper web app after each
// reviewed scrape). This is what lets the scraper run anywhere — on any
// collaborator's machine, or hosted — instead of needing local filesystem
// access to this file.
//
// If GitHub is unreachable when the plugin opens, it falls back to the
// bundled SNAPSHOT below so the plugin still works, just possibly stale.
// ============================================================

const DATA_URL =
  "https://raw.githubusercontent.com/hanseldoan/starbucks-photo-library/main/data/images.json";

// Fallback snapshot, used only if the live fetch fails (offline, GitHub
// down, rate-limited, etc). Regenerate this by running the "publish"
// scraper task; it's a convenience, not the source of truth.
const SNAPSHOT_LAST_UPDATED = "August 2026";
const SNAPSHOT_IMAGES = [];

async function loadImages() {
  try {
    const res = await fetch(DATA_URL);
    if (!res.ok) throw new Error(`GitHub fetch failed: ${res.status}`);
    const records = await res.json();

    // data/images.json records use {url, figmaLabel, timestamp, ...}; the
    // plugin UI needs {url, label, timestamp} — timestamp drives the
    // Newest/Oldest sort toggle in the toolbar.
    const images = records.map((r) => ({
      url: r.url,
      label: r.figmaLabel || r.title || r.url,
      timestamp: r.timestamp || null,
    }));

    const lastUpdated = records.length
      ? new Date(
          records.reduce((latest, r) => (r.timestamp > latest ? r.timestamp : latest), records[0].timestamp)
        ).toLocaleDateString("en-US", { year: "numeric", month: "long" })
      : SNAPSHOT_LAST_UPDATED;

    return { images, lastUpdated, source: "live" };
  } catch (e) {
    console.error("Falling back to bundled snapshot:", e.message);
    return { images: SNAPSHOT_IMAGES, lastUpdated: SNAPSHOT_LAST_UPDATED, source: "snapshot" };
  }
}

(async () => {
  const { images, lastUpdated, source } = await loadImages();

  figma.showUI(__html__, { width: 400, height: 600, title: "Starbucks Photos", themeColors: true });
  figma.ui.postMessage({ type: "init", images, lastUpdated, source });

  figma.ui.onmessage = async (msg) => {
    if (msg.type === "insert-image") {
      const { bytes, width, height } = msg;

      try {
        if (!bytes || bytes.length === 0) throw new Error("No image data received");

        const imageHash = figma.createImage(new Uint8Array(bytes)).hash;
        const fill = { type: "IMAGE", scaleMode: "FILL", imageHash };
        const selection = figma.currentPage.selection;

        if (selection.length > 0) {
          for (const node of selection) {
            if ("fills" in node) node.fills = [fill];
          }
          figma.notify("Photo applied to selection ✓");
        } else {
          const rect = figma.createRectangle();
          const maxW = 2048;
          const scale = width > maxW ? maxW / width : 1;
          rect.resize(Math.round(width * scale), Math.round(height * scale));
          rect.x = figma.viewport.center.x - rect.width / 2;
          rect.y = figma.viewport.center.y - rect.height / 2;
          rect.fills = [fill];
          figma.currentPage.appendChild(rect);
          figma.currentPage.selection = [rect];
          figma.viewport.scrollAndZoomIntoView([rect]);
          figma.notify("Photo placed on canvas ✓");
        }

        figma.ui.postMessage({ type: "insert-done" });
      } catch (e) {
        console.error("Insert error:", e.message);
        figma.ui.postMessage({ type: "insert-error", message: e.message });
      }
    }

    if (msg.type === "close") figma.closePlugin();
  };
})();
