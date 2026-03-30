"use client";
import Link from "next/link";
import { useState, useEffect, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { usePathname } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse, faCompass, faPlane, faCircleUser, faPlus, faChevronLeft, faShareNodes } from "@fortawesome/free-solid-svg-icons";

/* ── Google Maps + Places loader ──
   Uses a window-level promise so it's shared across all components.
   Always loads with &libraries=places so autocomplete works. ── */
function loadGoogleMaps() {
  if (typeof window === "undefined") return Promise.reject();
  // If already fully loaded (with places), resolve immediately
  if (window.google?.maps?.places) return Promise.resolve(window.google.maps);
  // Reuse existing in-flight promise
  if (window.__opalGmapsPromise) return window.__opalGmapsPromise;
  // If Maps is loaded but Places isn't (e.g. NearbyPage loaded it first),
  // load just the places library via a callback-based approach
  if (window.google?.maps && !window.google.maps.places) {
    window.__opalGmapsPromise = new Promise((resolve) => {
      const cb = `__opalPlacesCb${Date.now()}`;
      window[cb] = () => { delete window[cb]; resolve(window.google.maps); };
      const s = document.createElement("script");
      s.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY}&libraries=places&language=en&callback=${cb}`;
      s.async = true;
      document.head.appendChild(s);
    });
    return window.__opalGmapsPromise;
  }
  // Fresh load
  window.__opalGmapsPromise = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY}&libraries=places&language=en`;
    script.async = true;
    script.onload = () => resolve(window.google.maps);
    script.onerror = reject;
    document.head.appendChild(script);
  });
  return window.__opalGmapsPromise;
}

const SNAZZY_STYLE = [
  {"featureType":"administrative","elementType":"labels.text.fill","stylers":[{"color":"#444444"}]},
  {"featureType":"landscape","elementType":"all","stylers":[{"color":"#f2f2f2"}]},
  {"featureType":"poi","elementType":"all","stylers":[{"visibility":"off"}]},
  {"featureType":"road","elementType":"all","stylers":[{"saturation":-100},{"lightness":45}]},
  {"featureType":"road.highway","elementType":"all","stylers":[{"visibility":"simplified"}]},
  {"featureType":"road.arterial","elementType":"labels.icon","stylers":[{"visibility":"off"}]},
  {"featureType":"transit","elementType":"all","stylers":[{"visibility":"off"}]},
  {"featureType":"water","elementType":"all","stylers":[{"color":"#000347"},{"visibility":"on"}]},
];

/* ── City coordinate lookup (same cities as planner) ── */
const CITY_COORDS = {
  "Tokyo":     { lat: 35.6762, lng: 139.6503, zoom: 12 },
  "Seoul":     { lat: 37.5665, lng: 126.9780, zoom: 12 },
  "Bangkok":   { lat: 13.7563, lng: 100.5018, zoom: 12 },
  "Bali":      { lat: -8.4095, lng: 115.1889, zoom: 11 },
  "Paris":     { lat: 48.8566, lng: 2.3522,   zoom: 12 },
  "New York":  { lat: 40.7128, lng: -74.0060, zoom: 12 },
  "London":    { lat: 51.5074, lng: -0.1278,  zoom: 12 },
  "Rome":      { lat: 41.9028, lng: 12.4964,  zoom: 12 },
  "Istanbul":  { lat: 41.0082, lng: 28.9784,  zoom: 12 },
  "Dubai":     { lat: 25.2048, lng: 55.2708,  zoom: 12 },
  "Sydney":    { lat: -33.8688, lng: 151.2093, zoom: 12 },
  "Barcelona": { lat: 41.3851, lng: 2.1734,   zoom: 12 },
  "Kyoto":     { lat: 35.0116, lng: 135.7681, zoom: 13 },
  "Singapore": { lat: 1.3521,  lng: 103.8198, zoom: 12 },
  "Lisbon":    { lat: 38.7223, lng: -9.1393,  zoom: 13 },
};

const DAY_COLORS = ["#8B9DAF","#7B9E7F","#A07B7B","#9E9B7B","#7B7B9E","#9E7B9E"];

/* ── Map centered on destination — custom HTML overlay pins ── */
function EmptyMap({ destination, spots, selectedIdx = 0, onPinClick, totalMode = false }) {
  const mapRef      = useRef(null);
  const mapInstRef  = useRef(null);
  const overlaysRef = useRef([]);

  // Init map once
  useEffect(() => {
    if (!mapRef.current) return;
    const coords = (destination && CITY_COORDS[destination]) || { lat: 20, lng: 0, zoom: 2 };
    loadGoogleMaps().then((maps) => {
      if (mapInstRef.current) return;
      mapInstRef.current = new maps.Map(mapRef.current, {
        center: { lat: coords.lat, lng: coords.lng },
        zoom: coords.zoom,
        styles: SNAZZY_STYLE,
        disableDefaultUI: true,
        gestureHandling: "greedy",
      });
    }).catch(() => {});
  }, []);

  // Re-center when destination changes
  useEffect(() => {
    if (!destination || !mapInstRef.current) return;
    const coords = CITY_COORDS[destination];
    if (!coords) return;
    mapInstRef.current.panTo({ lat: coords.lat, lng: coords.lng });
    mapInstRef.current.setZoom(coords.zoom);
  }, [destination]);

  // Rebuild overlay pins whenever spots, selection, or mode changes
  useEffect(() => {
    if (!mapInstRef.current) return;
    loadGoogleMaps().then((maps) => {
      overlaysRef.current.forEach(o => o.setMap(null));
      overlaysRef.current = [];
      if (!spots || spots.length === 0) return;
      const bounds = new maps.LatLngBounds();
      spots.forEach((spot, idx) => {
        if (!spot.lat || !spot.lng) return;
        const isActive = !totalMode && idx === selectedIdx;
        const color = totalMode
          ? (DAY_COLORS[(spot._day - 1) % DAY_COLORS.length] || DAY_COLORS[0])
          : DAY_COLORS[0];
        const label = totalMode ? `D${spot._day}` : `${idx + 1}`;
        const overlay = new maps.OverlayView();
        overlay.onAdd = function () {
          const div = document.createElement("div");
          div.className = "nd-gm-pin";
          const ds = isActive ? "" : ` style="background:${color};border-color:${color}40"`;
          const ls = isActive ? "" : ` style="background:${color};border-color:${color}40"`;
          div.innerHTML = `<div class="nd-map-pin-dot${isActive ? " nd-map-pin-dot--active" : ""}"${ds}>${label}</div><div class="nd-map-pin-label"${ls}>${spot.name}</div>`;
          div.style.cursor = "pointer";
          div.addEventListener("click", () => onPinClick?.(idx));
          this._div = div;
          this.getPanes().overlayMouseTarget.appendChild(div);
        };
        overlay.draw = function () {
          if (!this._div) return;
          const pt = this.getProjection().fromLatLngToDivPixel(new maps.LatLng(spot.lat, spot.lng));
          if (pt) { this._div.style.left = `${pt.x}px`; this._div.style.top = `${pt.y}px`; }
        };
        overlay.onRemove = function () { this._div?.parentNode?.removeChild(this._div); this._div = null; };
        overlay.setMap(mapInstRef.current);
        overlaysRef.current.push(overlay);
        bounds.extend({ lat: spot.lat, lng: spot.lng });
      });
      if (spots.length > 1) {
        mapInstRef.current.fitBounds(bounds, { top: 80, bottom: 320, left: 40, right: 40 });
      } else if (spots.length === 1) {
        mapInstRef.current.panTo({ lat: spots[0].lat, lng: spots[0].lng });
        mapInstRef.current.setZoom(15);
      }
    }).catch(() => {});
  }, [spots, selectedIdx, totalMode]);

  return (
    <div className="nd-map-wrap">
      <div ref={mapRef} className="nd-map" />
      <div className="nd-map-grad-top" />
      <div className="nd-map-grad-bottom" />
    </div>
  );
}

const DESTINATIONS = [
  "Tokyo", "Seoul", "Bangkok", "Bali", "Paris",
  "New York", "London", "Rome", "Istanbul", "Dubai",
  "Sydney", "Barcelona", "Kyoto", "Singapore", "Lisbon",
];

/* Generate a descriptive trip title from destination + preferences */
const PREF_TITLES = {
  "Culture":     (d) => `${d} Cultural Journey`,
  "Food":        (d) => `${d} Food & Flavours`,
  "Nature":      (d) => `${d} Nature Escape`,
  "Art":         (d) => `${d} Art Explorer`,
  "Adventure":   (d) => `${d} Adventure`,
  "Shopping":    (d) => `${d} Shopping Spree`,
  "Photography": (d) => `${d} Through the Lens`,
  "Nightlife":   (d) => `${d} Nights`,
};
const PREF_ICONS = {
  "Culture": "🏛️", "Food": "🍜", "Nature": "🌿", "Art": "🎨",
  "Adventure": "🏔️", "Shopping": "🛍️", "Photography": "📸", "Nightlife": "🎵",
};
function makeTripTitle(dest, prefs) {
  if (!dest) return "My Trip";
  if (!prefs || prefs.length === 0) return `${dest} Getaway`;
  const fn = PREF_TITLES[prefs[0]];
  return fn ? fn(dest) : `${dest} Getaway`;
}

const CITY_FLAGS = {
  "Tokyo": "🇯🇵", "Seoul": "🇰🇷", "Bangkok": "🇹🇭", "Bali": "🇮🇩",
  "Paris": "🇫🇷", "New York": "🇺🇸", "London": "🇬🇧", "Rome": "🇮🇹",
  "Istanbul": "🇹🇷", "Dubai": "🇦🇪", "Sydney": "🇦🇺", "Barcelona": "🇪🇸",
  "Kyoto": "🇯🇵", "Singapore": "🇸🇬", "Lisbon": "🇵🇹",
};

const DURATIONS = ["2 Days", "3 Days", "4 Days", "5 Days", "7 Days", "10 Days", "14 Days"];

const PREFERENCES = [
  { icon: "🏛️", label: "Culture" },
  { icon: "🍜", label: "Food" },
  { icon: "🌿", label: "Nature" },
  { icon: "🎨", label: "Art" },
  { icon: "🏔️", label: "Adventure" },
  { icon: "🛍️", label: "Shopping" },
  { icon: "📸", label: "Photography" },
  { icon: "🎵", label: "Nightlife" },
];

/* Photo gradient palettes for spot placeholders (cycles by index) */
const SPOT_GRADIENTS = [
  "linear-gradient(135deg,#2d3561,#5465b3)",
  "linear-gradient(135deg,#3a2d61,#8c65b3)",
  "linear-gradient(135deg,#61302d,#b36565)",
  "linear-gradient(135deg,#2d5432,#65b36a)",
  "linear-gradient(135deg,#614e2d,#b39e65)",
  "linear-gradient(135deg,#1e4d5c,#4da1b3)",
];
const SPOT_EMOJIS = ["📍","🗺️","🏛️","🍜","🌿","🎨","🏔️","🛍️","📸","🎵"];

const BUDGET_CATS = [
  { icon: "🏨", label: "Hotel" },
  { icon: "✈️", label: "Transport" },
  { icon: "🍜", label: "Food" },
  { icon: "🎯", label: "Activity" },
  { icon: "🛍️", label: "Shopping" },
  { icon: "💊", label: "Other" },
];

/* Mock weather — destination-agnostic placeholders */
const WEATHER_MOCK = [
  { date: "Today",    icon: "🌤️", desc: "Partly Cloudy · 24°C" },
  { date: "Tomorrow", icon: "☀️",  desc: "Sunny · 26°C"         },
  { date: "Fri",      icon: "🌧️", desc: "Rainy · 20°C"         },
  { date: "Sat",      icon: "⛅",  desc: "Cloudy · 22°C"        },
  { date: "Sun",      icon: "☀️",  desc: "Clear · 25°C"         },
];

const NAV_ITEMS = [
  { icon: faHouse,      label: "Home",      href: "/"        },
  { icon: faCompass,    label: "Discover",  href: "/nearby"  },
  { center: true },
  { icon: faPlane,      label: "My Trips",  href: "/trips"   },
  { icon: faCircleUser, label: "Profile",   href: "/profile" },
];

function ManualPlanInner() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const paramCity     = searchParams.get("city")     || "";
  const paramDuration = searchParams.get("duration") || "";
  const paramPrefs    = searchParams.get("prefs")    || "";
  const paramBudget   = searchParams.get("budget")   || ""; // e.g. "Mid-Range · $500/day"

  // Derive clean destination label (strip country, e.g. "Tokyo, Japan" → "Tokyo")
  const initDest  = paramCity ? paramCity.split(",")[0].trim() : "";
  const initDur   = paramDuration || "";
  const initPrefs = paramPrefs ? paramPrefs.split(",").map(p => p.trim()).filter(Boolean) : [];

  const [destination] = useState(initDest);
  const [duration]    = useState(initDur);
  const [prefs]       = useState(initPrefs);

  const numDays = parseInt(duration) || 3;
  const [tripDay, setTripDay]         = useState(0);
  const [tripTab, setTripTab]         = useState("overview");
  const [mapMode, setMapMode]         = useState(false);
  const mapExitTime                   = useRef(0);
  const dragY                         = useRef(null);

  const [activities, setActivities]   = useState(() => {
    const init = {};
    const days = parseInt(initDur) || 3;
    for (let i = 1; i <= days; i++) init[i] = [];
    return init;
  });

  // ── Add-spot search sheet ──
  const [addSheetDay,   setAddSheetDay]   = useState(null);
  const [spotSearch,    setSpotSearch]    = useState("");
  const [spotResults,   setSpotResults]   = useState([]);
  const [spotLoading,   setSpotLoading]   = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);
  const [dayPickerOpen,  setDayPickerOpen]  = useState(false);

  // ── Budget tracker ──
  const [budget,        setBudget]        = useState("");
  const [expenses,      setExpenses]      = useState([]); // [{cat, amount, note}]
  const [addExpOpen,    setAddExpOpen]    = useState(false);
  const [expCat,        setExpCat]        = useState("Food");
  const [expAmount,     setExpAmount]     = useState("");
  const [expNote,       setExpNote]       = useState("");
  const [setBudgetOpen, setSetBudgetOpen] = useState(false);
  const [budgetInput,   setBudgetInput]   = useState("");

  // ── Map card carousel (pin↔card sync) ──
  const [selectedActIdx, setSelectedActIdx] = useState(0);
  const trackRef  = useRef(null);
  const swipeRef  = useRef({ startX: 0, currentX: 0, dragging: false });
  const springRef = useRef(null);

  function springTo(target, from, onUpdate) {
    if (springRef.current) cancelAnimationFrame(springRef.current);
    let pos = from, velocity = 0;
    const stiffness = 0.12, damping = 0.75;
    function step() {
      velocity = velocity * damping + (target - pos) * stiffness;
      pos += velocity;
      onUpdate(pos);
      if (Math.abs(velocity) > 0.2 || Math.abs(target - pos) > 0.5) {
        springRef.current = requestAnimationFrame(step);
      } else { onUpdate(target); springRef.current = null; }
    }
    springRef.current = requestAnimationFrame(step);
  }

  // Animate carousel track to selected card
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const wrap = track.querySelector(".nd-mapview-card-wrap");
    if (!wrap) return;
    const target = -selectedActIdx * wrap.offsetWidth;
    const cur = parseFloat(track.style.transform?.match(/-?\d+\.?\d*/)?.[0] || 0);
    springTo(target, cur, (v) => { track.style.transform = `translateX(${v}px)`; });
  }, [selectedActIdx]);

  // Reset selected card when switching days
  useEffect(() => { setSelectedActIdx(0); }, [tripDay]);

  // ── Collaborators / invite ──
  const [inviteOpen,    setInviteOpen]    = useState(false);
  const [inviteCopied,  setInviteCopied]  = useState(false);
  const [collaborators, setCollaborators] = useState([
    { initials: "Me", color: "#4361ee" },
  ]);

  const totalSpent  = expenses.reduce((s, e) => s + (parseFloat(e.amount) || 0), 0);
  const totalBudget = parseFloat(budget) || 0;
  const budgetPct   = totalBudget > 0 ? Math.min(100, (totalSpent / totalBudget) * 100) : 0;
  const budgetOver  = totalBudget > 0 && totalSpent > totalBudget;

  const addExpense = () => {
    if (!expAmount) return;
    setExpenses(prev => [...prev, { cat: expCat, amount: expAmount, note: expNote }]);
    setExpAmount(""); setExpNote(""); setAddExpOpen(false);
  };
  const autoSvcRef   = useRef(null);
  const placesSvcRef = useRef(null);
  const spotInputRef = useRef(null);
  const searchTimer  = useRef(null);
  const catTapTimer  = useRef(null);
  const catTapCount  = useRef(0);

  const CAT_QUERIES = {
    "Hotel":     { q: "hotels",               types: ["lodging"] },
    "Transport": { q: "train station airport", types: ["transit_station","airport"] },
    "Saved":     { q: "popular attractions",  types: ["tourist_attraction"] },
    "Food":      { q: "restaurants",          types: ["restaurant"] },
    "Activity":  { q: "attractions things to do", types: ["tourist_attraction","amusement_park"] },
    "Shopping":  { q: "shopping mall market", types: ["shopping_mall"] },
  };

  // ── Keyboard height tracking (visualViewport API) ──
  const [kbOffset, setKbOffset] = useState(0);
  useEffect(() => {
    if (typeof window === "undefined" || !window.visualViewport) return;
    const onVpChange = () => {
      const vv = window.visualViewport;
      // keyboard height = total window height minus visible viewport height (minus its top offset)
      const kb = Math.max(0, window.innerHeight - vv.height - vv.offsetTop);
      setKbOffset(kb);
    };
    window.visualViewport.addEventListener("resize", onVpChange);
    window.visualViewport.addEventListener("scroll", onVpChange);
    return () => {
      window.visualViewport.removeEventListener("resize", onVpChange);
      window.visualViewport.removeEventListener("scroll", onVpChange);
    };
  }, []);

  function onPanelDragStart(e) {
    dragY.current = e.touches?.[0]?.clientY ?? e.clientY;
  }
  function onPanelDragEnd(e) {
    if (dragY.current === null) return;
    const endY  = e.changedTouches?.[0]?.clientY ?? e.clientY;
    const delta = endY - dragY.current;
    if (delta > 48)       { mapExitTime.current = Date.now(); setMapMode(true); }
    else if (delta < -48) setMapMode(false);
    dragY.current = null;
  }


  // Open the search sheet for a given day
  const addSpot = (day) => {
    setAddSheetDay(day);
    setSpotSearch("");
    setSpotResults([]);
    setActiveCategory(null);
    setDayPickerOpen(false);
    catTapCount.current = 0;
    clearTimeout(catTapTimer.current);
    setTimeout(() => spotInputRef.current?.focus(), 120);
  };

  // Live autocomplete search (optional types for category filtering)
  const handleSpotSearch = (q, types) => {
    setSpotSearch(q);
    clearTimeout(searchTimer.current);
    if (!q.trim()) { setSpotResults([]); setSpotLoading(false); return; }
    setSpotLoading(true);
    searchTimer.current = setTimeout(() => {
      loadGoogleMaps().then((maps) => {
        if (!autoSvcRef.current) autoSvcRef.current = new maps.places.AutocompleteService();
        const coords = CITY_COORDS[destination];
        const req = {
          input: destination ? `${q} in ${destination}` : q,
          ...(coords ? { locationBias: { center: new maps.LatLng(coords.lat, coords.lng), radius: 50000 } } : {}),
          ...(types ? { types } : {}),
        };
        autoSvcRef.current.getPlacePredictions(req, (preds, status) => {
          setSpotLoading(false);
          setSpotResults(status === maps.places.PlacesServiceStatus.OK ? (preds || []) : []);
        });
      }).catch(() => setSpotLoading(false));
    }, 300);
  };

  // Category card tap:
  //   • Tap a different tag  → switch to it, run its search
  //   • Tap the active tag   → re-run the same search (restart)
  //   • Double-tap active tag → deselect + clear
  const selectCategory = (cat) => {
    const isActive = activeCategory === cat.label;
    if (isActive) {
      catTapCount.current += 1;
      clearTimeout(catTapTimer.current);
      if (catTapCount.current >= 2) {
        // Double-tap → cancel
        catTapCount.current = 0;
        setActiveCategory(null);
        setSpotSearch("");
        setSpotResults([]);
        return;
      }
      catTapTimer.current = setTimeout(() => {
        // Single tap on active → restart search
        catTapCount.current = 0;
        const cfg = CAT_QUERIES[cat.label];
        handleSpotSearch(cfg.q, cfg.types);
        spotInputRef.current?.focus();
      }, 280);
    } else {
      // Different tag → switch immediately
      catTapCount.current = 0;
      clearTimeout(catTapTimer.current);
      setActiveCategory(cat.label);
      const cfg = CAT_QUERIES[cat.label];
      handleSpotSearch(cfg.q, cfg.types);
      spotInputRef.current?.focus();
    }
  };

  // Select a predicted place → get details → add to activities
  const selectSpot = (pred) => {
    loadGoogleMaps().then((maps) => {
      if (!placesSvcRef.current) placesSvcRef.current = new maps.places.PlacesService(document.createElement("div"));
      placesSvcRef.current.getDetails(
        { placeId: pred.place_id, fields: ["name", "geometry", "types", "formatted_address", "opening_hours", "price_level"] },
        (place, status) => {
          if (status !== maps.places.PlacesServiceStatus.OK) return;
          const day = addSheetDay;
          const idx = (activities[day] || []).length;
          const TIMES = ["9:00 AM","11:00 AM","1:00 PM","3:00 PM","5:00 PM","7:00 PM","9:00 PM"];
          const TICKETED_TYPES = ["museum","amusement_park","zoo","aquarium","stadium","movie_theater","art_gallery","casino"];
          const isTicketed = (place.price_level > 0) || (place.types || []).some(t => TICKETED_TYPES.includes(t));
          const openNow = place.opening_hours?.open_now ?? null; // null = unknown
          setActivities(prev => ({
            ...prev,
            [day]: [...(prev[day] || []), {
              name: place.name,
              time: TIMES[idx % TIMES.length],
              category: (place.types?.[0] || "attraction").replace(/_/g, " "),
              address: (() => {
                const raw = place.formatted_address || "";
                const parts = raw.split(",").map(s => s.trim()).filter(s => /^[\x20-\x7E]+$/.test(s));
                return parts.length > 0 ? parts.join(", ") : raw.split(",").slice(-2).join(",").trim();
              })(),
              isTicketed,
              openNow,
              lat: place.geometry.location.lat(),
              lng: place.geometry.location.lng(),
            }],
          }));
          setAddSheetDay(null);
          setSpotSearch("");
          setSpotResults([]);
        }
      );
    });
  };

  const removeSpot = (day, idx) => {
    setActivities((prev) => ({
      ...prev,
      [day]: prev[day].filter((_, i) => i !== idx),
    }));
  };

  // ── Plan / Itinerary Editor — identical structure to NearbyPage trip panel ──
  return (
    <div className="nd-shell">
      {/* Full-screen dark map — centered on destination, pins for added spots */}
      <EmptyMap
        destination={destination}
        spots={tripDay === 0
          ? Object.entries(activities).flatMap(([day, acts]) => acts.map(a => ({ ...a, _day: Number(day) })))
          : (activities[tripDay] || [])}
        selectedIdx={selectedActIdx}
        onPinClick={(i) => { if (tripDay !== 0) setSelectedActIdx(i); }}
        totalMode={tripDay === 0}
      />

      {/* ── Map mode UI — identical structure to NearbyPage ── */}
      {mapMode && <>
        {/* Back button — returns to planner/AI plan page */}
        <button className="nd-mapview-back"
          onClick={() => router.back()}
          onTouchEnd={(e) => { e.stopPropagation(); e.preventDefault(); router.back(); }}>
          <FontAwesomeIcon icon={faChevronLeft} style={{ width: 10, height: 14, color: "white" }} />
        </button>

        {/* Share button (top right) */}
        <button className="nd-mapview-share-btn"
          onClick={() => navigator.share?.({ title: `${destination || "My Trip"} · ${duration}`, text: "Check out my trip plan!" })}>
          <FontAwesomeIcon icon={faShareNodes} style={{ width: 16, height: 16, color: "white" }} />
        </button>

        {/* Bottom handle — tap/swipe up to restore panel */}
        <div className="nd-mapview-bottom-handle"
          onClick={() => { mapExitTime.current = Date.now(); setTimeout(() => setMapMode(false), 80); }}
          onTouchEnd={(e) => { e.stopPropagation(); e.preventDefault(); mapExitTime.current = Date.now(); setTimeout(() => setMapMode(false), 80); }}>
          <div className="nd-mapview-bottom-handle-pill" />
        </div>

        {/* Swipeable spot cards — spring carousel, pin↔card synced */}
        {tripDay !== 0 && (activities[tripDay] || []).length > 0 && (
          <div className="nd-mapview-carousel"
            onTouchStart={(e) => {
              if (springRef.current) cancelAnimationFrame(springRef.current);
              swipeRef.current = { startX: e.touches[0].clientX, currentX: e.touches[0].clientX, dragging: true };
            }}
            onTouchMove={(e) => {
              if (!swipeRef.current.dragging) return;
              swipeRef.current.currentX = e.touches[0].clientX;
              const dx = swipeRef.current.currentX - swipeRef.current.startX;
              const wrap = trackRef.current?.querySelector(".nd-mapview-card-wrap");
              const base = -selectedActIdx * (wrap?.offsetWidth || 375);
              if (trackRef.current) trackRef.current.style.transform = `translateX(${base + dx}px)`;
            }}
            onTouchEnd={() => {
              if (!swipeRef.current.dragging) return;
              const dx = swipeRef.current.currentX - swipeRef.current.startX;
              swipeRef.current.dragging = false;
              const acts = activities[tripDay] || [];
              let next = selectedActIdx;
              if (dx < -50 && selectedActIdx < acts.length - 1) next = selectedActIdx + 1;
              else if (dx > 50 && selectedActIdx > 0) next = selectedActIdx - 1;
              if (next !== selectedActIdx) { setSelectedActIdx(next); }
              else {
                const wrap = trackRef.current?.querySelector(".nd-mapview-card-wrap");
                const target = -selectedActIdx * (wrap?.offsetWidth || 375);
                const cur = parseFloat(trackRef.current?.style.transform?.match(/-?\d+\.?\d*/)?.[0] || 0);
                springTo(target, cur, (v) => { if (trackRef.current) trackRef.current.style.transform = `translateX(${v}px)`; });
              }
            }}
            onMouseDown={(e) => {
              if (springRef.current) cancelAnimationFrame(springRef.current);
              swipeRef.current = { startX: e.clientX, currentX: e.clientX, dragging: true };
            }}
            onMouseMove={(e) => {
              if (!swipeRef.current.dragging) return;
              swipeRef.current.currentX = e.clientX;
              const dx = swipeRef.current.currentX - swipeRef.current.startX;
              const wrap = trackRef.current?.querySelector(".nd-mapview-card-wrap");
              const base = -selectedActIdx * (wrap?.offsetWidth || 375);
              if (trackRef.current) trackRef.current.style.transform = `translateX(${base + dx}px)`;
            }}
            onMouseUp={() => {
              if (!swipeRef.current.dragging) return;
              const dx = swipeRef.current.currentX - swipeRef.current.startX;
              swipeRef.current.dragging = false;
              const acts = activities[tripDay] || [];
              let next = selectedActIdx;
              if (dx < -50 && selectedActIdx < acts.length - 1) next = selectedActIdx + 1;
              else if (dx > 50 && selectedActIdx > 0) next = selectedActIdx - 1;
              if (next !== selectedActIdx) { setSelectedActIdx(next); }
              else {
                const wrap = trackRef.current?.querySelector(".nd-mapview-card-wrap");
                const target = -selectedActIdx * (wrap?.offsetWidth || 375);
                const cur = parseFloat(trackRef.current?.style.transform?.match(/-?\d+\.?\d*/)?.[0] || 0);
                springTo(target, cur, (v) => { if (trackRef.current) trackRef.current.style.transform = `translateX(${v}px)`; });
              }
            }}
            onMouseLeave={() => {
              if (!swipeRef.current.dragging) return;
              swipeRef.current.dragging = false;
              const wrap = trackRef.current?.querySelector(".nd-mapview-card-wrap");
              const target = -selectedActIdx * (wrap?.offsetWidth || 375);
              const cur = parseFloat(trackRef.current?.style.transform?.match(/-?\d+\.?\d*/)?.[0] || 0);
              springTo(target, cur, (v) => { if (trackRef.current) trackRef.current.style.transform = `translateX(${v}px)`; });
            }}
          >
            <div className="nd-mapview-carousel-track" ref={trackRef}>
              {(activities[tripDay] || []).map((act, i) => (
                <div className="nd-mapview-card-wrap" key={i}>
                  <div className="nd-mapview-card">
                    <div className="nd-mapview-card-glow" />
                    <div className="nd-mapview-card-header">
                      <div className="nd-mapview-card-left">
                        <div className="nd-mapview-card-icon">
                          <span className="nd-mapview-card-emoji">{SPOT_EMOJIS[i % SPOT_EMOJIS.length]}</span>
                        </div>
                        <div className="nd-mapview-card-info">
                          <p className="nd-mapview-card-name">{act.name}</p>
                          <p className="nd-mapview-card-time">{act.time}</p>
                        </div>
                      </div>
                      <div className="nd-mapview-card-right">
                        <p className="nd-mapview-card-cat-label">Day</p>
                        <p className="nd-mapview-card-cat-val">{tripDay}</p>
                        <button className="nd-mapview-card-rm"
                          onClick={e => { e.stopPropagation(); removeSpot(tripDay, i); }}>×</button>
                      </div>
                    </div>
                    {act.address && (
                      <p className="nd-mapview-card-desc">{act.address}</p>
                    )}
                    <div className="nd-mapview-card-actions">
                      <button className="nd-mapview-btn-glass"
                        onClick={() => {
                          const q = encodeURIComponent(act.name + (act.address ? `, ${act.address}` : ""));
                          window.open(`https://www.google.com/maps/search/?api=1&query=${q}`, "_blank");
                        }}>Details</button>
                      <button className="nd-mapview-btn-solid"
                        onClick={() => { mapExitTime.current = Date.now(); setMapMode(false); }}>
                        {act.isTicketed
                          ? "Tickets"
                          : act.openNow === true  ? "Open Now"
                          : act.openNow === false ? "Closed"
                          : "View Plan"}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Day tabs bar — matches NearbyPage nd-mapview-daybar exactly */}
        <div className="nd-mapview-daybar" onClick={e => e.stopPropagation()} onTouchStart={e => e.stopPropagation()} onTouchEnd={e => e.stopPropagation()}>
          <button
            className={`nd-mapview-daytab${tripDay === 0 ? " nd-mapview-daytab--total-active" : " nd-mapview-daytab--total"}`}
            onClick={e => { e.stopPropagation(); setTripDay(0); }}
            onTouchEnd={e => { e.stopPropagation(); e.preventDefault(); setTripDay(0); }}>
            Total
          </button>
          {Array.from({ length: numDays }, (_, i) => i + 1).map((d) => (
            <button key={d}
              className={`nd-mapview-daytab${tripDay === d ? " nd-mapview-daytab--active" : ""}`}
              onClick={e => { e.stopPropagation(); setTripDay(d); }}
              onTouchEnd={e => { e.stopPropagation(); e.preventDefault(); setTripDay(d); }}>
              <span className="nd-mapview-daytab-num">{d}</span>
              <span className="nd-mapview-daytab-label">DAY</span>
            </button>
          ))}
        </div>
      </>}

      {/* Bottom nav — hidden in map mode (same as NearbyPage) */}
      {!mapMode && (
        <nav className="hp-nav nearby-nav">
          <div className="hp-nav-pill">
            {NAV_ITEMS.map((item, i) =>
              item.center ? (
                <div key="center" className="hp-nav-center-wrap">
                  <Link href="/planner" className="hp-nav-center-btn">
                    <FontAwesomeIcon icon={faPlus} style={{ width: 18, height: 18, color: "white" }} />
                  </Link>
                </div>
              ) : (
                <Link key={i} href={item.href} className={`hp-nav-item${pathname === item.href ? " hp-nav-active" : ""}`}>
                  <FontAwesomeIcon icon={item.icon} className="hp-nav-icon" style={{ width: 20, height: 20 }} />
                  <span className="hp-nav-label">{item.label}</span>
                </Link>
              )
            )}
          </div>
        </nav>
      )}

      {/* Trip panel overlay — identical to NearbyPage */}
      <div
        className={`nd-trip-overlay${mapMode ? " nd-trip-overlay--out" : ""}`}
        onClick={() => { if (mapMode || Date.now() - mapExitTime.current < 800) return; setMapMode(true); }}
        onTouchEnd={(e) => { if (mapMode) { e.stopPropagation(); return; } }}
      >
        <div className="nd-trip-panel" onClick={e => e.stopPropagation()}>
          {/* Drag handle */}
          <div className="nd-trip-handle-row"
            onTouchStart={onPanelDragStart} onTouchEnd={onPanelDragEnd}
            onMouseDown={onPanelDragStart} onMouseUp={onPanelDragEnd}
            onClick={() => setMapMode(true)}>
            <div className="nd-trip-handle" />
          </div>

          {/* ── Trip title + info header ── */}
          <div className="mp-trip-header">
            <div className="mp-trip-header-left">
              <span className="mp-trip-flag">{CITY_FLAGS[destination] || "✈️"}</span>
              <div className="mp-trip-header-text">
                <h2 className="mp-trip-title">{makeTripTitle(destination, prefs)}</h2>
                <div className="mp-trip-meta">
                  {duration && <span className="mp-trip-badge">{duration}</span>}
                  {paramCity && paramCity.includes(",") && (
                    <span className="mp-trip-badge mp-trip-badge--dim">
                      {paramCity.split(",").slice(1).join(",").trim()}
                    </span>
                  )}
                  <span className="mp-trip-badge mp-trip-badge--dim">
                    {Object.values(activities).flat().length} stops
                  </span>
                </div>
              </div>
            </div>
            {/* ── Collaborator avatars + invite ── */}
            <div className="mp-collab-row">
              {collaborators.map((c, i) => (
                <div key={i} className="mp-collab-avatar"
                  style={{ background: c.color }}>
                  {c.initials}
                </div>
              ))}
              <button className="mp-collab-add" onClick={() => setInviteOpen(true)}>+</button>
            </div>
          </div>

          {/* Day selector */}
          <div className="nd-trip-day-scroll">
            <button className={`nd-trip-day-tab nd-trip-day-text${tripDay === 0 ? " nd-trip-day-text-active" : ""}`} onClick={() => setTripDay(0)}>
              <span className="nd-trip-day-num">Total</span>
            </button>
            {Array.from({ length: numDays }, (_, i) => i + 1).map((d) => (
              <button key={d} className={`nd-trip-day-tab${tripDay === d ? " nd-trip-day-active" : " nd-trip-day-inactive"}`} onClick={() => setTripDay(d)}>
                <span className="nd-trip-day-num">{d}</span>
                <span className="nd-trip-day-label">DAY</span>
              </button>
            ))}
          </div>

          {/* Overview / Details toggle */}
          <div className="nd-trip-toggle-row">
            <button className={`nd-trip-toggle-btn${tripTab === "overview" ? " nd-trip-toggle-active" : ""}`} onClick={() => setTripTab("overview")}>🗺️ Overview</button>
            <button className={`nd-trip-toggle-btn${tripTab === "details" ? " nd-trip-toggle-active" : ""}`} onClick={() => setTripTab("details")}>📝 Details</button>
          </div>

          {/* Content body */}
          <div className="nd-trip-body"
            onTouchStart={onPanelDragStart}
            onTouchEnd={(e) => {
              if (dragY.current === null) return;
              const endY = e.changedTouches?.[0]?.clientY ?? e.clientY;
              const delta = endY - dragY.current;
              if (delta > 72 && e.currentTarget.scrollTop === 0) { mapExitTime.current = Date.now(); setMapMode(true); }
              dragY.current = null;
            }}>

            {tripTab === "overview" ? (
              <>
                {tripDay === 0 ? (
                  <>
                    <div className="nd-trip-section-head" style={{ marginBottom: 16 }}>
                      <span className="nd-trip-section-icon">🗺️</span>
                      <span className="nd-trip-section-title">Trip Overview</span>
                    </div>
                    {Object.keys(activities).map(Number).sort((a, b) => a - b).map((dayNum) => (
                      <div key={dayNum} className="nd-trip-day-group">
                        <div className="nd-trip-day-header">
                          <div className="nd-trip-day-badge">{dayNum}</div>
                          <span className="nd-trip-day-title">DAY {dayNum}</span>
                        </div>
                        <div className="nd-trip-overview-list">
                          {(activities[dayNum] || []).map((act, idx) => (
                            <div key={idx} className="nd-trip-overview-row">
                              <div className="nd-trip-overview-info">
                                <span className="nd-trip-overview-name">{act.name}</span>
                                <span className="nd-trip-overview-time">{act.time}</span>
                              </div>
                              <button className="mp-spot-remove" onClick={e => { e.stopPropagation(); removeSpot(dayNum, idx); }}>×</button>
                            </div>
                          ))}
                          {/* Add spot — styled as a dashed overview-row */}
                          <button className="mp-add-spot" onClick={e => { e.stopPropagation(); addSpot(dayNum); }}>
                            <div className="nd-trip-overview-info">
                              <span className="nd-trip-overview-name" style={{ opacity: 0.35, fontWeight: 600, fontSize: 15 }}>Add a spot</span>
                              <span className="nd-trip-overview-time" style={{ opacity: 0.22 }}>Tap to add</span>
                            </div>
                            <span style={{ fontSize: 22, color: "rgba(255,255,255,0.28)", fontWeight: 300, lineHeight: 1 }}>+</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </>
                ) : (
                  <div className="nd-trip-day-group">
                    <div className="nd-trip-day-subheader">
                      <span className="nd-trip-day-subheader-icon">📅</span>
                      <span className="nd-trip-day-subheader-text">
                        Day {tripDay} · {(activities[tripDay] || []).length} Stops
                      </span>
                    </div>
                    <div className="nd-trip-day-header">
                      <div className="nd-trip-day-badge">{tripDay}</div>
                      <span className="nd-trip-day-title">DAY {tripDay}</span>
                    </div>
                    <div className="nd-trip-activities">
                      {(activities[tripDay] || []).map((act, idx) => (
                        <div key={idx}>
                          <div className="nd-trip-rich-card">
                            {/* Gradient photo placeholder */}
                            <div className="mp-spot-photo" style={{ background: SPOT_GRADIENTS[idx % SPOT_GRADIENTS.length] }}>
                              {SPOT_EMOJIS[idx % SPOT_EMOJIS.length]}
                            </div>
                            <div className="nd-trip-rich-content">
                              <p className="nd-trip-rich-title">{idx + 1} · {act.name}</p>
                              <p className="nd-trip-rich-category">{act.category}</p>
                              <p className="nd-trip-rich-meta"><span className="nd-trip-rich-emoji">⏰</span> {act.time} · <span className="nd-trip-rich-emoji">♡</span> Save</p>
                            </div>
                            <button className="mp-spot-remove" onClick={e => { e.stopPropagation(); removeSpot(tripDay, idx); }}>×</button>
                          </div>
                        </div>
                      ))}
                      {/* Add spot as a rich-card-style button */}
                      <button className="mp-add-rich" onClick={e => { e.stopPropagation(); addSpot(tripDay); }}>
                        <div className="mp-spot-photo" style={{ background: "rgba(255,255,255,0.06)", fontSize: 26 }}>+</div>
                        <div className="nd-trip-rich-content">
                          <p className="nd-trip-rich-title" style={{ opacity: 0.4, fontWeight: 600 }}>Add a spot</p>
                          <p className="nd-trip-rich-category" style={{ opacity: 0.25 }}>Tap to add to Day {tripDay}</p>
                        </div>
                      </button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              /* ── Details tab ── */
              <>
                <div className="nd-trip-section-head">
                  <span className="nd-trip-section-icon">📝</span>
                  <span className="nd-trip-section-title">Trip Details</span>
                </div>
                <div className="nd-trip-details-grid">
                  <button className="nd-trip-detail-card nd-trip-detail-card-btn" onClick={() => router.push("/notes")}>
                    <p className="nd-trip-detail-card-title">Notes</p>
                    <p className="nd-trip-detail-card-sub">Record your travel ideas</p>
                  </button>
                  <button className="nd-trip-detail-card nd-trip-detail-card-btn" onClick={() => router.push("/packing")}>
                    <p className="nd-trip-detail-card-title">Packing List</p>
                    <p className="nd-trip-detail-card-sub">Plan what to bring</p>
                  </button>
                </div>
                <div className="nd-trip-collections">
                  <div className="nd-trip-section-head" style={{ marginBottom: 12 }}>
                    <span className="nd-trip-section-icon">📸</span>
                    <span className="nd-trip-section-title">Collections</span>
                  </div>
                  <p className="nd-trip-coll-count">My Collections · 0</p>
                  <div className="nd-trip-coll-grid">
                    <div className="nd-trip-coll-add">+</div>
                  </div>
                </div>
                {/* ── Budget / Spending Tracker ── */}
                <div className="mp-budget-section">
                  <div className="nd-trip-section-head" style={{ marginBottom: 12 }}>
                    <span className="nd-trip-section-icon">💰</span>
                    <span className="nd-trip-section-title">Budget</span>
                  </div>

                  {/* Planned budget hint from planner page */}
                  {paramBudget && !budget && (
                    <div className="mp-budget-hint mp-budget-hint--static">
                      <span className="mp-budget-hint-icon">💡</span>
                      <span className="mp-budget-hint-text">
                        Your planned budget: <strong>{paramBudget}</strong>
                      </span>
                    </div>
                  )}

                  {/* Budget total row — tapping opens secondary page */}
                  <div className="mp-budget-total-row">
                    <button className="mp-budget-set-btn" onClick={() => { setBudgetInput(budget); setSetBudgetOpen(true); }}>
                      {budget ? (
                        <>
                          <span className="mp-budget-label">Budget</span>
                          <span className="mp-budget-amount">${parseFloat(budget).toLocaleString()}</span>
                          <span className="mp-budget-edit-hint">Edit</span>
                        </>
                      ) : (
                        <span className="mp-budget-placeholder">＋ Set total budget</span>
                      )}
                    </button>
                    <div className="mp-budget-spent-wrap">
                      <span className="mp-budget-spent-label">Spent</span>
                      <span className={`mp-budget-spent-val${budgetOver ? " mp-budget-over" : ""}`}>
                        ${totalSpent.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                      </span>
                    </div>
                  </div>

                  {/* Progress bar */}
                  {totalBudget > 0 && (
                    <div className="mp-budget-bar-wrap">
                      <div className="mp-budget-bar">
                        <div className={`mp-budget-bar-fill${budgetOver ? " mp-budget-bar-fill--over" : ""}`}
                          style={{ width: `${budgetPct}%` }} />
                      </div>
                      <span className={`mp-budget-remaining${budgetOver ? " mp-budget-over" : ""}`}>
                        {budgetOver
                          ? `$${(totalSpent - totalBudget).toLocaleString(undefined, {maximumFractionDigits:0})} over`
                          : `$${(totalBudget - totalSpent).toLocaleString(undefined, {maximumFractionDigits:0})} left`}
                      </span>
                    </div>
                  )}

                  {/* Category breakdown */}
                  {expenses.length > 0 && (
                    <div className="mp-budget-cats">
                      {BUDGET_CATS.map(cat => {
                        const total = expenses.filter(e => e.cat === cat.label)
                          .reduce((s, e) => s + (parseFloat(e.amount) || 0), 0);
                        if (!total) return null;
                        return (
                          <div key={cat.label} className="mp-budget-cat-row">
                            <span className="mp-budget-cat-icon">{cat.icon}</span>
                            <span className="mp-budget-cat-label">{cat.label}</span>
                            <span className="mp-budget-cat-amount">${total.toLocaleString(undefined, {maximumFractionDigits:0})}</span>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Expense list */}
                  {expenses.length > 0 && (
                    <div className="mp-expense-list">
                      {expenses.map((e, i) => (
                        <div key={i} className="mp-expense-row">
                          <span className="mp-expense-icon">{BUDGET_CATS.find(c => c.label === e.cat)?.icon || "💊"}</span>
                          <div className="mp-expense-info">
                            <span className="mp-expense-cat">{e.cat}</span>
                            {e.note && <span className="mp-expense-note">{e.note}</span>}
                          </div>
                          <span className="mp-expense-amount">${parseFloat(e.amount).toLocaleString(undefined, {maximumFractionDigits:0})}</span>
                          <button className="mp-expense-del" onClick={() => setExpenses(prev => prev.filter((_, j) => j !== i))}>×</button>
                        </div>
                      ))}
                    </div>
                  )}

                  <button className="mp-add-exp-btn" onClick={() => { setExpCat("Food"); setExpAmount(""); setExpNote(""); setAddExpOpen(true); }}>
                    ＋ Add expense
                  </button>
                </div>

                <div className="nd-trip-section-head" style={{ marginTop: 8 }}>
                  <span className="nd-trip-section-icon">☁️</span>
                  <span className="nd-trip-section-title">Weather · Next {WEATHER_MOCK.length} Days</span>
                </div>
                <div className="nd-trip-weather">
                  <p className="nd-trip-weather-city">{destination || "Destination"}</p>
                  <div className="nd-trip-weather-inner">
                    {WEATHER_MOCK.map((w, idx) => (
                      <div key={idx} className="nd-trip-weather-row">
                        <span className={`nd-trip-weather-date${idx === 0 ? " nd-trip-weather-date-today" : ""}`}>{w.date}</span>
                        <div className="nd-trip-weather-right">
                          <span className="nd-trip-weather-icon">{w.icon}</span>
                          <span className={`nd-trip-weather-desc${idx === 0 ? " nd-trip-weather-desc-today" : ""}`}>{w.desc}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
            <div style={{ height: 40 }} />
          </div>
        </div>
      </div>

      {/* ── Add Spot Search Sheet ── */}
      {addSheetDay !== null && (
        <div className="mp-sheet-overlay"
          style={{
            paddingBottom: kbOffset,
            "--mp-visible-h": kbOffset > 0
              ? `calc(100dvh - ${kbOffset}px - 60px)`
              : "92dvh",
          }}
          onClick={() => { setAddSheetDay(null); setDayPickerOpen(false); }}>
          <div className="mp-sheet" onClick={e => e.stopPropagation()}>
            {/* Handle + header row */}
            <div className="mp-sheet-handle-row"><div className="mp-sheet-handle" /></div>
            <div className="mp-sheet-header">
              <div className="mp-sheet-header-left">
                <span className="mp-sheet-title">Add to</span>
                {/* Day chip — tap to switch day */}
                <div style={{ position: "relative" }}>
                  <button className="mp-sheet-day-chip"
                    onClick={() => setDayPickerOpen(o => !o)}>
                    Day {addSheetDay}
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" style={{ marginLeft: 4 }}>
                      <path d="M2 3.5L5 6.5L8 3.5" stroke="#111" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                  {dayPickerOpen && (
                    <div className="mp-sheet-day-picker" onClick={e => e.stopPropagation()}>
                      {Array.from({ length: numDays }, (_, i) => i + 1).map(d => (
                        <button key={d}
                          className={`mp-sheet-day-option${d === addSheetDay ? " mp-sheet-day-option--active" : ""}`}
                          onClick={() => { setAddSheetDay(d); setDayPickerOpen(false); }}>
                          Day {d}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <button className="mp-sheet-close" onClick={() => setAddSheetDay(null)}>✕</button>
            </div>

            {/* Category action cards — horizontal scroll */}
            <div className="mp-sheet-cats">
              {[
                { icon: "🏨", label: "Hotel" },
                { icon: "✈️", label: "Transport" },
                { icon: "⭐", label: "Saved" },
                { icon: "🍽️", label: "Food" },
                { icon: "🎯", label: "Activity" },
                { icon: "🛍️", label: "Shopping" },
              ].map((cat) => (
                <button key={cat.label}
                  className={`mp-sheet-cat-card${activeCategory === cat.label ? " mp-sheet-cat-card--active" : ""}`}
                  onClick={() => selectCategory(cat)}>
                  <span className="mp-sheet-cat-icon">{cat.icon}</span>
                  <span className={`mp-sheet-cat-label${activeCategory === cat.label ? " mp-sheet-cat-label--active" : ""}`}>{cat.label}</span>
                </button>
              ))}
            </div>

            {/* Big search bar */}
            <div className="mp-sheet-search-bar">
              <button className="mp-sheet-search-btn">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <circle cx="11" cy="11" r="7" stroke="rgba(0,0,0,0.55)" strokeWidth="2.2"/>
                  <path d="M16.5 16.5L21 21" stroke="rgba(0,0,0,0.55)" strokeWidth="2.2" strokeLinecap="round"/>
                </svg>
              </button>
              <input
                ref={spotInputRef}
                className="mp-sheet-input"
                placeholder="Search places, landmarks, addresses…"
                value={spotSearch}
                onChange={e => handleSpotSearch(e.target.value)}
              />
              {spotSearch && (
                <button className="mp-sheet-input-clear"
                  onClick={() => { setSpotSearch(""); setSpotResults([]); spotInputRef.current?.focus(); }}>✕</button>
              )}
            </div>

            {/* Results list */}
            <div className="mp-sheet-results">
              {spotLoading && <div className="mp-sheet-loading">Searching…</div>}
              {!spotLoading && spotResults.length === 0 && spotSearch.length > 0 && (
                <div className="mp-sheet-loading">No results found</div>
              )}
              {!spotLoading && spotResults.length === 0 && !spotSearch && (
                <div className="mp-sheet-empty-hint">Search for a place to add to Day {addSheetDay}</div>
              )}
              {spotResults.map((pred, i) => (
                <div key={i} className="mp-sheet-result" onClick={() => selectSpot(pred)}>
                  <div className="mp-sheet-result-icon">📍</div>
                  <div className="mp-sheet-result-info">
                    <span className="mp-sheet-result-name">{pred.structured_formatting.main_text}</span>
                    <span className="mp-sheet-result-addr">{pred.structured_formatting.secondary_text}</span>
                  </div>
                  <button className="mp-sheet-result-add" onClick={e => { e.stopPropagation(); selectSpot(pred); }}>+</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Set Budget Secondary Page ── */}
      {setBudgetOpen && (() => {
        const PRESETS = [
          { label: "Budget",    icon: "🎒", amount: "500",   desc: "~$50–100/day" },
          { label: "Mid-Range", icon: "✈️", amount: "1500",  desc: "~$150–300/day" },
          { label: "Luxury",    icon: "💎", amount: "5000",  desc: "~$500–800/day" },
          { label: "Ultra",     icon: "👑", amount: "10000", desc: "Sky's the limit" },
        ];
        // Auto-detect which preset matches the planner's budget label
        const recommended = PRESETS.find(p =>
          paramBudget && paramBudget.toLowerCase().includes(p.label.toLowerCase())
        );
        const [showCustom, setShowCustom] = [
          budgetInput && !PRESETS.find(p => p.amount === budgetInput),
          (v) => { if (!v) setBudgetInput(""); }
        ];
        const isCustom = budgetInput && !PRESETS.find(p => p.amount === budgetInput);

        return (
          <div className="mp-exp-page">
            <div className="mp-exp-page-bar">
              <button className="mp-exp-page-back" onClick={() => setSetBudgetOpen(false)}>
                <FontAwesomeIcon icon={faChevronLeft} style={{ width: 10, height: 14 }} />
              </button>
              <span className="mp-exp-page-title">Set Budget</span>
              <button className="mp-exp-page-add"
                disabled={!budgetInput}
                style={{ opacity: budgetInput ? 1 : 0.4 }}
                onClick={() => { setBudget(budgetInput); setSetBudgetOpen(false); }}>Save</button>
            </div>

            {/* Subtitle */}
            <p className="mp-setbudget-sub">What's your total trip budget?</p>

            {/* Preset tiles — primary action */}
            <div className="mp-budget-presets">
              {PRESETS.map(p => {
                const isRec = recommended?.label === p.label;
                const isActive = budgetInput === p.amount;
                return (
                  <button key={p.label}
                    className={`mp-budget-preset-tile${isActive ? " mp-budget-preset-tile--active" : ""}`}
                    onClick={() => setBudgetInput(p.amount)}>
                    <div className="mp-budget-preset-top">
                      <span className="mp-budget-preset-icon">{p.icon}</span>
                      {isRec && <span className="mp-budget-preset-rec">Your plan</span>}
                    </div>
                    <span className="mp-budget-preset-label">{p.label}</span>
                    <span className="mp-budget-preset-amt">${parseInt(p.amount).toLocaleString()}</span>
                    <span className="mp-budget-preset-desc">{p.desc}</span>
                  </button>
                );
              })}
            </div>

            {/* Custom amount — secondary */}
            <div className="mp-setbudget-custom">
              <p className="mp-setbudget-custom-label">Custom amount</p>
              <div className={`mp-setbudget-custom-input${isCustom ? " mp-setbudget-custom-input--active" : ""}`}>
                <span className="mp-exp-hero-currency" style={{ fontSize: 20, marginTop: 0 }}>$</span>
                <input type="number" placeholder="Enter amount"
                  value={isCustom ? budgetInput : ""}
                  onChange={e => setBudgetInput(e.target.value)}
                  className="mp-setbudget-input" />
              </div>
            </div>
          </div>
        );
      })()}

      {/* ── Invite / Collaborators Secondary Page ── */}
      {inviteOpen && (
        <div className="mp-exp-page">
          <div className="mp-exp-page-bar">
            <button className="mp-exp-page-back" onClick={() => { setInviteOpen(false); setInviteCopied(false); }}>
              <FontAwesomeIcon icon={faChevronLeft} style={{ width: 10, height: 14 }} />
            </button>
            <span className="mp-exp-page-title">Collaborators</span>
            <span style={{ width: 52 }} />
          </div>

          {/* Plan info card */}
          <div className="mp-invite-plan-card">
            <span className="mp-invite-plan-flag">{CITY_FLAGS[destination] || "✈️"}</span>
            <div>
              <p className="mp-invite-plan-name">{makeTripTitle(destination, prefs)}</p>
              <p className="mp-invite-plan-meta">
                {duration && `${duration}`}{destination && ` · ${destination}`}
              </p>
            </div>
          </div>

          {/* Members */}
          <p className="mp-exp-section-label">Editing together</p>
          <div className="mp-invite-member-list">
            {collaborators.map((c, i) => (
              <div key={i} className="mp-invite-member-row">
                <div className="mp-invite-member-avatar" style={{ background: c.color }}>
                  {c.initials}
                </div>
                <div className="mp-invite-member-info">
                  <span className="mp-invite-member-name">
                    {i === 0 ? "You (owner)" : c.initials}
                  </span>
                </div>
                {i === 0 && <span className="mp-invite-member-badge">Owner</span>}
              </div>
            ))}
          </div>

          {/* Invite link */}
          <p className="mp-exp-section-label">Invite link</p>
          <div className="mp-invite-link-box">
            <span className="mp-invite-link-text">campusnest.app/plan/join/abc123</span>
            <button className="mp-invite-copy-btn" onClick={() => {
              navigator.clipboard?.writeText("https://campusnest.app/plan/join/abc123").catch(() => {});
              setInviteCopied(true);
              setTimeout(() => setInviteCopied(false), 2200);
            }}>
              {inviteCopied ? "✓ Copied" : "Copy"}
            </button>
          </div>

          {/* Share button */}
          <div className="mp-invite-actions">
            <button className="mp-invite-action-btn" onClick={() => {
              navigator.share?.({
                title: makeTripTitle(destination, prefs),
                text: `Join my trip plan on Campus Nest!`,
                url: "https://campusnest.app/plan/join/abc123",
              }).catch(() => {});
            }}>
              <FontAwesomeIcon icon={faShareNodes} style={{ width: 15, height: 15 }} />
              Share invite
            </button>
          </div>
        </div>
      )}

      {/* ── Add Expense Secondary Page ── */}
      {addExpOpen && (
        <div className="mp-exp-page">
          {/* Top bar */}
          <div className="mp-exp-page-bar">
            <button className="mp-exp-page-back" onClick={() => setAddExpOpen(false)}>
              <FontAwesomeIcon icon={faChevronLeft} style={{ width: 10, height: 14 }} />
            </button>
            <span className="mp-exp-page-title">Add Expense</span>
            <button className="mp-exp-page-add" onClick={addExpense}>Add</button>
          </div>

          {/* Amount hero */}
          <div className="mp-exp-amount-hero">
            <span className="mp-exp-hero-currency">$</span>
            <input className="mp-exp-hero-input" type="number" placeholder="0"
              value={expAmount} autoFocus
              onChange={e => setExpAmount(e.target.value)} />
          </div>

          {/* Category selector grid */}
          <p className="mp-exp-section-label">Category</p>
          <div className="mp-exp-cat-grid">
            {BUDGET_CATS.map(cat => (
              <button key={cat.label}
                className={`mp-exp-cat-tile${expCat === cat.label ? " mp-exp-cat-tile--active" : ""}`}
                onClick={() => setExpCat(cat.label)}>
                <span className="mp-exp-cat-tile-icon">{cat.icon}</span>
                <span className="mp-exp-cat-tile-label">{cat.label}</span>
              </button>
            ))}
          </div>

          {/* Note input */}
          <p className="mp-exp-section-label">Note</p>
          <div className="mp-exp-note-wrap">
            <input className="mp-exp-note-input" type="text"
              placeholder="What was this for?"
              value={expNote} onChange={e => setExpNote(e.target.value)} />
          </div>
        </div>
      )}
    </div>
  );
}

export default function ManualPlanPage() {
  return (
    <Suspense fallback={<div className="mp-plan-shell" />}>
      <ManualPlanInner />
    </Suspense>
  );
}
