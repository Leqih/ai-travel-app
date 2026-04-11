"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
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
              border: editMode ? "1px solid rgba(255,255,255,0.25)" : "1px solid rgba(255,255,255,0.1)",
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
          <div style={{ textAlign: "center", paddingTop: 80 }}>
            <div style={{
              width: 72, height: 72, borderRadius: "50%",
              background: "rgba(255,140,66,0.1)",
              border: "1px solid rgba(255,140,66,0.2)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 32, margin: "0 auto 20px",
            }}>✈️</div>
            <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 17, fontWeight: 600, margin: "0 0 6px" }}>No trips yet</p>
            <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 14, margin: 0 }}>Tap + to plan your first adventure</p>
          </div>
        )}

        {trips.map(trip => {
          const img = CITY_IMAGES[trip.destination];
          const flag = CITY_FLAGS[trip.destination] || "✈️";
          const title = makeTripTitle(trip.destination, trip.prefs);
          const count = activityCount(trip.activities);
          const href = `/planner/manual?city=${encodeURIComponent(trip.destination || "")}&duration=${encodeURIComponent(trip.duration || "")}&prefs=${encodeURIComponent((trip.prefs || []).join(","))}&id=${trip.id}`;


          const card = (
            <div style={{
              borderRadius: 18, overflow: "hidden", position: "relative",
              height: 240, background: "#111",
            }}>
              {/* Full-bleed image — same as hp-trip-img */}
              {img
                ? <img src={img} alt={trip.destination} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
                : <div style={{ position: "absolute", inset: 0, background: "#111" }} />
              }
              {/* Gradient — exact match hp-trip-grad */}
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(0deg, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.1) 55%, transparent 100%)" }} />

              {/* Top-left: trip name chip */}
              <div style={{
                position: "absolute", top: 12, left: 12, zIndex: 2,
                background: "rgba(20,20,20,0.7)",
                backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)",
                border: "1px solid rgba(255,255,255,0.08)",
                color: "#fff", fontSize: 11, fontWeight: 600,
                padding: "3px 9px", borderRadius: 16,
                maxWidth: "60%", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
              }}>{title}</div>

              {/* Top-right: delete (edit mode only) */}
              {editMode && (
                <button
                  onClick={e => { e.preventDefault(); e.stopPropagation(); deleteTrip(trip.id); }}
                  style={{
                    position: "absolute", top: 10, right: 10, zIndex: 2,
                    width: 32, height: 32, borderRadius: "50%",
                    background: "rgba(220,38,38,0.85)", backdropFilter: "blur(8px)",
                    border: "1px solid rgba(255,255,255,0.15)",
                    cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                    padding: 0, boxShadow: "none",
                  }}>
                  <FontAwesomeIcon icon={faTrash} style={{ width: 12, height: 12, color: "#fff" }} />
                </button>
              )}

              {/* Info — exact match hp-trip-info position */}
              <div style={{ position: "absolute", bottom: 48, left: 14, right: 14, zIndex: 2 }}>
                <p style={{ margin: 0, fontFamily: `-apple-system,"SF Pro Display","Helvetica Neue",sans-serif`, fontSize: 17, fontWeight: 700, color: "#fff", lineHeight: 1.2 }}>
                  {flag} {trip.destination}
                </p>
                <p style={{ margin: "3px 0 0", fontSize: 10, color: "rgba(255,255,255,0.55)" }}>
                  {[trip.duration, count > 0 && `${count} places`].filter(Boolean).join(" · ")}
                </p>
              </div>

              {/* Button — exact match hp-trip-action-btn */}
              {!editMode && (
                <div style={{
                  position: "absolute", bottom: 10, left: 10, right: 10, zIndex: 3,
                  background: "#fff", color: "#000",
                  fontSize: 12, fontWeight: 700,
                  padding: "8px 0", borderRadius: 16,
                  textAlign: "center", letterSpacing: 0.1,
                }}>→ Open</div>
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
    </div>
  );
}
