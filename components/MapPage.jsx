"use client";

import Link from "next/link";
import { useState } from "react";
import { listings } from "@/components/data";
import { MapFilterSheet } from "@/components/Overlays";

export function MapPage() {
  const [filterOpen, setFilterOpen] = useState(false);

  return (
    <>
      <main className="mobile-map-shell app-mobile-shell">
        <section className="map-search-top">
        <Link className="page-back" href="/">
          Back
        </Link>
          <div className="search-input-large map-search-input">
            <span className="search-label">Hill Park 8th Street</span>
            <strong>Near Campus</strong>
          </div>
          <button className="icon-button filter-trigger" type="button" onClick={() => setFilterOpen(true)} aria-label="Open filters">
            <span className="filter-icon-lines" />
          </button>
        </section>

        <section className="full-map-card">
          <div className="map-board active full-map">
            <button className="pin pin-a pin-button" type="button">
              $610
            </button>
            <button className="pin pin-b pin-button" type="button">
              $920
            </button>
            <button className="pin pin-c pin-button" type="button">
              $700
            </button>
            <div className="road road-a" />
            <div className="road road-b" />
          </div>
        </section>

        <section className="map-list-card">
          <div className="section-row">
            <h2>More Recommendations</h2>
            <Link className="section-link" href="/search">
              See all
            </Link>
          </div>
          <div className="map-recommend-list">
            {listings.map((listing) => (
              <article key={listing.id} className="map-recommend-item">
                <div className="recommend-thumb" />
                <div>
                  <strong>{listing.title}</strong>
                  <p>{listing.distance}</p>
                </div>
                <span className="recommend-price">{listing.price}</span>
              </article>
            ))}
          </div>
        </section>
      </main>

      <MapFilterSheet open={filterOpen} onClose={() => setFilterOpen(false)} />
    </>
  );
}
