import Link from "next/link";
import { subletChecklist } from "@/components/forms";

export function SubletCreatePage() {
  return (
    <main className="page-shell">
      <section className="page-hero">
        <div>
          <p className="eyebrow">Post a Sublet</p>
          <h1 className="page-title">Find the right next tenant faster</h1>
          <p className="page-text">Share lease timing, budget, distance to campus, and room highlights clearly to reduce back-and-forth.</p>
        </div>
        <Link className="page-back" href="/">
          Back Home
        </Link>
      </section>

      <section className="section detail-layout">
        <div className="detail-main">
          <div className="detail-card">
            <div className="section-heading compact">
              <p className="section-kicker">Listing Info</p>
              <h2>Include the key details before you publish</h2>
            </div>
            <div className="sheet-grid">
              <label className="field-card">
                <span>Layout</span>
                <input type="text" placeholder="For example: 2B1B private bedroom" />
              </label>
              <label className="field-card">
                <span>Monthly Rent</span>
                <input type="text" placeholder="$700 / mo" />
              </label>
              <label className="field-card">
                <span>Move-in Date</span>
                <input type="text" placeholder="For example: 2026-08-01" />
              </label>
              <label className="field-card">
                <span>Distance to School</span>
                <input type="text" placeholder="9 min walk" />
              </label>
              <label className="field-card wide">
                <span>Listing Highlights</span>
                <textarea rows="5" placeholder="Furniture, roommates, short-term flexibility, neighborhood safety" />
              </label>
            </div>
          </div>
        </div>

        <aside className="booking-card sticky-panel">
          <p className="section-kicker">Publishing Tips</p>
          <h2>Improve sublet response quality</h2>
          <div className="benefit-list">
            {subletChecklist.map((item) => (
              <div key={item} className="benefit-item">
                <strong>•</strong>
                <span>{item}</span>
              </div>
            ))}
          </div>
          <button type="button">Publish and share to community</button>
          <button className="secondary-button" type="button">
            Save draft
          </button>
        </aside>
      </section>
    </main>
  );
}
