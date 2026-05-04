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
    img: "https://picsum.photos/seed/iran-city/800/500",
    thumbs: [
      "https://picsum.photos/seed/isfahan-mosque/200/150",
      "https://picsum.photos/seed/persepolis/200/150",
      "https://picsum.photos/seed/iran-bazaar/200/150",
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
    img: "https://picsum.photos/seed/patagonia-peak/800/500",
    thumbs: [
      "https://picsum.photos/seed/patagonia-glacier/200/150",
      "https://picsum.photos/seed/torres-paine/200/150",
      "https://picsum.photos/seed/patagonia-trail/200/150",
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
      "https://picsum.photos/seed/lisbon-alfama/200/150",
      "https://picsum.photos/seed/lisbon-tiles/200/150",
      "https://picsum.photos/seed/lisbon-belem/200/150",
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
    img: "https://picsum.photos/seed/slovenia-lake/800/500",
    thumbs: [
      "https://picsum.photos/seed/lake-bled/200/150",
      "https://picsum.photos/seed/ljubljana/200/150",
      "https://picsum.photos/seed/julian-alps/200/150",
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
    img: "https://picsum.photos/seed/oaxaca-market/800/500",
    thumbs: [
      "https://picsum.photos/seed/oaxaca-food/200/150",
      "https://picsum.photos/seed/mexico-mole/200/150",
      "https://picsum.photos/seed/oaxaca-craft/200/150",
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
    img: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&h=500&fit=crop&q=80",
    thumbs: [
      "https://picsum.photos/seed/bali-yoga/200/150",
      "https://picsum.photos/seed/ubud-temple/200/150",
      "https://picsum.photos/seed/bali-rice/200/150",
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
    img: "https://picsum.photos/seed/egypt-desert/800/500",
    thumbs: [
      "https://picsum.photos/seed/luxor-temple/200/150",
      "https://picsum.photos/seed/abu-simbel/200/150",
      "https://picsum.photos/seed/aswan-souk/200/150",
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
    img: "https://picsum.photos/seed/santorini-sunset/800/500",
    thumbs: [
      "https://picsum.photos/seed/santorini-white/200/150",
      "https://picsum.photos/seed/milos-beach/200/150",
      "https://picsum.photos/seed/aegean-sea/200/150",
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
      </div>

      {/* Page header */}
      <div className="picks-header">
        <h1 className="picks-page-title">Today's Picks</h1>
        <p className="picks-subtitle">Curated travel stories & guides, refreshed daily</p>
      </div>

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
