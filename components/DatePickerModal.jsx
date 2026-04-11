"use client";
import { useState } from "react";

const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const CITY_FLAGS = { Tokyo:"🇯🇵", Seoul:"🇰🇷", Bangkok:"🇹🇭", Bali:"🇮🇩", Paris:"🇫🇷", "New York":"🇺🇸", London:"🇬🇧", Rome:"🇮🇹", Istanbul:"🇹🇷", Dubai:"🇦🇪", Sydney:"🇦🇺", Barcelona:"🇪🇸", Kyoto:"🇯🇵", Singapore:"🇸🇬", Lisbon:"🇵🇹" };

export default function DatePickerModal({ trip, initialDate = "", onSave, onClose }) {
  const now = new Date();
  const [pickerDate, setPickerDate] = useState(initialDate || "");
  const [calYear, setCalYear] = useState(now.getFullYear());
  const [calMonth, setCalMonth] = useState(now.getMonth());

  function prevMonth() {
    if (calMonth === 0) { setCalMonth(11); setCalYear(y => y - 1); }
    else setCalMonth(m => m - 1);
  }
  function nextMonth() {
    if (calMonth === 11) { setCalMonth(0); setCalYear(y => y + 1); }
    else setCalMonth(m => m + 1);
  }

  const flag = trip ? (CITY_FLAGS[trip.destination] || "✈️") : "✈️";
  const stops = trip ? Object.values(trip.activities || {}).flat().length : 0;
  const confirmed = !!pickerDate;

  return (
    <>
      {/* Scrim */}
      <div onClick={onClose} style={{
        position: "fixed", inset: 0, zIndex: 998,
        background: "rgba(0,0,0,0.6)", backdropFilter: "blur(6px)",
      }} />

      {/* Bottom sheet */}
      <div style={{
        position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 999,
        background: "#131317",
        borderRadius: "24px 24px 0 0",
        borderTop: "1px solid rgba(255,255,255,0.1)",
        boxShadow: "0 -16px 60px rgba(0,0,0,0.65)",
        padding: "0 0 40px",
        animation: "sheet-up 0.32s cubic-bezier(0.32,0.72,0,1)",
        overflow: "hidden",
      }}>
        {/* Drag handle */}
        <div style={{ width: 36, height: 4, borderRadius: 2, background: "rgba(255,255,255,0.18)", margin: "14px auto 0" }} />

        {/* Trip info header */}
        {trip && (
          <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "18px 20px 16px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
            <div style={{
              width: 52, height: 52, borderRadius: 14, flexShrink: 0,
              background: "rgba(255,255,255,0.07)",
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26,
            }}>{flag}</div>
            <div style={{ flex: 1 }}>
              <div style={{ color: "#fff", fontSize: 17, fontWeight: 700, letterSpacing: -0.4 }}>{trip.destination}</div>
              <div style={{ color: "rgba(255,255,255,0.38)", fontSize: 12, marginTop: 2 }}>{trip.duration}{stops > 0 ? ` · ${stops} stops` : ""}</div>
            </div>
            <div style={{
              width: 34, height: 34, borderRadius: "50%",
              background: confirmed ? "linear-gradient(135deg,#ff8c42,#ff5f1f)" : "rgba(255,255,255,0.08)",
              display: "flex", alignItems: "center", justifyContent: "center",
              transition: "background 0.25s",
              boxShadow: confirmed ? "0 4px 12px rgba(255,140,66,0.35)" : "none",
            }}>
              <span style={{ color: confirmed ? "#fff" : "rgba(255,255,255,0.4)", fontSize: 14, fontWeight: 800, lineHeight: 1 }}>✓</span>
            </div>
          </div>
        )}

        {/* Calendar section */}
        <div style={{ padding: "16px 20px 0" }}>
          {/* Section label */}
          <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 10, fontWeight: 700, letterSpacing: 1.2, textTransform: "uppercase", margin: "0 0 12px" }}>Start Date</p>

          {/* Calendar card — mirrors homepage calendar exactly */}
          <div style={{ background: "rgba(255,255,255,0.04)", borderRadius: 12, border: "1px solid rgba(255,255,255,0.08)", padding: "10px 8px 8px", marginBottom: 12, maxWidth: 320, margin: "0 auto 12px" }}>
            {/* Month/year nav */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8, padding: "0 2px" }}>
              <button onClick={prevMonth} style={{ background: "rgba(255,255,255,0.07)", border: "none", borderRadius: 8, width: 28, height: 28, minWidth: 28, padding: 0, color: "rgba(255,255,255,0.7)", fontSize: 14, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "none" }}>‹</button>
              <span style={{ color: "#fff", fontSize: 12, fontWeight: 700, letterSpacing: 0.5 }}>{MONTHS[calMonth]} {calYear}</span>
              <button onClick={nextMonth} style={{ background: "rgba(255,255,255,0.07)", border: "none", borderRadius: 8, width: 28, height: 28, minWidth: 28, padding: 0, color: "rgba(255,255,255,0.7)", fontSize: 14, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "none" }}>›</button>
            </div>

            {/* Day headers */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", marginBottom: 4 }}>
              {["Su","Mo","Tu","We","Th","Fr","Sa"].map(d => (
                <div key={d} style={{ textAlign: "center", fontSize: 9, fontWeight: 600, color: "rgba(255,255,255,0.3)", padding: "2px 0" }}>{d}</div>
              ))}
            </div>

            {/* Day cells */}
            {(() => {
              const firstDay = new Date(calYear, calMonth, 1).getDay();
              const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
              const cells = [];
              for (let i = 0; i < firstDay; i++) cells.push(null);
              for (let d = 1; d <= daysInMonth; d++) cells.push(d);
              const selD = pickerDate ? new Date(pickerDate + "T00:00:00") : null;
              const todayNow = new Date();
              return (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 1 }}>
                  {cells.map((day, idx) => {
                    if (!day) return <div key={`e-${idx}`} />;
                    const isSel = selD && selD.getFullYear() === calYear && selD.getMonth() === calMonth && selD.getDate() === day;
                    const isToday = todayNow.getFullYear() === calYear && todayNow.getMonth() === calMonth && todayNow.getDate() === day;
                    return (
                      <button key={day} onClick={() => {
                        const m = String(calMonth + 1).padStart(2, "0");
                        const dd = String(day).padStart(2, "0");
                        setPickerDate(`${calYear}-${m}-${dd}`);
                      }} style={{
                        background: isSel ? "#ff8c42" : isToday ? "rgba(255,140,66,0.18)" : "transparent",
                        border: isToday && !isSel ? "1px solid rgba(255,140,66,0.35)" : "1px solid transparent",
                        borderRadius: 7, height: 28, padding: 0, cursor: "pointer",
                        color: isSel ? "#fff" : isToday ? "#ff9a52" : "rgba(255,255,255,0.75)",
                        fontSize: 11, fontWeight: isSel ? 700 : 400, boxShadow: "none",
                      }}>{day}</button>
                    );
                  })}
                </div>
              );
            })()}
          </div>
        </div>

        {/* Confirm button */}
        <div style={{ padding: "0 20px", maxWidth: 360, margin: "0 auto", width: "100%" }}>
          <button
            onClick={() => pickerDate && onSave(pickerDate)}
            disabled={!pickerDate}
            style={{
              width: "100%", padding: "12px 0", borderRadius: 12,
              background: pickerDate ? "linear-gradient(135deg, #ff8c42, #ff5f1f)" : "rgba(255,255,255,0.07)",
              border: "none", cursor: pickerDate ? "pointer" : "default",
              color: pickerDate ? "#fff" : "rgba(255,255,255,0.2)",
              fontSize: 13, fontWeight: 700, letterSpacing: 0.3,
              boxShadow: pickerDate ? "0 6px 20px rgba(255,140,66,0.25)" : "none",
              transition: "all 0.2s",
            }}>
            {pickerDate
              ? `Confirm · ${new Date(pickerDate + "T00:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })} ›`
              : "Pick a date above"}
          </button>
        </div>
      </div>

      <style>{`@keyframes sheet-up { from { transform: translateY(100%); } to { transform: translateY(0); } }`}</style>
    </>
  );
}
