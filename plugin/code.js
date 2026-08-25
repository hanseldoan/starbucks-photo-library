// ============================================================
// Starbucks Photos — plugin main thread
// ============================================================
// Local-first plugin data flow:
// the scraper web app updates the bundled SNAPSHOT below during
// "Sync Selected to Plugin", so this plugin can run from local files
// without relying on a live GitHub fetch.
//
// Optional remote mode still exists as a fallback if you set
// USE_REMOTE_LIBRARY = true.
// ============================================================

const DATA_URL =
  "https://raw.githubusercontent.com/hanseldoan/starbucks-photo-library/main/data/images.json";
const USE_REMOTE_LIBRARY = false;

// Bundled local snapshot updated by the scraper app's /api/publish route.
const SNAPSHOT_LAST_UPDATED = "August 2026";
const SNAPSHOT_IMAGES = [
  {
    "url": "https://about.starbucks.com/uploads/2025/09/Starbucks-Coffeehouse-NYC-Union-Square-East-6-2048x1365.jpg",
    "label": "Coffee Our coffee story — Starbucks Coffeehouse Nyc Union Square East 6",
    "timestamp": "2026-08-12T14:38:10.788Z"
  },
  {
    "url": "https://about.starbucks.com/uploads/2026/02/StarbucksReserve_Artful-Eats_2-2048x1186.jpg",
    "label": "Coffee Our coffee story — Starbucksreserve Artful Eats 2",
    "timestamp": "2026-08-12T14:38:10.789Z"
  },
  {
    "url": "https://about.starbucks.com/uploads/2025/12/01-partners-004-1365x2048.jpg",
    "label": "Coffee Our coffee story — 01 Partners 004",
    "timestamp": "2026-08-12T14:38:10.789Z"
  },
  {
    "url": "https://about.starbucks.com/uploads/2025/12/Reserve-Roastery-Winter-Siphon-2048x1621.jpg",
    "label": "Coffee Our coffee story — Reserve Roastery Winter Siphon",
    "timestamp": "2026-08-12T14:38:10.789Z"
  },
  {
    "url": "https://about.starbucks.com/uploads/2026/03/Starbucks-Reserve-Roastery-Chicago-9-1365x2048.jpg",
    "label": "Coffee Our coffee story — Starbucks Reserve Roastery Chicago 9",
    "timestamp": "2026-08-12T14:38:10.789Z"
  },
  {
    "url": "https://about.starbucks.com/uploads/2026/03/Starbucks-Reserve-Roastery-Chicago-6-1536x1024.jpg",
    "label": "Coffee Our coffee story — Starbucks Reserve Roastery Chicago 6",
    "timestamp": "2026-08-12T14:38:10.789Z"
  },
  {
    "url": "https://about.starbucks.com/uploads/2025/12/Reserve-Roastery-Winter-Pour-Over-1280x2265.jpeg",
    "label": "Coffee Our coffee story — Reserve Roastery Winter Pour Over",
    "timestamp": "2026-08-12T14:38:10.789Z"
  },
  {
    "url": "https://about.starbucks.com/uploads/2024/08/Siren-Retail-Fall-Coffee-2048x1884.jpg",
    "label": "Coffee Our coffee story — Siren Retail Fall Coffee",
    "timestamp": "2026-08-12T14:38:10.789Z"
  },
  {
    "url": "https://about.starbucks.com/uploads/2025/09/Carlos-Mario-2048x1365.jpg",
    "label": "Coffee Our coffee story — Carlos Mario",
    "timestamp": "2026-08-12T14:38:10.789Z"
  },
  {
    "url": "https://about.starbucks.com/uploads/2025/05/SBX20250508-Impact-Report-Collage-Trees-1536x1024.jpg",
    "label": "Coffee Our coffee story — Impact Report Collage Trees",
    "timestamp": "2026-08-12T14:38:10.789Z"
  },
  {
    "url": "https://about.starbucks.com/uploads/2026/01/Starbucks-Coffee-Run-with-Team-USA-13-2048x1366.jpg",
    "label": "Coffee Our coffee story — Starbucks Coffee Run With Team Usa 13",
    "timestamp": "2026-08-12T14:38:10.789Z"
  },
  {
    "url": "https://about.starbucks.com/uploads/2023/03/SBX20230323-AMOS-Top-Takeaways-FeatureHorizontal3-1024x498.jpg",
    "label": "Coffee Our coffee story — Amos Top Takeaways Featurehorizontal3",
    "timestamp": "2026-08-12T14:38:10.789Z"
  },
  {
    "url": "https://about.starbucks.com/uploads/2021/03/SBX2021319-Starbucks-Coffee-Farm-2-2048x1365.jpg",
    "label": "Coffee Our coffee story — Starbucks Coffee Farm 2",
    "timestamp": "2026-08-12T14:38:10.790Z"
  },
  {
    "url": "https://about.starbucks.com/uploads/2025/08/Starbucks-Fall25-Casi-Cielo-Coffee-2048x1365.jpg",
    "label": "Coffee Our coffee story — Starbucks Fall25 Casi Cielo Coffee",
    "timestamp": "2026-08-12T14:38:10.790Z"
  },
  {
    "url": "https://about.starbucks.com/uploads/2025/01/Starbucks-Ethiopia-Single-Origin-Coffee-1-2048x1368.jpg",
    "label": "Coffee Our coffee story — Starbucks Ethiopia Single Origin Coffee 1",
    "timestamp": "2026-08-12T14:38:10.790Z"
  },
  {
    "url": "https://about.starbucks.com/uploads/2025/05/Starbucks-Coffee-Beans-2048x1262.jpg",
    "label": "Coffee Our coffee story — Starbucks Coffee Beans",
    "timestamp": "2026-08-12T14:38:10.790Z"
  },
  {
    "url": "https://about.starbucks.com/uploads/2025/06/20190320-amos-1-5-2-1024x684.jpg",
    "label": "Coffee Our coffee story — Amos 1 5 2",
    "timestamp": "2026-08-12T14:38:10.790Z"
  },
  {
    "url": "https://about.starbucks.com/uploads/2020/08/Starbucks-Virtual-Backgrounds-2-Cold-Brew-1920x1280-1-768x512.jpg",
    "label": "Coffee Our coffee story — Starbucks Virtual Backgrounds 2 Cold Brew 1920x1280 1 (3)",
    "timestamp": "2026-08-12T14:38:10.790Z"
  },
  {
    "url": "https://about.starbucks.com/uploads/2024/09/20240514_PA080_Duetto-Coffee-Tasting_FY24_Q2_059-1024x682.jpg",
    "label": "Coffee Our coffee story — Pa080 Duetto Coffee Tasting Fy24 Q2 059",
    "timestamp": "2026-08-12T14:38:10.790Z"
  },
  {
    "url": "https://about.starbucks.com/uploads/2026/06/20251105_Uplifts_LA_094-format-jpg-72dpi-2048x1365.jpeg",
    "label": "Coffeehouse Experience Meet Me At Starbucks — Uplifts La 094 Format Jpg 72dpi",
    "timestamp": "2026-08-12T14:38:16.122Z"
  },
  {
    "url": "https://about.starbucks.com/uploads/2026/07/Starbucks-Palm-Springs-Customer-story-4-2048x1365.jpg",
    "label": "Coffeehouse Experience Meet Me At Starbucks — Starbucks Palm Springs Customer Story 4",
    "timestamp": "2026-08-12T14:38:16.122Z"
  },
  {
    "url": "https://about.starbucks.com/uploads/2026/07/Starbucks-Customer-Nashville-Matthew-1-1365x2048.jpg",
    "label": "Coffeehouse Experience Meet Me At Starbucks — Starbucks Customer Nashville Matthew 1",
    "timestamp": "2026-08-12T14:38:16.122Z"
  },
  {
    "url": "https://about.starbucks.com/uploads/2026/07/Starbucks-Palm-Springs-Customer-story-1-2048x1365.jpg",
    "label": "Coffeehouse Experience Meet Me At Starbucks — Starbucks Palm Springs Customer Story 1",
    "timestamp": "2026-08-12T14:38:16.123Z"
  },
  {
    "url": "https://about.starbucks.com/uploads/2026/07/Starbucks-Palm-Springs-Customer-story-5-1536x2048.jpg",
    "label": "Coffeehouse Experience Meet Me At Starbucks — Starbucks Palm Springs Customer Story 5",
    "timestamp": "2026-08-12T14:38:16.123Z"
  },
  {
    "url": "https://about.starbucks.com/uploads/2026/07/Starbucks-Palm-Springs-Customer-story-3-2048x1365.jpg",
    "label": "Coffeehouse Experience Meet Me At Starbucks — Starbucks Palm Springs Customer Story 3",
    "timestamp": "2026-08-12T14:38:16.123Z"
  },
  {
    "url": "https://about.starbucks.com/uploads/2026/07/Morocco-Villa-Casablanca-2048x1138.jpg",
    "label": "Coffeehouse Experience Meet Me At Starbucks — Morocco Villa Casablanca",
    "timestamp": "2026-08-12T14:38:16.123Z"
  },
  {
    "url": "https://about.starbucks.com/uploads/2026/07/Norway-Bergen-768x1024.jpg",
    "label": "Coffeehouse Experience Meet Me At Starbucks — Norway Bergen",
    "timestamp": "2026-08-12T14:38:16.123Z"
  },
  {
    "url": "https://about.starbucks.com/uploads/2026/07/Agentina-Buenos-Aires-Unicenter-1536x1026.jpg",
    "label": "Coffeehouse Experience Meet Me At Starbucks — Agentina Buenos Aires Unicenter",
    "timestamp": "2026-08-12T14:38:16.123Z"
  },
  {
    "url": "https://about.starbucks.com/uploads/2026/07/Belgium-Brussels-1280x822.jpg",
    "label": "Coffeehouse Experience Meet Me At Starbucks — Belgium Brussels",
    "timestamp": "2026-08-12T14:38:16.123Z"
  },
  {
    "url": "https://about.starbucks.com/uploads/2026/05/Starbucks-Afternoon-Renton-Coffeehouse-11-1365x2048.jpg",
    "label": "Coffeehouse Experience Meet Me At Starbucks — Starbucks Afternoon Renton Coffeehouse 11",
    "timestamp": "2026-08-12T14:38:16.123Z"
  },
  {
    "url": "https://about.starbucks.com/uploads/2026/05/Starbucks-Afternoon-Renton-Coffeehouse-3-1536x1024.jpg",
    "label": "Coffeehouse Experience Meet Me At Starbucks — Starbucks Afternoon Renton Coffeehouse 3",
    "timestamp": "2026-08-12T14:38:16.123Z"
  },
  {
    "url": "https://about.starbucks.com/uploads/2026/05/Starbucks-Afternoon-Renton-Coffeehouse-1365x2048.jpg",
    "label": "Coffeehouse Experience Meet Me At Starbucks — Starbucks Afternoon Renton Coffeehouse",
    "timestamp": "2026-08-12T14:38:16.123Z"
  },
  {
    "url": "https://about.starbucks.com/uploads/2026/05/Starbucks-Afternoon-Renton-Coffeehouse-2-1536x1024.jpg",
    "label": "Coffeehouse Experience Meet Me At Starbucks — Starbucks Afternoon Renton Coffeehouse 2",
    "timestamp": "2026-08-12T14:38:16.123Z"
  },
  {
    "url": "https://about.starbucks.com/uploads/2026/04/Starbucks-Cicero-and-Berteau-after-1-2048x1365.jpg",
    "label": "Coffeehouse Experience Meet Me At Starbucks — Starbucks Cicero And Berteau After 1",
    "timestamp": "2026-08-12T14:38:16.123Z"
  },
  {
    "url": "https://about.starbucks.com/uploads/2026/04/Starbucks-Coffeehouse-Chicago-3-1365x2048.jpg",
    "label": "Coffeehouse Experience Meet Me At Starbucks — Starbucks Coffeehouse Chicago 3",
    "timestamp": "2026-08-12T14:38:16.123Z"
  },
  {
    "url": "https://about.starbucks.com/uploads/2026/04/Starbucks-Deerfield-after-1-2048x1365.jpg",
    "label": "Coffeehouse Experience Meet Me At Starbucks — Starbucks Deerfield After 1",
    "timestamp": "2026-08-12T14:38:16.123Z"
  },
  {
    "url": "https://about.starbucks.com/uploads/2026/04/Starbucks-Gold-Coast-after-2048x1276.jpg",
    "label": "Coffeehouse Experience Meet Me At Starbucks — Starbucks Gold Coast After",
    "timestamp": "2026-08-12T14:38:16.123Z"
  },
  {
    "url": "https://about.starbucks.com/uploads/2026/03/Starbucks-Reserve-Roastery-Chicago-20-1536x1024.jpg",
    "label": "Coffeehouse Experience Meet Me At Starbucks — Starbucks Reserve Roastery Chicago 20",
    "timestamp": "2026-08-12T14:38:16.123Z"
  },
  {
    "url": "https://about.starbucks.com/uploads/2026/01/2648-26b-20260109_SB_REWARDS_BBRAVO_SIDEWALK4_0825-Web-768x1151.jpg",
    "label": "Coffeehouse Experience Meet Me At Starbucks — 26b 20260109 Sb Rewards Bbravo Sidewalk4 0825 Web",
    "timestamp": "2026-08-12T14:38:16.123Z"
  },
  {
    "url": "https://about.starbucks.com/uploads/2026/01/2648-01c-20260107_SB_REWARDS_BBRAVO_PARK3_0177-Web-1536x1025.jpg",
    "label": "Coffeehouse Experience Meet Me At Starbucks — 01c 20260107 Sb Rewards Bbravo Park3 0177 Web",
    "timestamp": "2026-08-12T14:38:16.123Z"
  },
  {
    "url": "https://about.starbucks.com/uploads/2026/01/2648-42b-20260111_SB_REWARDS_BBRAVO_INSTORE3_2840-Web-1536x1025.jpg",
    "label": "Coffeehouse Experience Meet Me At Starbucks — 42b 20260111 Sb Rewards Bbravo Instore3 2840 Web",
    "timestamp": "2026-08-12T14:38:16.123Z"
  },
  {
    "url": "https://about.starbucks.com/uploads/2026/01/Starbucks-Rewards-2026-3-1536x1025.jpg",
    "label": "Coffeehouse Experience Meet Me At Starbucks — Starbucks Rewards 2026 3",
    "timestamp": "2026-08-12T14:38:16.123Z"
  },
  {
    "url": "https://about.starbucks.com/uploads/2025/12/01-partners-009-2048x1371.jpg",
    "label": "Coffeehouse Experience Meet Me At Starbucks — 01 Partners 009",
    "timestamp": "2026-08-12T14:38:16.123Z"
  },
  {
    "url": "https://about.starbucks.com/uploads/2025/12/12-Uplifted-coffeehouses-004-2048x1365.jpg",
    "label": "Coffeehouse Experience Meet Me At Starbucks — 12 Uplifted Coffeehouses 004",
    "timestamp": "2026-08-12T14:38:16.123Z"
  },
  {
    "url": "https://about.starbucks.com/uploads/2025/12/01-partners-007-2048x1365.jpg",
    "label": "Coffeehouse Experience Meet Me At Starbucks — 01 Partners 007",
    "timestamp": "2026-08-12T14:38:16.123Z"
  },
  {
    "url": "https://about.starbucks.com/uploads/2025/12/07-coffee-at-the-center-002-1365x2048.jpg",
    "label": "Coffeehouse Experience Meet Me At Starbucks — 07 Coffee At The Center 002",
    "timestamp": "2026-08-12T14:38:16.123Z"
  },
  {
    "url": "https://about.starbucks.com/uploads/2026/02/Starbucks-ceramic-mug-1536x1024.jpg",
    "label": "Coffeehouse Experience Meet Me At Starbucks — Starbucks Ceramic Mug",
    "timestamp": "2026-08-12T14:38:16.123Z"
  },
  {
    "url": "https://about.starbucks.com/uploads/2026/02/Starbucks-Green-Chair-1536x1024.jpg",
    "label": "Coffeehouse Experience Meet Me At Starbucks — Starbucks Green Chair",
    "timestamp": "2026-08-12T14:38:16.123Z"
  },
  {
    "url": "https://about.starbucks.com/uploads/2026/02/Starbucks-Spring-Menu-IcedLavenderCreamChai_IcedLavenderCreamMatcha_IcedUbeCoconutMacchiato1-2048x1365.jpg",
    "label": "Coffeehouse Experience Meet Me At Starbucks — Starbucks Spring Menu Icedlavendercreamchai Icedlavendercreammatcha Icedubecoconutmacchiato1",
    "timestamp": "2026-08-12T14:38:16.123Z"
  },
  {
    "url": "https://about.starbucks.com/uploads/2025/06/Starbucks-Reserve-Hiraya-Philippines-4-2048x1151.jpg",
    "label": "Coffeehouse Experience Meet Me At Starbucks — Starbucks Reserve Hiraya Philippines 4",
    "timestamp": "2026-08-12T14:38:16.123Z"
  },
  {
    "url": "https://about.starbucks.com/uploads/2025/06/SBX20241028_FY25SPR_ColdBrew_sRGB-2048x1536.jpg",
    "label": "Coffeehouse Experience Meet Me At Starbucks — Fy25spr Coldbrew Srgb",
    "timestamp": "2026-08-12T14:38:16.123Z"
  },
  {
    "url": "https://about.starbucks.com/uploads/2025/02/20230309_PA041_EarthWeekGreenerStoresLA_064-1536x1026.jpg",
    "label": "Coffeehouse Experience Meet Me At Starbucks — Pa041 Earthweekgreenerstoresla 064",
    "timestamp": "2026-08-12T14:38:16.123Z"
  },
  {
    "url": "https://about.starbucks.com/uploads/2025/08/EastHampton_03-2048x1368.jpg",
    "label": "Coffeehouse Experience Meet Me At Starbucks — Easthampton 03",
    "timestamp": "2026-08-12T14:38:16.123Z"
  },
  {
    "url": "https://about.starbucks.com/uploads/2025/08/Miami-Worldcenter_SDRC_02-2048x1365.jpg",
    "label": "Coffeehouse Experience Meet Me At Starbucks — Miami Worldcenter Sdrc 02",
    "timestamp": "2026-08-12T14:38:16.123Z"
  },
  {
    "url": "https://about.starbucks.com/uploads/2025/08/EastHampton_04-1365x2048.jpg",
    "label": "Coffeehouse Experience Meet Me At Starbucks — Easthampton 04",
    "timestamp": "2026-08-12T14:38:16.123Z"
  },
  {
    "url": "https://about.starbucks.com/uploads/2025/08/SouthHampton_03-2048x1368.jpg",
    "label": "Coffeehouse Experience Meet Me At Starbucks — Southhampton 03",
    "timestamp": "2026-08-12T14:38:16.123Z"
  },
  {
    "url": "https://about.starbucks.com/uploads/2025/01/OBC-and-Starbucks-podcast-2-1-1861x2048.jpg",
    "label": "Coffeehouse Experience Meet Me At Starbucks — Obc And Starbucks Podcast 2 1",
    "timestamp": "2026-08-12T14:38:16.123Z"
  },
  {
    "url": "https://about.starbucks.com/uploads/2025/04/Oprah-and-Tina-Knowles-for-Oprah-Book-Club-at-Starbucks-2048x1366.jpg",
    "label": "Coffeehouse Experience Meet Me At Starbucks — Oprah And Tina Knowles For Oprah Book Club At Starbucks",
    "timestamp": "2026-08-12T14:38:16.123Z"
  },
  {
    "url": "https://about.starbucks.com/uploads/2025/01/OBC-and-Starbucks-podcast-1-1365x2048.jpg",
    "label": "Coffeehouse Experience Meet Me At Starbucks — Obc And Starbucks Podcast 1",
    "timestamp": "2026-08-12T14:38:16.123Z"
  },
  {
    "url": "https://about.starbucks.com/uploads/2025/04/Oprah-Book-Club-at-Starbucks-3-2048x1366.jpg",
    "label": "Coffeehouse Experience Meet Me At Starbucks — Oprah Book Club At Starbucks 3",
    "timestamp": "2026-08-12T14:38:16.123Z"
  },
  {
    "url": "https://about.starbucks.com/uploads/2024/02/SBX20240215-InclusiveStores-FeatureHorizontal-1024x498.jpg",
    "label": "Coffeehouse Experience Meet Me At Starbucks — Inclusivestores Featurehorizontal",
    "timestamp": "2026-08-12T14:38:16.123Z"
  },
  {
    "url": "https://about.starbucks.com/uploads/2026/06/Starbucks-Pike-Place-Store-2-1536x1024.jpg",
    "label": "Coffeehouse Experience Meet Me At Starbucks — Starbucks Pike Place Store 2",
    "timestamp": "2026-08-12T14:38:16.123Z"
  },
  {
    "url": "https://about.starbucks.com/uploads/2026/06/Summer-Pink-Drink-Bearista-3-1365x2048.jpg",
    "label": "cups & merch Your new favorite mug, and more — Summer Pink Drink Bearista 3",
    "timestamp": "2026-08-12T14:38:18.714Z"
  },
  {
    "url": "https://about.starbucks.com/uploads/2026/07/SBXSUM26-PinkDrink-1528-1-2048x1365.jpg",
    "label": "cups & merch Your new favorite mug, and more — Sbxsum26 Pinkdrink 1528 1",
    "timestamp": "2026-08-12T14:38:18.714Z"
  },
  {
    "url": "https://about.starbucks.com/uploads/2026/07/SBXSUM26-PinkDrink-1546-1-1365x2048.jpg",
    "label": "cups & merch Your new favorite mug, and more — Sbxsum26 Pinkdrink 1546 1",
    "timestamp": "2026-08-12T14:38:18.714Z"
  },
  {
    "url": "https://about.starbucks.com/uploads/2026/06/Summer-Pink-Drink-Bearista-1365x2048.jpg",
    "label": "cups & merch Your new favorite mug, and more — Summer Pink Drink Bearista",
    "timestamp": "2026-08-12T14:38:18.714Z"
  },
  {
    "url": "https://about.starbucks.com/uploads/2026/07/SBXSUM26-PinkDrink-1450-1-1365x2048.jpg",
    "label": "cups & merch Your new favorite mug, and more — Sbxsum26 Pinkdrink 1450 1",
    "timestamp": "2026-08-12T14:38:18.714Z"
  },
  {
    "url": "https://about.starbucks.com/uploads/2026/07/SBXSUM26-PinkDrink-1571-1-2048x1365.jpg",
    "label": "cups & merch Your new favorite mug, and more — Sbxsum26 Pinkdrink 1571 1",
    "timestamp": "2026-08-12T14:38:18.715Z"
  },
  {
    "url": "https://about.starbucks.com/uploads/2026/05/MiffyCollection-29-2048x1365.jpg",
    "label": "cups & merch Your new favorite mug, and more — Miffycollection 29",
    "timestamp": "2026-08-12T14:38:18.715Z"
  },
  {
    "url": "https://about.starbucks.com/uploads/2026/02/Starbucks-Spring-Merch-2026-Cherry-Blossom-Collection-1-1536x864.jpg",
    "label": "cups & merch Your new favorite mug, and more — Starbucks Spring Merch 2026 Cherry Blossom Collection 1",
    "timestamp": "2026-08-12T14:38:18.715Z"
  },
  {
    "url": "https://about.starbucks.com/uploads/2026/02/Starbucks-Spring-Merch-2026-Cherry-Blossom-Collection-3-1024x1820.jpg",
    "label": "cups & merch Your new favorite mug, and more — Starbucks Spring Merch 2026 Cherry Blossom Collection 3",
    "timestamp": "2026-08-12T14:38:18.715Z"
  },
  {
    "url": "https://about.starbucks.com/uploads/2026/07/Orange-cream-1280x990.jpeg",
    "label": "cups & merch Your new favorite mug, and more — Orange Cream",
    "timestamp": "2026-08-12T14:38:18.715Z"
  },
  {
    "url": "https://about.starbucks.com/uploads/2026/06/Starbucks-Summer-Pink-Collection-5-2048x1365.jpg",
    "label": "cups & merch Your new favorite mug, and more — Starbucks Summer Pink Collection 5",
    "timestamp": "2026-08-12T14:38:18.715Z"
  },
  {
    "url": "https://about.starbucks.com/uploads/2026/05/Kahlana-Barfield-Brown-X-Starbucks-2048x1148.jpg",
    "label": "cups & merch Your new favorite mug, and more — Kahlana Barfield Brown X Starbucks",
    "timestamp": "2026-08-12T14:38:18.715Z"
  },
  {
    "url": "https://about.starbucks.com/uploads/2026/07/SBX-SUM2-26_35_BlendedPinkEnergyDrink-MangoDreamEnergy-MangoDragonfruitLemonade_sRGB-1280x1280-1.jpeg",
    "label": "Drinks & Food One cup at a time — Sbx Sum2 26 35 Blendedpinkenergydrink Mangodreamenergy Mangodragonfruitlemonade Srgb",
    "timestamp": "2026-08-12T14:38:21.201Z"
  },
  {
    "url": "https://about.starbucks.com/uploads/2026/07/SBX-SUM2-26_35_BlendedPinkEnergyDrink-MangoDreamEnergy-MangoDragonfruitLemonade_sRGB-1280x1280-1-762x1024.jpeg",
    "label": "Drinks & Food One cup at a time — Sbx Sum2 26 35 Blendedpinkenergydrink Mangodreamenergy Mangodragonfruitlemonade Srgb 1280x1280 1 (2)",
    "timestamp": "2026-08-12T14:38:21.201Z"
  },
  {
    "url": "https://about.starbucks.com/uploads/2026/07/SBX-SUM2-26_35_BlendedPinkEnergyDrink-MangoDreamEnergy-MangoDragonfruitLemonade_sRGB-1280x1280-1-768x1032.jpeg",
    "label": "Drinks & Food One cup at a time — Sbx Sum2 26 35 Blendedpinkenergydrink Mangodreamenergy Mangodragonfruitlemonade Srgb 1280x1280 1 (3)",
    "timestamp": "2026-08-12T14:38:21.201Z"
  },
  {
    "url": "https://about.starbucks.com/uploads/2026/07/SBX-SUM2-26_35_BlendedPinkEnergyDrink-MangoDreamEnergy-MangoDragonfruitLemonade_sRGB-1280x1280-1-480x645.jpeg",
    "label": "Drinks & Food One cup at a time — Sbx Sum2 26 35 Blendedpinkenergydrink Mangodreamenergy Mangodragonfruitlemonade Srgb 1280x1280 1 (4)",
    "timestamp": "2026-08-12T14:38:21.201Z"
  },
  {
    "url": "https://about.starbucks.com/uploads/2026/07/SBX-SUM2-26_35_BlendedPinkEnergyDrink-MangoDreamEnergy-MangoDragonfruitLemonade_sRGB-1280x1280-1-320x430.jpeg",
    "label": "Drinks & Food One cup at a time — Sbx Sum2 26 35 Blendedpinkenergydrink Mangodreamenergy Mangodragonfruitlemonade Srgb 1280x1280 1 (6)",
    "timestamp": "2026-08-12T14:38:21.201Z"
  },
  {
    "url": "https://about.starbucks.com/uploads/2026/06/Starbucks-Smores-Frappuccino-and-Cold-Brew-Smores-1536x1025.jpg",
    "label": "Drinks & Food One cup at a time — Starbucks Smores Frappuccino And Cold Brew Smores",
    "timestamp": "2026-08-12T14:38:21.201Z"
  },
  {
    "url": "https://about.starbucks.com/uploads/2026/07/SBX-SUM2-26-AFTN_40_BlendedPinkEnergyDrink-MangoStrawberryLemonade-MangoDragonfruitLemonade_sRGB-1280x1280-1.jpeg",
    "label": "Drinks & Food One cup at a time — Sbx Sum2 26 Aftn 40 Blendedpinkenergydrink Mangostrawberrylemonade Mangodragonfruitlemonade Srgb",
    "timestamp": "2026-08-12T14:38:21.202Z"
  },
  {
    "url": "https://about.starbucks.com/uploads/2026/06/Summer-Pink-Drink-Bearista-2-1365x2048.jpg",
    "label": "Drinks & Food One cup at a time — Summer Pink Drink Bearista 2",
    "timestamp": "2026-08-12T14:38:21.202Z"
  },
  {
    "url": "https://about.starbucks.com/uploads/2026/06/Starbucks-Smores-Frappuccino-and-Cold-Brew-2048x1365.jpg",
    "label": "Drinks & Food One cup at a time — Starbucks Smores Frappuccino And Cold Brew",
    "timestamp": "2026-08-12T14:38:21.202Z"
  },
  {
    "url": "https://about.starbucks.com/uploads/2026/05/Starbucks-Summer-Menu-2026-1024x636.jpeg",
    "label": "Drinks & Food One cup at a time — Starbucks Summer Menu 2026",
    "timestamp": "2026-08-12T14:38:21.202Z"
  },
  {
    "url": "https://about.starbucks.com/uploads/2026/05/Starbucks-Tropical-Butterfly-Refresher-1024x737.jpeg",
    "label": "Drinks & Food One cup at a time — Starbucks Tropical Butterfly Refresher",
    "timestamp": "2026-08-12T14:38:21.202Z"
  },
  {
    "url": "https://about.starbucks.com/uploads/2026/05/Starbucks-Horchata-2048x1365.jpeg",
    "label": "Drinks & Food One cup at a time — Starbucks Horchata",
    "timestamp": "2026-08-12T14:38:21.202Z"
  },
  {
    "url": "https://about.starbucks.com/uploads/2026/03/HistoryofCakePops_BrianMunley-5-2048x1320.jpg",
    "label": "Drinks & Food One cup at a time — Historyofcakepops Brianmunley 5",
    "timestamp": "2026-08-12T14:38:21.202Z"
  },
  {
    "url": "https://about.starbucks.com/uploads/2025/06/SBX20241028_FY25SPR_ILCOM_ICC_2_sRGB-2048x1536.jpg",
    "label": "Drinks & Food One cup at a time — Fy25spr Ilcom Icc 2 Srgb",
    "timestamp": "2026-08-12T14:38:21.202Z"
  },
  {
    "url": "https://about.starbucks.com/uploads/2025/06/20241021-alt-milk-images-007-1280x853.jpg",
    "label": "Drinks & Food One cup at a time — Alt Milk Images 007",
    "timestamp": "2026-08-12T14:38:21.202Z"
  },
  {
    "url": "https://about.starbucks.com/uploads/2025/06/20231130_PA025_PWI-Cultural-Magazine_FY24_Q1_069-1280x853.jpg",
    "label": "Drinks & Food One cup at a time — Pa025 Pwi Cultural Magazine Fy24 Q1 069",
    "timestamp": "2026-08-12T14:38:21.202Z"
  },
  {
    "url": "https://about.starbucks.com/uploads/2025/02/Roasted-coffee-1365x2048.jpg",
    "label": "Drinks & Food One cup at a time — Roasted Coffee",
    "timestamp": "2026-08-12T14:38:21.202Z"
  },
  {
    "url": "https://about.starbucks.com/uploads/2026/07/Fall-RTD-Lineup-1280x622.png",
    "label": "Drinks & Food One cup at a time — Fall Rtd Lineup",
    "timestamp": "2026-08-12T14:38:21.202Z"
  },
  {
    "url": "https://about.starbucks.com/uploads/2026/07/Starbucks-Fall-Menu-Preview-2026-1536x1536.jpg",
    "label": "Drinks & Food One cup at a time — Starbucks Fall Menu Preview 2026",
    "timestamp": "2026-08-12T14:38:21.202Z"
  },
  {
    "url": "https://about.starbucks.com/uploads/2025/09/20250709_Kansas_City_evergreen_063-2048x1365.jpg",
    "label": "Belonging at Starbucks Creating a more welcoming experience — Kansas City Evergreen 063",
    "timestamp": "2026-08-12T14:38:23.970Z"
  },
  {
    "url": "https://about.starbucks.com/uploads/2025/12/01-partners-001-2048x1327.jpg",
    "label": "Belonging at Starbucks Creating a more welcoming experience — 01 Partners 001",
    "timestamp": "2026-08-12T14:38:23.970Z"
  },
  {
    "url": "https://about.starbucks.com/uploads/2024/10/20230727_PA105_Military-Announcements-Still-Selects_FY23_005-1536x1024.jpg",
    "label": "Belonging at Starbucks Creating a more welcoming experience — Pa105 Military Announcements Still Selects Fy23 005",
    "timestamp": "2026-08-12T14:38:23.970Z"
  },
  {
    "url": "https://about.starbucks.com/uploads/2025/08/Starbucks-Partner-Palisades-1752x2048.jpeg",
    "label": "Belonging at Starbucks Creating a more welcoming experience — Starbucks Partner Palisades",
    "timestamp": "2026-08-12T14:38:23.970Z"
  },
  {
    "url": "https://about.starbucks.com/uploads/2020/09/SBX20201008-RacialEquity-Feature-1024x498.jpg",
    "label": "Belonging at Starbucks Creating a more welcoming experience — Racialequity Feature",
    "timestamp": "2026-08-12T14:38:23.970Z"
  },
  {
    "url": "https://about.starbucks.com/uploads/2023/04/GESI22-Partner-20220823-backpack-packing-003-2-1536x1024.jpg",
    "label": "Communities The power of positive impact — Gesi22 Partner 20220823 Backpack Packing 003 2",
    "timestamp": "2026-08-12T14:38:26.402Z"
  },
  {
    "url": "https://about.starbucks.com/uploads/2023/06/SBX20230612-Rwanda-OE-06-A-DAY-OF-SERVICE-002-2048x1365.jpg",
    "label": "Communities The power of positive impact — Rwanda Oe 06 A Day Of Service 002",
    "timestamp": "2026-08-12T14:38:26.402Z"
  },
  {
    "url": "https://about.starbucks.com/uploads/2025/10/20251029_VeteransDay_offer_025-2048x1365.jpg",
    "label": "Communities The power of positive impact — Veteransday Offer 025",
    "timestamp": "2026-08-12T14:38:26.402Z"
  },
  {
    "url": "https://about.starbucks.com/uploads/2019/06/Starbucks-Military-Store-Camp-Pendleton-2-1024x683.jpg",
    "label": "Communities The power of positive impact — Starbucks Military Store Camp Pendleton 2",
    "timestamp": "2026-08-12T14:38:26.402Z"
  },
  {
    "url": "https://about.starbucks.com/uploads/2026/04/HJCJ_2026_2Decatur-19-2048x1365.jpg",
    "label": "Communities The power of positive impact — Hjcj 2026 2decatur 19",
    "timestamp": "2026-08-12T14:38:26.402Z"
  },
  {
    "url": "https://about.starbucks.com/uploads/2026/04/HJCJ_2026_1MtSi-19-2048x1365.jpg",
    "label": "Communities The power of positive impact — Hjcj 2026 1mtsi 19",
    "timestamp": "2026-08-12T14:38:26.403Z"
  },
  {
    "url": "https://about.starbucks.com/uploads/2026/04/Hot-Java-Cool-Jazz-2026_7-2048x1365.jpg",
    "label": "Communities The power of positive impact — Hot Java Cool Jazz 2026 7",
    "timestamp": "2026-08-12T14:38:26.403Z"
  },
  {
    "url": "https://about.starbucks.com/uploads/2026/04/Hot-Java-Cool-Jazz-1536x1024.jpg",
    "label": "Communities The power of positive impact — Hot Java Cool Jazz",
    "timestamp": "2026-08-12T14:38:26.403Z"
  },
  {
    "url": "https://about.starbucks.com/uploads/2021/05/SBX20240903-HungerRelief-Feature-2048x996.jpg",
    "label": "Communities The power of positive impact — Hungerrelief Feature",
    "timestamp": "2026-08-12T14:38:26.403Z"
  },
  {
    "url": "https://about.starbucks.com/uploads/2024/11/FoodBank-1605x2048.jpg",
    "label": "Communities The power of positive impact — Foodbank",
    "timestamp": "2026-08-12T14:38:26.403Z"
  },
  {
    "url": "https://about.starbucks.com/uploads/2021/07/SBX20210721-FoodShareJourney-FeatureHorizontal-1024x498.jpg",
    "label": "Communities The power of positive impact — Foodsharejourney Featurehorizontal",
    "timestamp": "2026-08-12T14:38:26.403Z"
  },
  {
    "url": "https://about.starbucks.com/uploads/2024/01/SBX20240117-MLK-FeatureHorizontal-1-1024x498.jpg",
    "label": "Communities The power of positive impact — Mlk Featurehorizontal 1",
    "timestamp": "2026-08-12T14:38:26.403Z"
  },
  {
    "url": "https://about.starbucks.com/uploads/2024/09/SBX20240923-GlobalCommunityImpactGrants_Feature-2048x996.jpg",
    "label": "Communities The power of positive impact — Globalcommunityimpactgrants Feature",
    "timestamp": "2026-08-12T14:38:26.403Z"
  },
  {
    "url": "https://about.starbucks.com/uploads/2025/04/Hot-Cool-Java-Cool-Jazz-5-2048x1365.jpg",
    "label": "Communities The power of positive impact — Hot Cool Java Cool Jazz 5",
    "timestamp": "2026-08-12T14:38:26.403Z"
  },
  {
    "url": "https://about.starbucks.com/uploads/2024/04/SBX20240325-HJCJ-FeatureHorizontal-1280x622.jpg",
    "label": "Communities The power of positive impact — Hjcj Featurehorizontal",
    "timestamp": "2026-08-12T14:38:26.403Z"
  },
  {
    "url": "https://about.starbucks.com/uploads/2024/02/20230123-wave-six-217-2048x1365.jpg",
    "label": "Farmers Ensuring A more Sustainable Future OF COFFEE for all — Wave Six 217",
    "timestamp": "2026-08-12T14:38:28.944Z"
  },
  {
    "url": "https://about.starbucks.com/uploads/2020/04/SBX20200422-EarthDay-HaciendaAlsacia-14-1-2048x1376.jpg",
    "label": "Farmers Ensuring A more Sustainable Future OF COFFEE for all — Earthday Haciendaalsacia 14 1",
    "timestamp": "2026-08-12T14:38:28.944Z"
  },
  {
    "url": "https://about.starbucks.com/uploads/2019/12/02-coffee-001-2048x1365.jpg",
    "label": "Farmers Ensuring A more Sustainable Future OF COFFEE for all — 02 Coffee 001",
    "timestamp": "2026-08-12T14:38:28.944Z"
  },
  {
    "url": "https://about.starbucks.com/uploads/2024/09/SBX20240927-CelebratingCoffeeCraft-Feature-2048x996.jpg",
    "label": "Farmers Ensuring A more Sustainable Future OF COFFEE for all — Celebratingcoffeecraft Feature",
    "timestamp": "2026-08-12T14:38:28.944Z"
  },
  {
    "url": "https://about.starbucks.com/uploads/2024/09/SBX20240926-BeanToCup-Feature-2048x996.jpg",
    "label": "Farmers Ensuring A more Sustainable Future OF COFFEE for all — Beantocup Feature",
    "timestamp": "2026-08-12T14:38:28.944Z"
  },
  {
    "url": "https://about.starbucks.com/uploads/2023/06/SBX20230615-HATenYears-Feature-2-1024x512.jpg",
    "label": "Farmers Ensuring A more Sustainable Future OF COFFEE for all — Hatenyears Feature 2",
    "timestamp": "2026-08-12T14:38:28.944Z"
  },
  {
    "url": "https://about.starbucks.com/uploads/2019/03/FeatureStory_002-1024x684.jpg",
    "label": "Farmers Ensuring A more Sustainable Future OF COFFEE for all — Featurestory 002",
    "timestamp": "2026-08-12T14:38:28.944Z"
  },
  {
    "url": "https://about.starbucks.com/uploads/2025/09/20250211-evergreen-seattle-selects-030-1365x2048.jpg",
    "label": "It starts with the green apron — Evergreen Seattle Selects 030",
    "timestamp": "2026-08-12T14:38:31.623Z"
  },
  {
    "url": "https://about.starbucks.com/uploads/2025/10/thumb-84a-nodl-hiring-refugees-apron-1-1024x1024.jpg",
    "label": "It starts with the green apron — Thumb 84a Nodl Hiring Refugees Apron 1",
    "timestamp": "2026-08-12T14:38:31.623Z"
  },
  {
    "url": "https://about.starbucks.com/uploads/2025/12/01-partners-005-1365x2048.jpg",
    "label": "It starts with the green apron — 01 Partners 005",
    "timestamp": "2026-08-12T14:38:31.623Z"
  },
  {
    "url": "https://about.starbucks.com/uploads/2025/05/Starbucks-partners-5-2048x1537.jpg",
    "label": "It starts with the green apron — Starbucks Partners 5",
    "timestamp": "2026-08-12T14:38:31.623Z"
  },
  {
    "url": "https://about.starbucks.com/uploads/2025/05/Starbucks-partners-4-2048x1366.jpg",
    "label": "It starts with the green apron — Starbucks Partners 4",
    "timestamp": "2026-08-12T14:38:31.623Z"
  },
  {
    "url": "https://about.starbucks.com/uploads/2025/07/20250709_Kansas_City_evergreen_038_crop-2048x1463.jpg",
    "label": "It starts with the green apron — Kansas City Evergreen 038 Crop",
    "timestamp": "2026-08-12T14:38:31.623Z"
  },
  {
    "url": "https://about.starbucks.com/uploads/2024/12/STARBUCKS-CUP-WITH-HEART-1280x853.jpg",
    "label": "It starts with the green apron — Starbucks Cup With Heart",
    "timestamp": "2026-08-12T14:38:31.623Z"
  },
  {
    "url": "https://about.starbucks.com/uploads/2024/10/20240506-SCAP-graduation-072-1536x1024.jpg",
    "label": "It starts with the green apron — Scap Graduation 072",
    "timestamp": "2026-08-12T14:38:31.623Z"
  },
  {
    "url": "https://about.starbucks.com/uploads/2024/11/SCAP_23_Walk_SV-7878-1280x853.jpg",
    "label": "It starts with the green apron — Scap 23 Walk Sv 7878",
    "timestamp": "2026-08-12T14:38:31.623Z"
  },
  {
    "url": "https://about.starbucks.com/uploads/2024/11/20240528-PA076-Neighborhood-Grants-Covenant-House-005-1280x853.jpg",
    "label": "It starts with the green apron — Pa076 Neighborhood Grants Covenant House 005",
    "timestamp": "2026-08-12T14:38:31.623Z"
  },
  {
    "url": "https://about.starbucks.com/uploads/2021/09/SBX092021-Starbucks-Sustainability-Commitment-Greener-Stores-2048x1366.jpg",
    "label": "Sustainability Continuing to build impact — Starbucks Sustainability Commitment Greener Stores",
    "timestamp": "2026-08-12T14:38:34.170Z"
  },
  {
    "url": "https://about.starbucks.com/uploads/2025/04/Kyoto-Kuze-Starbucks-Store-in-Japan-2-2048x1366.jpg",
    "label": "Sustainability Continuing to build impact — Kyoto Kuze Starbucks Store In Japan 2",
    "timestamp": "2026-08-12T14:38:34.170Z"
  },
  {
    "url": "https://about.starbucks.com/uploads/2025/04/General-Booth-Nimmo-Starbucks-Store-in-Virginia-3-2048x1280.jpg",
    "label": "Sustainability Continuing to build impact — General Booth Nimmo Starbucks Store In Virginia 3",
    "timestamp": "2026-08-12T14:38:34.170Z"
  },
  {
    "url": "https://about.starbucks.com/uploads/2025/04/Ahau-Tulum-Starbucks-Store-in-Mexico-4-2048x1365.jpg",
    "label": "Sustainability Continuing to build impact — Ahau Tulum Starbucks Store In Mexico 4",
    "timestamp": "2026-08-12T14:38:34.170Z"
  },
  {
    "url": "https://about.starbucks.com/uploads/2025/04/General-Booth-Nimmo-Starbucks-Store-in-Virginia-2-2048x1367.jpg",
    "label": "Sustainability Continuing to build impact — General Booth Nimmo Starbucks Store In Virginia 2",
    "timestamp": "2026-08-12T14:38:34.170Z"
  },
  {
    "url": "https://about.starbucks.com/uploads/2021/06/SBX20210607-Reusable-Cups-FeatureHorizontal-1-1024x498.jpg",
    "label": "Sustainability Continuing to build impact — Reusable Cups Featurehorizontal 1",
    "timestamp": "2026-08-12T14:38:34.170Z"
  },
  {
    "url": "https://about.starbucks.com/uploads/2024/07/Starbucks-Next-Gen-Cup-Feature-1280x622.jpg",
    "label": "Sustainability Continuing to build impact — Starbucks Next Gen Cup Feature",
    "timestamp": "2026-08-12T14:38:34.170Z"
  },
  {
    "url": "https://about.starbucks.com/uploads/2026/06/Starbucks-Blended-Refreshers-2048x1528.jpg",
    "label": "404 — Starbucks Blended Refreshers",
    "timestamp": "2026-08-12T14:38:37.081Z"
  },
  {
    "url": "https://about.starbucks.com/uploads/2026/06/Starbucks-Smores-Frappuccino-and-Smores-Cold-brew-2048x1367.jpg",
    "label": "404 — Starbucks Smores Frappuccino And Smores Cold Brew",
    "timestamp": "2026-08-12T14:38:37.081Z"
  },
  {
    "url": "https://about.starbucks.com/uploads/2024/05/SBX20240521-SCAP-Yearbook-2024-FeatureHoriz-1280x622.jpg",
    "label": "Photo essay: Caps off to the class of 2024 — Scap Yearbook 2024 Featurehoriz",
    "timestamp": "2026-08-12T14:38:39.567Z"
  },
  {
    "url": "https://about.starbucks.com/uploads/2024/05/PA068_03-SCAP-photo-essay-028-1024x1536.jpg",
    "label": "Photo essay: Caps off to the class of 2024 — Scap Photo Essay 028",
    "timestamp": "2026-08-12T14:38:39.567Z"
  },
  {
    "url": "https://about.starbucks.com/uploads/2024/05/PA068_03-SCAP-photo-essay-012-1024x1536.jpg",
    "label": "Photo essay: Caps off to the class of 2024 — Scap Photo Essay 012",
    "timestamp": "2026-08-12T14:38:39.567Z"
  },
  {
    "url": "https://about.starbucks.com/uploads/2024/05/PA068_04-SCAP-photo-essay-031-1536x975.jpg",
    "label": "Photo essay: Caps off to the class of 2024 — Scap Photo Essay 031",
    "timestamp": "2026-08-12T14:38:39.567Z"
  },
  {
    "url": "https://about.starbucks.com/uploads/2024/05/PA068_05-20240506-SCAP-graduation-072-1024x683.jpg",
    "label": "Photo essay: Caps off to the class of 2024 — 20240506 Scap Graduation 072",
    "timestamp": "2026-08-12T14:38:39.567Z"
  },
  {
    "url": "https://about.starbucks.com/uploads/2024/05/PA068_05-20240506-SCAP-graduation-068-1024x683.jpg",
    "label": "Photo essay: Caps off to the class of 2024 — 20240506 Scap Graduation 068",
    "timestamp": "2026-08-12T14:38:39.567Z"
  },
  {
    "url": "https://about.starbucks.com/uploads/2024/05/PA068_05-20240506-SCAP-graduation-075-1024x683.jpg",
    "label": "Photo essay: Caps off to the class of 2024 — 20240506 Scap Graduation 075",
    "timestamp": "2026-08-12T14:38:39.567Z"
  },
  {
    "url": "https://about.starbucks.com/uploads/2024/05/PA068_06-20240506-SCAP-graduation-043-768x1152.jpg",
    "label": "Photo essay: Caps off to the class of 2024 — 20240506 Scap Graduation 043",
    "timestamp": "2026-08-12T14:38:39.567Z"
  },
  {
    "url": "https://about.starbucks.com/uploads/2024/05/PA068_06-20240506-SCAP-graduation-007-768x1152.jpg",
    "label": "Photo essay: Caps off to the class of 2024 — 20240506 Scap Graduation 007",
    "timestamp": "2026-08-12T14:38:39.567Z"
  },
  {
    "url": "https://about.starbucks.com/uploads/2024/05/PA068_06-20240506-SCAP-graduation-040-768x1152.jpg",
    "label": "Photo essay: Caps off to the class of 2024 — 20240506 Scap Graduation 040",
    "timestamp": "2026-08-12T14:38:39.567Z"
  },
  {
    "url": "https://about.starbucks.com/uploads/2024/05/PA068_07-SCAP-photo-essay-027-1024x1536.jpg",
    "label": "Photo essay: Caps off to the class of 2024 — Scap Photo Essay 027",
    "timestamp": "2026-08-12T14:38:39.567Z"
  },
  {
    "url": "https://about.starbucks.com/uploads/2024/05/PA068_07-SCAP-photo-essay-010-1024x1536.jpg",
    "label": "Photo essay: Caps off to the class of 2024 — Scap Photo Essay 010",
    "timestamp": "2026-08-12T14:38:39.567Z"
  },
  {
    "url": "https://about.starbucks.com/uploads/2024/05/PA068_07-SCAP-photo-essay-011-1024x1536.jpg",
    "label": "Photo essay: Caps off to the class of 2024 — Scap Photo Essay 011",
    "timestamp": "2026-08-12T14:38:39.567Z"
  },
  {
    "url": "https://about.starbucks.com/uploads/2024/05/PA068_08-SCAP-photo-essay-023-1536x1024.jpg",
    "label": "Photo essay: Caps off to the class of 2024 — Scap Photo Essay 023",
    "timestamp": "2026-08-12T14:38:39.567Z"
  },
  {
    "url": "https://about.starbucks.com/uploads/2024/05/PA068_08-SCAP-photo-essay-025-1536x1024.jpg",
    "label": "Photo essay: Caps off to the class of 2024 — Scap Photo Essay 025",
    "timestamp": "2026-08-12T14:38:39.567Z"
  },
  {
    "url": "https://about.starbucks.com/uploads/2024/05/PA068_08-SCAP-photo-essay-026-1536x1024.jpg",
    "label": "Photo essay: Caps off to the class of 2024 — Scap Photo Essay 026",
    "timestamp": "2026-08-12T14:38:39.567Z"
  },
  {
    "url": "https://about.starbucks.com/uploads/2026/04/Hot-Java-Cool-Jazz-2026_4-2048x1365.jpg",
    "label": "Photo essay: Caps off to the class of 2024 — Hot Java Cool Jazz 2026 4",
    "timestamp": "2026-08-12T14:38:39.567Z"
  },
  {
    "url": "https://about.starbucks.com/uploads/2024/08/SBX2024-Starbucks-Barista-EH-Paralympic-Feature-1280x622.jpg",
    "label": "‘This amazing life’ – The captain of the U.S. Paralympic Equestrian team is a Starbucks barista — Starbucks Barista Eh Paralympic Feature",
    "timestamp": "2026-08-12T14:38:42.037Z"
  },
  {
    "url": "https://about.starbucks.com/uploads/2024/08/Starbucks-barista-EH-Paralympic-Equestrian-8-1536x1083.jpg",
    "label": "‘This amazing life’ – The captain of the U.S. Paralympic Equestrian team is a Starbucks barista — Starbucks Barista Eh Paralympic Equestrian 8",
    "timestamp": "2026-08-12T14:38:42.037Z"
  },
  {
    "url": "https://about.starbucks.com/uploads/2024/08/Starbucks-barista-EH-Paralympic-Equestrian-6-1536x1025.jpg",
    "label": "‘This amazing life’ – The captain of the U.S. Paralympic Equestrian team is a Starbucks barista — Starbucks Barista Eh Paralympic Equestrian 6",
    "timestamp": "2026-08-12T14:38:42.037Z"
  },
  {
    "url": "https://about.starbucks.com/uploads/2024/08/Starbucks-barista-EH-Paralympic-Equestrian-7-1536x1025.jpg",
    "label": "‘This amazing life’ – The captain of the U.S. Paralympic Equestrian team is a Starbucks barista — Starbucks Barista Eh Paralympic Equestrian 7",
    "timestamp": "2026-08-12T14:38:42.037Z"
  },
  {
    "url": "https://about.starbucks.com/uploads/2024/08/Starbucks-barista-EH-Paralympic-Equestrian-9-1536x1025.jpg",
    "label": "‘This amazing life’ – The captain of the U.S. Paralympic Equestrian team is a Starbucks barista — Starbucks Barista Eh Paralympic Equestrian 9",
    "timestamp": "2026-08-12T14:38:42.037Z"
  },
  {
    "url": "https://about.starbucks.com/uploads/2024/08/Starbucks-barista-EH-Paralympic-Equestrian-2-1280x1920.jpg",
    "label": "‘This amazing life’ – The captain of the U.S. Paralympic Equestrian team is a Starbucks barista — Starbucks Barista Eh Paralympic Equestrian 2",
    "timestamp": "2026-08-12T14:38:42.037Z"
  },
  {
    "url": "https://about.starbucks.com/uploads/2024/08/Starbucks-barista-EH-Paralympic-Equestrian-3-1280x1918.jpg",
    "label": "‘This amazing life’ – The captain of the U.S. Paralympic Equestrian team is a Starbucks barista — Starbucks Barista Eh Paralympic Equestrian 3",
    "timestamp": "2026-08-12T14:38:42.037Z"
  },
  {
    "url": "https://about.starbucks.com/uploads/2024/08/Starbucks-barista-EH-Paralympic-Equestrian-5-1280x1918.jpg",
    "label": "‘This amazing life’ – The captain of the U.S. Paralympic Equestrian team is a Starbucks barista — Starbucks Barista Eh Paralympic Equestrian 5",
    "timestamp": "2026-08-12T14:38:42.037Z"
  },
  {
    "url": "https://about.starbucks.com/uploads/2026/02/Starbucks-NYFW-1536x864.jpg",
    "label": "‘This amazing life’ – The captain of the U.S. Paralympic Equestrian team is a Starbucks barista — Starbucks Nyfw",
    "timestamp": "2026-08-12T14:38:42.039Z"
  },
  {
    "url": "https://about.starbucks.com/uploads/2024/02/SBX2024213-Starbucks-accessible-store-artist-feature-1024x498.jpg",
    "label": "A place in the world: Deaf artist hopes mural at D.C. Starbucks sparks conversations about inclusion, accessibility — Starbucks Accessible Store Artist Feature",
    "timestamp": "2026-08-12T14:38:47.717Z"
  },
  {
    "url": "https://about.starbucks.com/uploads/2024/02/SBX2024213-Starbucks-Mural-Arist-Ryan-Seslow-4-2048x1365.jpg",
    "label": "A place in the world: Deaf artist hopes mural at D.C. Starbucks sparks conversations about inclusion, accessibility — Starbucks Mural Arist Ryan Seslow 4",
    "timestamp": "2026-08-12T14:38:47.717Z"
  },
  {
    "url": "https://about.starbucks.com/uploads/2024/02/SBX2024213-Starbucks-Mural-Arist-Ryan-Seslow-2-2048x1358.jpg",
    "label": "A place in the world: Deaf artist hopes mural at D.C. Starbucks sparks conversations about inclusion, accessibility — Starbucks Mural Arist Ryan Seslow 2",
    "timestamp": "2026-08-12T14:38:47.717Z"
  },
  {
    "url": "https://about.starbucks.com/uploads/2024/02/SBX2024213-Starbucks-Mural-Arist-Ryan-Seslow-1-2048x1358.jpg",
    "label": "A place in the world: Deaf artist hopes mural at D.C. Starbucks sparks conversations about inclusion, accessibility — Starbucks Mural Arist Ryan Seslow 1",
    "timestamp": "2026-08-12T14:38:47.717Z"
  },
  {
    "url": "https://about.starbucks.com/uploads/2024/02/SBX2024213-Starbucks-Mural-Arist-Ryan-Seslow-3-2048x1358.jpg",
    "label": "A place in the world: Deaf artist hopes mural at D.C. Starbucks sparks conversations about inclusion, accessibility — Starbucks Mural Arist Ryan Seslow 3",
    "timestamp": "2026-08-12T14:38:47.717Z"
  },
  {
    "url": "https://about.starbucks.com/uploads/2024/06/20240528-PA076-Neighborhood-Grants-Prism-United-004-1365x2048.jpg",
    "label": "Neighborhood Grants — Pa076 Neighborhood Grants Prism United 004",
    "timestamp": "2026-08-12T14:38:50.487Z"
  },
  {
    "url": "https://about.starbucks.com/uploads/2025/05/SBX20250508-Impact-Report-Intro-Grants-1536x1024.jpg",
    "label": "Neighborhood Grants — Impact Report Intro Grants",
    "timestamp": "2026-08-12T14:38:50.487Z"
  },
  {
    "url": "https://about.starbucks.com/uploads/2024/12/07-neighborhood-grants-002-2048x1365.jpg",
    "label": "Neighborhood Grants — 07 Neighborhood Grants 002",
    "timestamp": "2026-08-12T14:38:50.487Z"
  },
  {
    "url": "https://about.starbucks.com/uploads/2024/02/SBX20240229-NeighborhoodGrantsStory-FeatureHorizontal-1280x622.jpg",
    "label": "Neighborhood Grants — Neighborhoodgrantsstory Featurehorizontal",
    "timestamp": "2026-08-12T14:38:50.487Z"
  },
  {
    "url": "https://about.starbucks.com/uploads/2024/10/Neighborhood-Grants_The-Starbucks-Foundation-Logo-Lockup_US_EN-1536x178.webp",
    "label": "Neighborhood Grants — Neighborhood Grants The Starbucks Foundation Logo Lockup Us En",
    "timestamp": "2026-08-12T14:38:50.487Z"
  },
  {
    "url": "https://about.starbucks.com/uploads/2025/09/Starbucks-Neighborhood-Grants-Resource-Center-Dallas-4-2048x1366.jpg",
    "label": "Neighborhood Grants — Starbucks Neighborhood Grants Resource Center Dallas 4",
    "timestamp": "2026-08-12T14:38:50.487Z"
  },
  {
    "url": "https://about.starbucks.com/uploads/2025/09/Starbucks-Neighborhood-Grants-Resource-Center-Dallas-1-2048x1379.jpg",
    "label": "Neighborhood Grants — Starbucks Neighborhood Grants Resource Center Dallas 1",
    "timestamp": "2026-08-12T14:38:50.487Z"
  },
  {
    "url": "https://about.starbucks.com/uploads/2025/09/Starbucks-Neighborhood-Grants-Resource-Center-Dallas-3-2048x1337.jpg",
    "label": "Neighborhood Grants — Starbucks Neighborhood Grants Resource Center Dallas 3",
    "timestamp": "2026-08-12T14:38:50.487Z"
  },
  {
    "url": "https://about.starbucks.com/uploads/2025/09/Starbucks-Neighborhood-Grants-Resource-Center-Dallas-2-2048x1365.jpg",
    "label": "Neighborhood Grants — Starbucks Neighborhood Grants Resource Center Dallas 2",
    "timestamp": "2026-08-12T14:38:50.487Z"
  },
  {
    "url": "https://about.starbucks.com/uploads/2025/09/Starbucks-Neighborhood-Grants-Harlem-Grown-New-York-2-2048x1368.jpg",
    "label": "Neighborhood Grants — Starbucks Neighborhood Grants Harlem Grown New York 2",
    "timestamp": "2026-08-12T14:38:50.487Z"
  },
  {
    "url": "https://about.starbucks.com/uploads/2025/09/Starbucks-Neighborhood-Grants-Harlem-Grown-New-York-3-2048x1368.jpg",
    "label": "Neighborhood Grants — Starbucks Neighborhood Grants Harlem Grown New York 3",
    "timestamp": "2026-08-12T14:38:50.487Z"
  },
  {
    "url": "https://about.starbucks.com/uploads/2025/09/Starbucks-Neighborhood-Grants-Harlem-Grown-New-York-4-2048x1368.jpg",
    "label": "Neighborhood Grants — Starbucks Neighborhood Grants Harlem Grown New York 4",
    "timestamp": "2026-08-12T14:38:50.487Z"
  },
  {
    "url": "https://about.starbucks.com/uploads/2025/09/Starbucks-Neighborhood-Grants-Harlem-Grown-New-York-1-2048x1368.jpg",
    "label": "Neighborhood Grants — Starbucks Neighborhood Grants Harlem Grown New York 1",
    "timestamp": "2026-08-12T14:38:50.487Z"
  },
  {
    "url": "https://about.starbucks.com/uploads/2025/09/Starbucks-Neighborhood-Grants-Opportunity-Village-Nevada-2-2048x1365.jpg",
    "label": "Neighborhood Grants — Starbucks Neighborhood Grants Opportunity Village Nevada 2",
    "timestamp": "2026-08-12T14:38:50.487Z"
  },
  {
    "url": "https://about.starbucks.com/uploads/2025/09/Starbucks-Neighborhood-Grants-Opportunity-Village-Nevada-3-2048x1365.jpg",
    "label": "Neighborhood Grants — Starbucks Neighborhood Grants Opportunity Village Nevada 3",
    "timestamp": "2026-08-12T14:38:50.487Z"
  },
  {
    "url": "https://about.starbucks.com/uploads/2025/09/Starbucks-Neighborhood-Grants-Opportunity-Village-Nevada-1-1365x2048.jpg",
    "label": "Neighborhood Grants — Starbucks Neighborhood Grants Opportunity Village Nevada 1",
    "timestamp": "2026-08-12T14:38:50.487Z"
  },
  {
    "url": "https://about.starbucks.com/uploads/2026/07/Dandy-Starbucks-Hat-1-1366x2048.jpg",
    "label": "Multimedia — Dandy Starbucks Hat 1",
    "timestamp": "2026-08-12T14:38:56.087Z"
  },
  {
    "url": "https://about.starbucks.com/uploads/2026/07/Cold-Cup-and-Stainless-Steel-Water-Bottle-1366x2048.jpg",
    "label": "Multimedia — Cold Cup And Stainless Steel Water Bottle",
    "timestamp": "2026-08-12T14:38:56.087Z"
  },
  {
    "url": "https://about.starbucks.com/uploads/2026/07/Road-Trip-Cold-Cup-2-1357x2048.jpg",
    "label": "Multimedia — Road Trip Cold Cup 2",
    "timestamp": "2026-08-12T14:38:56.087Z"
  },
  {
    "url": "https://about.starbucks.com/uploads/2026/07/Road-Trip-Cold-Cup-1366x2048.jpg",
    "label": "Multimedia — Road Trip Cold Cup",
    "timestamp": "2026-08-12T14:38:56.087Z"
  },
  {
    "url": "https://about.starbucks.com/uploads/2026/07/Stainless-Steel-Lidded-Cup-1365x2048.jpg",
    "label": "Multimedia — Stainless Steel Lidded Cup",
    "timestamp": "2026-08-12T14:38:56.087Z"
  },
  {
    "url": "https://about.starbucks.com/uploads/2026/06/Starbucks-Summer-Pink-Collection-Charm-Bag-2-1280x1920.png",
    "label": "Multimedia — Starbucks Summer Pink Collection Charm Bag 2",
    "timestamp": "2026-08-12T14:39:01.030Z"
  },
  {
    "url": "https://about.starbucks.com/uploads/2026/06/Starbucks-Summer-Pink-Collection-Pink-Starbucks-Hat-1536x1024.png",
    "label": "Multimedia — Starbucks Summer Pink Collection Pink Starbucks Hat",
    "timestamp": "2026-08-12T14:39:01.030Z"
  },
  {
    "url": "https://about.starbucks.com/uploads/2026/06/Starbucks-Summer-Pink-Collection-Pink-Drink-Clips-2048x1365.png",
    "label": "Multimedia — Starbucks Summer Pink Collection Pink Drink Clips",
    "timestamp": "2026-08-12T14:39:01.030Z"
  },
  {
    "url": "https://about.starbucks.com/uploads/2026/06/Starbucks-Summer-Pink-Collection-Strawberry-Tumbler-1024x1536.png",
    "label": "Multimedia — Starbucks Summer Pink Collection Strawberry Tumbler",
    "timestamp": "2026-08-12T14:39:01.030Z"
  },
  {
    "url": "https://about.starbucks.com/uploads/2026/06/Starbucks-Summer-Pink-Collection-Strawberry-Glass-Cup-1024x1536.png",
    "label": "Multimedia — Starbucks Summer Pink Collection Strawberry Glass Cup",
    "timestamp": "2026-08-12T14:39:01.030Z"
  },
  {
    "url": "https://about.starbucks.com/uploads/2026/06/Starbucks-Blended-Matcha-Refresher-2048x2048.jpg",
    "label": "Multimedia — Starbucks Blended Matcha Refresher",
    "timestamp": "2026-08-12T14:39:03.509Z"
  },
  {
    "url": "https://about.starbucks.com/uploads/2026/06/Starbucks-Smores-Frappuccino-1-2048x2048.jpg",
    "label": "Multimedia — Starbucks Smores Frappuccino 1",
    "timestamp": "2026-08-12T14:39:03.509Z"
  },
  {
    "url": "https://about.starbucks.com/uploads/2026/07/Starbucks-and-Dandy-Collection-2-1-1366x2048.jpeg",
    "label": "Multimedia — Starbucks And Dandy Collection 2 1",
    "timestamp": "2026-08-12T14:39:05.928Z"
  },
  {
    "url": "https://about.starbucks.com/uploads/2026/07/Dandy-Hoodie-at-Pike-Place-Starbucks-1365x2048.jpg",
    "label": "Multimedia — Dandy Hoodie At Pike Place Starbucks",
    "timestamp": "2026-08-12T14:39:08.331Z"
  },
  {
    "url": "https://about.starbucks.com/uploads/2026/07/Stainless-Steel-Water-Bottle-2-1366x2048.jpg",
    "label": "Multimedia — Stainless Steel Water Bottle 2",
    "timestamp": "2026-08-12T14:39:10.891Z"
  },
  {
    "url": "https://about.starbucks.com/uploads/2026/07/Stainless-Steel-Water-Bottle-with-Woven-Handle-1366x2048.jpg",
    "label": "Multimedia — Stainless Steel Water Bottle With Woven Handle",
    "timestamp": "2026-08-12T14:39:10.891Z"
  },
  {
    "url": "https://about.starbucks.com/uploads/2026/07/Stainless-Steel-Water-Bottle-1536x2048.jpg",
    "label": "Multimedia — Stainless Steel Water Bottle",
    "timestamp": "2026-08-12T14:39:10.891Z"
  },
  {
    "url": "https://about.starbucks.com/uploads/2026/07/Orange-Cream-Trio-1280x1800.jpeg",
    "label": "Multimedia — Orange Cream Trio",
    "timestamp": "2026-08-12T14:39:13.336Z"
  },
  {
    "url": "https://about.starbucks.com/uploads/2026/07/Starbucks-and-Delta-1536x2048.jpg",
    "label": "Multimedia — Starbucks And Delta",
    "timestamp": "2026-08-12T14:39:42.836Z"
  },
  {
    "url": "https://content-prod-live.cert.starbucks.com/binary/v2/asset/137-111793.jpg",
    "label": "More pumpkin, please — 137 111793",
    "timestamp": "2026-08-25T16:43:30.957Z"
  },
  {
    "url": "https://content-prod-live.cert.starbucks.com/binary/v2/asset/137-111794.jpg",
    "label": "More pumpkin, please — 137 111794",
    "timestamp": "2026-08-25T16:43:30.957Z"
  },
  {
    "url": "https://content-prod-live.cert.starbucks.com/binary/v2/asset/137-112207.jpg",
    "label": "More pumpkin, please — 137 112207",
    "timestamp": "2026-08-25T16:43:30.957Z"
  },
  {
    "url": "https://content-prod-live.cert.starbucks.com/binary/v2/asset/137-111797.jpg",
    "label": "More pumpkin, please — 137 111797",
    "timestamp": "2026-08-25T16:43:30.957Z"
  },
  {
    "url": "https://content-prod-live.cert.starbucks.com/binary/v2/asset/137-111806.jpg",
    "label": "More pumpkin, please — 137 111806",
    "timestamp": "2026-08-25T16:43:30.957Z"
  },
  {
    "url": "https://content-prod-live.cert.starbucks.com/binary/v2/asset/137-111807.jpg",
    "label": "More pumpkin, please — 137 111807",
    "timestamp": "2026-08-25T16:43:30.957Z"
  },
  {
    "url": "https://content-prod-live.cert.starbucks.com/binary/v2/asset/137-111790.jpg",
    "label": "More pumpkin, please — 137 111790",
    "timestamp": "2026-08-25T16:43:30.957Z"
  },
  {
    "url": "https://content-prod-live.cert.starbucks.com/binary/v2/asset/137-111791.jpg",
    "label": "More pumpkin, please — 137 111791",
    "timestamp": "2026-08-25T16:43:30.957Z"
  },
  {
    "url": "https://content-prod-live.cert.starbucks.com/binary/v2/asset/137-111824.jpg",
    "label": "More pumpkin, please — 137 111824",
    "timestamp": "2026-08-25T16:43:30.957Z"
  },
  {
    "url": "https://content-prod-live.cert.starbucks.com/binary/v2/asset/137-111825.jpg",
    "label": "More pumpkin, please — 137 111825",
    "timestamp": "2026-08-25T16:43:30.957Z"
  },
  {
    "url": "https://content-prod-live.cert.starbucks.com/binary/v2/asset/137-111957.jpg",
    "label": "More pumpkin, please — 137 111957",
    "timestamp": "2026-08-25T16:43:30.957Z"
  },
  {
    "url": "https://content-prod-live.cert.starbucks.com/binary/v2/asset/137-111956.jpg",
    "label": "More pumpkin, please — 137 111956",
    "timestamp": "2026-08-25T16:43:30.957Z"
  },
  {
    "url": "https://content-prod-live.cert.starbucks.com/binary/v2/asset/137-112094.jpg",
    "label": "More pumpkin, please — 137 112094",
    "timestamp": "2026-08-25T16:43:30.957Z"
  },
  {
    "url": "https://content-prod-live.cert.starbucks.com/binary/v2/asset/137-112095.jpg",
    "label": "More pumpkin, please — 137 112095",
    "timestamp": "2026-08-25T16:43:30.957Z"
  },
  {
    "url": "https://content-prod-live.cert.starbucks.com/binary/v2/asset/137-112100.jpg",
    "label": "More pumpkin, please — 137 112100",
    "timestamp": "2026-08-25T16:43:30.957Z"
  },
  {
    "url": "https://content-prod-live.cert.starbucks.com/binary/v2/asset/137-112101.jpg",
    "label": "More pumpkin, please — 137 112101",
    "timestamp": "2026-08-25T16:43:30.957Z"
  }
];

async function loadImages() {
  if (!USE_REMOTE_LIBRARY) {
    return { images: SNAPSHOT_IMAGES, lastUpdated: SNAPSHOT_LAST_UPDATED, source: "snapshot" };
  }

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
