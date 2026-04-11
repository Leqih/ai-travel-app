"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { gsap } from "gsap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHouse, faCompass, faPlane, faCircleUser, faPlus, faEarthAmericas,
  faBell, faGear, faChevronRight, faPen,
} from "@fortawesome/free-solid-svg-icons";

const NAV_ITEMS = [
  { icon: faHouse,      label: "Home",     href: "/"        },
  { icon: faCompass,    label: "Discover", href: "/nearby"  },
  { center: true },
  { icon: faPlane,      label: "My Trips", href: "/trips"   },
  { icon: faCircleUser, label: "Profile",  href: "/profile" },
];

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

const CITY_MAP_POS = {
  "London":    { x: 49.5, y: 18.1 }, "Paris":     { x: 50.6, y: 19.4 },
  "Barcelona": { x: 51.0, y: 24.4 }, "Lisbon":    { x: 47.5, y: 25.6 },
  "Rome":      { x: 53.6, y: 23.8 }, "Istanbul":  { x: 58.1, y: 24.4 },
  "Dubai":     { x: 65.3, y: 34.4 }, "New York":  { x: 29.4, y: 24.4 },
  "Bangkok":   { x: 78.1, y: 41.2 }, "Singapore": { x: 78.9, y: 49.7 },
  "Bali":      { x: 81.9, y: 55.0 }, "Seoul":     { x: 85.3, y: 26.9 },
  "Kyoto":     { x: 87.8, y: 28.2 }, "Tokyo":     { x: 88.9, y: 27.5 },
  "Sydney":    { x: 91.9, y: 71.4 },
};

const COUNTRY_MAP = {
  "Tokyo":"Japan","Seoul":"S. Korea","Bangkok":"Thailand","Bali":"Indonesia",
  "Paris":"France","New York":"USA","London":"UK","Rome":"Italy","Istanbul":"Turkey",
  "Dubai":"UAE","Sydney":"Australia","Barcelona":"Spain","Kyoto":"Japan",
  "Singapore":"Singapore","Lisbon":"Portugal",
};

const glass = {
  background: "rgba(20,20,20,0.7)",
  backdropFilter: "blur(8px)",
  WebkitBackdropFilter: "blur(8px)",
  border: "1px solid rgba(255,255,255,0.08)",
};

export default function ProfilePage() {
  const pathname = usePathname();
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
      { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.55, ease: "power3.out", stagger: 0.07 }
    );
  }, [trips]);

  const visitedCities = [...new Set(trips.map(t => t.destination).filter(Boolean))];
  const visitedCountries = [...new Set(visitedCities.map(c => COUNTRY_MAP[c]).filter(Boolean))];
  const totalDays = trips.reduce((s, t) => s + (parseInt(t.duration) || 0), 0);

  return (
    <div ref={shellRef} style={{ background: "#09090f", minHeight: "100vh", paddingBottom: 100, fontFamily: `-apple-system,"SF Pro Display","Helvetica Neue",sans-serif` }}>

      {/* ── Top bar ── */}
      <div className="fp-a" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "56px 20px 20px" }}>
        <h1 style={{ color: "#fff", fontSize: 28, fontWeight: 800, margin: 0, letterSpacing: -0.8 }}>Profile</h1>
        <button style={{ ...glass, width: 36, height: 36, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", padding: 0 }}>
          <FontAwesomeIcon icon={faPen} style={{ width: 12, height: 12, color: "rgba(255,255,255,0.55)" }} />
        </button>
      </div>

      {/* ── Hero card ── */}
      <div className="fp-a" style={{ margin: "0 20px 16px" }}>
        <div style={{ ...glass, borderRadius: 24, overflow: "hidden", position: "relative", padding: "20px 20px 18px" }}>
          {/* orange ambient glow */}
          <div style={{ position: "absolute", top: -30, left: -10, width: 140, height: 140, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,140,66,0.12), transparent 65%)", pointerEvents: "none" }} />

          {/* Avatar row */}
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20 }}>
            <div style={{ position: "relative", flexShrink: 0 }}>
              <div style={{
                width: 64, height: 64, borderRadius: "50%",
                background: "linear-gradient(135deg, #ff8c42, #ff3d00)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 26, fontWeight: 900, color: "#fff",
                boxShadow: "0 8px 28px rgba(255,140,66,0.5)",
              }}>T</div>
              <div style={{ position: "absolute", bottom: 2, right: 2, width: 14, height: 14, borderRadius: "50%", background: "#34d399", border: "2.5px solid #0d0d14", boxShadow: "0 0 8px rgba(52,211,153,0.6)" }} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ color: "#fff", fontSize: 19, fontWeight: 700, letterSpacing: -0.4, lineHeight: 1.2 }}>Traveler</div>
              <div style={{ color: "rgba(255,255,255,0.35)", fontSize: 12, marginTop: 3 }}>Exploring the world ✈️</div>
            </div>
            {/* Stamp badge */}
            <div style={{ flexShrink: 0, width: 52, height: 52, borderRadius: "50%", border: "1.5px dashed rgba(255,140,66,0.38)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ width: 40, height: 40, borderRadius: "50%", border: "1px solid rgba(255,140,66,0.15)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 1 }}>
                <span style={{ fontSize: 5, fontWeight: 800, color: "#ff8c42", letterSpacing: 1.2, textTransform: "uppercase" }}>Navora</span>
                <span style={{ fontSize: 16, lineHeight: 1 }}>✈️</span>
                <span style={{ fontSize: 5, fontWeight: 700, color: "rgba(255,140,66,0.4)" }}>Explore</span>
              </div>
            </div>
          </div>

          {/* Stats row */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8 }}>
            {[
              { v: trips.length,         l: "Trips",     color: "#ff8c42" },
              { v: visitedCities.length, l: "Cities",    color: "#a78bfa" },
              { v: totalDays,            l: "Days",      color: "#34d399" },
            ].map(s => (
              <div key={s.l} style={{ background: "rgba(255,255,255,0.04)", borderRadius: 16, border: "1px solid rgba(255,255,255,0.06)", padding: "13px 0", textAlign: "center" }}>
                <div style={{ fontSize: 28, fontWeight: 800, color: "#fff", letterSpacing: -1.5, lineHeight: 1 }}>{s.v}</div>
                <div style={{ fontSize: 9, color: s.color, fontWeight: 700, letterSpacing: 0.9, textTransform: "uppercase", marginTop: 6, opacity: 0.75 }}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── World map ── */}
      <div className="fp-a" style={{ margin: "0 20px 16px" }}>
        {/* Section label */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <FontAwesomeIcon icon={faEarthAmericas} style={{ width: 10, height: 10, color: "rgba(255,255,255,0.25)" }} />
            <span style={{ color: "rgba(255,255,255,0.25)", fontSize: 10, fontWeight: 700, letterSpacing: 1.2, textTransform: "uppercase" }}>World Map</span>
          </div>
          <span style={{ color: visitedCities.length > 0 ? "rgba(255,140,66,0.65)" : "rgba(255,255,255,0.12)", fontSize: 10, fontWeight: 600 }}>
            {visitedCities.length} {visitedCities.length === 1 ? "pin" : "pins"}
          </span>
        </div>

        {/* Map card */}
        <div style={{ ...glass, borderRadius: 20, overflow: "hidden", position: "relative" }}>
          <img src="/world-dotted.svg" alt="World map" style={{ display: "block", width: "100%", height: "auto", opacity: 0.5 }} />

          {/* Connection lines */}
          {visitedCities.length > 1 && (
            <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", zIndex: 1 }} preserveAspectRatio="none">
              {visitedCities.slice(0, -1).map((city, i) => {
                const p1 = CITY_MAP_POS[city], p2 = CITY_MAP_POS[visitedCities[i + 1]];
                if (!p1 || !p2) return null;
                return <line key={city} x1={`${p1.x}%`} y1={`${p1.y}%`} x2={`${p2.x}%`} y2={`${p2.y}%`} stroke="rgba(255,140,66,0.3)" strokeWidth="1" strokeDasharray="3,5" />;
              })}
            </svg>
          )}

          {/* Pins */}
          {visitedCities.map(city => {
            const pos = CITY_MAP_POS[city];
            if (!pos) return null;
            const isActive = activeCity === city;
            return (
              <button key={city} onClick={() => setActiveCity(isActive ? null : city)} style={{ position: "absolute", left: `${pos.x}%`, top: `${pos.y}%`, transform: "translate(-50%,-50%)", background: "none", border: "none", padding: 0, cursor: "pointer", zIndex: isActive ? 5 : 3 }}>
                <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 20, height: 20, borderRadius: "50%", border: "1.5px solid rgba(255,140,66,0.45)", animation: "fp-pulse 2.5s ease-out infinite" }} />
                <div style={{ width: isActive ? 10 : 7, height: isActive ? 10 : 7, borderRadius: "50%", position: "relative", zIndex: 1, background: isActive ? "#ff8c42" : "#ff8c42cc", boxShadow: isActive ? "0 0 0 2px rgba(255,140,66,0.3), 0 0 12px rgba(255,140,66,0.7)" : "0 0 6px rgba(255,140,66,0.5)", transition: "all 0.18s" }} />
                {isActive && (
                  <div style={{ position: "absolute", bottom: "calc(100% + 8px)", left: "50%", transform: "translateX(-50%)", background: "rgba(15,15,22,0.95)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, padding: "5px 10px", color: "#fff", fontSize: 11, fontWeight: 700, whiteSpace: "nowrap", boxShadow: "0 8px 24px rgba(0,0,0,0.6)", display: "flex", alignItems: "center", gap: 5 }}>
                    <span>{CITY_FLAGS[city] || "📍"}</span>
                    <span>{city}</span>
                    <span style={{ color: "rgba(255,255,255,0.3)", fontSize: 9 }}>{COUNTRY_MAP[city]}</span>
                    <div style={{ position: "absolute", top: "100%", left: "50%", transform: "translateX(-50%)", width: 0, height: 0, borderLeft: "5px solid transparent", borderRight: "5px solid transparent", borderTop: "5px solid rgba(255,255,255,0.08)" }} />
                  </div>
                )}
              </button>
            );
          })}

          {visitedCities.length === 0 && (
            <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8 }}>
              <span style={{ fontSize: 28 }}>🌍</span>
              <p style={{ color: "rgba(255,255,255,0.18)", fontSize: 12, margin: 0, fontWeight: 500 }}>Add trips to mark your footprint</p>
            </div>
          )}
          {visitedCities.length > 0 && (
            <div style={{ position: "absolute", bottom: 9, right: 12, color: "rgba(255,255,255,0.12)", fontSize: 8, fontWeight: 700, letterSpacing: 0.6, textTransform: "uppercase" }}>Tap to explore</div>
          )}
        </div>
      </div>

      {/* ── Visited chips ── */}
      {visitedCities.length > 0 && (
        <div className="fp-a" style={{ margin: "0 20px 16px" }}>
          <p style={{ color: "rgba(255,255,255,0.22)", fontSize: 10, fontWeight: 700, letterSpacing: 1.2, textTransform: "uppercase", margin: "0 0 10px" }}>Visited</p>
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
                  <span style={{ fontSize: 14, lineHeight: 1 }}>{CITY_FLAGS[city] || "✈️"}</span>
                  <span style={{ color: sel ? "#000" : "rgba(255,255,255,0.85)", fontSize: 12, fontWeight: 600 }}>{city}</span>
                  <span style={{ color: sel ? "rgba(0,0,0,0.35)" : "rgba(255,255,255,0.22)", fontSize: 10 }}>· {COUNTRY_MAP[city]}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Collection ── */}
      {visitedCities.length > 0 && (
        <div className="fp-a" style={{ margin: "0 20px 16px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
            <p style={{ color: "rgba(255,255,255,0.22)", fontSize: 10, fontWeight: 700, letterSpacing: 1.2, textTransform: "uppercase", margin: 0 }}>Collection</p>
            <span style={{ color: "rgba(255,255,255,0.18)", fontSize: 10, fontWeight: 600 }}>{visitedCities.filter(c => CITY_IMAGES[c]).length} places</span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8 }}>
            {visitedCities.filter(c => CITY_IMAGES[c]).map(city => (
              <div key={city} style={{ borderRadius: 16, overflow: "hidden", position: "relative", aspectRatio: "2/3", boxShadow: "0 8px 24px rgba(0,0,0,0.5)" }}>
                <img src={CITY_IMAGES[city]} alt={city} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(0,0,0,0) 35%, rgba(0,0,0,0.82) 100%)" }} />
                <div style={{ position: "absolute", top: 8, left: 8, background: "rgba(0,0,0,0.3)", backdropFilter: "blur(6px)", borderRadius: 8, padding: "2px 5px", fontSize: 11 }}>{CITY_FLAGS[city] || "✈️"}</div>
                <div style={{ position: "absolute", bottom: 8, left: 9, right: 9 }}>
                  <div style={{ color: "#fff", fontSize: 11, fontWeight: 700, letterSpacing: -0.2 }}>{city}</div>
                  <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 9, marginTop: 1 }}>{COUNTRY_MAP[city]}</div>
                </div>
              </div>
            ))}
            <Link href="/planner" style={{
              borderRadius: 16, aspectRatio: "2/3", textDecoration: "none",
              background: "rgba(255,255,255,0.02)", border: "1.5px dashed rgba(255,255,255,0.08)",
              display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8,
            }}>
              <div style={{ width: 32, height: 32, borderRadius: "50%", background: "rgba(255,140,66,0.09)", border: "1px solid rgba(255,140,66,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <FontAwesomeIcon icon={faPlus} style={{ width: 11, height: 11, color: "#ff8c42" }} />
              </div>
              <span style={{ color: "rgba(255,255,255,0.18)", fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5 }}>New Trip</span>
            </Link>
          </div>
        </div>
      )}

      {/* ── Account ── */}
      <div className="fp-a" style={{ margin: "0 20px 24px" }}>
        <p style={{ color: "rgba(255,255,255,0.22)", fontSize: 10, fontWeight: 700, letterSpacing: 1.2, textTransform: "uppercase", margin: "0 0 10px" }}>Account</p>
        <div style={{ ...glass, borderRadius: 20, overflow: "hidden" }}>
          {[
            { icon: faBell, label: "Trip Reminders", sub: "Get notified before your trips" },
            { icon: faGear, label: "Settings",        sub: "Preferences & privacy",         last: true },
          ].map((item, i) => (
            <div key={item.label} style={{
              display: "flex", alignItems: "center", gap: 14, padding: "15px 18px",
              borderBottom: item.last ? "none" : "1px solid rgba(255,255,255,0.05)",
              cursor: "pointer",
            }}>
              <div style={{ width: 36, height: 36, borderRadius: 12, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.07)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <FontAwesomeIcon icon={item.icon} style={{ width: 14, height: 14, color: "rgba(255,255,255,0.45)" }} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ color: "rgba(255,255,255,0.9)", fontSize: 14, fontWeight: 500 }}>{item.label}</div>
                <div style={{ color: "rgba(255,255,255,0.28)", fontSize: 11, marginTop: 1 }}>{item.sub}</div>
              </div>
              <FontAwesomeIcon icon={faChevronRight} style={{ width: 9, height: 9, color: "rgba(255,255,255,0.18)", flexShrink: 0 }} />
            </div>
          ))}
        </div>
      </div>

      {/* ── Bottom nav ── */}
      <nav style={{
        position: "fixed", bottom: 0, left: 0, right: 0,
        background: "rgba(9,9,15,0.88)", backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)",
        borderTop: "1px solid rgba(255,255,255,0.07)",
        display: "flex", alignItems: "center", justifyContent: "space-around",
        padding: "10px 0 calc(10px + env(safe-area-inset-bottom))",
        zIndex: 50,
      }}>
        {NAV_ITEMS.map((item, i) => {
          if (item.center) return (
            <Link key="center" href="/planner" style={{ textDecoration: "none" }}>
              <div style={{ width: 52, height: 52, borderRadius: "50%", background: "linear-gradient(135deg, #ff8c42, #ff3d00)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 20px rgba(255,140,66,0.45)" }}>
                <FontAwesomeIcon icon={faPlus} style={{ width: 20, height: 20, color: "#fff" }} />
              </div>
            </Link>
          );
          const active = pathname === item.href;
          return (
            <Link key={i} href={item.href} style={{ textDecoration: "none", display: "flex", flexDirection: "column", alignItems: "center", gap: 4, minWidth: 44 }}>
              <FontAwesomeIcon icon={item.icon} style={{ width: 20, height: 20, color: active ? "#fff" : "rgba(255,255,255,0.32)" }} />
              <span style={{ fontSize: 10, fontWeight: active ? 700 : 400, color: active ? "#fff" : "rgba(255,255,255,0.32)" }}>{item.label}</span>
            </Link>
          );
        })}
      </nav>

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
