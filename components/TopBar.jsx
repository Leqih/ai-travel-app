import Link from "next/link";

export function TopBar({ onLogin }) {
  return (
    <div className="topbar">
      <div className="brand-chip">CN</div>
      <nav className="top-actions" aria-label="Quick actions">
        <button className="icon-button" type="button" onClick={onLogin}>
          Log in
        </button>
        <Link className="icon-button" href="/sublet/new">
          Post
        </Link>
        <Link className="icon-button" href="/community">
          Community
        </Link>
        <Link className="icon-button" href="/profile">
          Profile
        </Link>
      </nav>
    </div>
  );
}
