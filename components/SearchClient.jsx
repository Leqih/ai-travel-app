"use client";

import Link from "next/link";
import { useState } from "react";
import { listings } from "@/components/data";
import { MapDrawer } from "@/components/Overlays";

export function SearchClient() {
  const [filters, setFilters] = useState({
    verified: false,
    sublet: false,
    shortLease: false,
    budget: "all"
  });

  const filteredListings = listings.filter((listing) => {
    if (filters.verified && !listing.verified) return false;
    if (filters.sublet && !listing.sublet) return false;
    if (filters.shortLease && !listing.shortLease) return false;
    if (filters.budget === "under800" && listing.budgetValue >= 800) return false;
    return true;
  });

  const [activeListing, setActiveListing] = useState(listings[0]);

  const visibleListing =
    filteredListings.find((listing) => listing.id === activeListing?.id) ?? filteredListings[0] ?? null;

  const toggleFilter = (key) => {
    setFilters((current) => ({
      ...current,
      [key]: !current[key]
    }));
  };

  return (
    <main className="page-shell">
      <section className="page-hero search-hero">
        <div>
          <p className="eyebrow">Search Results</p>
          <h1 className="page-title">Housing Near Campus</h1>
          <p className="page-text">Filter by budget, walking time, and listing trust signals so the best student-fit options appear first.</p>
        </div>
        <Link className="page-back" href="/">
          Back Home
        </Link>
      </section>

      <section className="section search-header-panel">
        <div className="search-toolbar">
          <div className="search-field wide">
            <span className="search-label">Area</span>
            <strong>University Loop</strong>
          </div>
          <div className="search-field">
            <span className="search-label">Budget</span>
            <strong>$500-$900</strong>
          </div>
          <div className="search-field">
            <span className="search-label">Commute</span>
            <strong>Within 15 min</strong>
          </div>
        </div>
        <div className="search-mood-row">
          <div className="mood-chip lime-chip">walkable</div>
          <div className="mood-chip blue-chip">verified</div>
          <div className="mood-chip peach-chip">student-only</div>
        </div>
        <div className="filter-row">
          <button
            className={`filter-pill${filters.budget === "under800" ? " active" : ""}`}
            type="button"
            onClick={() =>
              setFilters((current) => ({
                ...current,
                budget: current.budget === "under800" ? "all" : "under800"
              }))
            }
          >
            Under $800
          </button>
          <button
            className={`filter-pill${filters.verified ? " active" : ""}`}
            type="button"
            onClick={() => toggleFilter("verified")}
          >
            Verified only
          </button>
          <button
            className={`filter-pill${filters.sublet ? " active" : ""}`}
            type="button"
            onClick={() => toggleFilter("sublet")}
          >
            Sublets only
          </button>
          <button
            className={`filter-pill${filters.shortLease ? " active" : ""}`}
            type="button"
            onClick={() => toggleFilter("shortLease")}
          >
            Short-term
          </button>
        </div>
      </section>

      <section className="section results-layout">
        <div className="results-column">
          {filteredListings.map((listing) => (
            <article
              key={listing.id}
              className={`result-card${visibleListing?.id === listing.id ? " selected" : ""}`}
              onClick={() => setActiveListing(listing)}
            >
              <div className="result-top">
                <span className={`listing-badge ${listing.badgeTone}`}>{listing.badge}</span>
                <span className="result-score">{listing.score}</span>
              </div>
              <div className="result-graphic">
                <span className="graphic-orb" />
                <span className="graphic-line" />
              </div>
              <h2>{listing.title}</h2>
              <p className="listing-meta">
                {listing.price} · {listing.meta}
              </p>
              <p className="listing-copy">{listing.copy}</p>
              <div className="result-tags">
                {listing.tags.map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>
              <Link className="result-link" href="/detail">
                View details
              </Link>
            </article>
          ))}
          {filteredListings.length === 0 ? (
            <div className="empty-card">
              <strong>No listings match these filters</strong>
              <p>Try widening the budget or turning off conditions like “Sublets only.”</p>
            </div>
          ) : null}
        </div>

        <aside className="map-side">
          <div className="map-panel sticky-panel">
            <div className="map-header">
              <strong>Map Results</strong>
              <span>{filteredListings.length} available</span>
            </div>
            <div className="map-board active">
              <button
                className="pin pin-a pin-button"
                type="button"
                onClick={() => setActiveListing(listings[2])}
              >
                $610
              </button>
              <button
                className="pin pin-b pin-button"
                type="button"
                onClick={() => setActiveListing(listings[0])}
              >
                $920
              </button>
              <button
                className="pin pin-c pin-button"
                type="button"
                onClick={() => setActiveListing(listings[1])}
              >
                $700
              </button>
              <div className="road road-a" />
              <div className="road road-b" />
              <div className="campus-badge">Campus</div>
            </div>
            <div className="map-caption-row">
              <span>Tap a pin</span>
              <span>Open drawer</span>
            </div>
            <MapDrawer listing={visibleListing} onClose={() => setActiveListing(filteredListings[0] ?? null)} />
          </div>
        </aside>
      </section>
    </main>
  );
}
