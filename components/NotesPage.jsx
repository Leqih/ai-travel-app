"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";

/* ─── Data ───────────────────────────────────────────────────────── */
const INITIAL_NOTES = [
  {
    id: 1,
    title: "Shibuya Crossing Tips",
    body: "Rush hour 8–9am for the full crossing experience. Best photo spot is the Starbucks 2F window.",
    date: "Mar 15",
    location: "Shibuya · Tokyo",
  },
  {
    id: 2,
    title: "Hotel Check-in Reminder",
    body: "Check-in at 3 PM. Bring passport and booking confirmation. Ask for high floor.",
    date: "Mar 14",
    location: "Shinjuku · Tokyo",
  },
  {
    id: 3,
    title: "Must-try Foods in Tokyo",
    body: "Tsukiji sushi breakfast, Ichiran ramen solo booth, Convenience store matcha items, Harajuku crepes.",
    date: "Mar 13",
    location: "Tokyo, Japan",
  },
  {
    id: 4,
    title: "Meiji Shrine — Notes",
    body: "Modest clothing required. Morning visit is quieter. Forest walk takes ~20 min. Free entry.",
    date: "Mar 12",
    location: "Harajuku · Tokyo",
  },
];

/* ─── NoteEditor (View B) ─────────────────────────────────────────── */
function NoteEditor({ note, onBack, onDelete }) {
  const [title, setTitle] = useState(note.title);
  const [body, setBody] = useState(note.body);
  const textareaRef = useRef(null);

  // Auto-grow textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
    }
  }, [body]);

  function handleBack() {
    onBack({ title, body });
  }

  const dateStr = `Mar 17, 2026 | ${note.location}`;

  return (
    <div className="apnotes-editor-shell">
      {/* Nav bar */}
      <div className="apnotes-editor-nav">
        <button className="apnotes-editor-back-btn" onClick={handleBack}>
          <FontAwesomeIcon icon={faChevronLeft} style={{ width: 10, height: 14, color: "white" }} />
        </button>
        <button className="apnotes-editor-share-btn" aria-label="Share">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/>
            <polyline points="16 6 12 2 8 6"/>
            <line x1="12" y1="2" x2="12" y2="15"/>
          </svg>
        </button>
      </div>

      {/* Date + location */}
      <p className="apnotes-editor-dateline">{dateStr}</p>

      {/* Scrollable content */}
      <div className="apnotes-editor-content">
        <div className="apnotes-editor-card">
          <input
            className="apnotes-editor-title-input"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <div className="apnotes-editor-divider" />
          <textarea
            ref={textareaRef}
            className="apnotes-editor-body-input"
            placeholder="Note"
            value={body}
            onChange={(e) => {
              setBody(e.target.value);
            }}
          />
        </div>
      </div>

      {/* Bottom toolbar */}
      <div className="apnotes-editor-toolbar">
        <button className="apnotes-editor-tool-btn" aria-label="Share">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/>
            <polyline points="16 6 12 2 8 6"/>
            <line x1="12" y1="2" x2="12" y2="15"/>
          </svg>
        </button>
        <button className="apnotes-editor-tool-btn" aria-label="Checklist">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 11 12 14 22 4"/>
            <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
          </svg>
        </button>
        <button className="apnotes-editor-tool-btn" aria-label="Camera">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
            <circle cx="12" cy="13" r="4"/>
          </svg>
        </button>
        <button className="apnotes-editor-tool-btn" aria-label="Draw">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 20h9"/>
            <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
          </svg>
        </button>
        <button className="apnotes-editor-tool-btn apnotes-editor-tool-delete" aria-label="Delete" onClick={onDelete}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3 6 5 6 21 6"/>
            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
            <path d="M10 11v6"/>
            <path d="M14 11v6"/>
            <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
          </svg>
        </button>
      </div>
    </div>
  );
}

/* ─── NotesPage (View A + View B) ───────────────────────────────── */
export function NotesPage() {
  const router = useRouter();
  const [notes, setNotes] = useState(INITIAL_NOTES);
  const [search, setSearch] = useState("");
  const [openNote, setOpenNote] = useState(null); // null = list view

  const filtered = search
    ? notes.filter(
        (n) =>
          n.title.toLowerCase().includes(search.toLowerCase()) ||
          n.body.toLowerCase().includes(search.toLowerCase())
      )
    : notes;

  function handleNoteOpen(note) {
    setOpenNote(note);
  }

  function handleEditorBack({ title, body }) {
    // Save changes
    setNotes((prev) =>
      prev.map((n) =>
        n.id === openNote.id ? { ...n, title: title || n.title, body } : n
      )
    );
    setOpenNote(null);
  }

  function handleDelete() {
    setNotes((prev) => prev.filter((n) => n.id !== openNote.id));
    setOpenNote(null);
  }

  function handleCompose() {
    const newNote = {
      id: Date.now(),
      title: "",
      body: "",
      date: "Mar 17",
      location: "Tokyo, Japan",
    };
    setNotes((prev) => [newNote, ...prev]);
    setOpenNote(newNote);
  }

  /* ── View B: Note Editor ── */
  if (openNote) {
    return (
      <>
        <NoteEditor
          note={openNote}
          onBack={handleEditorBack}
          onDelete={handleDelete}
        />
      </>
    );
  }

  /* ── View A: Notes List ── */
  return (
    <div className="apnotes-shell">
      {/* Nav bar */}
      <div className="apnotes-nav">
        <button className="apnotes-nav-back" onClick={() => router.back()}>
          <FontAwesomeIcon icon={faChevronLeft} style={{ width: 10, height: 14, color: "white" }} />
        </button>
        <span className="apnotes-nav-title">Notes</span>
        <button className="apnotes-nav-compose" onClick={handleCompose} aria-label="New note">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 20h9"/>
            <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
          </svg>
        </button>
      </div>

      {/* Scrollable area */}
      <div className="apnotes-scroll">
        {/* Large title */}
        <h1 className="apnotes-large-title">Notes</h1>

        {/* Count */}
        <p className="apnotes-count">{notes.length} Notes</p>

        {/* Search bar */}
        <div className="apnotes-search-bar">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="apnotes-search-icon">
            <circle cx="11" cy="11" r="8"/>
            <path d="m21 21-4.3-4.3"/>
          </svg>
          <input
            className="apnotes-search-input"
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button className="apnotes-search-clear" onClick={() => setSearch("")}>✕</button>
          )}
        </div>

        {/* Section label */}
        {filtered.length > 0 && (
          <p className="apnotes-section-label">My Notes</p>
        )}

        {/* Notes list */}
        <div className="apnotes-list">
          {filtered.length === 0 ? (
            <div className="apnotes-empty">
              <div className="apnotes-empty-icon">📝</div>
              <p className="apnotes-empty-text">No notes yet</p>
              <p className="apnotes-empty-sub">Tap the compose button to create your first note</p>
            </div>
          ) : (
            filtered.map((note) => (
              <button
                key={note.id}
                className="apnotes-row"
                onClick={() => handleNoteOpen(note)}
              >
                <div className="apnotes-row-meta">
                  <span className="apnotes-row-location">{note.location}</span>
                  <span className="apnotes-row-date">{note.date}</span>
                </div>
                <p className="apnotes-row-title">{note.title || "New Note"}</p>
                <p className="apnotes-row-preview">{note.body}</p>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Bottom toolbar */}
      <div className="apnotes-bottom-bar">
        <button className="apnotes-bottom-btn" aria-label="Folders">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
          </svg>
          <span className="apnotes-bottom-label">Folders</span>
        </button>
        <div style={{ flex: 1 }} />
        <button className="apnotes-bottom-compose" onClick={handleCompose} aria-label="Compose">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 20h9"/>
            <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
          </svg>
        </button>
      </div>
    </div>
  );
}
