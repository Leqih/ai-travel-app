"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse, faCompass, faPlane, faCircleUser, faPlus } from "@fortawesome/free-solid-svg-icons";

const NAV_ITEMS = [
  { icon: faHouse,      label: "Home",      href: "/"        },
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
        {Array.from({ length: 12 }).map((_, i) => (
          <span
            key={i}
            className="pl-star"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${1 + Math.random() * 1.5}px`,
              height: `${1 + Math.random() * 1.5}px`,
              opacity: 0.2 + Math.random() * 0.5,
              animationDelay: `${Math.random() * 4}s`,
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

      {/* Nav */}
      <nav className="hp-nav">
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
