"use client";
import Link from "next/link";
import dynamic from "next/dynamic";
const Grainient = dynamic(() => import("./Grainient"), { ssr: false });
import { usePathname } from "next/navigation";
import { useMemo } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse, faCompass, faPlane, faCircleUser, faPlus } from "@fortawesome/free-solid-svg-icons";

// Fixed star positions — avoids SSR/client Math.random() hydration mismatch
const STARS = [
  { l: 8,  t: 14, w: 1.2, h: 1.2, o: 0.55, d: 1.2 },
  { l: 23, t: 72, w: 1.8, h: 1.8, o: 0.30, d: 0.4 },
  { l: 41, t: 5,  w: 1.0, h: 1.0, o: 0.45, d: 2.7 },
  { l: 57, t: 88, w: 2.2, h: 2.2, o: 0.60, d: 0.9 },
  { l: 68, t: 33, w: 1.5, h: 1.5, o: 0.25, d: 3.1 },
  { l: 79, t: 61, w: 1.1, h: 1.1, o: 0.50, d: 1.8 },
  { l: 15, t: 48, w: 2.0, h: 2.0, o: 0.35, d: 0.6 },
  { l: 34, t: 91, w: 1.3, h: 1.3, o: 0.65, d: 2.3 },
  { l: 50, t: 22, w: 1.7, h: 1.7, o: 0.40, d: 3.8 },
  { l: 63, t: 77, w: 1.0, h: 1.0, o: 0.28, d: 1.5 },
  { l: 88, t: 10, w: 2.4, h: 2.4, o: 0.55, d: 0.2 },
  { l: 93, t: 54, w: 1.6, h: 1.6, o: 0.42, d: 2.9 },
];

const NAV_ITEMS = [
  { icon: faHouse,      label: "Home",      href: "/home"   },
  { icon: faCompass,    label: "Discover",  href: "/nearby"  },
  { center: true },
  { icon: faPlane,      label: "My Trips",  href: "/trips"   },
  { icon: faCircleUser, label: "Profile",   href: "/profile" },
];

export function CreateTripPage() {
  const pathname = usePathname();
  return (
    <div className="ct-shell">
      {/* Star field */}
      <div className="ct-stars" aria-hidden="true">
        {STARS.map((s, i) => (
          <span
            key={i}
            className="pl-star"
            style={{
              left: `${s.l}%`,
              top: `${s.t}%`,
              width: `${s.w}px`,
              height: `${s.h}px`,
              opacity: s.o,
              animationDelay: `${s.d}s`,
            }}
          />
        ))}
      </div>

      {/* Title */}
      <div className="ct-title-area">
        <h1 className="ct-title">How Would You<br />Like To Plan?</h1>
        <p className="ct-subtitle">Choose your preferred way to create a trip</p>
      </div>

      {/* Cards */}
      <div className="ct-cards">
        {/* AI Generate */}
        <Link href="/planner/ai" className="ct-card ct-card-ai">
          <div className="ct-card-icon-wrap ct-card-icon-ai">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <path d="M12 2l2.09 6.26L20.18 10l-6.09 1.74L12 18l-2.09-6.26L3.82 10l6.09-1.74L12 2z" fill="#fff"/>
              <path d="M18 14l1.05 3.13L22.18 18l-3.13.87L18 22l-1.05-3.13L13.82 18l3.13-.87L18 14z" fill="rgba(255,255,255,0.6)"/>
            </svg>
          </div>
          <div className="ct-card-content">
            <h3 className="ct-card-title">AI Travel Planner</h3>
            <p className="ct-card-desc">Let AI craft a personalized itinerary based on your preferences</p>
          </div>
          <div className="ct-card-arrow">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M6 4l4 4-4 4" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </Link>

        {/* Manual */}
        <Link href="/planner/manual" className="ct-card ct-card-manual">
          <div className="ct-card-icon-wrap ct-card-icon-manual">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <path d="M12 20h9M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className="ct-card-content">
            <h3 className="ct-card-title">Create Your Own</h3>
            <p className="ct-card-desc">Build your trip manually with full control over every detail</p>
          </div>
          <div className="ct-card-arrow">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M6 4l4 4-4 4" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </Link>

        {/* Import from Airbnb */}
        <Link href="/planner/import" className="ct-card ct-card-import">
          <div className="ct-card-icon-wrap ct-card-icon-import">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M14 8h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className="ct-card-content">
            <h3 className="ct-card-title">Import from Airbnb</h3>
            <p className="ct-card-desc">Paste a shared Airbnb link to auto-generate your travel plan</p>
          </div>
          <div className="ct-card-arrow">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M6 4l4 4-4 4" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </Link>
      </div>

    </div>
  );
}
