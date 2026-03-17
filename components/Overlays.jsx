"use client";

export function LoginModal({ open, onClose }) {
  if (!open) return null;

  return (
    <div className="overlay-backdrop" role="presentation" onClick={onClose}>
      <div className="overlay-card modal-card" onClick={(event) => event.stopPropagation()}>
        <div className="overlay-header">
          <div>
            <p className="section-kicker">Log in</p>
            <h2>Continue your housing search</h2>
          </div>
          <button className="ghost-icon" type="button" onClick={onClose}>
            Close
          </button>
        </div>
        <div className="form-stack">
          <label className="field-card">
            <span>School Email</span>
            <input type="email" placeholder="name@school.edu" />
          </label>
          <label className="field-card">
            <span>Password</span>
            <input type="password" placeholder="Enter password" />
          </label>
          <button type="button">Log in and sync saved items</button>
        </div>
      </div>
    </div>
  );
}

export function SubletSheet({ open, onClose }) {
  if (!open) return null;

  return (
    <div className="overlay-backdrop" role="presentation" onClick={onClose}>
      <div className="overlay-card sheet-card" onClick={(event) => event.stopPropagation()}>
        <div className="overlay-header">
          <div>
            <p className="section-kicker">Post a Sublet</p>
            <h2>Reach the right students faster</h2>
          </div>
          <button className="ghost-icon" type="button" onClick={onClose}>
            Close
          </button>
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
          <label className="field-card wide">
            <span>Location and Highlights</span>
            <textarea rows="4" placeholder="How close to campus, whether short-term is allowed, and whether furniture is included" />
          </label>
        </div>
        <div className="sublet-actions">
          <button type="button">Publish and share to community</button>
          <button className="secondary-button" type="button" onClick={onClose}>
            Maybe later
          </button>
        </div>
      </div>
    </div>
  );
}

export function MapDrawer({ listing, onClose }) {
  if (!listing) return null;

  return (
    <div className="drawer-card">
      <div className="overlay-header">
        <div>
          <p className="section-kicker">Map Detail Drawer</p>
          <h2>{listing.title}</h2>
        </div>
        <button className="ghost-icon" type="button" onClick={onClose}>
          Collapse
        </button>
      </div>
      <div className="drawer-stats">
        <div className="detail-stat">
          <strong>{listing.price}</strong>
          <span>Rent</span>
        </div>
        <div className="detail-stat">
          <strong>{listing.distance}</strong>
          <span>To campus</span>
        </div>
        <div className="detail-stat">
          <strong>{listing.fit}</strong>
          <span>Fit</span>
        </div>
      </div>
      <p className="detail-copy">{listing.copy}</p>
      <div className="result-tags">
        {listing.tags.map((tag) => (
          <span key={tag}>{tag}</span>
        ))}
      </div>
    </div>
  );
}

export function MapFilterSheet({ open, onClose }) {
  if (!open) return null;

  return (
    <div className="overlay-backdrop" role="presentation" onClick={onClose}>
      <div className="overlay-card sheet-card filter-sheet" onClick={(event) => event.stopPropagation()}>
        <div className="filter-sheet-top">
          <button className="ghost-icon" type="button" onClick={onClose}>
            Cancel
          </button>
          <h2>Filter</h2>
          <button className="ghost-icon" type="button">
            Reset
          </button>
        </div>

        <section className="filter-block">
          <div className="section-row">
            <h3>Home type</h3>
          </div>
          <div className="filter-chip-grid">
            <button className="filter-option active" type="button">Beds</button>
            <button className="filter-option" type="button">Home</button>
            <button className="filter-option active" type="button">Baths</button>
            <button className="filter-option" type="button">Chair</button>
            <button className="filter-option" type="button">Hotel</button>
          </div>
        </section>

        <section className="filter-block">
          <div className="section-row">
            <h3>Price Range</h3>
            <span className="filter-inline-link">Enter Manually</span>
          </div>
          <div className="range-histogram">
            <div className="bar short" />
            <div className="bar tall" />
            <div className="bar mid" />
            <div className="bar short" />
            <div className="bar tall" />
            <div className="bar tall" />
            <div className="bar mid" />
            <div className="bar short muted" />
          </div>
          <div className="range-pills">
            <span>$0</span>
            <span>$5m+</span>
          </div>
        </section>

        <section className="filter-block">
          <div className="section-row">
            <h3>Square footage</h3>
            <span className="filter-inline-link">Enter Manually</span>
          </div>
          <div className="range-histogram">
            <div className="bar short" />
            <div className="bar tall" />
            <div className="bar mid" />
            <div className="bar short" />
            <div className="bar tall" />
            <div className="bar tall" />
            <div className="bar mid" />
            <div className="bar short muted" />
          </div>
          <div className="range-pills">
            <span>0 sqft</span>
            <span>10000+ sqft</span>
          </div>
        </section>

        <section className="filter-block">
          <div className="section-row">
            <h3>Home Details</h3>
          </div>
          <div className="detail-counter-row">
            <span>Beds</span>
            <div className="counter-control">
              <button type="button">-</button>
              <strong>3</strong>
              <button type="button">+</button>
            </div>
          </div>
          <div className="detail-counter-row">
            <span>Baths</span>
            <div className="counter-control">
              <button type="button">-</button>
              <strong>2</strong>
              <button type="button">+</button>
            </div>
          </div>
        </section>

        <button className="filter-apply-button" type="button" onClick={onClose}>
          Apply filters
        </button>
      </div>
    </div>
  );
}
