"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";

/* ── Google Maps loader (shared with NearbyPage) ── */
let gmapsPromise = null;
function loadGoogleMaps() {
  if (gmapsPromise) return gmapsPromise;
  if (window.google?.maps) return Promise.resolve(window.google.maps);
  gmapsPromise = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY}&language=en`;
    script.async = true;
    script.onload = () => resolve(window.google.maps);
    script.onerror = reject;
    document.head.appendChild(script);
  });
  return gmapsPromise;
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

/* ── Article data with locations ── */
const ARTICLES = {
  1: {
    tag: "Cultural Exploration",
    tagIcon: "🌍",
    title: "Iran: Ancient Cities at the Crossroads of Civilization",
    author: "Wanderlust Editorial",
    authorAvatar: "✍️",
    desc: "From Isfahan's turquoise mosques to Persepolis' ancient ruins, discover a land where East meets West. Iran's rich history spans thousands of years, offering travelers an unparalleled journey through time.",
    img: "https://images.unsplash.com/photo-1565711561500-49678a10a63f?w=800&h=500&fit=crop&q=80",
    center: { lat: 32.65, lng: 51.68 },
    zoom: 6,
    locations: [
      { name: "Isfahan", icon: "🕌", lat: 32.6546, lng: 51.6680, desc: "Turquoise mosques & bridges" },
      { name: "Persepolis", icon: "🏛️", lat: 29.9352, lng: 52.8914, desc: "Ancient ceremonial capital" },
      { name: "Shiraz", icon: "🌹", lat: 29.5918, lng: 52.5837, desc: "City of poetry & gardens" },
      { name: "Yazd", icon: "🏜️", lat: 31.8974, lng: 54.3569, desc: "Desert city of wind towers" },
      { name: "Tehran", icon: "🏔️", lat: 35.6892, lng: 51.3890, desc: "Vibrant modern capital" },
    ],
  },
  2: {
    tag: "Nature & Adventure",
    tagIcon: "🏔️",
    title: "Patagonia: Edge of the World Trekking Guide",
    author: "Adventure Trails",
    authorAvatar: "🥾",
    desc: "Torres del Paine, Perito Moreno glacier, and the windswept trails of South America's last frontier. A comprehensive guide to trekking through Earth's most dramatic landscapes.",
    img: "https://images.unsplash.com/photo-1531761535209-180857e963b9?w=800&h=500&fit=crop&q=80",
    center: { lat: -50.5, lng: -72.5 },
    zoom: 6,
    locations: [
      { name: "Torres del Paine", icon: "⛰️", lat: -50.9423, lng: -73.4068, desc: "Iconic granite towers" },
      { name: "Perito Moreno", icon: "🧊", lat: -50.4967, lng: -73.1377, desc: "Advancing glacier" },
      { name: "El Chaltén", icon: "🥾", lat: -49.3313, lng: -72.8860, desc: "Trekking capital" },
      { name: "Ushuaia", icon: "🚢", lat: -54.8019, lng: -68.3030, desc: "End of the world city" },
      { name: "Bariloche", icon: "🏔️", lat: -41.1335, lng: -71.3103, desc: "Lake district gateway" },
    ],
  },
  3: {
    tag: "City Guide",
    tagIcon: "🏙️",
    title: "72 Hours in Lisbon: Art, Tiles & Pastel de Nata",
    author: "City Compass",
    authorAvatar: "🧭",
    desc: "A perfectly paced weekend guide to Lisbon's neighborhoods, from Alfama's fado to Belem's pastries. Discover the city's art, architecture, and culinary delights in just three days.",
    img: "https://images.unsplash.com/photo-1585208798174-6cedd86e019a?w=800&h=500&fit=crop&q=80",
    center: { lat: 38.72, lng: -9.14 },
    zoom: 13,
    locations: [
      { name: "Alfama", icon: "🎵", lat: 38.7114, lng: -9.1300, desc: "Historic fado quarter" },
      { name: "Belém Tower", icon: "🗼", lat: 38.6916, lng: -9.2160, desc: "Iconic riverside tower" },
      { name: "LX Factory", icon: "🎨", lat: 38.7035, lng: -9.1786, desc: "Creative hub & market" },
      { name: "Praça do Comércio", icon: "🏛️", lat: 38.7075, lng: -9.1365, desc: "Grand riverside square" },
      { name: "Sintra", icon: "🏰", lat: 38.7876, lng: -9.3907, desc: "Fairy-tale palaces" },
    ],
  },
  4: {
    tag: "Hidden Gems",
    tagIcon: "💎",
    title: "Slovenia: Europe's Best-Kept Secret",
    author: "Off the Path",
    authorAvatar: "💎",
    desc: "Lake Bled, Ljubljana's charm, and the Julian Alps — compact, green, and endlessly surprising. Slovenia packs incredible diversity into a tiny country.",
    img: "https://images.unsplash.com/photo-1586901533048-0e856dff2c0d?w=800&h=500&fit=crop&q=80",
    center: { lat: 46.15, lng: 14.50 },
    zoom: 9,
    locations: [
      { name: "Lake Bled", icon: "🏝️", lat: 46.3633, lng: 14.0938, desc: "Island church & castle" },
      { name: "Ljubljana", icon: "🐉", lat: 46.0569, lng: 14.5058, desc: "Dragon bridge capital" },
      { name: "Postojna Cave", icon: "🦇", lat: 45.7828, lng: 14.2034, desc: "Underground wonder" },
      { name: "Piran", icon: "⛵", lat: 45.5283, lng: 13.5681, desc: "Venetian coastal gem" },
      { name: "Triglav", icon: "⛰️", lat: 46.3786, lng: 13.8367, desc: "Julian Alps peak" },
    ],
  },
  5: {
    tag: "Food & Culture",
    tagIcon: "🍜",
    title: "Oaxaca: Mexico's Culinary Heart",
    author: "Flavor Atlas",
    authorAvatar: "🌮",
    desc: "Mole negro, mezcal tastings, and vibrant markets — the ultimate food lover's destination. Explore the culinary traditions that make Oaxaca a gastronomic paradise.",
    img: "https://images.unsplash.com/photo-1518105779142-d975f22f1b0a?w=800&h=500&fit=crop&q=80",
    center: { lat: 17.06, lng: -96.72 },
    zoom: 12,
    locations: [
      { name: "Mercado Benito Juárez", icon: "🏪", lat: 17.0609, lng: -96.7236, desc: "Main food market" },
      { name: "Monte Albán", icon: "🏛️", lat: 17.0436, lng: -96.7682, desc: "Zapotec ruins" },
      { name: "Hierve el Agua", icon: "💧", lat: 16.8660, lng: -96.2759, desc: "Petrified waterfalls" },
      { name: "Mezcal District", icon: "🥃", lat: 16.9528, lng: -96.5478, desc: "Artisanal distilleries" },
      { name: "Santo Domingo", icon: "⛪", lat: 17.0660, lng: -96.7254, desc: "Baroque church & garden" },
    ],
  },
  6: {
    tag: "Wellness",
    tagIcon: "🧘",
    title: "Bali Retreat: Mind, Body & Spirit",
    author: "Zen Traveler",
    authorAvatar: "🧘",
    desc: "Yoga in Ubud, temple sunrise walks, and healing ceremonies — find your inner peace. A guide to Bali's most transformative wellness experiences.",
    img: "https://images.unsplash.com/photo-1554689021-c9e70753d301?w=800&h=500&fit=crop&q=80",
    center: { lat: -8.45, lng: 115.26 },
    zoom: 10,
    locations: [
      { name: "Ubud", icon: "🧘", lat: -8.5069, lng: 115.2625, desc: "Yoga & wellness capital" },
      { name: "Tirta Empul", icon: "💧", lat: -8.4152, lng: 115.3155, desc: "Sacred water temple" },
      { name: "Tegallalang", icon: "🌾", lat: -8.4312, lng: 115.2793, desc: "Rice terrace walks" },
      { name: "Uluwatu", icon: "🌅", lat: -8.8291, lng: 115.0849, desc: "Clifftop temple" },
      { name: "Mount Batur", icon: "🌋", lat: -8.2420, lng: 115.3750, desc: "Sunrise volcano trek" },
    ],
  },
  7: {
    tag: "History",
    tagIcon: "🏛️",
    title: "Egypt Beyond the Pyramids",
    author: "Ancient Roads",
    authorAvatar: "🏛️",
    desc: "Luxor's Valley of the Kings, Abu Simbel at dawn, and the souks of Aswan. Discover Egypt's lesser-known treasures beyond the famous pyramids.",
    img: "https://images.unsplash.com/photo-1539768942893-daf53e736b68?w=800&h=500&fit=crop&q=80",
    center: { lat: 25.7, lng: 32.6 },
    zoom: 6,
    locations: [
      { name: "Luxor", icon: "🏛️", lat: 25.6872, lng: 32.6396, desc: "Valley of the Kings" },
      { name: "Abu Simbel", icon: "🗿", lat: 22.3372, lng: 31.6258, desc: "Ramesses II temples" },
      { name: "Aswan", icon: "⛵", lat: 24.0889, lng: 32.8998, desc: "Nubian culture & souks" },
      { name: "Karnak", icon: "🏛️", lat: 25.7188, lng: 32.6573, desc: "Largest temple complex" },
      { name: "Cairo", icon: "🔺", lat: 30.0444, lng: 31.2357, desc: "Pyramids & museum" },
    ],
  },
  8: {
    tag: "Island Life",
    tagIcon: "🏝️",
    title: "Greek Islands: Santorini to Milos",
    author: "Aegean Diaries",
    authorAvatar: "🏝️",
    desc: "Whitewashed villages, sapphire waters, and the best sunset spots in the Aegean. Island-hop through Greece's most enchanting destinations.",
    img: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800&h=500&fit=crop&q=80",
    center: { lat: 36.8, lng: 25.3 },
    zoom: 8,
    locations: [
      { name: "Santorini", icon: "🌅", lat: 36.3932, lng: 25.4615, desc: "Caldera sunset views" },
      { name: "Milos", icon: "🏖️", lat: 36.7486, lng: 24.4271, desc: "Secret beaches" },
      { name: "Mykonos", icon: "🎉", lat: 37.4467, lng: 25.3289, desc: "Windmills & nightlife" },
      { name: "Naxos", icon: "🏛️", lat: 37.1036, lng: 25.3762, desc: "Apollo's gateway" },
      { name: "Paros", icon: "⛵", lat: 37.0856, lng: 25.1489, desc: "Marble & harbors" },
    ],
  },
};

/* ── Pin colors by category ── */
const PIN_COLORS = [
  "#fff", "#ff6b6b", "#ffd93d", "#6bcb77", "#4d96ff",
  "#ff8fab", "#a78bfa", "#f97316",
];

/* ── Article Map Component ── */
function ArticleMap({ locations, center, zoom, selectedIdx, onPinClick }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);

  useEffect(() => {
    if (!mapRef.current || !locations.length) return;
    let cancelled = false;

    loadGoogleMaps().then((maps) => {
      if (cancelled) return;

      if (!mapInstanceRef.current) {
        const map = new maps.Map(mapRef.current, {
          center,
          zoom: zoom || 8,
          styles: SNAZZY_STYLE,
          disableDefaultUI: true,
          gestureHandling: "greedy",
        });
        mapInstanceRef.current = map;
      }

      const map = mapInstanceRef.current;

      // Clear old overlays
      markersRef.current.forEach((m) => m.setMap(null));
      markersRef.current = [];

      // Add location pin overlays
      locations.forEach((loc, i) => {
        const isActive = i === selectedIdx;
        const overlay = new maps.OverlayView();

        overlay.onAdd = function () {
          const div = document.createElement("div");
          div.className = "nd-gm-pin";
          div.innerHTML = `<div class="nd-map-pin-dot${isActive ? " nd-map-pin-dot--active" : ""}">${i + 1}</div><div class="nd-map-pin-label">${loc.name}</div>`;
          div.style.cursor = "pointer";
          div.addEventListener("click", () => onPinClick?.(i));
          this._div = div;
          this.getPanes().overlayMouseTarget.appendChild(div);
        };

        overlay.draw = function () {
          const pos = this.getProjection().fromLatLngToDivPixel(
            new maps.LatLng(loc.lat, loc.lng)
          );
          if (pos && this._div) {
            this._div.style.position = "absolute";
            this._div.style.left = pos.x - 15 + "px";
            this._div.style.top = pos.y - 44 + "px";
          }
        };

        overlay.onRemove = function () {
          this._div?.remove();
        };

        overlay.setMap(map);
        markersRef.current.push(overlay);
      });

      // Pan to selected location
      if (locations[selectedIdx]) {
        const sel = locations[selectedIdx];
        map.panTo({ lat: sel.lat, lng: sel.lng });
      }
    });

    return () => {
      cancelled = true;
    };
  }, [locations, selectedIdx, center, zoom]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      markersRef.current.forEach((m) => m.setMap(null));
      markersRef.current = [];
      mapInstanceRef.current = null;
    };
  }, []);

  return <div ref={mapRef} style={{ position: "absolute", inset: 0, zIndex: 0 }} />;
}

/* ── Main Component ── */
export function PickArticlePage({ articleId }) {
  const router = useRouter();
  const [selectedPin, setSelectedPin] = useState(0);
  const [saved, setSaved] = useState(false);
  const [showLocList, setShowLocList] = useState(false);
  const carouselRef = useRef(null);

  const article = ARTICLES[articleId];

  if (!article) {
    return (
      <div className="pa-shell">
        <div className="pa-not-found">
          <p>Article not found</p>
          <button onClick={() => router.back()}>← Go back</button>
        </div>
      </div>
    );
  }

  /* scroll carousel to selected card */
  useEffect(() => {
    const el = carouselRef.current;
    if (!el) return;
    const wrapWidth = el.children[0]?.offsetWidth || el.offsetWidth;
    el.scrollTo({ left: selectedPin * wrapWidth, behavior: "smooth" });
  }, [selectedPin]);

  /* snap-based scroll detection */
  const handleCarouselScroll = () => {
    const el = carouselRef.current;
    if (!el) return;
    const wrapWidth = el.children[0]?.offsetWidth || el.offsetWidth;
    const idx = Math.round(el.scrollLeft / wrapWidth);
    const clamped = Math.max(0, Math.min(idx, article.locations.length - 1));
    if (clamped !== selectedPin) setSelectedPin(clamped);
  };

  return (
    <div className="pa-shell">
      {/* Full-screen map */}
      <div className="pa-map-wrap">
        <ArticleMap
          locations={article.locations}
          center={article.center}
          zoom={article.zoom}
          selectedIdx={selectedPin}
          onPinClick={(i) => setSelectedPin(i)}
        />
        <div className="pa-map-grad-top" />
      </div>

      {/* Top bar */}
      <div className="pa-topbar">
        <button className="pa-back-btn" onClick={() => router.back()}>
          <FontAwesomeIcon icon={faChevronLeft} style={{ width: 10, height: 14, color: "white" }} />
        </button>
        <button
          className={`pa-save-all-btn${saved ? " pa-save-all-btn--saved" : ""}`}
          onClick={() => setSaved(!saved)}
        >
          {saved ? "✓ Saved" : "🔖 Save All Spots"}
        </button>
      </div>

      {/* Location pills */}
      <div className="pa-loc-pills">
        {article.locations.map((loc, i) => (
          <button
            key={i}
            className={`pa-loc-pill${selectedPin === i ? " pa-loc-pill--active" : ""}`}
            onClick={() => setSelectedPin(i)}
          >
            <span className="pa-loc-pill-icon">{loc.icon}</span>
            <span className="pa-loc-pill-name">{loc.name}</span>
          </button>
        ))}
      </div>

      {/* Location list popover */}
      {showLocList && (
        <div className="pa-loc-list-overlay" onClick={() => setShowLocList(false)}>
          <div className="pa-loc-list-panel" onClick={(e) => e.stopPropagation()}>
            <div className="pa-loc-list-handle-row"><div className="pa-loc-list-handle" /></div>
            <h3 className="pa-loc-list-title">Mentioned Locations</h3>
            {article.locations.map((loc, i) => (
              <button
                key={i}
                className={`pa-loc-list-item${selectedPin === i ? " pa-loc-list-item--active" : ""}`}
                onClick={() => { setSelectedPin(i); setShowLocList(false); }}
              >
                <span className="pa-loc-list-item-icon">{loc.icon}</span>
                <div className="pa-loc-list-item-info">
                  <span className="pa-loc-list-item-name">{loc.name}</span>
                  <span className="pa-loc-list-item-desc">{loc.desc}</span>
                </div>
                <span className="pa-loc-list-item-arrow">›</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Bottom swipeable location cards */}
      <div className="pa-carousel-wrap">
        <div
          className="pa-carousel-scroll"
          ref={carouselRef}
          onScroll={handleCarouselScroll}
        >
          {article.locations.map((loc, i) => (
            <div key={i} className="pa-carousel-card-wrap">
            <div
              className={`pa-carousel-card${selectedPin === i ? " pa-carousel-card--active" : ""}`}
              onClick={() => setSelectedPin(i)}
            >
              <div className="pa-carousel-card-img-wrap">
                <img className="pa-carousel-card-img" src={article.img} alt={loc.name} />
              </div>
              <div className="pa-carousel-card-body">
                <h2 className="pa-carousel-card-title">{article.title}</h2>
                <div className="pa-carousel-card-author">
                  <span>{article.authorAvatar}</span>
                  <span className="pa-carousel-card-author-name">{article.author}</span>
                </div>
                <p className="pa-carousel-card-desc">{article.desc}</p>
                <div className="pa-carousel-card-loc">
                  <span className="pa-carousel-card-loc-icon">{loc.icon}</span>
                  <div className="pa-carousel-card-loc-info">
                    <span className="pa-carousel-card-loc-name">{loc.name}</span>
                    <span className="pa-carousel-card-loc-desc">{loc.desc}</span>
                  </div>
                </div>
                <div className="pa-carousel-card-actions">
                  <button className={`pa-carousel-card-btn-save${selectedPin === i ? " pa-carousel-card-btn-save--active" : ""}`}>🔖 {((i + 3) * 127 + 89) % 900 + 100}</button>
                  <button className="pa-carousel-card-btn-add">+ Add to Trip</button>
                </div>
              </div>
            </div>
            </div>
          ))}
        </div>
        {/* Dots indicator */}
        <div className="pa-carousel-dots">
          {article.locations.map((_, i) => (
            <span
              key={i}
              className={`pa-carousel-dot${selectedPin === i ? " pa-carousel-dot--active" : ""}`}
              onClick={() => setSelectedPin(i)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
