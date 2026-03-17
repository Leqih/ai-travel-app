"use client";

import { useState, useRef } from "react";

/* ─── Data ───────────────────────────────────────────────────────── */
const INITIAL_NOTES = [
  {
    id: 1,
    day: 1,
    title: "Shibuya Crossing Tips",
    body: "Rush hour 8–9am for the full crossing experience. Best photo spot: Starbucks 2F.",
    location: "Shibuya · Tokyo",
    date: "Mar 15",
    photo: null,
  },
  {
    id: 2,
    day: 2,
    title: "Temple Street Night Market",
    body: "After 9pm best. Cash only. Try egg waffles near the entrance gate.",
    location: "Mong Kok · HK",
    date: "Mar 16",
    photo: null,
  },
  {
    id: 3,
    day: 1,
    title: "Meiji Shrine — What to Know",
    body: "Modest clothing required. Morning visit is quieter. Forest walk ~20 min.",
    location: "Harajuku · Tokyo",
    date: "Mar 15",
    photo: null,
  },
  {
    id: 4,
    day: 3,
    title: "Arashiyama Bamboo Grove",
    body: "Go at 7am before tour groups. Rent bikes for the riverside path.",
    location: "Arashiyama · Kyoto",
    date: "Mar 17",
    photo: null,
  },
];

const DAY_FILTERS = ["All", "Day 1", "Day 2", "Day 3", "Day 4"];

// Day accent colors — warm, ink-friendly tones for light mode
const DAY_ACCENTS = {
  1: "#4a8fe8",
  2: "#2ab87a",
  3: "#9b59e0",
  4: "#e07a1a",
};

/* ─── NoteRow ─────────────────────────────────────────────────────── */
function NoteRow({ note, index, onPhotoAdd, onOpen }) {
  const fileRef = useRef(null);
  const accent = DAY_ACCENTS[note.day] ?? DAY_ACCENTS[1];

  function handleFileChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    onPhotoAdd(note.id, URL.createObjectURL(file));
  }

  return (
    <div
      className="note-row"
      style={{ animationDelay: `${index * 50}ms` }}
      onClick={onOpen}
    >
      {/* Day badge */}
      <div className="note-row-day-badge" style={{ background: accent }}>
        D{note.day}
      </div>

      {/* Content */}
      <div className="note-row-content">
        <div className="note-row-top">
          <span className="note-row-title">{note.title}</span>
          <span className="note-row-date">{note.date}</span>
        </div>
        <p className="note-row-body">{note.body}</p>
        <div className="note-row-footer">
          <span className="note-row-location">📍 {note.location}</span>

          {/* Camera button or photo thumb */}
          {note.photo ? (
            <img className="note-row-photo-thumb" src={note.photo} alt="" />
          ) : (
            <>
              <button
                className="note-row-camera-btn"
                onClick={(e) => { e.stopPropagation(); fileRef.current?.click(); }}
                title="Add photo"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                  <circle cx="12" cy="13" r="4"/>
                </svg>
              </button>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                capture="environment"
                style={{ display: "none" }}
                onChange={handleFileChange}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── NoteDetail (full single note view) ─────────────────────────── */
function NoteDetail({ note, onClose }) {
  const accent = DAY_ACCENTS[note.day] ?? DAY_ACCENTS[1];
  return (
    <div className="note-detail-shell">
      <div className="note-detail-topbar">
        <button className="note-detail-back" onClick={onClose}>‹ Back</button>
        <span className="note-detail-day-tag" style={{ color: accent }}>DAY {note.day}</span>
      </div>
      <div className="note-detail-scroll">
        <h1 className="note-detail-title">{note.title}</h1>
        <div className="note-detail-meta">
          <span>📍 {note.location}</span>
          <span>{note.date}</span>
        </div>
        {note.photo && (
          <img className="note-detail-photo" src={note.photo} alt="" />
        )}
        <p className="note-detail-body">{note.body}</p>
      </div>
    </div>
  );
}

/* ─── NotesPage ──────────────────────────────────────────────────── */
export function NotesPage({ onBack }) {
  const [activeFilter, setActiveFilter] = useState("All");
  const [search, setSearch]             = useState("");
  const [notes, setNotes]               = useState(INITIAL_NOTES);
  const [openNote, setOpenNote]         = useState(null);

  function handlePhotoAdd(id, url) {
    setNotes((prev) => prev.map((n) => (n.id === id ? { ...n, photo: url } : n)));
  }

  const filtered = notes.filter((n) => {
    const matchDay =
      activeFilter === "All" ||
      n.day === parseInt(activeFilter.replace("Day ", ""));
    const q = search.toLowerCase();
    const matchSearch =
      !search ||
      n.title.toLowerCase().includes(q) ||
      n.body.toLowerCase().includes(q);
    return matchDay && matchSearch;
  });

  // Show single note detail
  if (openNote) {
    return (
      <NoteDetail
        note={openNote}
        onClose={() => setOpenNote(null)}
      />
    );
  }

  return (
    <div className="notes-shell">
      {/* ── Handle ── */}
      <div className="notes-drag-handle" />

      {/* ── Header ── */}
      <div className="notes-top-bar">
        {onBack && (
          <button className="notes-back-btn" onClick={onBack}>‹</button>
        )}
        <h1 className="notes-big-title">便签</h1>
        <button className="notes-more-btn">···</button>
      </div>

      {/* ── Count ── */}
      <div className="notes-count-row">
        <span className="notes-count-text">{notes.length} 条笔记</span>
      </div>

      {/* ── Search ── */}
      <div className="notes-search-wrap">
        <div className="notes-search-bar">
          <svg className="notes-search-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
          </svg>
          <input
            className="notes-search-input"
            placeholder="搜索笔记..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button className="notes-search-clear" onClick={() => setSearch("")}>✕</button>
          )}
        </div>
      </div>

      {/* ── Day filters ── */}
      <div className="notes-filters">
        {DAY_FILTERS.map((f) => (
          <button
            key={f}
            className={`notes-chip ${activeFilter === f ? "notes-chip-active" : ""}`}
            onClick={() => setActiveFilter(f)}
          >
            {f}
          </button>
        ))}
      </div>

      {/* ── Note list (on lined paper) ── */}
      <div className="notes-paper-area">
        {filtered.length === 0 ? (
          <div className="notes-empty">
            <span className="notes-empty-icon">📝</span>
            <p className="notes-empty-text">暂无笔记</p>
            <p className="notes-empty-sub">点击 + 新建一条</p>
          </div>
        ) : (
          filtered.map((note, i) => (
            <NoteRow
              key={note.id}
              note={note}
              index={i}
              onPhotoAdd={handlePhotoAdd}
              onOpen={() => setOpenNote(note)}
            />
          ))
        )}
      </div>

      {/* ── FAB ── */}
      <button className="notes-fab" aria-label="New note">
        <span>+</span>
      </button>
    </div>
  );
}
