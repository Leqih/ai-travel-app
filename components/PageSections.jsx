import Link from "next/link";
import { communityPosts, profileSummary } from "@/components/data";

export function CommunityPageSection() {
  return (
    <main className="community-forum-shell app-mobile-shell">
      <section className="community-forum-header">
        <div className="detail-topbar">
          <Link className="page-back" href="/">
            Back
          </Link>
          <div className="community-header-actions">
            <button className="icon-button" type="button">
              Bell
            </button>
            <button className="icon-button" type="button">
              Save
            </button>
          </div>
        </div>
        <div className="community-title-block">
          <p className="eyebrow">Community Forum</p>
          <h1 className="page-title">Community Forum</h1>
          <p className="page-text">Connect, discuss, and grow together here.</p>
        </div>
      </section>

      <section className="community-categories">
        <article className="forum-category-card">
          <strong>Loan Talk</strong>
          <p>Updated at 9:00 AM</p>
          <div className="forum-avatars">
            <span />
            <span />
            <span />
          </div>
        </article>
        <article className="forum-category-card">
          <strong>Market Insights</strong>
          <p>Updated at 11:00 AM</p>
          <div className="forum-avatars">
            <span />
            <span />
            <span />
          </div>
        </article>
      </section>

      <section className="community-feed-list">
        <article className="forum-feed-card">
          <div className="forum-user-row">
            <div className="forum-avatar" />
            <div>
              <strong>Susan Smithson</strong>
              <p>Question Post</p>
            </div>
            <span className="forum-meta">1D / 2C</span>
          </div>
          <p className="forum-body">
            What kind of housing can a student rent near campus with a tight budget but still feel safe?
          </p>
          <button className="forum-action" type="button">
            ↩
          </button>
        </article>

        <article className="forum-feed-card image-post-card">
          <div className="forum-user-row">
            <div className="forum-avatar dark" />
            <div>
              <strong>Guy Hawkins</strong>
              <p>Image Post</p>
            </div>
            <span className="forum-meta">1D / 1C</span>
          </div>
          <div className="forum-image-stack">
            <span className="forum-shot forum-shot-a" />
            <span className="forum-shot forum-shot-b" />
            <span className="forum-shot forum-shot-c" />
          </div>
          <div className="forum-post-tools">
            <button className="forum-action" type="button">
              ♡
            </button>
            <button className="forum-action" type="button">
              ⤴
            </button>
          </div>
        </article>

        <article className="forum-feed-card">
          <div className="forum-user-row">
            <div className="forum-avatar light" />
            <div>
              <strong>Kathryn Murphy</strong>
              <p>Reply Post</p>
            </div>
          </div>
          <p className="forum-body">
            You can still find a cozy, safe, and walkable place if you prioritize verified listings and student reviews.
          </p>
          <button className="forum-action" type="button">
            ↩
          </button>
        </article>
      </section>

      <section className="create-post-bar">
        <button className="create-post-icon" type="button">
          ＋
        </button>
        <button className="create-post-wave" type="button">
          〰
        </button>
        <div className="create-post-input">Create a post to share the news</div>
        <button className="create-post-send" type="button">
          ➤
        </button>
      </section>
    </main>
  );
}

export function ProfilePageSection() {
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
          <h1 className="saved-title">Profile</h1>
          <button className="icon-button" type="button">
            Me
          </button>
        </div>
      </section>

      <section className="profile-card profile-card-hero">
        <div className="avatar-badge">LQ</div>
        <div>
          <h2>{profileSummary.name}</h2>
          <p>
            {profileSummary.role} · {profileSummary.moveIn}
          </p>
        </div>
        <div className="profile-smile">: )</div>
      </section>

      <section className="saved-grid">
        <Link className="stat-summary-link" href="/saved">
          <article className="saved-card stat-summary-card">
            <strong>Saved Listings</strong>
            <span>{profileSummary.saved} saved</span>
            <p>4 of them have new activity today</p>
          </article>
        </Link>
        <article className="saved-card mint-card">
          <strong>Sublet Alerts</strong>
          <span>{profileSummary.subletAlerts} alerts</span>
          <p>2 match your budget and move-in timing</p>
        </article>
        <article className="saved-card peach-card">
          <strong>Booked Tours</strong>
          <span>{profileSummary.visits} tours</span>
          <p>Your next tour is Tuesday at 4:30 PM</p>
        </article>
      </section>

      <section className="detail-card">
        <div className="section-heading compact">
          <p className="section-kicker">Current Preferences</p>
          <h2>Saved Search Criteria</h2>
        </div>
        <div className="result-tags">
          {profileSummary.preferences.map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>
      </section>

      <section className="schedule-card">
        <p className="section-kicker">This Week</p>
        <div className="schedule-pin">go!</div>
        <div className="schedule-list">
          <div>
            <strong>Mon</strong>
            <span>Check new reviews for North Loop</span>
          </div>
          <div>
            <strong>Tue</strong>
            <span>South Gate video tour</span>
          </div>
          <div>
            <strong>Thu</strong>
            <span>Message the 2B1B sublet host</span>
          </div>
        </div>
      </section>
    </main>
  );
}
