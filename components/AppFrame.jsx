import Link from "next/link";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/map", label: "Map" },
  { href: "/messages", label: "Messages" },
  { href: "/community", label: "Community" },
  { href: "/profile", label: "Profile" }
];

export function AppFrame({ activePath, children }) {
  return (
    <div className="app-shell">
      <div className="bg-shape bg-shape-a" />
      <div className="bg-shape bg-shape-b" />
      <div className="bg-shape bg-shape-c" />
      {children}
      <nav className="bottom-nav" aria-label="Bottom navigation">
        {navItems.map((item) => (
          <Link
            key={item.href}
            className={`nav-item${activePath === item.href ? " active" : ""}`}
            href={item.href}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
