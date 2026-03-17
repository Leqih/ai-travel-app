import Link from "next/link";
import { listings } from "@/components/data";

export function SavedPage() {
  return (
    <main className="saved-shell app-mobile-shell">
      <section className="saved-header">
        <div className="status-row">
          <span className="mini-status">9:41</span>
        </div>
        <div className="detail-topbar">
          <Link className="page-back" href="/">
            Back
          </Link>
          <h1 className="saved-title">Dream list</h1>
          <button className="icon-button" type="button" aria-label="Edit dream list">
            ✎
          </button>
        </div>
      </section>

      <section className="saved-collection-grid">
        {listings.map((listing, index) => (
          <article key={listing.id} className="saved-collage-card">
            <div className="saved-collage">
              <span className={`saved-photo saved-photo-a photo-tone-${index % 3}`} />
              <span className={`saved-photo saved-photo-b photo-tone-${(index + 1) % 3}`} />
              <span className={`saved-photo saved-photo-c photo-tone-${(index + 2) % 3}`} />
            </div>
            <strong className="saved-card-title">{listing.title}</strong>
            <p className="saved-card-meta">5 Saves</p>
          </article>
        ))}
      </section>
    </main>
  );
}
