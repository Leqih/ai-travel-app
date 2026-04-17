"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faPlus, faEarthAmericas } from "@fortawesome/free-solid-svg-icons";

const CITY_FLAGS = {
  "Tokyo":"🇯🇵","Seoul":"🇰🇷","Bangkok":"🇹🇭","Bali":"🇮🇩","Paris":"🇫🇷",
  "New York":"🇺🇸","London":"🇬🇧","Rome":"🇮🇹","Istanbul":"🇹🇷","Dubai":"🇦🇪",
  "Sydney":"🇦🇺","Barcelona":"🇪🇸","Kyoto":"🇯🇵","Singapore":"🇸🇬","Lisbon":"🇵🇹",
};

const CITY_IMAGES = {
  "Tokyo":     "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400&h=500&fit=crop",
  "Seoul":     "https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?w=400&h=500&fit=crop",
  "Bangkok":   "https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=400&h=500&fit=crop",
  "Bali":      "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=400&h=500&fit=crop",
  "Paris":     "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400&h=500&fit=crop",
  "New York":  "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=400&h=500&fit=crop",
  "London":    "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=400&h=500&fit=crop",
  "Rome":      "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=400&h=500&fit=crop",
  "Singapore": "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=400&h=500&fit=crop",
  "Lisbon":    "https://images.unsplash.com/photo-1585208798174-6cedd86e019a?w=400&h=500&fit=crop",
};

// Pin positions for Figma landscape map (1040×504, equirectangular)
// x: 0=180°W → 1040=180°E  →  xPct = (lon+180)/360*100
// y: 27.6=80°N → 484.5=80°S, span=456.9  →  yPct = (27.6 + (80-lat)*2.856 - 27.6) / 456.9 * 100
//    = (80-lat)*2.856 / 456.9 * 100  = (80-lat)*0.6252
const CITY_MAP_POS = {
  "London":    { x: 49.5, y: 18.1 }, // 51°N,   0°
  "Paris":     { x: 50.6, y: 19.4 }, // 49°N,   2°E
  "Barcelona": { x: 51.0, y: 24.4 }, // 41°N,   2°E
  "Lisbon":    { x: 47.5, y: 25.6 }, // 39°N,   9°W
  "Rome":      { x: 53.6, y: 23.8 }, // 42°N,  13°E
  "Istanbul":  { x: 58.1, y: 24.4 }, // 41°N,  29°E
  "Dubai":     { x: 65.3, y: 34.4 }, // 25°N,  55°E
  "New York":  { x: 29.4, y: 24.4 }, // 41°N,  74°W
  "Bangkok":   { x: 78.1, y: 41.2 }, // 14°N, 101°E
  "Singapore": { x: 78.9, y: 49.7 }, //  1°N, 104°E
  "Bali":      { x: 81.9, y: 55.0 }, //  8°S, 115°E
  "Seoul":     { x: 85.3, y: 26.9 }, // 37°N, 127°E
  "Kyoto":     { x: 87.8, y: 28.2 }, // 35°N, 136°E
  "Tokyo":     { x: 88.9, y: 27.5 }, // 36°N, 140°E
  "Sydney":    { x: 91.9, y: 71.4 }, // 34°S, 151°E
};

const COUNTRY_MAP = {
  "Tokyo":"Japan","Seoul":"S. Korea","Bangkok":"Thailand","Bali":"Indonesia",
  "Paris":"France","New York":"USA","London":"UK","Rome":"Italy","Istanbul":"Turkey",
  "Dubai":"UAE","Sydney":"Australia","Barcelona":"Spain","Kyoto":"Japan",
  "Singapore":"Singapore","Lisbon":"Portugal",
};

export default function FootprintPage() {
  const shellRef = useRef(null);
  const [trips, setTrips] = useState([]);
  const [activeCity, setActiveCity] = useState(null);

  useEffect(() => {
    try { setTrips(JSON.parse(localStorage.getItem("opal_trips") || "[]")); } catch (_) {}
  }, []);

  useEffect(() => {
    if (!shellRef.current) return;
    gsap.fromTo(shellRef.current.querySelectorAll(".fp-a"),
      { opacity: 0, y: 24, filter: "blur(5px)" },
      { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.55, ease: "power3.out", stagger: 0.08 }
    );
  }, [trips]);

  const visitedCities = [...new Set(trips.map(t => t.destination).filter(Boolean))];
  const visitedCountries = [...new Set(visitedCities.map(c => COUNTRY_MAP[c]).filter(Boolean))];
  const totalDays = trips.reduce((s, t) => s + (parseInt(t.duration) || 0), 0);

  return (
    <div ref={shellRef} style={{ background: "#09090f", minHeight: "100vh", paddingBottom: 48 }}>

      {/* ── Top bar ── */}
      <div className="fp-a" style={{ display: "flex", alignItems: "center", padding: "56px 20px 18px" }}>
        <Link href="/profile" style={{
          width: 44, height: 44, borderRadius: "50%",
          background: "rgba(20,20,20,0.7)", backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)",
          border: "none",
          display: "flex", alignItems: "center", justifyContent: "center", textDecoration: "none", flexShrink: 0,
        }}>
          <svg width="10" height="18" viewBox="0 0 10 18" fill="none"><path d="M9 1L1 9L9 17" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </Link>
        <h1 style={{ color: "#fff", fontSize: 17, fontWeight: 700, margin: "0 auto", letterSpacing: -0.3, fontFamily: `-apple-system,"SF Pro Display","Helvetica Neue",sans-serif` }}>Travel Footprint</h1>
        <div style={{ width: 44 }} />
      </div>

      {/* ── Hero ── */}
      <div className="fp-a" style={{ margin: "0 20px 20px" }}>
        <div style={{
          borderRadius: 20, overflow: "hidden", position: "relative",
          background: "rgba(20,20,20,0.7)", backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)",
          border: "none",
          padding: "22px 20px 20px",
        }}>
          {/* Subtle orange glow from avatar */}
          <div style={{ position: "absolute", top: -20, left: 10, width: 100, height: 100, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,140,66,0.1), transparent 70%)", pointerEvents: "none" }} />

          {/* Avatar + name row */}
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 18 }}>
            <div style={{ position: "relative" }}>
              <div style={{
                width: 56, height: 56, borderRadius: "50%",
                background: "linear-gradient(135deg, #ff8c42, #ff3d00)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 22, fontWeight: 900, color: "#fff",
                boxShadow: "0 6px 24px rgba(255,140,66,0.45)",
              }}>T</div>
              <div style={{ position: "absolute", bottom: 1, right: 1, width: 13, height: 13, borderRadius: "50%", background: "#34d399", border: "2px solid #141414", boxShadow: "0 0 6px rgba(52,211,153,0.5)" }} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ color: "#fff", fontSize: 17, fontWeight: 700, letterSpacing: -0.3 }}>Traveler</div>
              <div style={{ color: "rgba(255,255,255,0.38)", fontSize: 12, marginTop: 2 }}>Exploring the world</div>
            </div>
            {/* Stamp */}
            <div style={{ width: 52, height: 52, borderRadius: "50%", border: "1.5px dashed rgba(255,140,66,0.4)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <div style={{ width: 40, height: 40, borderRadius: "50%", border: "1px solid rgba(255,140,66,0.18)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 1 }}>
                <span style={{ fontSize: 5.5, fontWeight: 800, color: "#ff8c42", letterSpacing: 1, textTransform: "uppercase" }}>Navora</span>
                <span style={{ fontSize: 15 }}>✈️</span>
                <span style={{ fontSize: 5.5, fontWeight: 700, color: "rgba(255,140,66,0.45)" }}>Explore</span>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8 }}>
            {[
              { v: visitedCities.length,    l: "Cities"    },
              { v: visitedCountries.length, l: "Countries" },
              { v: totalDays,               l: "Days"      },
            ].map(s => (
              <div key={s.l} style={{
                background: "rgba(255,255,255,0.05)", borderRadius: 14,
                border: "none",
                padding: "11px 0", textAlign: "center",
              }}>
                <div style={{ fontSize: 26, fontWeight: 800, color: "#fff", letterSpacing: -1.5, lineHeight: 1, fontFamily: `-apple-system,"SF Pro Display","Helvetica Neue",sans-serif` }}>{s.v}</div>
                <div style={{ fontSize: 9, color: "rgba(255,255,255,0.3)", fontWeight: 700, letterSpacing: 0.8, textTransform: "uppercase", marginTop: 5 }}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── World map ── */}
      <div className="fp-a" style={{ margin: "0 0 20px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10, padding: "0 20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <FontAwesomeIcon icon={faEarthAmericas} style={{ width: 11, height: 11, color: "rgba(255,255,255,0.3)" }} />
            <span style={{ color: "rgba(255,255,255,0.3)", fontSize: 10, fontWeight: 700, letterSpacing: 1.2, textTransform: "uppercase" }}>World Map</span>
          </div>
          <span style={{ color: visitedCities.length > 0 ? "rgba(255,140,66,0.7)" : "rgba(255,255,255,0.15)", fontSize: 10, fontWeight: 600 }}>
            {visitedCities.length} {visitedCities.length === 1 ? "pin" : "pins"}
          </span>
        </div>

        <div style={{
          overflow: "hidden", position: "relative",
          background: "#0d1117",
          borderTop: "1px solid rgba(255,255,255,0.06)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}>
          {/* Dotted world map — full world, no distortion, full bleed */}
          <img
            src="/world-dotted.svg"
            alt="World map"
            style={{
              display: "block", width: "100%", height: "auto",
              opacity: 0.55,
            }}
          />

          {/* Connection lines overlay */}
          {visitedCities.length > 1 && (
            <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", zIndex: 1 }} preserveAspectRatio="none">
              {visitedCities.slice(0, -1).map((city, i) => {
                const p1 = CITY_MAP_POS[city];
                const p2 = CITY_MAP_POS[visitedCities[i + 1]];
                if (!p1 || !p2) return null;
                return (
                  <line key={city}
                    x1={`${p1.x}%`} y1={`${p1.y}%`}
                    x2={`${p2.x}%`} y2={`${p2.y}%`}
                    stroke="rgba(255,140,66,0.35)" strokeWidth="1" strokeDasharray="3,5"
                  />
                );
              })}
            </svg>
          )}

          {/* City pins */}
          {visitedCities.map(city => {
            const pos = CITY_MAP_POS[city];
            if (!pos) return null;
            const isActive = activeCity === city;
            return (
              <button key={city} onClick={() => setActiveCity(isActive ? null : city)} style={{
                position: "absolute",
                left: `${pos.x}%`, top: `${pos.y}%`,
                transform: "translate(-50%,-50%)",
                background: "none", border: "none", padding: 0, cursor: "pointer", zIndex: isActive ? 5 : 3,
              }}>
                {/* Pulse ring */}
                <div style={{
                  position: "absolute", top: "50%", left: "50%",
                  transform: "translate(-50%,-50%)",
                  width: 20, height: 20, borderRadius: "50%",
                  border: "1.5px solid rgba(255,140,66,0.5)",
                  animation: "fp-pulse 2.5s ease-out infinite",
                }} />
                {/* Core dot */}
                <div style={{
                  width: isActive ? 10 : 7, height: isActive ? 10 : 7,
                  borderRadius: "50%", position: "relative", zIndex: 1,
                  background: isActive ? "#ff8c42" : "#ff8c42cc",
                  boxShadow: isActive
                    ? "0 0 0 2px rgba(255,140,66,0.3), 0 0 12px rgba(255,140,66,0.7)"
                    : "0 0 6px rgba(255,140,66,0.5)",
                  transition: "all 0.18s",
                }} />
                {/* Tooltip */}
                {isActive && (
                  <div style={{
                    position: "absolute", bottom: "calc(100% + 8px)", left: "50%", transform: "translateX(-50%)",
                    background: "rgba(20,20,20,0.9)", backdropFilter: "blur(8px)", border: "none",
                    borderRadius: 10, padding: "5px 10px",
                    color: "#fff", fontSize: 11, fontWeight: 700, whiteSpace: "nowrap",
                    boxShadow: "0 6px 20px rgba(0,0,0,0.5)",
                    display: "flex", alignItems: "center", gap: 5,
                  }}>
                    <span>{CITY_FLAGS[city] || "📍"}</span>
                    <span style={{ color: "#fff" }}>{city}</span>
                    <span style={{ color: "rgba(255,255,255,0.35)", fontSize: 9 }}>{COUNTRY_MAP[city]}</span>
                    {/* Arrow */}
                    <div style={{ position: "absolute", top: "100%", left: "50%", transform: "translateX(-50%)", width: 0, height: 0, borderLeft: "5px solid transparent", borderRight: "5px solid transparent", borderTop: "5px solid rgba(255,255,255,0.1)" }} />
                  </div>
                )}
              </button>
            );
          })}

          {/* Empty state */}
          {visitedCities.length === 0 && (
            <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8 }}>
              <span style={{ fontSize: 30 }}>🌍</span>
              <p style={{ color: "rgba(255,255,255,0.2)", fontSize: 12, margin: 0 }}>Plan trips to build your footprint</p>
            </div>
          )}
          {visitedCities.length > 0 && (
            <div style={{ position: "absolute", bottom: 10, right: 12, color: "rgba(255,255,255,0.14)", fontSize: 8.5, fontWeight: 700, letterSpacing: 0.5, textTransform: "uppercase" }}>Tap to explore</div>
          )}
        </div>
      </div>

      {/* ── Visited chips ── */}
      {visitedCities.length > 0 && (
        <div className="fp-a" style={{ margin: "0 20px 20px" }}>
          <p style={{ color: "rgba(255,255,255,0.25)", fontSize: 10, fontWeight: 700, letterSpacing: 1.2, textTransform: "uppercase", margin: "0 0 10px" }}>Visited</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
            {visitedCities.map(city => {
              const sel = activeCity === city;
              return (
                <button key={city} onClick={() => setActiveCity(sel ? null : city)} style={{
                  display: "flex", alignItems: "center", gap: 6,
                  background: sel ? "#fff" : "rgba(20,20,20,0.7)",
                  backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)",
                  border: `1px solid ${sel ? "transparent" : "rgba(255,255,255,0.08)"}`,
                  borderRadius: 999, padding: "6px 12px 6px 8px",
                  cursor: "pointer", transition: "all 0.15s", boxShadow: "none",
                }}>
                  <span style={{ fontSize: 15, lineHeight: 1 }}>{CITY_FLAGS[city] || "✈️"}</span>
                  <span style={{ color: sel ? "#000" : "rgba(255,255,255,0.85)", fontSize: 12, fontWeight: 600, letterSpacing: -0.1 }}>{city}</span>
                  <span style={{ color: sel ? "rgba(0,0,0,0.4)" : "rgba(255,255,255,0.25)", fontSize: 10 }}>· {COUNTRY_MAP[city]}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Photo collection ── */}
      {visitedCities.length > 0 && (
        <div className="fp-a" style={{ margin: "0 20px 24px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
            <p style={{ color: "rgba(255,255,255,0.25)", fontSize: 10, fontWeight: 700, letterSpacing: 1.2, textTransform: "uppercase", margin: 0 }}>
              Collection
            </p>
            <span style={{ color: "rgba(255,255,255,0.2)", fontSize: 10, fontWeight: 600 }}>
              {visitedCities.filter(c => CITY_IMAGES[c]).length} places
            </span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8 }}>
            {visitedCities.filter(c => CITY_IMAGES[c]).map(city => (
              <div key={city} style={{
                borderRadius: 14, overflow: "hidden", position: "relative",
                aspectRatio: "2/3",
                boxShadow: "0 6px 20px rgba(0,0,0,0.45)",
              }}>
                <img src={CITY_IMAGES[city]} alt={city} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                {/* Gradient */}
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(0,0,0,0) 40%, rgba(0,0,0,0.78) 100%)" }} />
                {/* Flag top-left */}
                <div style={{
                  position: "absolute", top: 8, left: 8,
                  background: "rgba(0,0,0,0.35)", backdropFilter: "blur(6px)",
                  borderRadius: 8, padding: "2px 6px", fontSize: 12,
                }}>{CITY_FLAGS[city] || "✈️"}</div>
                {/* Info bottom */}
                <div style={{ position: "absolute", bottom: 9, left: 10, right: 10 }}>
                  <div style={{ color: "#fff", fontSize: 12, fontWeight: 700, letterSpacing: -0.2, lineHeight: 1.2, textShadow: "0 1px 4px rgba(0,0,0,0.5)" }}>{city}</div>
                  <div style={{ color: "rgba(255,255,255,0.45)", fontSize: 9, marginTop: 2 }}>{COUNTRY_MAP[city]}</div>
                </div>
              </div>
            ))}
            {/* Add new */}
            <Link href="/planner" style={{
              borderRadius: 14, aspectRatio: "2/3", textDecoration: "none",
              background: "rgba(255,255,255,0.025)",
              border: "none",
              display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 9,
            }}>
              <div style={{
                width: 34, height: 34, borderRadius: "50%",
                background: "rgba(255,140,66,0.1)", border: "1px solid rgba(255,140,66,0.22)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <FontAwesomeIcon icon={faPlus} style={{ width: 11, height: 11, color: "#ff8c42" }} />
              </div>
              <span style={{ color: "rgba(255,255,255,0.2)", fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5 }}>New Trip</span>
            </Link>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fp-pulse {
          0%   { opacity: 0.8; transform: translate(-50%,-50%) scale(0.6); }
          70%  { opacity: 0;   transform: translate(-50%,-50%) scale(2.2); }
          100% { opacity: 0;   transform: translate(-50%,-50%) scale(2.2); }
        }
      `}</style>
    </div>
  );
}
