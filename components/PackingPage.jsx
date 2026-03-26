"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";

/* ─── Preset category templates ─────────────────────────────── */
const PRESET_CATEGORIES = [
  { id: "docs",        icon: "📄", label: "Documents",   items: ["Passport", "Flight Tickets", "Hotel Booking", "Travel Insurance"] },
  { id: "clothing",    icon: "👕", label: "Clothing",    items: ["T-shirts × 5", "Pants × 2", "Underwear", "Socks", "Light Jacket", "Comfortable Shoes"] },
  { id: "electronics", icon: "🔌", label: "Electronics", items: ["Phone Charger", "Power Bank", "Camera", "Earphones", "Universal Adapter"] },
  { id: "toiletries",  icon: "🧴", label: "Toiletries",  items: ["Toothbrush & Paste", "Shampoo", "Sunscreen SPF 50", "Face Wash", "Deodorant"] },
  { id: "health",      icon: "💊", label: "Health",      items: ["Pain Relievers", "Motion Sickness Pills", "Band-aids", "Cash (JPY)"] },
  { id: "snacks",      icon: "🍱", label: "Snacks",      items: ["Snack bars", "Instant noodles", "Candy", "Water bottle"] },
];

/* ─── Ring SVG ───────────────────────────────────────────────── */
function RingProgress({ percent }) {
  const r = 42;
  const circ = 2 * Math.PI * r;
  const offset = circ - (percent / 100) * circ;
  return (
    <svg width="106" height="106" viewBox="0 0 106 106" style={{ position: "absolute", top: 0, left: 0 }}>
      <circle cx="53" cy="53" r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="6" />
      <circle
        cx="53" cy="53" r={r} fill="none"
        stroke="#ffffff" strokeWidth="6"
        strokeLinecap="round"
        strokeDasharray={circ}
        strokeDashoffset={offset}
        transform="rotate(-90 53 53)"
        style={{ transition: "stroke-dashoffset 0.4s ease" }}
      />
    </svg>
  );
}

/* ═══════════════════════════════════════════════════════════════
   View A — Empty State
   ═══════════════════════════════════════════════════════════════ */
function EmptyState({ onAddCategory, onBack }) {
  return (
    <div className="pk-shell">
      <div className="pk-nav">
        <button className="pk-nav-back" onClick={onBack}>
          <FontAwesomeIcon icon={faChevronLeft} style={{ width: 10, height: 14, color: "white" }} />
        </button>
        <span className="pk-nav-title">Packing List</span>
        <div style={{ width: 44 }} />
      </div>

      <div className="pk-empty-body">
        <div className="pk-empty-icon">🧳</div>
        <p className="pk-empty-title">Your list is empty</p>
        <p className="pk-empty-sub">Add categories to start building your packing list for the trip.</p>
        <button className="pk-cta-btn" onClick={onAddCategory}>
          + Add Category
        </button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   View B — Category Picker (bottom sheet overlay)
   ═══════════════════════════════════════════════════════════════ */
function CategoryPicker({ existing, onAdd, onClose }) {
  const available = PRESET_CATEGORIES.filter(
    (p) => !existing.find((e) => e.id === p.id)
  );
  return (
    <div className="pk-picker-overlay" onClick={onClose}>
      <div className="pk-picker-sheet" onClick={(e) => e.stopPropagation()}>
        <div className="pk-picker-handle" />
        <p className="pk-picker-title">Choose a Category</p>
        <div className="pk-picker-grid">
          {available.map((preset) => (
            <button key={preset.id} className="pk-picker-item" onClick={() => onAdd(preset)}>
              <span className="pk-picker-icon">{preset.icon}</span>
              <span className="pk-picker-label">{preset.label}</span>
            </button>
          ))}
          {available.length === 0 && (
            <p className="pk-picker-empty">All categories added!</p>
          )}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   View C — Main List
   ═══════════════════════════════════════════════════════════════ */
export function PackingPage() {
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [packed, setPacked]         = useState(new Set());
  const [addingTo, setAddingTo]     = useState(null);
  const [newItemText, setNewItemText] = useState("");
  const [pickerOpen, setPickerOpen] = useState(false);

  const allItems   = categories.flatMap((c) => c.items);
  const totalCount = allItems.length;
  const packedCount = packed.size;
  const remaining  = totalCount - packedCount;
  const progress   = totalCount > 0 ? (packedCount / totalCount) * 100 : 0;

  function toggleItem(itemId) {
    setPacked((prev) => {
      const next = new Set(prev);
      next.has(itemId) ? next.delete(itemId) : next.add(itemId);
      return next;
    });
  }

  function addItem(catId) {
    if (!newItemText.trim()) return;
    const newItem = { id: `ci-${Date.now()}`, name: newItemText.trim() };
    setCategories((prev) =>
      prev.map((c) => c.id === catId ? { ...c, items: [...c.items, newItem] } : c)
    );
    setNewItemText("");
    setAddingTo(null);
  }

  function handleAddCategory(preset) {
    const newCat = {
      id: preset.id,
      icon: preset.icon,
      label: preset.label,
      items: [],
    };
    setCategories((prev) => [...prev, newCat]);
    setPickerOpen(false);
    // Auto-open the add-item input for the new category
    setAddingTo(preset.id);
    setNewItemText("");
  }

  /* ── Empty state ── */
  if (categories.length === 0) {
    return (
      <>
        <EmptyState onAddCategory={() => setPickerOpen(true)} onBack={() => router.back()} />
        {pickerOpen && (
          <CategoryPicker
            existing={categories}
            onAdd={handleAddCategory}
            onClose={() => setPickerOpen(false)}
          />
        )}
      </>
    );
  }

  /* ── List view ── */
  return (
    <div className="pk-shell">
      {/* Nav */}
      <div className="pk-nav">
        <button className="pk-nav-back" onClick={() => router.back()}>
          <FontAwesomeIcon icon={faChevronLeft} style={{ width: 10, height: 14, color: "white" }} />
        </button>
        <span className="pk-nav-title">Packing List</span>
        <button className="pk-nav-add" onClick={() => setPickerOpen(true)} aria-label="Add category">+</button>
      </div>

      {/* Hero ring stats */}
      <div className="pk-hero">
        <div className="pk-ring-wrap">
          <RingProgress percent={progress} />
          <div className="pk-ring-inner">
            <span className="pk-hero-num">{packedCount}</span>
            <span className="pk-hero-denom">of {totalCount}</span>
          </div>
        </div>
        <p className="pk-hero-label">ITEMS PACKED</p>

        <div className="pk-stat-row">
          <div className="pk-stat-card">
            <span className="pk-stat-num">{categories.length}</span>
            <span className="pk-stat-label">CATEGORIES</span>
          </div>
          <div className="pk-stat-card">
            <span className={`pk-stat-num${remaining > 0 ? " pk-stat-num--warn" : " pk-stat-num--done"}`}>
              {remaining}
            </span>
            <span className="pk-stat-label">REMAINING</span>
          </div>
        </div>
      </div>

      {/* Scrollable list */}
      <div className="pk-scroll">
        {categories.map((cat) => {
          const catPacked = cat.items.filter((i) => packed.has(i.id)).length;
          const allDone   = cat.items.length > 0 && catPacked === cat.items.length;
          return (
            <div key={cat.id} className="pk-category">
              <div className="pk-cat-header">
                <span className="pk-cat-icon">{cat.icon}</span>
                <span className="pk-cat-label">{cat.label}</span>
                <span className={`pk-cat-count${allDone ? " pk-cat-count--done" : ""}`}>
                  {catPacked}/{cat.items.length}
                </span>
              </div>

              <div className="pk-card">
                {cat.items.map((item, idx) => {
                  const isDone = packed.has(item.id);
                  return (
                    <div key={item.id}>
                      <button
                        className={`pk-item${isDone ? " pk-item--done" : ""}`}
                        onClick={() => toggleItem(item.id)}
                      >
                        <div className={`pk-checkbox${isDone ? " pk-checkbox--checked" : ""}`}>
                          {isDone && (
                            <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                              <path d="M1 4L3.5 6.5L9 1" stroke="#000" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          )}
                        </div>
                        <span className="pk-item-name">{item.name}</span>
                      </button>
                      {idx < cat.items.length - 1 && <div className="pk-item-divider" />}
                    </div>
                  );
                })}

                {addingTo === cat.id ? (
                  <>
                    <div className="pk-item-divider" />
                    <div className="pk-add-input-row">
                      <input
                        className="pk-add-input"
                        placeholder="Item name…"
                        value={newItemText}
                        onChange={(e) => setNewItemText(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter")  addItem(cat.id);
                          if (e.key === "Escape") { setAddingTo(null); setNewItemText(""); }
                        }}
                        autoFocus
                      />
                      <button className="pk-add-confirm" onClick={() => addItem(cat.id)}>Add</button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="pk-item-divider" />
                    <button className="pk-add-btn" onClick={() => { setAddingTo(cat.id); setNewItemText(""); }}>
                      <span className="pk-add-plus">+</span>
                      <span className="pk-add-text">Add item</span>
                    </button>
                  </>
                )}
              </div>
            </div>
          );
        })}
        <div style={{ height: 32 }} />
      </div>

      {/* Category picker overlay */}
      {pickerOpen && (
        <CategoryPicker
          existing={categories}
          onAdd={handleAddCategory}
          onClose={() => setPickerOpen(false)}
        />
      )}
    </div>
  );
}
