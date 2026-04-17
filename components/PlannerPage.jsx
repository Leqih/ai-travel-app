"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import dynamic from "next/dynamic";
import { gsap } from "gsap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faChevronLeft, faChevronRight, faChevronDown, faCreditCard, faHouse, faCompass, faPlane, faCircleUser, faPlus, faMagnifyingGlass, faCheck, faXmark } from "@fortawesome/free-solid-svg-icons";
const CircularGallery = dynamic(() => import("./CircularGallery"), { ssr: false });
const PixelBlast = dynamic(() => import("./PixelBlast"), { ssr: false });

const TRAVEL_TYPES = ["Vacation", "Adventure", "Relaxation", "Cultural", "Romantic", "Business", "Road Trip", "Backpacking"];

const CITY_OPTIONS = [
  { label: "Tokyo", emoji: "🗼", country: "Japan", code: "TYO", img: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=300&h=300&fit=crop", desc: "A neon-lit metropolis where ancient temples sit beside futuristic skyscrapers.", bestTime: "Mar – May, Oct – Nov", vibes: ["Foodie", "Tech", "Culture"] },
  { label: "Seoul", emoji: "🇰🇷", country: "South Korea", code: "SEL", img: "https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?w=300&h=300&fit=crop", desc: "K-culture capital blending cutting-edge fashion, street food, and royal palaces.", bestTime: "Apr – Jun, Sep – Nov", vibes: ["Trendy", "Nightlife", "Food"] },
  { label: "Bangkok", emoji: "🛕", country: "Thailand", code: "BKK", img: "https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=300&h=300&fit=crop", desc: "Sensory overload in the best way — ornate temples, bustling markets, street food paradise.", bestTime: "Nov – Mar", vibes: ["Street Food", "Temples", "Vibrant"] },
  { label: "Bali", emoji: "🌴", country: "Indonesia", code: "DPS", img: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=300&h=300&fit=crop", desc: "Island of gods with emerald rice terraces, surf breaks, and spiritual serenity.", bestTime: "Apr – Oct", vibes: ["Wellness", "Surf", "Nature"] },
  { label: "Paris", emoji: "🗼", country: "France", code: "CDG", img: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=300&h=300&fit=crop", desc: "The city of light, love, and croissants — romance in every cobblestone street.", bestTime: "Apr – Jun, Sep – Oct", vibes: ["Romance", "Art", "Cuisine"] },
  { label: "New York", emoji: "🗽", country: "United States", code: "JFK", img: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=300&h=300&fit=crop", desc: "The city that never sleeps — energy, diversity, and skylines that define ambition.", bestTime: "Apr – Jun, Sep – Nov", vibes: ["Urban", "Arts", "Energy"] },
  { label: "London", emoji: "🇬🇧", country: "United Kingdom", code: "LHR", img: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=300&h=300&fit=crop", desc: "Royal heritage meets indie music scenes — history on every corner, pubs on every street.", bestTime: "May – Sep", vibes: ["History", "Culture", "Music"] },
  { label: "Rome", emoji: "🏛️", country: "Italy", code: "FCO", img: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=300&h=300&fit=crop", desc: "An open-air museum where every fountain, ruin, and piazza tells a 2,000-year story.", bestTime: "Apr – Jun, Sep – Oct", vibes: ["History", "Food", "Art"] },
  { label: "Istanbul", emoji: "🕌", country: "Turkey", code: "IST", img: "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=300&h=300&fit=crop", desc: "Where Europe meets Asia — bazaars, minarets, and Bosphorus sunsets.", bestTime: "Apr – May, Sep – Nov", vibes: ["Bazaars", "Culture", "Views"] },
  { label: "Dubai", emoji: "🏙️", country: "UAE", code: "DXB", img: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=300&h=300&fit=crop", desc: "Superlatives made real — tallest towers, largest malls, boldest architecture.", bestTime: "Nov – Mar", vibes: ["Luxury", "Modern", "Desert"] },
  { label: "Sydney", emoji: "🦘", country: "Australia", code: "SYD", img: "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=300&h=300&fit=crop", desc: "Harbour city with iconic sails, golden beaches, and laid-back coastal living.", bestTime: "Sep – Nov, Mar – May", vibes: ["Beaches", "Outdoors", "Relaxed"] },
  { label: "Barcelona", emoji: "🇪🇸", country: "Spain", code: "BCN", img: "https://images.unsplash.com/photo-1583422409516-2895a77efded?w=300&h=300&fit=crop", desc: "Gaudí's dreamlike architecture, tapas culture, and endless Mediterranean sunshine.", bestTime: "May – Jun, Sep – Oct", vibes: ["Architecture", "Beach", "Nightlife"] },
  { label: "Kyoto", emoji: "⛩️", country: "Japan", code: "KIX", img: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=300&h=300&fit=crop", desc: "Japan's cultural soul — thousands of temples, geisha districts, and bamboo groves.", bestTime: "Mar – May, Oct – Nov", vibes: ["Zen", "Tradition", "Nature"] },
  { label: "Santorini", emoji: "🏝️", country: "Greece", code: "JTR", img: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=300&h=300&fit=crop", desc: "Whitewashed villages clinging to volcanic cliffs above the cobalt Aegean Sea.", bestTime: "May – Oct", vibes: ["Sunset", "Romance", "Island"] },
  { label: "Marrakech", emoji: "🇲🇦", country: "Morocco", code: "RAK", img: "https://images.unsplash.com/photo-1597212618440-806262de4f6b?w=300&h=300&fit=crop", desc: "A labyrinth of souks, spices, and riads where color assaults you beautifully.", bestTime: "Mar – May, Sep – Nov", vibes: ["Exotic", "Souks", "Craft"] },
  { label: "Singapore", emoji: "🇸🇬", country: "Singapore", code: "SIN", img: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=300&h=300&fit=crop", desc: "Futuristic garden city — sky parks, hawker centres, and hyper-efficient charm.", bestTime: "Feb – Apr", vibes: ["Modern", "Food", "Clean"] },
  { label: "Prague", emoji: "🏰", country: "Czech Republic", code: "PRG", img: "https://images.unsplash.com/photo-1519677100203-a0e668c92439?w=300&h=300&fit=crop", desc: "Fairy-tale Gothic spires, medieval squares, and Europe's finest craft beer.", bestTime: "Apr – May, Sep – Oct", vibes: ["Medieval", "Beer", "Budget"] },
  { label: "Lisbon", emoji: "🇵🇹", country: "Portugal", code: "LIS", img: "https://images.unsplash.com/photo-1585208798174-6cedd86e019a?w=300&h=300&fit=crop", desc: "Hilly, sun-drenched city with trams, fado music, and pastel de nata on every corner.", bestTime: "Mar – May, Sep – Oct", vibes: ["Charming", "Affordable", "Fado"] },
  { label: "Cape Town", emoji: "🇿🇦", country: "South Africa", code: "CPT", img: "https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=300&h=300&fit=crop", desc: "Table Mountain backdrop, world-class wine, and the meeting of two oceans.", bestTime: "Nov – Mar", vibes: ["Nature", "Wine", "Adventure"] },
  { label: "Havana", emoji: "🇨🇺", country: "Cuba", code: "HAV", img: "https://images.unsplash.com/photo-1500759285222-a95626b934cb?w=300&h=300&fit=crop", desc: "Frozen in time — vintage cars, salsa rhythms, and crumbling colonial grandeur.", bestTime: "Dec – Apr", vibes: ["Vintage", "Music", "Unique"] },
  { label: "Amsterdam", emoji: "🇳🇱", country: "Netherlands", code: "AMS", img: "https://images.unsplash.com/photo-1534351590666-13e3e96b5017?w=300&h=300&fit=crop", desc: "Canal rings, tulip fields, world-class museums, and the world's best cycling culture.", bestTime: "Apr – May, Sep – Oct", vibes: ["Canals", "Museums", "Bikes"] },
  { label: "Reykjavik", emoji: "🇮🇸", country: "Iceland", code: "KEF", img: "https://images.unsplash.com/photo-1504829857797-ddff29c27927?w=300&h=300&fit=crop", desc: "Gateway to fire and ice — auroras, geysers, hot springs, and midnight sun.", bestTime: "Jun – Aug, Dec – Feb", vibes: ["Aurora", "Nature", "Wild"] },
  { label: "Buenos Aires", emoji: "🇦🇷", country: "Argentina", code: "EZE", img: "https://images.unsplash.com/photo-1589909202802-8f4aadce1849?w=300&h=300&fit=crop", desc: "Paris of the South — tango, steak, bookshops, and passionate football culture.", bestTime: "Mar – May, Sep – Nov", vibes: ["Tango", "Steak", "Culture"] },
  { label: "Osaka", emoji: "🏯", country: "Japan", code: "ITM", img: "https://images.unsplash.com/photo-1590559899731-a382839e5549?w=300&h=300&fit=crop", desc: "Japan's kitchen — takoyaki, ramen, neon-lit streets, and unmatched street food.", bestTime: "Mar – May, Oct – Nov", vibes: ["Food", "Fun", "Nightlife"] },
  { label: "Vienna", emoji: "🎵", country: "Austria", code: "VIE", img: "https://images.unsplash.com/photo-1516550893923-42d28e5677af?w=300&h=300&fit=crop", desc: "Imperial grandeur, Mozart's birthplace, coffeehouses, and the world's best philharmonic.", bestTime: "Apr – May, Sep – Oct", vibes: ["Classical", "Coffee", "Imperial"] },
  { label: "Petra", emoji: "🏜️", country: "Jordan", code: "AMM", img: "https://images.unsplash.com/photo-1579606032821-4e6161c81571?w=300&h=300&fit=crop", desc: "The Rose City — ancient Nabataean tombs carved into rose-red sandstone cliffs.", bestTime: "Mar – May, Sep – Nov", vibes: ["Ancient", "Adventure", "Desert"] },
  { label: "Rio", emoji: "🇧🇷", country: "Brazil", code: "GIG", img: "https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=300&h=300&fit=crop", desc: "Carnival energy, Cristo Redentor, iconic beaches, and samba in the streets.", bestTime: "Dec – Mar", vibes: ["Carnival", "Beach", "Samba"] },
  { label: "Hanoi", emoji: "🇻🇳", country: "Vietnam", code: "HAN", img: "https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=300&h=300&fit=crop", desc: "Old Quarter chaos, pho for breakfast, French colonial charm, and lakes at dusk.", bestTime: "Oct – Apr", vibes: ["Street Food", "History", "Budget"] },
  { label: "Maldives", emoji: "🏝️", country: "Maldives", code: "MLE", img: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=300&h=300&fit=crop", desc: "Overwater bungalows, crystal lagoons, and the clearest water on the planet.", bestTime: "Nov – Apr", vibes: ["Luxury", "Diving", "Romance"] },
  { label: "Taipei", emoji: "🇹🇼", country: "Taiwan", code: "TPE", img: "https://images.unsplash.com/photo-1470004914212-05527e49370b?w=300&h=300&fit=crop", desc: "Night markets, bubble tea origins, friendly locals, and Taipei 101 piercing the clouds.", bestTime: "Oct – Dec, Mar – May", vibes: ["Night Market", "Foodie", "Modern"] },
];

const BUDGET_STEPS = [
  { label: "Budget", amount: "$50", sub: "/ day" },
  { label: "Mid-Range", amount: "$150", sub: "/ day" },
  { label: "Luxury", amount: "$500", sub: "/ day" },
  { label: "Ultra-Luxury", amount: "$2000", sub: "/ day" },
];

/* Interest icons matching Figma: dining, accommodation, culture, hiking, outdoors, museum, shopping, nightlife */
const INTEREST_OPTIONS = [
  { label: "Dining", icon: "dining" },
  { label: "Stay", icon: "stay" },
  { label: "Culture", icon: "culture" },
  { label: "Hiking", icon: "hiking" },
  { label: "Outdoors", icon: "outdoors" },
  { label: "Museum", icon: "museum" },
  { label: "Shopping", icon: "shopping" },
  { label: "Nightlife", icon: "nightlife" },
];

const INTEREST_CATEGORIES = ["Culture", "Adventure", "Relaxation", "Luxury"];

const DURATION_OPTIONS = [
  { label: "3 Days", days: 3 },
  { label: "5 Days", days: 5 },
  { label: "1 Week", days: 7 },
  { label: "10 Days", days: 10 },
  { label: "2 Weeks", days: 14 },
  { label: "3 Weeks", days: 21 },
  { label: "1 Month", days: 30 },
];

/* SVG icons for interest orbital */
function InterestIcon({ type, active }) {
  const color = active ? "#000" : "rgba(255,255,255,0.5)";
  const size = 20;
  const icons = {
    dining: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 002-2V2"/><path d="M7 2v20"/><path d="M21 15V2v0a5 5 0 00-5 5v6c0 1.1.9 2 2 2h3zm0 0v7"/>
      </svg>
    ),
    stay: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 21h18"/><path d="M5 21V7l8-4v18"/><path d="M19 21V11l-6-4"/><path d="M9 9h.01"/><path d="M9 12h.01"/><path d="M9 15h.01"/>
      </svg>
    ),
    culture: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 000 20 14.5 14.5 0 000-20"/><path d="M2 12h20"/>
      </svg>
    ),
    hiking: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M13 4v16"/><path d="M17 4v16"/><path d="M19 4H11a2 2 0 00-2 2v12a2 2 0 002 2h8"/><path d="M5 8l4 4-4 4"/>
      </svg>
    ),
    outdoors: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 22H7l-5-9 10-11 10 11-5 9z"/><path d="M12 2v20"/>
      </svg>
    ),
    museum: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 21h18"/><path d="M5 21V7l7-4 7 4v14"/><path d="M9 21v-4a3 3 0 016 0v4"/>
      </svg>
    ),
    shopping: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 01-8 0"/>
      </svg>
    ),
    nightlife: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3a6 6 0 019 9 9 9 0 11-9-9z"/>
      </svg>
    ),
  };
  return icons[type] || null;
}


/* ── Bottom Sheet wrapper ── */
function BottomSheet({ open, onClose, children }) {
  if (!open) return null;
  return (
    <div className="pl-sheet-overlay" onClick={onClose}>
      <div className="pl-sheet" onClick={(e) => e.stopPropagation()}>
        <div className="pl-sheet-handle" />
        {children}
      </div>
    </div>
  );
}

/* ── City selector — ReactBits Circular Gallery ── */
function CitySheet({ open, onClose, value, onSelect }) {
  const [selected, setSelected] = useState(value || CITY_OPTIONS[0]?.label);
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const [flipped, setFlipped] = useState(false);
  const inputRef = useRef(null);
  const tapRef = useRef(null);

  const isSearchMode = focused || query.trim().length > 0;

  const filtered = useMemo(() =>
    query.trim()
      ? CITY_OPTIONS.filter(c =>
          c.label.toLowerCase().includes(query.toLowerCase()) ||
          c.country.toLowerCase().includes(query.toLowerCase())
        )
      : CITY_OPTIONS,
    [query]
  );

  // Reset on open
  useEffect(() => {
    if (open) {
      setSelected(value || CITY_OPTIONS[0]?.label);
      setQuery("");
      setFocused(false);
      setFlipped(false);
    }
  }, [open, value]);

  const galleryItems = useMemo(() =>
    CITY_OPTIONS.map((c) => ({
      image: c.img.replace("w=300&h=300", "w=800&h=600"),
      text: c.label,
    })),
    []
  );

  // Pick a city from the list, collapse back to gallery
  const pickCity = (city) => {
    setSelected(city.label);
    setQuery("");
    setFocused(false);
    inputRef.current?.blur();
  };

  const clearSearch = () => {
    setQuery("");
    inputRef.current?.focus();
  };

  const canConfirm = !!selected;
  const selectedCity = CITY_OPTIONS.find(c => c.label === selected);
  const buttonLabel = selectedCity ? `${selectedCity.emoji}  ${selectedCity.label}, ${selectedCity.country}` : "Select a city";

  return (
    <BottomSheet open={open} onClose={onClose}>
      {/* Header */}
      <div className="pl-city-header">
        <h2 className="pl-city-title">
          {isSearchMode ? "Search Destinations" : "Explore Cities"}
        </h2>
      </div>

      {/* Search bar */}
      <div className="pl-city-search-wrap">
        <input
          ref={inputRef}
          className="pl-city-search"
          type="text"
          placeholder="Search city or country..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => { if (!query.trim()) setFocused(false); }}
          autoComplete="off"
        />
        {query.trim().length > 0 && (
          <button className="pl-city-search-clear" onClick={clearSearch} aria-label="Clear">
            <FontAwesomeIcon icon={faXmark} />
          </button>
        )}
      </div>

      {/* SEARCH MODE — flat list */}
      {isSearchMode ? (
        <div className="pl-city-list">
          {filtered.length > 0 ? filtered.map(city => (
            <button
              key={city.code}
              className={`pl-city-list-item${selected === city.label ? " pl-city-list-item--active" : ""}`}
              onClick={() => pickCity(city)}
            >
              <span className="pl-city-list-emoji">{city.emoji}</span>
              <div className="pl-city-list-info">
                <span className="pl-city-list-name">{city.label}</span>
                <span className="pl-city-list-country">{city.country}</span>
              </div>
              {selected === city.label && (
                <FontAwesomeIcon icon={faCheck} className="pl-city-list-check" />
              )}
            </button>
          )) : (
            <p className="pl-city-list-empty">No destinations found for "{query}"</p>
          )}
        </div>
      ) : (
        <div
          style={{ height: "320px", overflow: "hidden", position: "relative", width: "100%" }}
          onPointerDown={(e) => {
            if (flipped) return;
            tapRef.current = { x: e.clientX, y: e.clientY, t: Date.now() };
          }}
          onPointerUp={(e) => {
            if (flipped || !tapRef.current) return;
            const dx = Math.abs(e.clientX - tapRef.current.x);
            const dy = Math.abs(e.clientY - tapRef.current.y);
            const dt = Date.now() - tapRef.current.t;
            tapRef.current = null;
            if (dx < 8 && dy < 8 && dt < 300) setFlipped(true);
          }}
        >
          <div style={{ position: "absolute", top: "-130px", left: 0, right: 0, height: "480px" }}>
            <CircularGallery
              items={galleryItems}
              bend={1}
              textColor="#ffffff"
              borderRadius={0.05}
              scrollSpeed={2}
              scrollEase={0.05}
              showLabel={false}
              onSnap={(item) => { if (item) { setSelected(item.text); setFlipped(false); } }}
            />
          </div>
          {/* Gradient fade at bottom */}
          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "90px", background: "linear-gradient(to bottom, transparent, #111)", pointerEvents: "none", zIndex: 10 }} />
          {/* Detail — same position as WebGL card, scaleX flip so it feels like the card back */}
          {flipped && selectedCity && (
            <div className="pl-detail-card" onClick={() => setFlipped(false)}>
              <img src={selectedCity.img.replace("w=300&h=300", "w=800&h=600")} alt="" className="pl-detail-card-bg" />
              <div className="pl-detail-card-content">
                <div style={{ fontSize: 30, lineHeight: 1 }}>{selectedCity.emoji}</div>
                <div className="pl-detail-city-name">{selectedCity.label}</div>
                <div className="pl-detail-city-country">{selectedCity.country}</div>
                <div className="pl-detail-city-desc">{selectedCity.desc}</div>
                <div style={{ marginTop: "auto", paddingTop: 10 }}>
                  <div className="pl-detail-label">Best time to visit</div>
                  <div className="pl-detail-besttime">{selectedCity.bestTime}</div>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 8 }}>
                    {selectedCity.vibes.map(v => (
                      <span key={v} className="pl-detail-vibe">{v}</span>
                    ))}
                  </div>
                </div>
                <div className="pl-detail-hint">tap to go back</div>
              </div>
            </div>
          )}
        </div>
      )}

      <button
        className={`pl-sheet-cta${!canConfirm ? " pl-sheet-cta--disabled" : ""}`}
        disabled={!canConfirm}
        onClick={() => { if (canConfirm) { onSelect(selected); onClose(); } }}
      >
        {buttonLabel}
        <FontAwesomeIcon icon={faArrowRight} style={{ width: 16, height: 16, color: "black" }} />
      </button>
    </BottomSheet>
  );
}

/* ── Budget selector — spinnable dial ── */
/* 36 ticks, each tick = $100, range $0–$3,500 */
const MIN_BUDGET = 0;
const MAX_BUDGET = 3500;
const TICK_COUNT = 36;
const TICK_VALUE = 100; // each tick = $100

function budgetToAngle(budget) {
  const t = Math.max(0, Math.min(1, budget / MAX_BUDGET));
  return t * 270 - 135;
}

function angleToBudget(angle) {
  const t = (angle + 135) / 270;
  const clamped = Math.max(0, Math.min(1, t));
  const raw = clamped * MAX_BUDGET;
  // Snap to nearest $100 (one tick)
  return Math.round(raw / TICK_VALUE) * TICK_VALUE;
}

function getBudgetLabel(amount) {
  if (amount <= 100) return "Budget";
  if (amount <= 500) return "Mid-Range";
  if (amount <= 1500) return "Luxury";
  return "Ultra-Luxury";
}

function RangeSlider({ min, max, rangeMin, rangeMax, step, onChangeMin, onChangeMax }) {
  const trackRef = useRef(null);
  const draggingThumb = useRef(null); // "min" | "max" | null

  const pctMin = ((rangeMin - min) / (max - min)) * 100;
  const pctMax = ((rangeMax - min) / (max - min)) * 100;

  const getValueFromEvent = (e) => {
    if (!trackRef.current) return 0;
    const rect = trackRef.current.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const pct = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    const raw = min + pct * (max - min);
    return Math.round(raw / step) * step;
  };

  const handleStart = (thumb) => (e) => {
    e.preventDefault();
    e.stopPropagation();
    draggingThumb.current = thumb;
  };

  const handleTrackClick = (e) => {
    if (draggingThumb.current) return;
    const val = getValueFromEvent(e);
    const distMin = Math.abs(val - rangeMin);
    const distMax = Math.abs(val - rangeMax);
    if (distMin <= distMax) {
      onChangeMin(Math.min(val, rangeMax));
    } else {
      onChangeMax(Math.max(val, rangeMin));
    }
  };

  useEffect(() => {
    const onMove = (e) => {
      if (!draggingThumb.current) return;
      e.preventDefault();
      const val = getValueFromEvent(e);
      if (draggingThumb.current === "min") {
        onChangeMin(Math.min(val, rangeMax));
      } else {
        onChangeMax(Math.max(val, rangeMin));
      }
    };
    const onEnd = () => { draggingThumb.current = null; };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onEnd);
    window.addEventListener("touchmove", onMove, { passive: false });
    window.addEventListener("touchend", onEnd);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onEnd);
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("touchend", onEnd);
    };
  }, [rangeMin, rangeMax]);

  return (
    <div className="pl-rslider">
      {/* Track */}
      <div className="pl-rslider-track" ref={trackRef} onMouseDown={handleTrackClick} onTouchStart={handleTrackClick}>
        <div className="pl-rslider-fill" style={{ left: `${pctMin}%`, width: `${pctMax - pctMin}%` }} />
        {/* Min thumb */}
        <div
          className="pl-rslider-thumb pl-rslider-thumb-min"
          style={{ left: `${pctMin}%` }}
          onMouseDown={handleStart("min")}
          onTouchStart={handleStart("min")}
        >
          <div className="pl-rslider-thumb-glow" />
        </div>
        {/* Max thumb */}
        <div
          className="pl-rslider-thumb pl-rslider-thumb-max"
          style={{ left: `${pctMax}%` }}
          onMouseDown={handleStart("max")}
          onTouchStart={handleStart("max")}
        >
          <div className="pl-rslider-thumb-glow" />
        </div>
      </div>
      {/* Scale labels */}
      <div className="pl-rslider-labels">
        <span>${min.toLocaleString()}</span>
        <span>${max.toLocaleString()}</span>
      </div>
    </div>
  );
}

function BudgetSheet({ open, onClose, value, onSelect }) {
  const [mode, setMode] = useState("single"); // "single" | "range"
  const [amount, setAmount] = useState(MIN_BUDGET);
  const [rangeMin, setRangeMin] = useState(0);
  const [rangeMax, setRangeMax] = useState(3500);
  const [editing, setEditing] = useState(false);
  const [inputVal, setInputVal] = useState("");
  const inputRef = useRef(null);
  const dialRef = useRef(null);
  const dragging = useRef(false);
  const activePointer = useRef(null);

  useEffect(() => {
    if (open) {
      if (value && value.includes("–")) {
        setMode("range");
        const parts = value.replace(/[$,/day]/g, "").split("–").map(s => parseInt(s.trim(), 10));
        if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
          setRangeMin(parts[0]);
          setRangeMax(parts[1]);
        }
      } else if (value && value.startsWith("$")) {
        setMode("single");
        const num = parseInt(value.replace(/[$,/day]/g, ""), 10);
        setAmount(isNaN(num) ? 0 : num);
      } else {
        const map = { "Budget": 100, "Mid-Range": 500, "Luxury": 1500, "Ultra-Luxury": 3000 };
        setAmount(map[value] || 0);
      }
    }
  }, [open, value]);

  const rotation = budgetToAngle(amount);

  const getAngleFromEvent = (e, rect) => {
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    const dx = clientX - cx;
    const dy = clientY - cy;
    let angle = (Math.atan2(dy, dx) * 180) / Math.PI + 90;
    if (angle > 180) angle -= 360;
    return Math.max(-135, Math.min(135, angle));
  };

  const handleStart = (e) => {
    if (!dialRef.current) return;
    if (e.target.closest && e.target.closest('.pl-dial-inner')) return;
    dragging.current = true;
    const rect = dialRef.current.getBoundingClientRect();
    const angle = getAngleFromEvent(e, rect);
    activePointer.current = "single";
    setAmount(angleToBudget(angle));
  };

  const handleMove = (e) => {
    if (!dragging.current || !dialRef.current) return;
    e.preventDefault();
    const rect = dialRef.current.getBoundingClientRect();
    const angle = getAngleFromEvent(e, rect);
    setAmount(angleToBudget(angle));
  };

  const handleEnd = () => {
    dragging.current = false;
    activePointer.current = null;
  };

  useEffect(() => {
    if (!open || mode !== "single") return;
    const onMove = (e) => handleMove(e);
    const onEnd = () => handleEnd();
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onEnd);
    window.addEventListener("touchmove", onMove, { passive: false });
    window.addEventListener("touchend", onEnd);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onEnd);
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("touchend", onEnd);
    };
  }, [open, mode]);

  const label = mode === "single" ? getBudgetLabel(amount) : `${getBudgetLabel(rangeMin)} – ${getBudgetLabel(rangeMax)}`;

  return (
    <BottomSheet open={open} onClose={onClose}>
      <div className="pl-budget-header">
        <span className="pl-budget-icon-wrap">
          <FontAwesomeIcon icon={faCreditCard} style={{ width: 18, height: 14, color: "rgba(255,255,255,0.5)" }} />
        </span>
        <span className="pl-budget-title">Daily Budget</span>
        <div className="pl-budget-toggle">
          <button className={`pl-budget-toggle-btn ${mode === "single" ? "pl-budget-toggle-active" : ""}`} onClick={() => setMode("single")}>Single</button>
          <button className={`pl-budget-toggle-btn ${mode === "range" ? "pl-budget-toggle-active" : ""}`} onClick={() => setMode("range")}>Range</button>
        </div>
      </div>

      {mode === "single" ? (
        /* ── Single: Rotary Dial ── */
        <div className="pl-dial-wrap">
          <div
            className="pl-dial-outer"
            ref={dialRef}
            onMouseDown={handleStart}
            onTouchStart={handleStart}
            style={{ cursor: "grab", userSelect: "none", touchAction: "none" }}
          >
            {Array.from({ length: 36 }).map((_, i) => {
              const a = (i / 36) * 360;
              const isMajor = i % 5 === 0;
              return (
                <div
                  key={i}
                  className={`pl-dial-tick ${isMajor ? "pl-dial-tick-major" : ""}`}
                  style={{ transform: `rotate(${a}deg)` }}
                />
              );
            })}
            <div className="pl-dial-pointer" style={{ transform: `rotate(${rotation}deg)` }}>
              <div className="pl-dial-pointer-tri" />
            </div>
            <div
              className="pl-dial-inner"
              onClick={(e) => {
                e.stopPropagation();
                setEditing(true);
                setInputVal(String(amount));
                setTimeout(() => inputRef.current?.focus(), 50);
              }}
              style={{ cursor: "pointer" }}
            >
              <span className="pl-dial-unit">USD / DAY</span>
              {editing ? (
                <span className="pl-dial-amount">
                  <span className="pl-dial-dollar">$</span>
                  <input
                    ref={inputRef}
                    className="pl-dial-input"
                    type="number"
                    min="0"
                    max="3500"
                    step="100"
                    value={inputVal}
                    onChange={(e) => setInputVal(e.target.value)}
                    onBlur={() => {
                      const v = Math.max(0, Math.min(MAX_BUDGET, Math.round(Number(inputVal) / TICK_VALUE) * TICK_VALUE));
                      setAmount(isNaN(v) ? 0 : v);
                      setEditing(false);
                    }}
                    onKeyDown={(e) => { if (e.key === "Enter") e.target.blur(); }}
                    onClick={(e) => e.stopPropagation()}
                    onMouseDown={(e) => e.stopPropagation()}
                    onTouchStart={(e) => e.stopPropagation()}
                  />
                </span>
              ) : (
                <span className="pl-dial-amount">
                  <span className="pl-dial-dollar">$</span>
                  {amount.toLocaleString()}
                </span>
              )}
              <div className="pl-dial-dots">
                {BUDGET_STEPS.map((b, i) => (
                  <span key={i} className={`pl-dial-dot ${b.label === label ? "pl-dial-dot-active" : ""}`} />
                ))}
              </div>
            </div>
          </div>
          <div className="pl-dial-range">
            <span>MIN $0</span>
            <span>MAX $3,500</span>
          </div>
        </div>
      ) : (
        /* ── Range: Horizontal Slider ── */
        <div className="pl-range-section">
          <div className="pl-range-display">
            <span className="pl-range-display-label">USD / DAY</span>
            <span className="pl-range-display-value">
              <span className="pl-dial-dollar">$</span>{rangeMin.toLocaleString()}
              <span className="pl-range-display-sep"> – </span>
              <span className="pl-dial-dollar">$</span>{rangeMax.toLocaleString()}
            </span>
          </div>
          <RangeSlider
            min={MIN_BUDGET}
            max={MAX_BUDGET}
            step={TICK_VALUE}
            rangeMin={rangeMin}
            rangeMax={rangeMax}
            onChangeMin={setRangeMin}
            onChangeMax={setRangeMax}
          />
        </div>
      )}

      {mode === "single" ? (
        <div className="pl-budget-segments">
          {BUDGET_STEPS.map((b) => (
            <button
              key={b.label}
              className={`pl-budget-seg ${b.label === getBudgetLabel(amount) ? "pl-budget-seg-active" : ""}`}
              onClick={() => {
                const map = { "Budget": 100, "Mid-Range": 500, "Luxury": 1500, "Ultra-Luxury": 3000 };
                setAmount(map[b.label]);
              }}
            >
              {b.label}
            </button>
          ))}
        </div>
      ) : (
        <div className="pl-budget-range-presets">
          {[
            { label: "Budget", min: 0, max: 500 },
            { label: "Mid-Range", min: 500, max: 1500 },
            { label: "Luxury", min: 1500, max: 3000 },
            { label: "Flexible", min: 0, max: 3500 },
          ].map((p) => {
            // Highlight when range matches this preset (within $50 tolerance)
            const isActive = Math.abs(rangeMin - p.min) <= 50 && Math.abs(rangeMax - p.max) <= 50;
            return (
              <button
                key={p.label}
                className={`pl-budget-seg ${isActive ? "pl-budget-seg-active" : ""}`}
                onClick={() => { setRangeMin(p.min); setRangeMax(p.max); }}
              >
                {p.label}
              </button>
            );
          })}
        </div>
      )}

      <button
        className="pl-sheet-cta"
        onClick={() => {
          if (mode === "single") {
            onSelect(`$${amount.toLocaleString()}/day`);
          } else {
            onSelect(`$${rangeMin.toLocaleString()} – $${rangeMax.toLocaleString()}/day`);
          }
          onClose();
        }}
      >
        Set Budget
        <FontAwesomeIcon icon={faArrowRight} style={{ width: 16, height: 16, color: "black" }} />
      </button>
      <p className="pl-sheet-hint">{mode === "single" ? "Drag around the dial to adjust, or tap a preset below" : "Drag either pointer to set your budget range"}</p>
    </BottomSheet>
  );
}

/* ── Travel Style / Interests — orbital ring (Figma 624:11700) ── */
function StyleSheet({ open, onClose, value, onSelect }) {
  const [selected, setSelected] = useState(() => value ? [value] : []);

  useEffect(() => {
    if (open) setSelected(value ? [value] : []);
  }, [open, value]);

  const toggle = (label) => {
    setSelected((prev) =>
      prev.includes(label) ? prev.filter((l) => l !== label) : [...prev, label]
    );
  };

  const selectedCount = selected.length;

  return (
    <BottomSheet open={open} onClose={onClose}>
      <h2 className="pl-sheet-title">Select Interests</h2>
      <p className="pl-sheet-subtitle">Swipe to explore, tap to collect</p>

      <div className="pl-interest-orbit">
        <div className="pl-orbit-ring pl-orbit-ring-inner" />
        <div className="pl-orbit-ring pl-orbit-ring-outer" />
        {INTEREST_OPTIONS.map((item, i) => {
          const angle = (i / INTEREST_OPTIONS.length) * 360 - 90;
          const rad = (angle * Math.PI) / 180;
          const r = 120;
          const x = Math.cos(rad) * r;
          const y = Math.sin(rad) * r;
          const isActive = selected.includes(item.label);
          return (
            <button
              key={item.label}
              className={`pl-orbit-item ${isActive ? "pl-orbit-item-active" : ""}`}
              style={{ transform: `translate(${x}px, ${y}px)`, '--ox': `${x}px`, '--oy': `${y}px` }}
              onClick={() => toggle(item.label)}
            >
              <InterestIcon type={item.icon} active={isActive} />
              <span className="pl-orbit-item-label">{item.label}</span>
            </button>
          );
        })}
        <div className="pl-orbit-center">
          <span className="pl-orbit-center-label">SELECTED</span>
          <div className="pl-orbit-dots">
            {[0, 1, 2].map((i) => (
              <span key={i} className={`pl-orbit-dot ${i < selectedCount ? "pl-orbit-dot-active" : ""}`} />
            ))}
          </div>
        </div>
      </div>

      <button
        className="pl-sheet-cta"
        onClick={() => {
          if (selected.length > 0) {
            onSelect(selected.length === 1 ? selected[0] : `${selected.length} Interests`);
            onClose();
          }
        }}
      >
        Confirm Selection
        <FontAwesomeIcon icon={faArrowRight} style={{ width: 16, height: 16, color: "black" }} />
      </button>
    </BottomSheet>
  );
}

/* ── Duration selector ── */
function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}
function getFirstDayOfWeek(year, month) {
  return new Date(year, month, 1).getDay();
}
function formatDuration(startDate, endDate) {
  if (!startDate || !endDate) return null;
  const diff = Math.round((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
  if (diff <= 1) return "1 Day";
  if (diff < 7) return `${diff} Days`;
  if (diff === 7) return "1 Week";
  if (diff < 14) return `${diff} Days`;
  if (diff === 14) return "2 Weeks";
  if (diff < 21) return `${diff} Days`;
  if (diff === 21) return "3 Weeks";
  if (diff < 30) return `${diff} Days`;
  if (diff === 30) return "1 Month";
  return `${diff} Days`;
}
function dateDiffDays(a, b) {
  return Math.round((b - a) / (1000 * 60 * 60 * 24)) + 1;
}

const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const MONTH_NAMES = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"];

const DURATION_PRESETS = [
  { label: "Weekend", days: 2 },
  { label: "3 Days", days: 3 },
  { label: "5 Days", days: 5 },
  { label: "1 Week", days: 7 },
  { label: "10 Days", days: 10 },
  { label: "2 Weeks", days: 14 },
];

const TICK_SPACING = 36; // px per day
const MAX_DAYS = 30;

function DurationSheet({ open, onClose, value, onSelect }) {
  const currentDays = value ? parseInt(value) : null;
  const [days, setDays] = useState(currentDays || 3);

  const rulerRef = useRef(null);
  const dragStartX = useRef(null);
  const dragStartDays = useRef(null);

  useEffect(() => {
    if (open) setDays(currentDays || 3);
  }, [open]);

  const label = days === 1 ? "1 Day" : `${days} Days`;

  const onDragStart = (clientX) => {
    dragStartX.current = clientX;
    dragStartDays.current = days;
  };
  const onDragMove = (clientX) => {
    if (dragStartX.current === null) return;
    // drag right → more days
    const delta = Math.round((clientX - dragStartX.current) / TICK_SPACING);
    setDays(Math.min(MAX_DAYS, Math.max(1, dragStartDays.current + delta)));
  };
  const onDragEnd = () => { dragStartX.current = null; };

  // Ruler: padding of 12 ticks on each side so edges can reach center
  const PAD = 12;
  // offset = distance from strip start to selected tick = PAD + (days-1)
  const rulerOffset = (PAD + days - 1) * TICK_SPACING;

  return (
    <BottomSheet open={open} onClose={onClose}>
      <h2 className="pl-sheet-title">Trip Duration</h2>

      {/* Value display */}
      <div style={{ textAlign: "center", margin: "16px 0 20px" }}>
        <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 1.5, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", marginBottom: 6 }}>Days</div>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "center", gap: 6 }}>
          <span style={{ fontSize: 48, fontWeight: 800, letterSpacing: -3, lineHeight: 1, color: "#fff", fontFamily: `-apple-system,"SF Pro Display","Helvetica Neue",sans-serif` }}>{days}</span>
          <span style={{ fontSize: 18, fontWeight: 600, color: "rgba(255,255,255,0.3)", letterSpacing: -0.3 }}>{days === 1 ? "day" : "days"}</span>
        </div>
      </div>

      {/* Horizontal ruler */}
      <div style={{ position: "relative", margin: "0 -28px 24px", alignSelf: "stretch", overflow: "hidden" }}>

        {/* Draggable ruler track */}
        <div
          ref={rulerRef}
          onMouseDown={e => onDragStart(e.clientX)}
          onMouseMove={e => e.buttons === 1 && onDragMove(e.clientX)}
          onMouseUp={onDragEnd}
          onTouchStart={e => onDragStart(e.touches[0].clientX)}
          onTouchMove={e => { e.preventDefault(); onDragMove(e.touches[0].clientX); }}
          onTouchEnd={onDragEnd}
          style={{
            touchAction: "none", userSelect: "none", cursor: "ew-resize",
            height: 120, position: "relative", overflow: "hidden",
            background: "rgba(255,255,255,0.02)",
            borderTop: "1px solid rgba(255,255,255,0.07)",
            borderBottom: "1px solid rgba(255,255,255,0.07)",
          }}
        >
          {/* Left fade */}
          <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 72, background: "linear-gradient(90deg, rgba(14,14,18,1) 0%, rgba(14,14,18,0) 100%)", zIndex: 2, pointerEvents: "none" }} />
          {/* Right fade */}
          <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: 72, background: "linear-gradient(270deg, rgba(14,14,18,1) 0%, rgba(14,14,18,0) 100%)", zIndex: 2, pointerEvents: "none" }} />

          {/* Center pointer triangle (pointing down from top) */}
          <div style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", zIndex: 3, pointerEvents: "none" }}>
            <div style={{ width: 0, height: 0, borderLeft: "8px solid transparent", borderRight: "8px solid transparent", borderTop: "12px solid #ff8c42" }} />
          </div>
          {/* Center glow line */}
          <div style={{
            position: "absolute", top: 12, bottom: 18, left: "50%", transform: "translateX(-50%)",
            width: 2, borderRadius: 1,
            background: "linear-gradient(180deg, rgba(255,140,66,0.5) 0%, rgba(255,140,66,0) 100%)",
            zIndex: 1, pointerEvents: "none",
          }} />

          {/* Sliding tick strip */}
          <div style={{
            position: "absolute",
            top: 0, bottom: 0,
            left: `calc(50% - ${rulerOffset}px)`,
            display: "flex",
          }}>
            {/* padding ticks on left */}
            {Array.from({ length: PAD }).map((_, i) => (
              <div key={`pl${i}`} style={{ width: TICK_SPACING, flexShrink: 0 }} />
            ))}
            {Array.from({ length: MAX_DAYS }).map((_, i) => {
              const d = i + 1;
              const isMajor = d % 5 === 0;
              const isSel = d === days;
              const tickH = isSel ? 64 : isMajor ? 40 : 20;
              const tickW = isSel ? 3 : isMajor ? 2 : 1.5;
              return (
                <div key={d} onClick={() => setDays(d)} style={{
                  width: TICK_SPACING, flexShrink: 0,
                  display: "flex", flexDirection: "column", alignItems: "center",
                  justifyContent: "flex-end", paddingBottom: 18,
                  cursor: "pointer", height: "100%",
                }}>
                  <div style={{
                    width: tickW,
                    height: tickH,
                    borderRadius: 2,
                    background: isSel
                      ? "linear-gradient(180deg, #ff8c42 0%, #ff5f1f 100%)"
                      : isMajor
                      ? "rgba(255,255,255,0.45)"
                      : "rgba(255,255,255,0.15)",
                    boxShadow: isSel ? "0 2px 12px rgba(255,140,66,0.6)" : "none",
                    transition: "height 0.15s cubic-bezier(0.34,1.56,0.64,1), width 0.15s, background 0.15s",
                    flexShrink: 0,
                  }} />
                  {(isMajor || d === 1) && (
                    <span style={{
                      fontSize: 10, fontWeight: 700, lineHeight: 1, marginTop: 6,
                      color: isSel ? "#ff9a52" : "rgba(255,255,255,0.25)",
                      transition: "color 0.15s",
                      letterSpacing: 0.2,
                    }}>{d}</span>
                  )}
                </div>
              );
            })}
            {/* padding ticks on right */}
            {Array.from({ length: PAD }).map((_, i) => (
              <div key={`pr${i}`} style={{ width: TICK_SPACING, flexShrink: 0 }} />
            ))}
          </div>
        </div>

        {/* Drag hint */}
        <div style={{ textAlign: "center", marginTop: 8, fontSize: 10, color: "rgba(255,255,255,0.2)", fontWeight: 600, letterSpacing: 0.8, textTransform: "uppercase" }}>
          ← swipe to adjust →
        </div>
      </div>

      {/* Preset chips */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 24, justifyContent: "center" }}>
        {DURATION_PRESETS.map(p => {
          const isSel = days === p.days;
          return (
            <button key={p.days} onClick={() => setDays(p.days)} style={{
              padding: "8px 16px", borderRadius: 20,
              border: isSel ? "1.5px solid rgba(255,140,66,0.5)" : "1.5px solid rgba(255,255,255,0.1)",
              background: isSel ? "rgba(255,140,66,0.12)" : "rgba(255,255,255,0.05)",
              color: isSel ? "#ff9a52" : "rgba(255,255,255,0.55)",
              fontSize: 13, fontWeight: isSel ? 700 : 500,
              cursor: "pointer", transition: "all 0.15s",
            }}>{p.label}</button>
          );
        })}
      </div>

      <button
        className="pl-sheet-cta"
        onClick={() => { onSelect(label); onClose(); }}
      >
        Set {label}
        <FontAwesomeIcon icon={faArrowRight} style={{ width: 16, height: 16, color: "black" }} />
      </button>
    </BottomSheet>
  );
}


export function PlannerPage() {
  const router = useRouter();
  const pathname = usePathname();
  const [travelType, setTravelType] = useState(0);
  const [travelOpen, setTravelOpen] = useState(false);
  const dropdownRef = useRef(null);

  const [city, setCity] = useState(null);
  const [budget, setBudget] = useState(null);
  const [style, setStyle] = useState(null);
  const [duration, setDuration] = useState(null);
  const [generating, setGenerating] = useState(false);

  const [activeSheet, setActiveSheet] = useState(null);
  const shellRef = useRef(null);

  // Entrance animation — clearProps:"filter" removes inline filter after animation
  // so it doesn't create a persistent stacking context that blocks pointer events
  useEffect(() => {
    if (!shellRef.current) return;
    const elements = shellRef.current.querySelectorAll(".pl-header, .pl-heading, .pl-card, .pl-actions");
    gsap.fromTo(elements,
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 0.7, ease: "power3.out", stagger: 0.08, clearProps: "transform,filter" }
    );
  }, []);

  useEffect(() => {
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setTravelOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Navigate after loading animation completes (~3.2s covers all 4 steps)
  useEffect(() => {
    if (!generating) return;
    const timer = setTimeout(() => {
      const params = new URLSearchParams();
      if (city) params.set("city", city);
      if (duration) params.set("duration", duration);
      if (budget) params.set("budget", budget);
      if (style) params.set("prefs", style);
      params.set("ai", "true");
      router.push(`/planner/manual?${params.toString()}`);
    }, 3200);
    return () => clearTimeout(timer);
  }, [generating]);

  return (
    <div className="pl-shell" ref={shellRef}>
      {/* PixelBlast background */}
      <div style={{ position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none", opacity: 0.5 }}>
        <PixelBlast
          variant="square"
          pixelSize={4}
          color="#ff6a00"
          patternScale={2}
          patternDensity={1.2}
          pixelSizeJitter={0}
          enableRipples
          rippleSpeed={0.4}
          rippleThickness={0.12}
          rippleIntensityScale={1.5}
          liquid={false}
          liquidStrength={0.12}
          liquidRadius={1.2}
          liquidWobbleSpeed={5}
          speed={0.5}
          edgeFade={0.1}
          transparent
        />
      </div>

      {/* Header */}
      <div className="pl-header">
        <div className="pl-badge">AI TRAVEL PLANNER</div>
      </div>

      {/* Heading */}
      <div className="pl-heading">
        <h1 className="pl-title">Plan The Best<br />Trip To The</h1>
        <div className="pl-vacation-wrap" ref={dropdownRef}>
          <button className="pl-vacation-btn" onClick={() => setTravelOpen(!travelOpen)}>
            <span className="pl-vacation">{TRAVEL_TYPES[travelType]}</span>
            <FontAwesomeIcon icon={faChevronDown} className={`pl-vacation-arrow ${travelOpen ? "pl-vacation-arrow-open" : ""}`} style={{ width: 14, height: 14, color: "#ff7b4b" }} />
          </button>
          {travelOpen && (
              <div className="pl-travel-dropdown">
                {TRAVEL_TYPES.map((t, i) => (
                  <button
                    key={t}
                    className={`pl-travel-option ${i === travelType ? "pl-travel-option-active" : ""}`}
                    onClick={() => { setTravelType(i); setTravelOpen(false); }}
                  >
                    {t}
                  </button>
                ))}
              </div>
          )}
        </div>
      </div>

      {/* Dropdown backdrop — rendered at shell level to avoid stacking context clipping */}
      {travelOpen && <div className="pl-dropdown-backdrop" onClick={() => setTravelOpen(false)} />}

      {/* Mad-libs card */}
      <div className="pl-card">
        <div className="pl-prompt">
          <div className="pl-prompt-line">
            I want to explore{" "}
            <button className={`pl-pill ${city ? "pl-pill-selected" : ""}`} onClick={() => setActiveSheet("city")}>
              <span className="pl-pill-text">{city || "City/Region"}</span>
            </button>
          </div>
          <div className="pl-prompt-line">
            prefer a{" "}
            <button className={`pl-pill ${budget ? "pl-pill-selected" : ""}`} onClick={() => setActiveSheet("budget")}>
              <span className="pl-pill-text">{budget || "Budget"}</span>
            </button>
            {" "}budget,
          </div>
          <div className="pl-prompt-line">
            my travel style is{" "}
            <button className={`pl-pill ${style ? "pl-pill-selected" : ""}`} onClick={() => setActiveSheet("style")}>
              <span className="pl-pill-text">{style || "Type of Group"}</span>
            </button>
          </div>
          <div className="pl-prompt-line" style={{ marginBottom: 0 }}>
            for{" "}
            <button className={`pl-pill ${duration ? "pl-pill-selected" : ""}`} onClick={() => setActiveSheet("duration")}>
              <span className="pl-pill-text">{duration || "Duration"}</span>
            </button>
            {" "}....
          </div>
        </div>
      </div>

      {/* Validation hint */}
      {!city && (
        <div style={{ textAlign: "center", marginBottom: 4, color: "rgba(255,140,66,0.65)", fontSize: 11, fontWeight: 600, letterSpacing: 0.4, animation: "pl-fade-in 0.4s ease" }}>
          ↑ Choose a destination to get started
        </div>
      )}

      {/* Action buttons */}
      <div className="pl-actions">
        <Link
          href={`/planner/manual?city=${encodeURIComponent(city || "")}&duration=${encodeURIComponent(duration || "")}${budget ? `&budget=${encodeURIComponent(budget)}` : ""}${style ? `&style=${encodeURIComponent(style)}` : ""}`}
          className="pl-btn-inspire"
        >DIRECTLY CREATE</Link>
        <button
          className="pl-btn-generate"
          onClick={() => { if (city) setGenerating(true); }}
          style={{ opacity: city ? 1 : 0.45, cursor: city ? "pointer" : "not-allowed", transition: "opacity 0.2s" }}
          title={!city ? "Select a destination first" : undefined}
        >
          <div className="pl-uiverse-wrapper">
            <span>HELP ME PLAN</span>
            <div className="pl-circle pl-circle-12"></div>
            <div className="pl-circle pl-circle-11"></div>
            <div className="pl-circle pl-circle-10"></div>
            <div className="pl-circle pl-circle-9"></div>
            <div className="pl-circle pl-circle-8"></div>
            <div className="pl-circle pl-circle-7"></div>
            <div className="pl-circle pl-circle-6"></div>
            <div className="pl-circle pl-circle-5"></div>
            <div className="pl-circle pl-circle-4"></div>
            <div className="pl-circle pl-circle-3"></div>
            <div className="pl-circle pl-circle-2"></div>
            <div className="pl-circle pl-circle-1"></div>
          </div>
        </button>
      </div>

      {/* Generating loading overlay */}
      {generating && (
        <div className="pl-gen-overlay">
          {/* Same pixel background as planner page */}
          <div style={{ position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none", opacity: 0.5 }}>
            <PixelBlast
              variant="square"
              pixelSize={4}
              color="#ff6a00"
              patternScale={2}
              patternDensity={1.2}
              pixelSizeJitter={0}
              enableRipples
              rippleSpeed={0.4}
              rippleThickness={0.12}
              rippleIntensityScale={1.5}
              liquid={false}
              speed={0.5}
              edgeFade={0.1}
              transparent
            />
          </div>
          <div className="pl-gen-card">
            <div className="pl-gen-orb" />
            <div className="pl-gen-content">
              <p className="pl-gen-label">AI TRAVEL PLANNER</p>
              <h2 className="pl-gen-title">
                Crafting your<br />perfect trip
                {city ? <> to <span className="pl-gen-city">{city.split(",")[0]}</span></> : "…"}
              </h2>
              <p className="pl-gen-sub">Analysing destinations, weather, and hidden gems</p>
              <div className="pl-gen-steps">
                {[
                  { text: "Researching destination", delay: 0 },
                  { text: "Matching your style",     delay: 0.7 },
                  { text: "Building itinerary",       delay: 1.4 },
                  { text: "Finalising details",        delay: 2.1 },
                ].map(({ text, delay }) => (
                  <div key={text} className="pl-gen-step" style={{ animationDelay: `${delay}s` }}>
                    <span className="pl-gen-step-dot" style={{ animationDelay: `${delay}s` }} />
                    <span className="pl-gen-step-text">{text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <button className="pl-gen-cancel" onClick={() => setGenerating(false)}>Cancel</button>
        </div>
      )}

      {/* Bottom sheets */}
      <CitySheet open={activeSheet === "city"} onClose={() => setActiveSheet(null)} value={city} onSelect={setCity} />
      <BudgetSheet open={activeSheet === "budget"} onClose={() => setActiveSheet(null)} value={budget} onSelect={setBudget} />
      <StyleSheet open={activeSheet === "style"} onClose={() => setActiveSheet(null)} value={style} onSelect={setStyle} />
      <DurationSheet open={activeSheet === "duration"} onClose={() => setActiveSheet(null)} value={duration} onSelect={setDuration} />

      {/* Bottom nav */}
      <nav className="hp-nav">
        <div className="hp-nav-pill">
          <Link href="/" className={`hp-nav-item${pathname === "/" ? " hp-nav-active" : ""}`}>
            <FontAwesomeIcon icon={faHouse} className="hp-nav-icon" style={{ width: 20, height: 20 }} />
            <span className="hp-nav-label">Home</span>
          </Link>
          <Link href="/nearby" className={`hp-nav-item${pathname === "/nearby" ? " hp-nav-active" : ""}`}>
            <FontAwesomeIcon icon={faCompass} className="hp-nav-icon" style={{ width: 20, height: 20 }} />
            <span className="hp-nav-label">Discover</span>
          </Link>
          <div className="hp-nav-center-wrap">
            <Link href="/planner" className="hp-nav-center-btn">
              <FontAwesomeIcon icon={faPlus} style={{ width: 18, height: 18, color: "white" }} />
            </Link>
          </div>
          <Link href="/trips" className={`hp-nav-item${pathname === "/trips" ? " hp-nav-active" : ""}`}>
            <FontAwesomeIcon icon={faPlane} className="hp-nav-icon" style={{ width: 20, height: 20 }} />
            <span className="hp-nav-label">My Trips</span>
          </Link>
          <Link href="/profile" className={`hp-nav-item${pathname === "/profile" ? " hp-nav-active" : ""}`}>
            <FontAwesomeIcon icon={faCircleUser} className="hp-nav-icon" style={{ width: 20, height: 20 }} />
            <span className="hp-nav-label">Profile</span>
          </Link>
        </div>
      </nav>
    </div>
  );
}
