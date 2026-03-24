"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

const DESTINATIONS = [
  "Tokyo", "Seoul", "Bangkok", "Bali", "Paris",
  "New York", "London", "Rome", "Istanbul", "Dubai",
  "Sydney", "Barcelona", "Kyoto", "Singapore", "Lisbon",
];

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

const NAV_ITEMS = [
  { icon: "⌂", label: "Home", href: "/" },
  { icon: "⊙", label: "Discover", href: "/nearby" },
  { center: true },
  { icon: "✈︎", label: "My Trips", href: "/nearby" },
  { icon: "◉", label: "Profile", href: "/profile" },
];

export default function ManualPlanPage() {
  const router = useRouter();
  const [step, setStep] = useState("setup"); // "setup" | "plan"
  const [destination, setDestination] = useState("");
  const [duration, setDuration] = useState("");
  const [prefs, setPrefs] = useState([]);

  // Itinerary state
  const numDays = parseInt(duration) || 3;
  const [tripDay, setTripDay] = useState(0);
  const [activities, setActivities] = useState({});

  const togglePref = (label) => {
    setPrefs((p) => p.includes(label) ? p.filter((x) => x !== label) : [...p, label]);
  };

  const handleStart = () => {
    if (!destination || !duration) return;
    // Initialize empty days
    const init = {};
    for (let i = 1; i <= numDays; i++) init[i] = [];
    setActivities(init);
    setStep("plan");
  };

  const addSpot = (day) => {
    const name = prompt("Spot name:");
    if (!name) return;
    const time = prompt("Time (e.g. 9:00 AM):", "9:00 AM") || "9:00 AM";
    setActivities((prev) => ({
      ...prev,
      [day]: [...(prev[day] || []), { name, time, category: prefs[0] || "Explore" }],
    }));
  };

  const removeSpot = (day, idx) => {
    setActivities((prev) => ({
      ...prev,
      [day]: prev[day].filter((_, i) => i !== idx),
    }));
  };

  if (step === "setup") {
    return (
      <div className="ct-shell">
        <div className="ct-stars" aria-hidden="true">
          {Array.from({ length: 12 }).map((_, i) => (
            <span key={i} className="pl-star" style={{
              left: `${10 + Math.random() * 80}%`, top: `${5 + Math.random() * 90}%`,
              width: `${1 + Math.random() * 1.5}px`, height: `${1 + Math.random() * 1.5}px`,
              opacity: 0.2 + Math.random() * 0.5, animationDelay: `${Math.random() * 4}s`,
            }} />
          ))}
        </div>

        {/* Header */}
        <div className="mp-header">
          <button className="mp-back" onClick={() => router.back()}>
            <svg width="10" height="16" viewBox="0 0 10 16" fill="none">
              <path d="M8.5 1L1.5 8l7 7" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <span className="mp-badge">CREATE YOUR OWN</span>
          <div style={{ width: 44 }} />
        </div>

        {/* Destination */}
        <div className="mp-section">
          <h2 className="mp-section-title">Where to?</h2>
          <div className="mp-chips">
            {DESTINATIONS.map((d) => (
              <button key={d} className={`mp-chip${destination === d ? " mp-chip-active" : ""}`}
                onClick={() => setDestination(d)}>
                {d}
              </button>
            ))}
          </div>
        </div>

        {/* Duration */}
        <div className="mp-section">
          <h2 className="mp-section-title">How long?</h2>
          <div className="mp-chips">
            {DURATIONS.map((d) => (
              <button key={d} className={`mp-chip${duration === d ? " mp-chip-active" : ""}`}
                onClick={() => setDuration(d)}>
                {d}
              </button>
            ))}
          </div>
        </div>

        {/* Preferences */}
        <div className="mp-section">
          <h2 className="mp-section-title">What do you enjoy?</h2>
          <div className="mp-chips">
            {PREFERENCES.map((p) => (
              <button key={p.label} className={`mp-chip mp-chip-pref${prefs.includes(p.label) ? " mp-chip-active" : ""}`}
                onClick={() => togglePref(p.label)}>
                {p.icon} {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mp-cta-wrap">
          <button className="mp-cta" disabled={!destination || !duration} onClick={handleStart}>
            Start Planning
            <svg width="18" height="14" viewBox="0 0 20 16" fill="none">
              <path d="M1 8h16M13 3l5 5-5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        {/* Nav */}
        <nav className="hp-nav">
          <div className="hp-nav-pill">
            {NAV_ITEMS.map((item, i) =>
              item.center ? (
                <div key="center" className="hp-nav-center-wrap">
                  <Link href="/planner" className="hp-nav-center-btn">
                    <span className="hp-nav-center-icon">+</span>
                  </Link>
                </div>
              ) : (
                <Link key={i} href={item.href} className="hp-nav-item">
                  <span className="hp-nav-icon">{item.icon}</span>
                  <span className="hp-nav-label">{item.label}</span>
                </Link>
              )
            )}
          </div>
        </nav>
      </div>
    );
  }

  // ── Plan / Itinerary Editor ──
  const allActs = tripDay === 0
    ? Object.entries(activities).flatMap(([day, acts]) => acts.map((a) => ({ ...a, day: Number(day) })))
    : (activities[tripDay] || []).map((a) => ({ ...a, day: tripDay }));

  return (
    <div className="mp-plan-shell">
      {/* Top bar */}
      <div className="mp-plan-top">
        <button className="mp-back" onClick={() => setStep("setup")}>
          <svg width="10" height="16" viewBox="0 0 10 16" fill="none">
            <path d="M8.5 1L1.5 8l7 7" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <div className="mp-plan-top-info">
          <h2 className="mp-plan-dest">{destination}</h2>
          <p className="mp-plan-meta">{duration} · {prefs.slice(0, 3).join(", ") || "Custom"}</p>
        </div>
        <div style={{ width: 44 }} />
      </div>

      {/* Day selector */}
      <div className="nd-trip-day-scroll">
        <button className={`nd-trip-day-tab nd-trip-day-text${tripDay === 0 ? " nd-trip-day-text-active" : ""}`}
          onClick={() => setTripDay(0)}>
          <span className="nd-trip-day-num">Total</span>
        </button>
        {Array.from({ length: numDays }, (_, i) => i + 1).map((d) => (
          <button key={d}
            className={`nd-trip-day-tab${tripDay === d ? " nd-trip-day-active" : " nd-trip-day-inactive"}`}
            onClick={() => setTripDay(d)}>
            <span className="nd-trip-day-num">{d}</span>
            <span className="nd-trip-day-label">DAY</span>
          </button>
        ))}
      </div>

      {/* Itinerary body */}
      <div className="mp-plan-body">
        {tripDay === 0 ? (
          // Overview - all days
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
                      <button className="mp-spot-remove" onClick={() => removeSpot(dayNum, idx)}>×</button>
                    </div>
                  ))}
                  {(activities[dayNum] || []).length === 0 && (
                    <p className="mp-empty-hint">No spots yet</p>
                  )}
                </div>
                <button className="mp-add-spot" onClick={() => addSpot(dayNum)}>
                  + Add Spot
                </button>
              </div>
            ))}
          </>
        ) : (
          // Single day detail
          <div className="nd-trip-day-group">
            <div className="nd-trip-day-header">
              <div className="nd-trip-day-badge">{tripDay}</div>
              <span className="nd-trip-day-title">DAY {tripDay}</span>
            </div>
            <div className="nd-trip-activities">
              {(activities[tripDay] || []).map((act, idx) => (
                <div key={idx}>
                  <div className="nd-trip-rich-card">
                    <div className="mp-spot-placeholder">
                      <span className="mp-spot-num">{idx + 1}</span>
                    </div>
                    <div className="nd-trip-rich-content">
                      <p className="nd-trip-rich-title">{idx + 1} · {act.name}</p>
                      <p className="nd-trip-rich-category">{act.category}</p>
                      <p className="nd-trip-rich-meta"><span className="nd-trip-rich-emoji">⏰</span> {act.time}</p>
                    </div>
                    <button className="mp-spot-remove" onClick={() => removeSpot(tripDay, idx)}>×</button>
                  </div>
                </div>
              ))}
              {(activities[tripDay] || []).length === 0 && (
                <p className="mp-empty-hint">No spots added for this day yet</p>
              )}
            </div>
            <button className="mp-add-spot" onClick={() => addSpot(tripDay)}>
              + Add Spot
            </button>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="hp-nav">
        <div className="hp-nav-pill">
          {NAV_ITEMS.map((item, i) =>
            item.center ? (
              <div key="center" className="hp-nav-center-wrap">
                <Link href="/planner" className="hp-nav-center-btn">
                  <span className="hp-nav-center-icon">+</span>
                </Link>
              </div>
            ) : (
              <Link key={i} href={item.href} className="hp-nav-item">
                <span className="hp-nav-icon">{item.icon}</span>
                <span className="hp-nav-label">{item.label}</span>
              </Link>
            )
          )}
        </div>
      </nav>
    </div>
  );
}
