"use client";

import Link from "next/link";
import { useState } from "react";
import { listings } from "@/components/data";

export function DetailClient() {
  const listing = listings[0];
  const [activeGalleryIndex, setActiveGalleryIndex] = useState(0);

  return (
    <main className="mobile-detail-shell app-mobile-shell">
      <section className="detail-topbar">
        <Link className="page-back" href="/">
          Back
        </Link>
        <h1 className="detail-title">Property Detail</h1>
        <button className="icon-button" type="button">
          ♡
        </button>
      </section>

      <section className="detail-hero-card">
        <div className="detail-hero-media">
          <div className="gallery-room detail-art-room">
            <div className="detail-art-window" />
            <div className="detail-art-bed" />
            <div className="detail-art-lamp" />
          </div>
        </div>
        <div className="detail-price-row">
          <div>
            <h2>{listing.title}</h2>
            <p>Brookside Estate</p>
          </div>
          <strong className="detail-price">{listing.price}</strong>
        </div>
      </section>

      <section className="detail-spec-grid">
        <article className="detail-stat">
          <strong>1</strong>
          <span>Bed</span>
        </article>
        <article className="detail-stat">
          <strong>1</strong>
          <span>Bath</span>
        </article>
        <article className="detail-stat">
          <strong>8</strong>
          <span>Walk</span>
        </article>
        <article className="detail-stat">
          <strong>Yes</strong>
          <span>Verified</span>
        </article>
      </section>

      <section className="detail-agent-card">
        <div className="agent-avatar">CN</div>
        <div>
          <strong>Campus Nest Verified</strong>
          <p>Luxe student housing network</p>
        </div>
        <button type="button">Contact Now</button>
      </section>

      <section className="detail-section-card">
        <div className="detail-ribbon-row">
          <span className="detail-ribbon blue-ribbon">quiet</span>
          <span className="detail-ribbon pink-ribbon">study</span>
          <span className="detail-ribbon lime-ribbon">ready</span>
        </div>
        <div className="gallery-thumbs">
          {listing.gallery.map((item, index) => (
            <button
              key={item}
              className={`thumb ${index === activeGalleryIndex ? "active" : ""}`}
              type="button"
              onClick={() => setActiveGalleryIndex(index)}
              aria-label={item}
            />
          ))}
        </div>
        <p className="detail-copy">{listing.gallery[activeGalleryIndex]}</p>
      </section>

      <section className="detail-map-card">
        <div className="section-row">
          <h2>Location Address</h2>
          <Link className="section-link" href="/map">
            Open map
          </Link>
        </div>
        <div className="map-board active compact-map">
          <button className="pin pin-b pin-button" type="button">
            {listing.price}
          </button>
          <div className="road road-a" />
          <div className="road road-b" />
        </div>
      </section>
    </main>
  );
}
