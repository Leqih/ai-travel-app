"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
const Grainient = dynamic(() => import("@/components/Grainient"), { ssr: false });
import { usePathname } from "next/navigation";
import { gsap } from "gsap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse, faCompass, faPlane, faCircleUser, faPlus, faChevronRight, faTrash } from "@fortawesome/free-solid-svg-icons";

const NAV_ITEMS = [
  { icon: faHouse,      label: "Home",      href: "/"        },
  { icon: faCompass,    label: "Discover",  href: "/nearby"  },
  { center: true },
  { icon: faPlane,      label: "My Trips",  href: "/trips"   },
  { icon: faCircleUser, label: "Profile",   href: "/profile" },
];

const CITY_IMAGES = {
  "Tokyo":     "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=600&h=400&fit=crop",
  "Seoul":     "https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?w=600&h=400&fit=crop",
  "Bangkok":   "https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=600&h=400&fit=crop",
  "Bali":      "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&h=400&fit=crop",
  "Paris":     "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600&h=400&fit=crop",
  "New York":  "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=600&h=400&fit=crop",
  "London":    "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=600&h=400&fit=crop",
  "Rome":      "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=600&h=400&fit=crop",
  "Istanbul":  "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=600&h=400&fit=crop",
  "Dubai":     "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600&h=400&fit=crop",
  "Sydney":    "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=600&h=400&fit=crop",
  "Barcelona": "https://images.unsplash.com/photo-1583422409516-2895a77efded?w=600&h=400&fit=crop",
  "Kyoto":     "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=600&h=400&fit=crop",
  "Singapore": "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=600&h=400&fit=crop",
  "Lisbon":    "https://images.unsplash.com/photo-1585208798174-6cedd86e019a?w=600&h=400&fit=crop",
};

const CITY_FLAGS = {
  "Tokyo": "🇯🇵", "Seoul": "🇰🇷", "Bangkok": "🇹🇭", "Bali": "🇮🇩",
  "Paris": "🇫🇷", "New York": "🇺🇸", "London": "🇬🇧", "Rome": "🇮🇹",
  "Istanbul": "🇹🇷", "Dubai": "🇦🇪", "Sydney": "🇦🇺", "Barcelona": "🇪🇸",
  "Kyoto": "🇯🇵", "Singapore": "🇸🇬", "Lisbon": "🇵🇹",
};

function activityCount(activities) {
  if (!activities) return 0;
  return Object.values(activities).reduce((s, a) => s + (a?.length || 0), 0);
}

function makeTripTitle(dest, prefs) {
  if (!dest) return "My Trip";
  if (!prefs || prefs.length === 0) return `${dest} Getaway`;
  const map = {
    "Culture": d => `${d} Cultural Journey`,
    "Food":    d => `${d} Food & Flavours`,
    "Nature":  d => `${d} Nature Escape`,
    "Art":     d => `${d} Art Explorer`,
    "Adventure": d => `${d} Adventure`,
    "Shopping": d => `${d} Shopping Spree`,
    "Photography": d => `${d} Through the Lens`,
    "Nightlife": d => `${d} Nights`,
  };
  const fn = map[prefs[0]];
  return fn ? fn(dest) : `${dest} Getaway`;
}

export default function TripsPage() {
  const pathname = usePathname();
  const [trips, setTrips] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const shellRef = useRef(null);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("opal_trips") || "[]");
      setTrips(saved);
    } catch (_) {}
  }, []);

  useEffect(() => {
    if (!shellRef.current) return;
    const sections = shellRef.current.querySelectorAll(".ct-header, .ct-trip-list");
    gsap.fromTo(sections,
      { opacity: 0, y: 50, filter: "blur(8px)" },
      { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.7, ease: "power3.out", stagger: 0.06 }
    );
  }, []);

  function deleteTrip(id) {
    const updated = trips.filter(t => t.id !== id);
    setTrips(updated);
    try { localStorage.setItem("opal_trips", JSON.stringify(updated)); } catch (_) {}
  }

  return (
    <div className="ct-shell" ref={shellRef} style={{ background: "#09090f", minHeight: "100vh", paddingBottom: 100 }}>
      {/* Header */}
      <div className="ct-header" style={{ padding: "60px 20px 12px", display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
        <div>
          <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 12, fontWeight: 600, letterSpacing: 1, textTransform: "uppercase", margin: "0 0 4px" }}>
            {trips.length > 0 ? `${trips.length} ${trips.length === 1 ? "trip" : "trips"}` : "Travel"}
          </p>
          <h1 style={{ color: "#fff", fontSize: 22, fontWeight: 700, margin: 0, letterSpacing: -0.3 }}>My Trips</h1>
        </div>
        {trips.length > 0 && (
          <button
            onClick={() => setEditMode(e => !e)}
            style={{
              height: 34, padding: "0 18px", borderRadius: 20, cursor: "pointer",
              border: "none",
              background: editMode ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.06)",
              color: editMode ? "#fff" : "rgba(255,255,255,0.55)",
              fontSize: 13, fontWeight: 600, letterSpacing: 0.1,
              backdropFilter: "blur(8px)",
            }}>
            {editMode ? "Done" : "Edit"}
          </button>
        )}
      </div>

      {/* Trips list */}
      <div className="ct-trip-list" style={{ padding: "12px 20px", display: "flex", flexDirection: "column", gap: 16 }}>
        {trips.length === 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {/* Ghost hero card */}
            <Link href="/planner" style={{
              textDecoration: "none", position: "relative",
              display: "flex", flexDirection: "column", justifyContent: "flex-end",
              height: 240, borderRadius: 20, overflow: "hidden",
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.07)",
            }}>
              {/* City silhouette */}
              <svg viewBox="0 0 375 120" preserveAspectRatio="xMidYMax meet"
                style={{ position: "absolute", bottom: 60, left: 0, right: 0, width: "100%", opacity: 0.07 }}>
                <path d="M0,120 L0,80 L20,80 L20,60 L30,60 L30,40 L40,40 L40,60 L55,60 L55,70 L65,70 L65,50 L75,50 L75,30 L85,30 L85,50 L95,50 L95,70 L105,70 L105,55 L115,55 L115,35 L125,35 L125,55 L135,55 L135,70 L145,70 L145,45 L155,45 L155,25 L165,25 L165,45 L175,45 L175,65 L190,65 L190,40 L200,40 L200,20 L210,20 L210,40 L220,40 L220,60 L230,60 L230,45 L240,45 L240,65 L255,65 L255,50 L265,50 L265,35 L275,35 L275,50 L285,50 L285,70 L295,70 L295,55 L310,55 L310,75 L325,75 L325,60 L340,60 L340,80 L355,80 L355,90 L375,90 L375,120 Z"
                  fill="rgba(255,255,255,1)" />
              </svg>
              {/* Bottom fade */}
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(0deg, rgba(0,0,0,0.7) 0%, transparent 60%)" }} />
              {/* Top tag */}
              <div style={{
                position: "absolute", top: 14, left: 14,
                background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)",
                backdropFilter: "blur(8px)", color: "rgba(255,255,255,0.6)",
                fontSize: 10, fontWeight: 700, padding: "4px 10px", borderRadius: 20,
                letterSpacing: 0.8, textTransform: "uppercase",
              }}>No trips yet</div>
              {/* Card body */}
              <div style={{ position: "relative", padding: "0 16px 18px", zIndex: 2 }}>
                <p style={{ color: "#fff", fontSize: 22, fontWeight: 800, margin: "0 0 14px", letterSpacing: -0.5, lineHeight: 1.2 }}>Where to next?</p>
                <span style={{
                  display: "inline-flex", alignItems: "center", gap: 6,
                  background: "#fff", color: "#000",
                  fontSize: 12, fontWeight: 700, padding: "9px 20px", borderRadius: 99,
                  letterSpacing: 0.5, textTransform: "uppercase",
                }}>
                  Start planning
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                    <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
              </div>
            </Link>

            {/* Two ghost placeholder cards */}
            <div style={{ display: "flex", gap: 12 }}>
              {[0, 1].map(i => (
                <div key={i} style={{
                  flex: 1, height: 140, borderRadius: 18,
                  background: "rgba(255,255,255,0.02)",
                  border: "1px dashed rgba(255,255,255,0.07)",
                }} />
              ))}
            </div>
          </div>
        )}

        {trips.map((trip, idx) => {
          const img = CITY_IMAGES[trip.destination];
          const flag = CITY_FLAGS[trip.destination] || "✈️";
          const title = makeTripTitle(trip.destination, trip.prefs);
          const count = activityCount(trip.activities);
          const href = `/planner/manual?city=${encodeURIComponent(trip.destination || "")}&duration=${encodeURIComponent(trip.duration || "")}&prefs=${encodeURIComponent((trip.prefs || []).join(","))}&id=${trip.id}`;

          // Status badge
          const getStatus = () => {
            if (!trip.startDate) return null;
            const start = new Date(trip.startDate + "T00:00:00");
            const days = parseInt(trip.duration) || 0;
            const end = new Date(start); end.setDate(end.getDate() + days - 1);
            const now = new Date();
            if (now < start) return { label: "Upcoming", color: "#ff8c42" };
            if (now <= end) return { label: "Ongoing", color: "#4ade80" };
            return { label: "Past", color: "rgba(255,255,255,0.35)" };
          };
          const status = getStatus();

          // Tag label — prefs or fallback
          const tagLabel = trip.prefs?.length > 0 ? (Array.isArray(trip.prefs) ? trip.prefs[0] : trip.prefs) : (trip.destination || "Trip");

          const card = (
            <div className="hp-trip-card" style={{ width: "100%", height: 220, borderRadius: 20, flexShrink: "unset" }}>
              {img
                ? <img className="hp-trip-img" src={img} alt={trip.destination} />
                : <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg,#1a1a2e,#0d0d1a)" }} />
              }
              <div className="hp-trip-grad" />

              {/* Top-left tag */}
              <span className="hp-trip-tag">{tagLabel}</span>

              {/* Top-right: status pill or delete */}
              <div style={{ position: "absolute", top: 12, right: 12, zIndex: 2, display: "flex", gap: 6, alignItems: "center" }}>
                {status && (
                  <span style={{
                    background: "rgba(20,20,20,0.7)", backdropFilter: "blur(8px)",
                    color: status.color, fontSize: 10, fontWeight: 700,
                    padding: "3px 9px", borderRadius: 16, letterSpacing: 0.3,
                  }}>{status.label}</span>
                )}
                {editMode && (
                  <button
                    onClick={e => { e.preventDefault(); e.stopPropagation(); deleteTrip(trip.id); }}
                    style={{
                      width: 28, height: 28, borderRadius: "50%",
                      background: "rgba(220,38,38,0.85)", border: "none", cursor: "pointer",
                      display: "flex", alignItems: "center", justifyContent: "center", padding: 0,
                    }}>
                    <FontAwesomeIcon icon={faTrash} style={{ width: 11, height: 11, color: "#fff" }} />
                  </button>
                )}
              </div>

              {/* Info */}
              <div className="hp-trip-info" style={{ bottom: 50 }}>
                <p className="hp-trip-title" style={{ fontSize: 18, fontWeight: 800, letterSpacing: -0.3 }}>
                  {flag} {trip.destination}
                </p>
                <p className="hp-trip-meta" style={{ fontSize: 11, marginTop: 3 }}>
                  {[trip.duration, count > 0 && `${count} places`].filter(Boolean).join(" · ")}
                </p>
              </div>

              {/* Action button — exact Home style */}
              {!editMode && (
                <div className="hp-trip-action-btn">→ Open</div>
              )}
            </div>
          );

          return editMode ? (
            <div key={trip.id}>{card}</div>
          ) : (
            <Link key={trip.id} href={href} style={{ textDecoration: "none" }}>{card}</Link>
          );
        })}
      </div>

      {/* Bottom nav */}
      <nav className="hp-nav" style={{ position: "fixed", bottom: 0, left: 0, right: 0 }}>
        <div className="hp-nav-pill">
          {NAV_ITEMS.map((item, i) =>
            item.center ? (
              <div key="center" className="hp-nav-center-wrap">
                <Link href="/planner" className="hp-nav-center-btn" style={{ overflow: "hidden", position: "relative" }}>
                  {pathname === '/planner' ? (
                    <div style={{ position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none", borderRadius: "50%" }}>
                      <Grainient color1="#F97316" color2="#396cbf" color3="#B497CF" timeSpeed={0.25} warpStrength={1} warpFrequency={5} warpSpeed={2} warpAmplitude={50} rotationAmount={500} grainAmount={0.1} contrast={1.5} zoom={0.9} />
                    </div>
                  ) : (
                    <div style={{ position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none", borderRadius: "50%", background: "linear-gradient(135deg, #F97316 0%, #396cbf 60%, #B497CF 100%)" }} />
                  )}
                  <FontAwesomeIcon icon={faPlus} style={{ width: 18, height: 18, color: "white", position: "relative", zIndex: 1 }} />
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
    </div>
  );
}
