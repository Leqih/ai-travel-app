"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

/* ─── Data ──────────────────────────────────────────────────────── */
const PLAN = [
  { time: "09:00", icon: "✈️", title: "Arrive Narita T3",  note: "JL 7" },
  { time: "13:00", icon: "🏯", title: "Senso-ji Temple",   note: "Asakusa" },
  { time: "18:00", icon: "🍜", title: "Shibuya Food Tour", note: "Meet at Hachiko" },
  { time: "21:00", icon: "🏨", title: "Check-in Hotel",    note: "Shinjuku" },
];

const TRIPS = [
  { id: 1, title: "Japan Classic",   dates: "Mar 20–25", places: 12, img: "https://picsum.photos/seed/japan-torii/300/380",    tag: "Culture", color: "#6c6cff" },
  { id: 2, title: "Seoul Adventure", dates: "Apr 10–13", places: 8,  img: "https://picsum.photos/seed/seoul-night/300/380",    tag: "Food",    color: "#14c8a8" },
  { id: 3, title: "Bangkok Hop",     dates: "May 1–7",   places: 15, img: "https://picsum.photos/seed/bangkok-temple/300/380", tag: "Nature",  color: "#e0a020" },
];

const DISCOVER = [
  { id: 1, title: "Immersive Art",    sub: "Exhibitions & installations", img: "https://picsum.photos/seed/art-exhibit/400/600"  },
  { id: 2, title: "Theme Parks",      sub: "Thrills & memories",          img: "https://picsum.photos/seed/theme-park/400/300"   },
  { id: 3, title: "Craft & Make",     sub: "DIY workshops nearby",        img: "https://picsum.photos/seed/pottery-craft/400/300" },
  { id: 4, title: "Live Music",       sub: "Concerts & festivals",        img: "https://picsum.photos/seed/concert-crowd/400/300" },
];

const TOPICS = [
  { id: 1, tag: "Outdoor",   title: "Japan's Best Hiking Trails", img: "https://picsum.photos/seed/japan-hike/220/160" },
  { id: 2, tag: "Deep Dive", title: "Hidden Alleys of Kyoto",     img: "https://picsum.photos/seed/kyoto-alley/220/160" },
  { id: 3, tag: "Food",      title: "Osaka Street Food Map",      img: "https://picsum.photos/seed/osaka-food/220/160" },
  { id: 4, tag: "Culture",   title: "Festivals & Crafts",         img: "https://picsum.photos/seed/japan-craft/220/160" },
];

const MY_TRIPS = [
  {
    id: 1,
    title: "Japan Classic 5-Day",
    dates: "Mar 20 – Mar 25",
    duration: "5 days · 4 nights",
    places: 12,
    img: "https://picsum.photos/seed/japan-castle/200/200",
    color: "#1e1e2e",
    accent: "#6c6cff",
  },
  {
    id: 2,
    title: "Seoul Adventure",
    dates: "Apr 10 – Apr 13",
    duration: "3 days · 2 nights",
    places: 8,
    img: "https://picsum.photos/seed/seoul-street/200/200",
    color: "#162420",
    accent: "#14c8a8",
  },
];

const CITIES = [
  { city: "Tokyo",   temp: "8°C",  icon: "☁️",  img: "https://picsum.photos/seed/tokyo-tower/120/120",   color: "#4a8fe8" },
  { city: "Seoul",   temp: "12°C", icon: "🌤️", img: "https://picsum.photos/seed/seoul-palace/120/120",  color: "#14c8a8" },
  { city: "Bangkok", temp: "32°C", icon: "☀️",  img: "https://picsum.photos/seed/bangkok-wat/120/120",   color: "#e0a020" },
  { city: "Kyoto",   temp: "10°C", icon: "🌸",  img: "https://picsum.photos/seed/kyoto-shrine/120/120",  color: "#e05f8a" },
  { city: "Osaka",   temp: "11°C", icon: "🌥️", img: "https://picsum.photos/seed/osaka-castle/120/120",  color: "#9b59e0" },
];

const BUDDIES = [
  "https://picsum.photos/seed/face-a/48/48",
  "https://picsum.photos/seed/face-b/48/48",
  "https://picsum.photos/seed/face-c/48/48",
];

const STATS = [
  { emoji: "📍", value: "12", label: "Places",  accent: "#14c8a8" },
  { emoji: "💰", value: "¥45K", label: "Budget", accent: "#e0a020" },
  { emoji: "🌤️", value: "8°C",  label: "Tokyo",  accent: "#4a8fe8" },
  { emoji: "📝", value: "4",    label: "Notes",  accent: "#9b59e0" },
  { emoji: "🗺️", value: "3",    label: "Routes", accent: "#2ab87a" },
];

const NAV_ITEMS = [
  { icon: "⌂",  label: "Home",      href: "/",        active: true  },
  { icon: "⊙",  label: "Discover",  href: "/nearby",  active: false },
  { center: true },
  { icon: "✈︎",  label: "My Trips",  href: "/nearby",  active: false },
  { icon: "◉",  label: "Profile",   href: "/profile", active: false },
];

const TRIP_DATE = new Date("2026-03-20T09:00:00");
const DEST_IMG  = "https://picsum.photos/seed/japan-fuji-hero/700/400";
const TODAY_FEATURED_IMG = "https://picsum.photos/seed/iran-isfahan/700/400";
const TODAY_THUMBS = [
  "https://picsum.photos/seed/iran-bazaar/120/100",
  "https://picsum.photos/seed/iran-mosque/120/100",
  "https://picsum.photos/seed/iran-people/120/100",
];

function pad(n) { return String(n).padStart(2, "0"); }

/* ─── HomeClient ─────────────────────────────────────────────────── */
export function HomeClient() {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Morning" : hour < 18 ? "Afternoon" : "Evening";
  const today = new Date();
  const monthNames = ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"];

  const [planOpen, setPlanOpen] = useState(false);
  const [cd, setCd] = useState({ days: 0, h: "00", m: "00", s: "00" });

  useEffect(() => {
    function tick() {
      const diff = TRIP_DATE - new Date();
      if (diff <= 0) { setCd({ days: 0, h: "00", m: "00", s: "00" }); return; }
      setCd({
        days: Math.floor(diff / 86400000),
        h: pad(Math.floor((diff % 86400000) / 3600000)),
        m: pad(Math.floor((diff % 3600000) / 60000)),
        s: pad(Math.floor((diff % 60000) / 1000)),
      });
    }
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="hp-shell">
      <div className="hp-scroll">

        {/* ══ 1. Header — dotted dark bg ══ */}
        <div className="hp-header">
          <div className="hp-topbar">
            <div className="hp-topbar-left">
              <div className="hp-hey-row">
                <span className="hp-wave">👋</span>
                <span className="hp-hey">Hey Leqi</span>
              </div>
              <div className="hp-greeting">Good <strong>{greeting}</strong></div>
            </div>
            <div className="hp-avatar" />
          </div>

          {/* ── Countdown hero card (expandable) ── */}
          <div className="hp-cd-card">
            <img className="hp-cd-img" src={DEST_IMG} alt="Destination" />
            <div className="hp-cd-overlay" />

            {/* Countdown view */}
            <div className={`hp-cd-count-view${planOpen ? " hp-cd-hidden" : ""}`}>
              <div className="hp-cd-top">
                <span className="hp-cd-trip">Trip to Japan</span>
                <span className="hp-cd-badge">March 20</span>
              </div>
              <div className="hp-cd-main">In {cd.days} days</div>
              <div className="hp-cd-timer">
                <span className="hp-cd-digits">{cd.h}</span>
                <span className="hp-cd-sep">:</span>
                <span className="hp-cd-digits">{cd.m}</span>
                <span className="hp-cd-sep">:</span>
                <span className="hp-cd-digits">{cd.s}</span>
              </div>
              {/* Toggle to plan */}
              <button className="hp-cd-plan-toggle" onClick={() => setPlanOpen(true)}>
                <span>Day 1 Itinerary</span>
                <span className="hp-cd-toggle-arrow">›</span>
              </button>
            </div>

            {/* Today's plan view */}
            <div className={`hp-cd-plan-view${planOpen ? " hp-cd-plan-open" : ""}`}>
              <div className="hp-cd-plan-header">
                <span className="hp-cd-plan-title">Day 1 · Tokyo</span>
                <button className="hp-cd-plan-close" onClick={() => setPlanOpen(false)}>✕</button>
              </div>
              <div className="hp-cd-plan-list">
                {PLAN.map((item, i) => (
                  <div key={i} className="hp-cd-plan-row">
                    <span className="hp-cd-plan-time">{item.time}</span>
                    <span className="hp-cd-plan-icon">{item.icon}</span>
                    <div className="hp-cd-plan-info">
                      <span className="hp-cd-plan-name">{item.title}</span>
                      <span className="hp-cd-plan-note">{item.note}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ══ 2. Today's Pick ══ */}
        <div className="hp-section-hd">
          <div className="hp-today-date-label">
            <span className="hp-today-day">{today.getDate()}</span>
            <div className="hp-today-month-year">
              <span className="hp-today-month">{monthNames[today.getMonth()]}</span>
              <span className="hp-today-year">{today.getFullYear()}</span>
            </div>
            <span className="hp-today-title-text">Today's Pick</span>
          </div>
          <Link href="/nearby" className="hp-section-link">See more</Link>
        </div>

        <div className="hp-featured-card">
          <img className="hp-featured-img" src={TODAY_FEATURED_IMG} alt="Featured" />
          <div className="hp-featured-overlay" />
          <div className="hp-featured-content">
            <p className="hp-featured-tag">🌍 Cultural Exploration</p>
            <p className="hp-featured-title">Iran: Ancient Cities at the<br />Crossroads of Civilization</p>
          </div>
          <div className="hp-featured-thumbs">
            {TODAY_THUMBS.map((src, i) => (
              <img key={i} className="hp-featured-thumb" src={src} alt="" />
            ))}
          </div>
        </div>

        {/* ══ 3. Travel Hub — bento 2×2 ══ */}
        <div className="hp-section-hd" style={{ marginTop: 28 }}>
          <span className="hp-section-title">Travel Hub</span>
        </div>

        <div className="hp-bento">
          {/* Guide — tall left with floating badges */}
          <Link href="/nearby" className="hp-bento-card hp-bento-guide">
            <img className="hp-bento-bg" src="https://picsum.photos/seed/japan-mountain/300/500" alt="" />
            <div className="hp-bento-dim" />
            {/* top weather badge */}
            <div className="hp-bento-weather-pill">
              <span className="hp-bento-weather-temp">8°C</span>
              <div className="hp-bento-weather-right">
                <span className="hp-bento-weather-label">Temperature</span>
                <span className="hp-bento-weather-sub">Tokyo · Now</span>
              </div>
            </div>
            {/* bottom social pill */}
            <div className="hp-bento-social-pill">
              ✦ 198 travelers
            </div>
            <div className="hp-bento-guide-body">
              <p className="hp-bento-guide-head">The Ultimate</p>
              <p className="hp-bento-guide-italic">Japan Guide</p>
            </div>
          </Link>

          {/* Saved places */}
          <Link href="/nearby" className="hp-bento-card hp-bento-saved">
            <img className="hp-bento-bg" src="https://picsum.photos/seed/desert-dunes/300/320" alt="" />
            <div className="hp-bento-saved-dim" />
            <span className="hp-bento-big-num">32<span className="hp-bento-plus">+</span></span>
            <div>
              <p className="hp-bento-saved-label">Your Favorite</p>
              <p className="hp-bento-saved-italic"><em>places</em></p>
            </div>
          </Link>

          {/* Travel crew */}
          <Link href="/nearby" className="hp-bento-card hp-bento-crew">
            <img className="hp-bento-bg" src="https://picsum.photos/seed/city-balloon/300/260" alt="" />
            <div className="hp-bento-crew-dim" />
            <div className="hp-bento-crew-top">
              <p className="hp-bento-crew-label">Travel Crew</p>
              <div className="hp-bento-crew-dest">
                <span className="hp-bento-crew-arrow">→</span>
                <span className="hp-bento-crew-trip">Tokyo · Mar 20</span>
              </div>
            </div>
            <div className="hp-bento-avatars">
              {BUDDIES.map((src, i) => (
                <img key={i} className="hp-bento-avatar" src={src} alt="" style={{ marginLeft: i ? -10 : 0 }} />
              ))}
              <span className="hp-bento-avatar-more">4+</span>
            </div>
          </Link>
        </div>

        {/* ══ 4. Your Trips — compact horizontal ══ */}
        <div className="hp-section-hd">
          <div>
            <span className="hp-section-title">Your Trips</span>
            <p className="hp-section-sub">3 upcoming</p>
          </div>
          <button className="hp-section-link">+ New</button>
        </div>

        <div className="hp-trips-scroll">
          {TRIPS.map((trip) => (
            <Link key={trip.id} href="/nearby" className="hp-trip-card">
              <img className="hp-trip-img" src={trip.img} alt={trip.title} />
              <div className="hp-trip-grad" />
              <span className="hp-trip-tag">{trip.tag}</span>
              <div className="hp-trip-info">
                <p className="hp-trip-title">{trip.title}</p>
                <p className="hp-trip-meta">{trip.dates} · {trip.places} places</p>
              </div>
              <div className="hp-trip-dot" style={{ background: trip.color }} />
            </Link>
          ))}
        </div>

        {/* My Itineraries lives in the Trips tab — see nav */}

        {/* ══ 6. Featured Topics ══ */}
        <div className="hp-section-hd">
          <span className="hp-section-title">Featured Topics</span>
          <Link href="/nearby" className="hp-section-link">All ›</Link>
        </div>

        <div className="hp-topics-scroll">
          {TOPICS.map((t) => (
            <Link key={t.id} href="/nearby" className="hp-topic-card">
              <img className="hp-topic-img" src={t.img} alt={t.title} />
              <div className="hp-topic-grad" />
              <span className="hp-topic-tag">{t.tag}</span>
              <p className="hp-topic-title">{t.title}</p>
            </Link>
          ))}
        </div>

        {/* ══ 7. Discover ══ */}
        <div className="hp-section-hd">
          <div>
            <span className="hp-section-title">Discover</span>
            <p className="hp-section-sub">Curated for your style</p>
          </div>
          <Link href="/nearby" className="hp-section-link">All ›</Link>
        </div>

        <div className="hp-disc-grid">
          {/* Left — tall card spanning both rows */}
          <Link href="/nearby" className="hp-disc-cell hp-disc-tall">
            <img className="hp-disc-img" src={DISCOVER[0].img} alt={DISCOVER[0].title} />
            <div className="hp-disc-grad" />
            <div className="hp-disc-label">
              <p className="hp-disc-title">{DISCOVER[0].title}</p>
              <p className="hp-disc-sub">{DISCOVER[0].sub}</p>
            </div>
          </Link>
          {/* Right column — two stacked */}
          {DISCOVER.slice(1, 3).map((item) => (
            <Link key={item.id} href="/nearby" className="hp-disc-cell hp-disc-short">
              <img className="hp-disc-img" src={item.img} alt={item.title} />
              <div className="hp-disc-grad" />
              <div className="hp-disc-label">
                <p className="hp-disc-title">{item.title}</p>
                <p className="hp-disc-sub">{item.sub}</p>
              </div>
            </Link>
          ))}
        </div>

        <div style={{ height: 112 }} />
      </div>

      {/* ── Bottom nav ── */}
      <nav className="hp-nav">
        <div className="hp-nav-pill">
          {NAV_ITEMS.map((item, i) => {
            if (item.center) {
              return (
                <div key="center" className="hp-nav-center-wrap">
                  <Link href="/nearby" className="hp-nav-center-btn">
                    <span className="hp-nav-center-icon">+</span>
                  </Link>
                </div>
              );
            }
            return (
              <Link key={i} href={item.href}
                className={`hp-nav-item${item.active ? " hp-nav-active" : ""}`}>
                <span className="hp-nav-icon">{item.icon}</span>
                <span className="hp-nav-label">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
