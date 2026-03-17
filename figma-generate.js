// ================================================================
// CampusNest — Figma Design Generator Plugin
// Run this in Figma: Plugins > Development > New Plugin (Run Once)
// ================================================================

const COLORS = {
  bg: { r: 1, g: 0.973, b: 0.937 },           // #fff8ef
  ink: { r: 0.122, g: 0.157, b: 0.337 },       // #1f2856
  muted: { r: 0.361, g: 0.388, b: 0.533 },     // #5c6388
  coral: { r: 1, g: 0.545, b: 0.482 },          // #ff8b7b
  mint: { r: 0.749, g: 0.941, b: 0.843 },       // #bff0d7
  butter: { r: 1, g: 0.898, b: 0.604 },         // #ffe59a
  sky: { r: 0.620, g: 0.851, b: 1 },            // #9ed9ff
  peach: { r: 1, g: 0.843, b: 0.749 },          // #ffd7bf
  pink: { r: 1, g: 0.776, b: 0.867 },           // #ffc6dd
  lime: { r: 0.843, g: 0.949, b: 0.478 },       // #d7f27a
  white: { r: 1, g: 0.992, b: 0.973 },          // #fffdf8
  black: { r: 0, g: 0, b: 0 },
};

const FRAME_W = 390;
const FRAME_H = 844;
const GAP = 80;

// ── helpers ──────────────────────────────────────────────────────

function solid(color, a = 1) {
  return [{ type: "SOLID", color, opacity: a }];
}

async function loadFont(family = "Inter", style = "Regular") {
  await figma.loadFontAsync({ family, style });
}

function frame(name, x, y, w = FRAME_W, h = FRAME_H) {
  const f = figma.createFrame();
  f.name = name;
  f.resize(w, h);
  f.x = x;
  f.y = y;
  f.fills = solid(COLORS.bg);
  f.clipsContent = true;
  return f;
}

function rect(parent, name, x, y, w, h, fill, radius = 0, strokeColor = null) {
  const r = figma.createRectangle();
  r.name = name;
  r.resize(w, h);
  r.x = x;
  r.y = y;
  r.fills = solid(fill);
  r.cornerRadius = radius;
  if (strokeColor) {
    r.strokes = solid(strokeColor);
    r.strokeWeight = 2;
  }
  parent.appendChild(r);
  return r;
}

async function text(parent, content, x, y, size, fill, weight = "Regular", w = 0) {
  const style = weight === "Bold" ? "Bold" : weight === "SemiBold" ? "SemiBold" : "Regular";
  await loadFont("Inter", style);
  const t = figma.createText();
  t.fontName = { family: "Inter", style };
  t.characters = content;
  t.fontSize = size;
  t.fills = solid(fill);
  t.x = x;
  t.y = y;
  if (w > 0) {
    t.textAutoResize = "HEIGHT";
    t.resize(w, t.height);
  }
  parent.appendChild(t);
  return t;
}

function pill(parent, name, x, y, w, h, bg, strokeColor) {
  const r = figma.createRectangle();
  r.name = name;
  r.resize(w, h);
  r.x = x;
  r.y = y;
  r.fills = solid(bg);
  r.cornerRadius = 999;
  r.strokes = solid(strokeColor);
  r.strokeWeight = 2;
  parent.appendChild(r);
  return r;
}

function bottomNav(parent) {
  const nav = figma.createFrame();
  nav.name = "Bottom Nav";
  nav.resize(FRAME_W, 80);
  nav.x = 0;
  nav.y = FRAME_H - 80;
  nav.fills = solid(COLORS.white);
  nav.strokes = solid(COLORS.ink);
  nav.strokeWeight = 2;

  const items = ["Home", "Map", "Messages", "Community", "Profile"];
  items.forEach((label, i) => {
    const isActive = i === 0;
    const dot = figma.createEllipse();
    dot.resize(6, 6);
    dot.x = 16 + i * 74 + 20;
    dot.y = 18;
    dot.fills = solid(isActive ? COLORS.coral : COLORS.muted);
    nav.appendChild(dot);

    loadFont("Inter", isActive ? "Bold" : "Regular").then(() => {
      const t = figma.createText();
      t.fontName = { family: "Inter", style: isActive ? "Bold" : "Regular" };
      t.characters = label;
      t.fontSize = 11;
      t.fills = solid(isActive ? COLORS.ink : COLORS.muted);
      t.x = 8 + i * 74;
      t.y = 30;
      nav.appendChild(t);
    });
  });

  parent.appendChild(nav);
}

// ── Page 1: Home / Explore ────────────────────────────────────────

async function createHomePage(startX) {
  const f = frame("01 · Home — Explore", startX, 0);

  // bg blob top-right
  rect(f, "blob-mint", 260, 80, 160, 160, COLORS.mint, 60);
  // bg blob mid-left
  rect(f, "blob-sky", -20, 480, 100, 100, COLORS.sky, 20);

  // status bar
  await text(f, "9:41", 16, 16, 13, COLORS.ink, "Bold");
  await text(f, "Rembag, Student Area", 120, 16, 12, COLORS.muted);

  // brand + nav
  rect(f, "brand-chip", 16, 44, 40, 40, COLORS.coral, 12);
  await text(f, "CN", 24, 54, 13, COLORS.ink, "Bold");
  pill(f, "btn-login", 196, 48, 56, 28, COLORS.white, COLORS.ink);
  await text(f, "Log in", 207, 54, 11, COLORS.ink);
  pill(f, "btn-post", 258, 48, 40, 28, COLORS.lime, COLORS.ink);
  await text(f, "Post", 266, 54, 11, COLORS.ink);

  // hero text
  await text(f, "EXPLORE", 20, 112, 11, COLORS.muted);
  await text(f, "Find student housing\nwithout platform-hopping.", 20, 132, 28, COLORS.ink, "Bold", 290);

  // callout badges
  rect(f, "badge-safe", 20, 230, 64, 32, COLORS.butter, 8);
  await text(f, "safe", 30, 238, 13, COLORS.ink, "Bold");
  rect(f, "badge-walkable", 92, 230, 100, 32, COLORS.sky, 999);
  await text(f, "walkable", 108, 238, 13, COLORS.ink);
  rect(f, "badge-smile", 200, 230, 52, 32, COLORS.pink, 999);
  await text(f, ": )", 214, 238, 13, COLORS.ink);

  // search panel
  rect(f, "search-panel", 16, 290, FRAME_W - 32, 260, COLORS.white, 20, COLORS.ink);

  // segment pills
  rect(f, "seg-rent", 28, 308, 72, 32, COLORS.ink, 999);
  await text(f, "Rent", 46, 316, 13, COLORS.white, "Bold");
  rect(f, "seg-buy", 108, 308, 72, 32, COLORS.bg, 999, COLORS.ink);
  await text(f, "Buy", 128, 316, 13, COLORS.ink);

  // search fields
  rect(f, "field-location", 28, 352, FRAME_W - 60, 44, COLORS.bg, 12, COLORS.ink);
  await text(f, "SEARCH LOCATION", 40, 358, 9, COLORS.muted);
  await text(f, "University Loop", 40, 370, 14, COLORS.ink, "Bold");

  rect(f, "field-start", 28, 408, 150, 40, COLORS.bg, 12, COLORS.ink);
  await text(f, "START DATE", 40, 414, 9, COLORS.muted);
  await text(f, "Aug 12", 40, 425, 13, COLORS.ink, "Bold");

  rect(f, "field-end", 190, 408, 150, 40, COLORS.bg, 12, COLORS.ink);
  await text(f, "END DATE", 202, 414, 9, COLORS.muted);
  await text(f, "May 28", 202, 425, 13, COLORS.ink, "Bold");

  // filter pills row
  const fPills = [["Any type", true], ["Rent", false], ["Sublet", false], ["Publish", false]];
  let fpx = 28;
  for (const [label, active] of fPills) {
    const pw = label.length * 8 + 24;
    rect(f, `fpill-${label}`, fpx, 460, pw, 28, active ? COLORS.ink : COLORS.bg, 999, COLORS.ink);
    await text(f, label, fpx + 10, 467, 11, active ? COLORS.white : COLORS.ink);
    fpx += pw + 10;
  }

  // search button
  rect(f, "search-btn", 28, 498, FRAME_W - 56, 44, COLORS.coral, 999, COLORS.ink);
  await text(f, "Search", 160, 511, 15, COLORS.ink, "Bold");

  // Popular section
  await text(f, "Popular", 20, 572, 18, COLORS.ink, "Bold");
  await text(f, "See all →", 320, 576, 13, COLORS.coral);

  // featured card
  rect(f, "card-featured", 20, 602, FRAME_W - 40, 120, COLORS.peach, 16, COLORS.ink);
  rect(f, "card-featured-media", 20, 602, 100, 120, COLORS.coral, 16);
  await text(f, "South Gate Studio", 134, 614, 15, COLORS.ink, "Bold");
  await text(f, "Chicago Campus Area", 134, 634, 12, COLORS.muted);
  await text(f, "$920 / mo", 300, 614, 14, COLORS.ink, "Bold");
  await text(f, "Studio · 1 Bath · Furnished", 134, 660, 11, COLORS.ink);

  // bottom nav
  bottomNav(f);
  return f;
}

// ── Page 2: Search Results ───────────────────────────────────────

async function createSearchPage(startX) {
  const f = frame("02 · Search Results", startX, 0);

  // header
  await text(f, "SEARCH RESULTS", 20, 60, 11, COLORS.muted);
  await text(f, "Housing Near Campus", 20, 78, 24, COLORS.ink, "Bold", 260);
  rect(f, "btn-back", 300, 64, 72, 32, COLORS.bg, 999, COLORS.ink);
  await text(f, "Back Home", 308, 72, 11, COLORS.ink);

  // toolbar
  rect(f, "toolbar", 16, 136, FRAME_W - 32, 48, COLORS.white, 12, COLORS.ink);
  await text(f, "AREA  University Loop", 28, 144, 11, COLORS.ink);
  await text(f, "BUDGET  $500–$900", 160, 144, 11, COLORS.ink);
  await text(f, "COMMUTE  15min", 270, 144, 11, COLORS.ink);

  // mood chips
  const moodChips = [["walkable", COLORS.lime], ["verified", COLORS.sky], ["student-only", COLORS.peach]];
  let mcx = 16;
  for (const [label, bg] of moodChips) {
    const mw = label.length * 8 + 24;
    rect(f, `mood-${label}`, mcx, 196, mw, 28, bg, 999, COLORS.ink);
    await text(f, label, mcx + 10, 204, 11, COLORS.ink);
    mcx += mw + 10;
  }

  // filter pills
  const filters = ["Under $800", "Verified only", "Sublets only", "Short-term"];
  let fx = 16;
  for (const label of filters) {
    const fw = label.length * 7 + 24;
    rect(f, `filter-${label}`, fx, 236, fw, 28, COLORS.bg, 999, COLORS.ink);
    await text(f, label, fx + 10, 244, 10, COLORS.ink);
    fx += fw + 8;
  }

  // listing cards
  const listings = [
    { title: "South Gate Studio", price: "$920/mo", badge: "Verified", badgeColor: COLORS.coral, meta: "Private bath · Verified", score: "98%", tags: ["Furnished", "Quiet floor"] },
    { title: "2B1B Sublet Bedroom", price: "$700/mo", badge: "Sublet", badgeColor: COLORS.sky, meta: "Student roommates · Updated today", score: "95%", tags: ["Short-term", "Move-in ready"] },
    { title: "North Loop 3B2B", price: "$610/mo", badge: "Budget", badgeColor: COLORS.lime, meta: "Verified landlord · Study zone", score: "91%", tags: ["Laundry room", "Budget-friendly"] },
  ];

  let cardY = 280;
  for (const [i, listing] of listings.entries()) {
    const isFirst = i === 0;
    rect(f, `card-${listing.title}`, 16, cardY, 220, 140, isFirst ? COLORS.peach : COLORS.white, 16, COLORS.ink);
    rect(f, `badge-${listing.badge}`, 28, cardY + 12, 64, 22, listing.badgeColor, 999);
    await text(f, listing.badge, 36, cardY + 17, 10, COLORS.ink, "Bold");
    await text(f, listing.score, 168, cardY + 14, 12, COLORS.ink, "Bold");
    await text(f, listing.title, 28, cardY + 44, 14, COLORS.ink, "Bold", 190);
    await text(f, listing.price, 28, cardY + 64, 12, COLORS.muted);
    await text(f, listing.meta, 28, cardY + 80, 10, COLORS.muted, "Regular", 180);
    for (const [j, tag] of listing.tags.entries()) {
      rect(f, `tag-${tag}`, 28 + j * 90, cardY + 100, 84, 22, COLORS.bg, 999, COLORS.ink);
      await text(f, tag, 34 + j * 90, cardY + 106, 9, COLORS.ink);
    }
    rect(f, `view-btn-${i}`, 28, cardY + 130, 90, 28, COLORS.coral, 999, COLORS.ink);
    await text(f, "View details", 38, cardY + 137, 10, COLORS.ink, "Bold");
    cardY += 160;
  }

  // mini-map side
  rect(f, "map-side", 250, 280, 120, 340, COLORS.mint, 16, COLORS.ink);
  await text(f, "Map Results", 258, 296, 11, COLORS.ink, "Bold");
  rect(f, "pin-a", 268, 360, 40, 24, COLORS.coral, 999, COLORS.ink);
  await text(f, "$610", 276, 366, 10, COLORS.ink, "Bold");
  rect(f, "pin-b", 320, 320, 40, 24, COLORS.butter, 999, COLORS.ink);
  await text(f, "$920", 328, 326, 10, COLORS.ink, "Bold");
  rect(f, "pin-c", 290, 420, 40, 24, COLORS.sky, 999, COLORS.ink);
  await text(f, "$700", 298, 426, 10, COLORS.ink, "Bold");

  bottomNav(f);
  return f;
}

// ── Page 3: Property Detail ───────────────────────────────────────

async function createDetailPage(startX) {
  const f = frame("03 · Property Detail", startX, 0);

  // hero media
  rect(f, "hero-media", 0, 0, FRAME_W, 280, COLORS.coral, 0);
  rect(f, "hero-blob-1", 40, 60, 120, 120, COLORS.peach, 50);
  rect(f, "hero-blob-2", 220, 120, 80, 80, COLORS.butter, 40);

  // back btn
  rect(f, "btn-back", 16, 52, 40, 40, COLORS.white, 999, COLORS.ink);
  await text(f, "←", 28, 64, 16, COLORS.ink, "Bold");
  await text(f, "9:41", 320, 60, 13, COLORS.ink);

  // gallery dots
  for (let i = 0; i < 4; i++) {
    const dot = figma.createEllipse();
    dot.resize(8, 8);
    dot.x = 174 + i * 14;
    dot.y = 262;
    dot.fills = solid(i === 0 ? COLORS.ink : COLORS.white);
    f.appendChild(dot);
  }

  // content
  rect(f, "content-bg", 0, 280, FRAME_W, FRAME_H - 280, COLORS.white, 0);
  rect(f, "badge-verified", 20, 296, 72, 26, COLORS.coral, 999);
  await text(f, "Verified", 30, 302, 11, COLORS.ink, "Bold");
  await text(f, "98%", 330, 296, 14, COLORS.ink, "Bold");

  await text(f, "South Gate Studio", 20, 334, 22, COLORS.ink, "Bold", 280);
  await text(f, "$920 / mo", 20, 364, 18, COLORS.coral, "Bold");
  await text(f, "6 min by bike  ·  12 months  ·  Best for solo living", 20, 388, 11, COLORS.muted, "Regular", 340);

  // divider
  rect(f, "divider-1", 20, 408, FRAME_W - 40, 1, COLORS.muted, 0);

  // spec chips
  const specs = [["Studio", COLORS.peach], ["1 Bath", COLORS.sky], ["Furnished", COLORS.mint]];
  let sx = 20;
  for (const [label, bg] of specs) {
    rect(f, `spec-${label}`, sx, 420, label.length * 9 + 20, 32, bg, 12, COLORS.ink);
    await text(f, label, sx + 10, 428, 12, COLORS.ink, "Bold");
    sx += label.length * 9 + 32;
  }

  // description
  await text(f, "About this place", 20, 468, 15, COLORS.ink, "Bold");
  await text(f, "Quiet, tidy, and close to the lab buildings. A strong fit for graduate students who want to save commute time.", 20, 492, 13, COLORS.muted, "Regular", 350);

  // tags
  const tags = ["Furnished", "Stable management", "Quiet floor"];
  let tx = 20;
  for (const tag of tags) {
    rect(f, `dtag-${tag}`, tx, 548, tag.length * 8 + 20, 28, COLORS.bg, 999, COLORS.ink);
    await text(f, tag, tx + 10, 555, 10, COLORS.ink);
    tx += tag.length * 8 + 32;
  }

  // action buttons
  rect(f, "btn-save", 20, 620, 160, 52, COLORS.white, 999, COLORS.ink);
  await text(f, "♡  Save", 65, 636, 15, COLORS.ink);
  rect(f, "btn-contact", 196, 620, 174, 52, COLORS.coral, 999, COLORS.ink);
  await text(f, "Contact Landlord", 204, 636, 13, COLORS.ink, "Bold");

  bottomNav(f);
  return f;
}

// ── Page 4: Map ─────────────────────────────────────────────────

async function createMapPage(startX) {
  const f = frame("04 · Map View", startX, 0);

  // map background
  rect(f, "map-bg", 0, 0, FRAME_W, FRAME_H, COLORS.mint, 0);

  // grid lines (streets)
  for (let i = 0; i < 6; i++) {
    rect(f, `road-h-${i}`, 0, 100 + i * 120, FRAME_W, 3, COLORS.white, 0);
    rect(f, `road-v-${i}`, i * 80, 0, 3, FRAME_H, COLORS.white, 0);
  }

  // campus badge
  rect(f, "campus-block", 120, 300, 140, 80, COLORS.butter, 8, COLORS.ink);
  await text(f, "🎓 Campus", 145, 330, 14, COLORS.ink, "Bold");

  // price pins
  const pins = [["$610", 80, 220, COLORS.coral], ["$920", 240, 160, COLORS.peach], ["$700", 300, 340, COLORS.sky]];
  for (const [price, px, py, bg] of pins) {
    rect(f, `pin-${price}`, px, py, 64, 32, bg, 999, COLORS.ink);
    await text(f, price, px + 10, py + 9, 13, COLORS.ink, "Bold");
    const dot = figma.createEllipse();
    dot.resize(8, 8);
    dot.x = px + 28;
    dot.y = py + 32;
    dot.fills = solid(COLORS.ink);
    f.appendChild(dot);
  }

  // top bar
  rect(f, "topbar-bg", 0, 0, FRAME_W, 88, COLORS.white, 0);
  await text(f, "9:41", 16, 16, 13, COLORS.ink, "Bold");
  await text(f, "MAP RESULTS", 20, 44, 11, COLORS.muted);
  await text(f, "Campus Area", 20, 60, 18, COLORS.ink, "Bold");
  rect(f, "btn-list-view", 280, 52, 92, 32, COLORS.coral, 999, COLORS.ink);
  await text(f, "List View", 296, 60, 12, COLORS.ink, "Bold");

  // bottom card
  rect(f, "bottom-card", 16, FRAME_H - 180, FRAME_W - 32, 140, COLORS.white, 20, COLORS.ink);
  rect(f, "card-img", 28, FRAME_H - 168, 80, 80, COLORS.peach, 12);
  await text(f, "South Gate Studio", 122, FRAME_H - 168, 15, COLORS.ink, "Bold");
  await text(f, "$920 / mo · 6 min by bike", 122, FRAME_H - 148, 12, COLORS.muted);
  rect(f, "card-badge", 122, FRAME_H - 128, 64, 22, COLORS.coral, 999);
  await text(f, "Verified", 132, FRAME_H - 122, 10, COLORS.ink, "Bold");
  await text(f, "98%", 290, FRAME_H - 166, 14, COLORS.ink, "Bold");
  rect(f, "btn-view", 28, FRAME_H - 76, 120, 36, COLORS.coral, 999, COLORS.ink);
  await text(f, "View Details", 44, FRAME_H - 64, 12, COLORS.ink, "Bold");

  bottomNav(f);
  return f;
}

// ── Page 5: Messages ─────────────────────────────────────────────

async function createMessagesPage(startX) {
  const f = frame("05 · Messages", startX, 0);

  // header
  await text(f, "9:41", 16, 16, 13, COLORS.ink, "Bold");
  await text(f, "MESSAGES", 20, 44, 11, COLORS.muted);
  await text(f, "Chat List", 20, 62, 24, COLORS.ink, "Bold");
  rect(f, "btn-new", 340, 60, 36, 36, COLORS.lime, 999, COLORS.ink);
  await text(f, "＋", 350, 68, 16, COLORS.ink, "Bold");

  // category cards
  const cats = [["Listing Chats", "8 chats", true], ["Roommate Chats", "3 chats", false], ["Support", "1 chat", false]];
  let cx = 16;
  for (const [label, count, active] of cats) {
    const cw = 108;
    rect(f, `cat-${label}`, cx, 118, cw, 64, active ? COLORS.ink : COLORS.white, 16, COLORS.ink);
    await text(f, label, cx + 10, 130, 11, active ? COLORS.white : COLORS.ink, "Bold");
    await text(f, count, cx + 10, 148, 11, active ? COLORS.sky : COLORS.muted);
    cx += cw + 12;
  }

  // chat list
  const chats = [
    { name: "Emma", role: "Subletter", listing: "Springfield 2B1B", preview: "You can move in around mid-August.", time: "09:24", unread: 2, active: true },
    { name: "Jason", role: "Landlord", listing: "Green St. Studio", preview: "We can schedule an in-person tour Friday.", time: "Yesterday", unread: 0, active: false },
    { name: "Sarah", role: "Roommate Match", listing: "Fall 2026 Roommate", preview: "My schedule is pretty regular.", time: "Mon", unread: 1, active: false },
  ];

  let chatY = 206;
  for (const chat of chats) {
    rect(f, `chat-${chat.name}`, 16, chatY, FRAME_W - 32, 100, chat.active ? COLORS.peach : COLORS.white, 16, COLORS.ink);
    // avatar
    const av = figma.createEllipse();
    av.resize(48, 48);
    av.x = 28;
    av.y = chatY + 26;
    av.fills = solid(chat.active ? COLORS.coral : COLORS.sky);
    f.appendChild(av);
    await text(f, chat.name[0], 46, chatY + 44, 16, COLORS.ink, "Bold");

    await text(f, chat.name, 88, chatY + 16, 14, COLORS.ink, "Bold");
    await text(f, chat.time, 310, chatY + 18, 11, COLORS.muted);
    rect(f, `role-${chat.name}`, 88, chatY + 36, chat.role.length * 7 + 16, 18, chat.active ? COLORS.coral : COLORS.mint, 999);
    await text(f, chat.role, 96, chatY + 40, 9, COLORS.ink);
    await text(f, chat.listing, 88 + chat.role.length * 7 + 22, chatY + 40, 10, COLORS.muted);
    await text(f, chat.preview, 88, chatY + 60, 11, COLORS.muted, "Regular", 250);

    if (chat.unread > 0) {
      const badge = figma.createEllipse();
      badge.resize(20, 20);
      badge.x = 348;
      badge.y = chatY + 38;
      badge.fills = solid(COLORS.coral);
      f.appendChild(badge);
      await text(f, String(chat.unread), 353, chatY + 42, 10, COLORS.ink, "Bold");
    }

    chatY += 116;
  }

  bottomNav(f);
  return f;
}

// ── Page 6: Community ─────────────────────────────────────────────

async function createCommunityPage(startX) {
  const f = frame("06 · Community", startX, 0);

  // header
  await text(f, "9:41", 16, 16, 13, COLORS.ink, "Bold");
  await text(f, "COMMUNITY", 20, 44, 11, COLORS.muted);
  await text(f, "Community Board", 20, 62, 22, COLORS.ink, "Bold");
  rect(f, "post-btn", 268, 56, 104, 36, COLORS.coral, 999, COLORS.ink);
  await text(f, "+ New Post", 280, 66, 12, COLORS.ink, "Bold");

  const posts = [
    { badge: "Hot", badgeColor: COLORS.butter, meta: "248 replies", title: "Best apartments for late-night classes?", tags: ["# Late class", "# Safety", "# Picks"] },
    { badge: "Sublet Alert", badgeColor: COLORS.sky, meta: "Updated today", title: "3 short-term rentals near north gate for summer interns", tags: ["# Summer sublet", "# North gate"] },
    { badge: "Guide", badgeColor: COLORS.coral, meta: "86 saves", title: "First time renting in the U.S.? 5 things to know", tags: ["# Lease", "# Deposit", "# Rules"] },
  ];

  let postY = 120;
  for (const post of posts) {
    rect(f, `post-${post.badge}`, 16, postY, FRAME_W - 32, 140, COLORS.white, 16, COLORS.ink);
    rect(f, `post-badge-${post.badge}`, 28, postY + 14, post.badge.length * 9 + 20, 24, post.badgeColor, 999);
    await text(f, post.badge, 36, postY + 20, 10, COLORS.ink, "Bold");
    await text(f, post.meta, 200, postY + 18, 10, COLORS.muted);
    await text(f, post.title, 28, postY + 46, 14, COLORS.ink, "Bold", 330);
    let tagX = 28;
    for (const tag of post.tags) {
      rect(f, `ptag-${tag}`, tagX, postY + 96, tag.length * 7 + 16, 24, COLORS.bg, 999, COLORS.ink);
      await text(f, tag, tagX + 8, postY + 103, 9, COLORS.muted);
      tagX += tag.length * 7 + 24;
    }
    postY += 158;
  }

  bottomNav(f);
  return f;
}

// ── Page 7: Profile ───────────────────────────────────────────────

async function createProfilePage(startX) {
  const f = frame("07 · Profile", startX, 0);

  // header gradient area
  rect(f, "profile-header", 0, 0, FRAME_W, 260, COLORS.peach, 0);
  rect(f, "blob-a", -30, -20, 160, 160, COLORS.butter, 60);
  rect(f, "blob-b", 260, 80, 140, 140, COLORS.pink, 999);

  await text(f, "9:41", 16, 16, 13, COLORS.ink, "Bold");
  await text(f, "MY PROFILE", 20, 44, 11, COLORS.muted);

  // avatar
  const av = figma.createEllipse();
  av.resize(80, 80);
  av.x = 155;
  av.y = 100;
  av.fills = solid(COLORS.coral);
  av.strokes = solid(COLORS.ink);
  av.strokeWeight = 3;
  f.appendChild(av);
  await text(f, "L", 187, 126, 28, COLORS.white, "Bold");

  await text(f, "Leqi", 170, 192, 20, COLORS.ink, "Bold");
  await text(f, "Graduate Student  ·  Fall Move-in", 100, 218, 12, COLORS.muted);

  // stats row
  const stats = [["12", "Saved"], ["8", "Alerts"], ["3", "Visits"]];
  let sx = 40;
  for (const [num, label] of stats) {
    rect(f, `stat-${label}`, sx, 264, 96, 64, COLORS.white, 16, COLORS.ink);
    await text(f, num, sx + 36, 278, 22, COLORS.coral, "Bold");
    await text(f, label, sx + 26, 302, 11, COLORS.muted);
    sx += 112;
  }

  // preferences
  await text(f, "Housing Preferences", 20, 348, 15, COLORS.ink, "Bold");
  const prefs = ["$600–$900", "Within 15 min walk", "Quiet area", "Open to shared living"];
  let py2 = 376;
  for (const pref of prefs) {
    rect(f, `pref-${pref}`, 20, py2, FRAME_W - 40, 40, COLORS.bg, 12, COLORS.ink);
    await text(f, pref, 32, py2 + 12, 13, COLORS.ink);
    await text(f, "›", 350, py2 + 12, 16, COLORS.muted);
    py2 += 52;
  }

  // edit button
  rect(f, "btn-edit", 20, 600, FRAME_W - 40, 48, COLORS.coral, 999, COLORS.ink);
  await text(f, "Edit Profile", 160, 616, 15, COLORS.ink, "Bold");

  bottomNav(f);
  return f;
}

// ── MAIN ──────────────────────────────────────────────────────────

(async function main() {
  figma.currentPage.name = "CampusNest — All Screens";

  const creators = [
    createHomePage,
    createSearchPage,
    createDetailPage,
    createMapPage,
    createMessagesPage,
    createCommunityPage,
    createProfilePage,
  ];

  const frames = [];
  for (let i = 0; i < creators.length; i++) {
    const f = await creators[i](i * (FRAME_W + GAP));
    frames.push(f);
    figma.currentPage.appendChild(f);
  }

  figma.viewport.scrollAndZoomIntoView(frames);
  figma.notify("✅ CampusNest — 7 screens created!", { timeout: 4000 });
  figma.closePlugin();
})();
