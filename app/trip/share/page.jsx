"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { useMemo, Suspense } from "react";

const S = {
  bg:      "#09090f",
  card:    "rgba(255,255,255,0.04)",
  border:  "rgba(255,255,255,0.08)",
  text:    "#fff",
  textDim: "rgba(255,255,255,0.45)",
  accent:  "#ff8c42",
  font:    `-apple-system, "SF Pro Display", "Helvetica Neue", sans-serif`,
};

const CITY_FLAGS = {
  Tokyo: "🇯🇵", Kyoto: "🇯🇵", Osaka: "🇯🇵",
  Paris: "🇫🇷", London: "🇬🇧", Rome: "🇮🇹",
  "New York": "🇺🇸", Barcelona: "🇪🇸", Amsterdam: "🇳🇱",
  Bangkok: "🇹🇭", Singapore: "🇸🇬", Seoul: "🇰🇷",
  Dubai: "🇦🇪", Sydney: "🇦🇺", Bali: "🇮🇩",
};

const DAY_COLORS = ["#ff8c42","#ff6b8a","#7c6fff","#3ecf8e","#f5c842","#4ecdc4"];

function TripShareInner() {
  const params = useSearchParams();
  const router = useRouter();
  const raw = params.get("d");

  const trip = useMemo(() => {
    if (!raw) return null;
    try {
      return JSON.parse(decodeURIComponent(escape(atob(raw))));
    } catch (_) { return null; }
  }, [raw]);

  if (!trip) {
    return (
      <div style={{ position: "fixed", inset: 0, background: S.bg, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily: S.font, color: S.text }}>
        <div style={{ fontSize: 40, marginBottom: 16 }}>🗺️</div>
        <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>Invalid share link</div>
        <div style={{ fontSize: 14, color: S.textDim }}>This link may have expired or been corrupted.</div>
      </div>
    );
  }

  const { title, destination, duration, startDate, endDate, budget, activities, isAI } = trip;
  const flag = CITY_FLAGS[destination] || "✈️";
  const numDays = parseInt(duration) || Object.keys(activities || {}).length;
  const totalBudget = budget ? parseFloat((budget || "").replace(/[$,]/g, "")) : 0;

  const dateLabel = (() => {
    if (!startDate || !endDate) return duration || null;
    const fmt = d => new Date(d + "T00:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    return `${fmt(startDate)} – ${fmt(endDate)}`;
  })();

  const allDays = Array.from({ length: numDays }, (_, i) => i + 1);

  return (
    <div style={{ position: "fixed", inset: 0, background: S.bg, fontFamily: S.font, color: S.text, overflowY: "auto", display: "flex", flexDirection: "column" }}>

      {/* Header gradient */}
      <div style={{ position: "relative", padding: "56px 24px 32px", background: "linear-gradient(160deg, rgba(255,140,66,0.18) 0%, rgba(255,80,180,0.08) 60%, transparent 100%)" }}>
        <div style={{ position: "absolute", top: 16, right: 16, background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 20, padding: "4px 12px", fontSize: 11, color: S.textDim, fontWeight: 600, letterSpacing: 0.5 }}>
          VIEW ONLY
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 12 }}>
          <span style={{ fontSize: 36 }}>{flag}</span>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 800, margin: 0, letterSpacing: -0.5, lineHeight: 1.2 }}>
              {title}
              {isAI && (
                <span style={{ marginLeft: 8, display: "inline-flex", alignItems: "center", gap: 3, background: "linear-gradient(90deg,rgba(255,140,66,0.15),rgba(255,80,180,0.15))", border: "1px solid rgba(255,140,66,0.25)", borderRadius: 8, padding: "2px 7px", fontSize: 10, fontWeight: 700, color: "#ff9a52", letterSpacing: 0.5, verticalAlign: "middle" }}>
                  ✦ AI
                </span>
              )}
            </h1>
            <div style={{ display: "flex", gap: 8, marginTop: 6, flexWrap: "wrap" }}>
              {dateLabel && (
                <span style={{ fontSize: 12, background: "rgba(255,255,255,0.08)", borderRadius: 8, padding: "3px 10px", color: S.textDim }}>
                  📅 {dateLabel}
                </span>
              )}
              <span style={{ fontSize: 12, background: "rgba(255,255,255,0.08)", borderRadius: 8, padding: "3px 10px", color: S.textDim }}>
                {numDays} {numDays === 1 ? "day" : "days"}
              </span>
              {totalBudget > 0 && (
                <span style={{ fontSize: 12, background: "rgba(255,140,66,0.1)", border: "1px solid rgba(255,140,66,0.2)", borderRadius: 8, padding: "3px 10px", color: S.accent }}>
                  💰 {budget}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Itinerary */}
      <div style={{ padding: "0 16px 100px", flex: 1 }}>
        {allDays.map(day => {
          const spots = (activities?.[day] || []);
          const color = DAY_COLORS[(day - 1) % DAY_COLORS.length];
          return (
            <div key={day} style={{ marginBottom: 20 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                <div style={{ width: 32, height: 32, borderRadius: "50%", background: color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 800, color: "#fff", flexShrink: 0 }}>
                  {day}
                </div>
                <span style={{ fontSize: 14, fontWeight: 700, letterSpacing: 0.5, color: "rgba(255,255,255,0.7)", textTransform: "uppercase" }}>
                  Day {day}
                </span>
              </div>

              {spots.length === 0 ? (
                <div style={{ background: S.card, border: `1px solid ${S.border}`, borderRadius: 14, padding: "16px", color: S.textDim, fontSize: 13, textAlign: "center" }}>
                  No spots planned
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {spots.map((spot, idx) => (
                    <div key={idx} style={{ background: S.card, border: `1px solid ${S.border}`, borderRadius: 14, padding: "12px 16px", display: "flex", alignItems: "center", gap: 12 }}>
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2, flexShrink: 0 }}>
                        <div style={{ width: 8, height: 8, borderRadius: "50%", background: color, opacity: 0.7 }} />
                        {idx < spots.length - 1 && <div style={{ width: 1, height: 20, background: "rgba(255,255,255,0.1)" }} />}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 600, fontSize: 14 }}>{spot.name}</div>
                        {spot.time && <div style={{ fontSize: 12, color: S.textDim, marginTop: 2 }}>{spot.time}</div>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Bottom CTA */}
      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, padding: "16px 24px 32px", background: "linear-gradient(to top, #09090f 60%, transparent)" }}>
        <button
          onClick={() => router.push("/home")}
          style={{ width: "100%", padding: "14px 0", borderRadius: 14, border: "none", cursor: "pointer", fontSize: 15, fontWeight: 700, background: "#ff8c42", color: "#fff", boxShadow: "0 6px 20px rgba(255,140,66,0.35)" }}
        >
          Plan your own trip ✈️
        </button>
      </div>
    </div>
  );
}

export default function TripSharePage() {
  return (
    <Suspense fallback={
      <div style={{ position: "fixed", inset: 0, background: "#09090f", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ color: "rgba(255,255,255,0.35)", fontSize: 14 }}>Loading…</div>
      </div>
    }>
      <TripShareInner />
    </Suspense>
  );
}
