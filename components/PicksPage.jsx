"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";

/* ── Curated Picks Data ── */
const PICKS = [
  {
    id: 1,
    tag: "Cultural Exploration",
    tagIcon: "🌍",
    title: "Iran: Ancient Cities at the Crossroads of Civilization",
    desc: "From Isfahan's turquoise mosques to Persepolis' ancient ruins, discover a land where East meets West.",
    img: "https://images.unsplash.com/photo-1565711561500-49678a10a63f?w=800&h=500&fit=crop&q=80",
    thumbs: [
      "https://images.unsplash.com/photo-1562979314-bee7453e911c?w=200&h=150&fit=crop&q=80",
      "https://images.unsplash.com/photo-1576834389950-bfae4e8e05c5?w=200&h=150&fit=crop&q=80",
      "https://images.unsplash.com/photo-1569584187510-93559e6a2b0a?w=200&h=150&fit=crop&q=80",
    ],
    likes: 2341,
    saves: 892,
  },
  {
    id: 2,
    tag: "Nature & Adventure",
    tagIcon: "🏔️",
    title: "Patagonia: Edge of the World Trekking Guide",
    desc: "Torres del Paine, Perito Moreno glacier, and the windswept trails of South America's last frontier.",
    img: "https://images.unsplash.com/photo-1531761535209-180857e963b9?w=800&h=500&fit=crop&q=80",
    thumbs: [
      "https://images.unsplash.com/photo-1478827536114-da961b7f86d2?w=200&h=150&fit=crop&q=80",
      "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=200&h=150&fit=crop&q=80",
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=200&h=150&fit=crop&q=80",
    ],
    likes: 1876,
    saves: 645,
  },
  {
    id: 3,
    tag: "City Guide",
    tagIcon: "🏙️",
    title: "72 Hours in Lisbon: Art, Tiles & Pastel de Nata",
    desc: "A perfectly paced weekend guide to Lisbon's neighborhoods, from Alfama's fado to Belem's pastries.",
    img: "https://images.unsplash.com/photo-1585208798174-6cedd86e019a?w=800&h=500&fit=crop&q=80",
    thumbs: [
      "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=200&h=150&fit=crop&q=80",
      "https://images.unsplash.com/photo-1580323956656-26bbb0206e53?w=200&h=150&fit=crop&q=80",
      "https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=200&h=150&fit=crop&q=80",
    ],
    likes: 3102,
    saves: 1204,
  },
  {
    id: 4,
    tag: "Hidden Gems",
    tagIcon: "💎",
    title: "Slovenia: Europe's Best-Kept Secret",
    desc: "Lake Bled, Ljubljana's charm, and the Julian Alps — compact, green, and endlessly surprising.",
    img: "https://images.unsplash.com/photo-1586901533048-0e856dff2c0d?w=800&h=500&fit=crop&q=80",
    thumbs: [
      "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=200&h=150&fit=crop&q=80",
      "https://images.unsplash.com/photo-1573828426698-4c0ccf84d4fa?w=200&h=150&fit=crop&q=80",
      "https://images.unsplash.com/photo-1592753054398-9fa698e48891?w=200&h=150&fit=crop&q=80",
    ],
    likes: 1543,
    saves: 721,
  },
  {
    id: 5,
    tag: "Food & Culture",
    tagIcon: "🍜",
    title: "Oaxaca: Mexico's Culinary Heart",
    desc: "Mole negro, mezcal tastings, and vibrant markets — the ultimate food lover's destination.",
    img: "https://images.unsplash.com/photo-1518105779142-d975f22f1b0a?w=800&h=500&fit=crop&q=80",
    thumbs: [
      "https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=200&h=150&fit=crop&q=80",
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=200&h=150&fit=crop&q=80",
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=200&h=150&fit=crop&q=80",
    ],
    likes: 2789,
    saves: 1056,
  },
  {
    id: 6,
    tag: "Wellness",
    tagIcon: "🧘",
    title: "Bali Retreat: Mind, Body & Spirit",
    desc: "Yoga in Ubud, temple sunrise walks, and healing ceremonies — find your inner peace.",
    img: "https://images.unsplash.com/photo-1554689021-c9e70753d301?w=800&h=500&fit=crop&q=80",
    thumbs: [
      "https://images.unsplash.com/photo-1559628233-eb1b1a45564b?w=200&h=150&fit=crop&q=80",
      "https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=200&h=150&fit=crop&q=80",
      "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=200&h=150&fit=crop&q=80",
    ],
    likes: 1987,
    saves: 834,
  },
  {
    id: 7,
    tag: "History",
    tagIcon: "🏛️",
    title: "Egypt Beyond the Pyramids",
    desc: "Luxor's Valley of the Kings, Abu Simbel at dawn, and the souks of Aswan.",
    img: "https://images.unsplash.com/photo-1539768942893-daf53e736b68?w=800&h=500&fit=crop&q=80",
    thumbs: [
      "https://images.unsplash.com/photo-1553913861-c0fddf2619ee?w=200&h=150&fit=crop&q=80",
      "https://images.unsplash.com/photo-1568322445389-f64e1bbea412?w=200&h=150&fit=crop&q=80",
      "https://images.unsplash.com/photo-1572252009286-268acec5ca0a?w=200&h=150&fit=crop&q=80",
    ],
    likes: 2156,
    saves: 943,
  },
  {
    id: 8,
    tag: "Island Life",
    tagIcon: "🏝️",
    title: "Greek Islands: Santorini to Milos",
    desc: "Whitewashed villages, sapphire waters, and the best sunset spots in the Aegean.",
    img: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800&h=500&fit=crop&q=80",
    thumbs: [
      "https://images.unsplash.com/photo-1533105079780-92b9be482077?w=200&h=150&fit=crop&q=80",
      "https://images.unsplash.com/photo-1504512485720-7d83a16ee930?w=200&h=150&fit=crop&q=80",
      "https://images.unsplash.com/photo-1530841377377-3ff06c0ca713?w=200&h=150&fit=crop&q=80",
    ],
    likes: 3456,
    saves: 1567,
  },
];

const FILTERS = [
  { label: "All", emoji: "" },
  { label: "Culture", emoji: "🌍" },
  { label: "Nature", emoji: "🌿" },
  { label: "City", emoji: "🏙️" },
  { label: "Food", emoji: "🍜" },
  { label: "Wellness", emoji: "🧘" },
  { label: "History", emoji: "🏛️" },
];

/* ── Component ── */
export function PicksPage() {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState("All");
  const [likedIds, setLikedIds] = useState(new Set());

  const toggleLike = (id) => {
    setLikedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const filteredPicks = activeFilter === "All"
    ? PICKS
    : PICKS.filter((p) => p.tag.toLowerCase().includes(activeFilter.toLowerCase()));

  return (
    <div className="picks-shell">
      {/* Top bar */}
      <div className="picks-topbar">
        <button className="picks-back" onClick={() => router.back()}>
          <FontAwesomeIcon icon={faChevronLeft} style={{ width: 10, height: 14, color: "white" }} />
        </button>
        <h1 className="picks-page-title">Today's Picks</h1>
        <div className="picks-topbar-spacer" />
      </div>

      {/* Subtitle */}
      <p className="picks-subtitle">Curated travel stories & guides, refreshed daily</p>

      {/* Filter pills */}
      <div className="picks-filters">
        {FILTERS.map((f) => (
          <button
            key={f.label}
            className={`picks-filter-pill${activeFilter === f.label ? " picks-filter-active" : ""}`}
            onClick={() => setActiveFilter(f.label)}
          >
            {f.emoji ? `${f.emoji} ` : ""}{f.label}
          </button>
        ))}
      </div>

      {/* Cards list */}
      <div className="picks-list">
        {filteredPicks.map((pick) => (
          <div key={pick.id} className="picks-card">
            {/* Hero image */}
            <div className="picks-card-hero">
              <img className="picks-card-img" src={pick.img} alt={pick.title} />
              <div className="picks-card-grad" />
              <span className="picks-card-tag">{pick.tagIcon} {pick.tag}</span>
            </div>

            {/* Content */}
            <div className="picks-card-body">
              <h2 className="picks-card-title">{pick.title}</h2>
              <p className="picks-card-desc">{pick.desc}</p>

              {/* Thumbnails */}
              <div className="picks-card-thumbs">
                {pick.thumbs.map((src, i) => (
                  <img key={i} className="picks-card-thumb" src={src} alt="" />
                ))}
              </div>

              {/* Actions */}
              <div className="picks-card-actions">
                <button
                  className={`picks-card-like${likedIds.has(pick.id) ? " picks-liked" : ""}`}
                  onClick={() => toggleLike(pick.id)}
                >
                  {likedIds.has(pick.id) ? "❤️" : "🤍"} {pick.likes + (likedIds.has(pick.id) ? 1 : 0)}
                </button>
                <button className="picks-card-save">🔖 {pick.saves}</button>
                <Link href={`/picks/${pick.id}`} className="picks-card-read">Read →</Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom spacing */}
      <div style={{ height: 40 }} />
    </div>
  );
}
