"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

const HERO_IMG    = "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&h=400&fit=crop&q=80";
const GOOGLE_ICON = "https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg";
const FB_ICON     = "https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Facebook_Logo_%282019%29.png/240px-Facebook_Logo_%282019%29.png";

export const S = {
  bg:          "#09090f",
  border:      "rgba(255,255,255,0.08)",
  borderFocus: "rgba(255,140,66,0.55)",
  text:        "#fff",
  textDim:     "rgba(255,255,255,0.45)",
  textMuted:   "rgba(255,255,255,0.22)",
  accent:      "#ff8c42",
  font:        `-apple-system, "SF Pro Display", "Helvetica Neue", sans-serif`,
};

export { HERO_IMG, GOOGLE_ICON, FB_ICON };

export function AuthPage() {
  const router = useRouter();
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [focused, setFocused]   = useState(null);
  const [loading, setLoading]   = useState(false);

  function handleSignIn() {
    setLoading(true);
    setTimeout(() => router.push("/home"), 1800);
  }

  if (loading) return <SplashLoader />;

  return (
    <AuthShell>
      {/* Hero */}
      <HeroImage />

      {/* Form */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "14px 24px 20px", overflow: "auto" }}>

        {/* Top: title + fields */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 700, margin: "0 0 3px", letterSpacing: -0.5 }}>
              Welcome Back <span style={{ fontWeight: 400 }}>👋</span>
            </h1>
            <p style={{ fontSize: 12, color: S.textDim, margin: 0, lineHeight: 1.4 }}>
              Sign in to start planning your next trip.
            </p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <Field label="Email" type="email" placeholder="Example@email.com"
              value={email} onChange={setEmail}
              focused={focused === "email"} onFocus={() => setFocused("email")} onBlur={() => setFocused(null)} />
            <Field label="Password" type="password" placeholder="At least 8 characters"
              value={password} onChange={setPassword}
              focused={focused === "password"} onFocus={() => setFocused("password")} onBlur={() => setFocused(null)} />
            <div style={{ textAlign: "right" }}>
              <button style={{ background: "none", border: "none", cursor: "pointer", fontSize: 12, color: S.accent, fontWeight: 600, padding: 0 }}>
                Forgot Password?
              </button>
            </div>
          </div>
        </div>

        {/* Bottom: CTA — marginTop: auto pins it to the bottom */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: "auto" }}>
          <CTAButton onClick={handleSignIn}>Sign in</CTAButton>
          <Divider label="Or sign in with" />
          <div style={{ display: "flex", gap: 12 }}>
            <SocialBtn icon={<img src={GOOGLE_ICON} alt="Google" style={{ width: 20, height: 20 }} />} label="Google" />
            <SocialBtn icon={<img src={FB_ICON} alt="Facebook" style={{ width: 20, height: 20 }} />} label="Facebook" />
          </div>
          <p style={{ textAlign: "center", fontSize: 13, color: S.textDim, margin: 0 }}>
            Don't have an account?{" "}
            <button onClick={() => router.push("/signup")} style={{ background: "none", border: "none", cursor: "pointer", color: S.accent, fontWeight: 700, fontSize: 13, padding: 0 }}>
              Sign up
            </button>
          </p>
        </div>
      </div>
    </AuthShell>
  );
}

/* ─── shared shell ─── */
export function AuthShell({ children }) {
  return (
    <div style={{
      position: "fixed", inset: 0,
      background: S.bg,
      fontFamily: S.font,
      color: S.text,
      display: "flex", flexDirection: "column",
      overflow: "hidden",
    }}>
      {children}
    </div>
  );
}

export function HeroImage() {
  return (
    <div style={{ position: "relative", margin: "16px 16px 0", borderRadius: 20, overflow: "hidden", flexShrink: 0, height: 183 }}>
      <img src={HERO_IMG} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
    </div>
  );
}

export function Field({ label, type, placeholder, value, onChange, focused, onFocus, onBlur }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <span style={{ fontSize: 12, fontWeight: 600, color: focused ? S.accent : "rgba(255,255,255,0.55)" }}>{label}</span>
      <input
        type={type} placeholder={placeholder} value={value}
        onChange={e => onChange(e.target.value)}
        onFocus={onFocus} onBlur={onBlur}
        style={{
          width: "100%", boxSizing: "border-box",
          padding: "9px 12px", borderRadius: 8,
          border: `1px solid ${focused ? S.borderFocus : S.border}`,
          background: focused ? "rgba(255,255,255,0.07)" : "rgba(255,255,255,0.04)",
          color: S.text, fontSize: 14, fontFamily: S.font, outline: "none",
          boxShadow: focused ? "0 0 0 3px rgba(255,140,66,0.12)" : "none",
          transition: "border-color 0.15s, box-shadow 0.15s",
        }}
      />
    </div>
  );
}

export function CTAButton({ onClick, children }) {
  return (
    <button onClick={onClick} style={{
      width: "100%", padding: "14px 0",
      borderRadius: 12, border: "none", cursor: "pointer",
      fontSize: 15, fontWeight: 700,
      background: "#ff6524",
      color: "#fff", boxShadow: "0px 6px 10px rgba(255,110,30,0.35)",
    }}>
      {children}
    </button>
  );
}

export function Divider({ label }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <div style={{ flex: 1, height: 1, background: S.border }} />
      <span style={{ fontSize: 12, color: S.textMuted, fontWeight: 600, whiteSpace: "nowrap" }}>{label}</span>
      <div style={{ flex: 1, height: 1, background: S.border }} />
    </div>
  );
}

export function SocialBtn({ icon, label }) {
  return (
    <button style={{
      flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
      padding: "10px 0", borderRadius: 12, border: `1px solid ${S.border}`,
      background: "rgba(255,255,255,0.05)",
      color: S.text, fontSize: 14, fontWeight: 600,
      cursor: "pointer", fontFamily: S.font,
    }}>
      {icon}{label}
    </button>
  );
}

export function SplashLoader() {
  return (
    <div style={{
      position: "fixed", inset: 0,
      background: "#09090f",
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      fontFamily: S.font,
    }}>
      <div style={{
        width: 96, height: 96, borderRadius: 24,
        background: "rgba(255,255,255,0.05)",
        border: "1px solid rgba(255,255,255,0.08)",
        display: "flex", alignItems: "center", justifyContent: "center",
        marginBottom: 24,
      }}>
        <img src="/navora-logo.svg" alt="Navora" style={{ width: 72, height: 72, objectFit: "contain" }} />
      </div>
      <div style={{ fontSize: 22, fontWeight: 800, color: "#fff", letterSpacing: 3, marginBottom: 8 }}>NAVORA</div>
      <div style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", letterSpacing: 1.5, marginBottom: 48 }}>PLAN YOUR JOURNEY</div>
      <div style={{ display: "flex", gap: 7 }}>
        {[0, 1, 2].map(i => (
          <div key={i} style={{
            width: 8, height: 8, borderRadius: "50%",
            background: S.accent,
            animation: `splash-bounce 1.2s ease-in-out ${i * 0.2}s infinite`,
          }} />
        ))}
      </div>
      <style>{`
        @keyframes splash-bounce {
          0%, 80%, 100% { opacity: 0.2; transform: scale(0.75); }
          40% { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}
