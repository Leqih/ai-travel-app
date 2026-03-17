import Link from "next/link";
import { loginBenefits } from "@/components/forms";

export function AuthPage() {
  return (
    <main className="page-shell">
      <section className="page-hero">
        <div>
          <p className="eyebrow">Account Login</p>
          <h1 className="page-title">Continue your housing search</h1>
          <p className="page-text">Sign in with your school email to sync saved listings, alerts, and scheduled tours.</p>
        </div>
        <Link className="page-back" href="/">
          Back Home
        </Link>
      </section>

      <section className="section auth-layout">
        <div className="detail-card">
          <div className="section-heading compact">
            <p className="section-kicker">Login Form</p>
            <h2>Build trust with campus identity</h2>
          </div>
          <div className="form-stack">
            <label className="field-card">
              <span>School Email</span>
              <input type="email" placeholder="name@school.edu" />
            </label>
            <label className="field-card">
              <span>Password</span>
              <input type="password" placeholder="Enter password" />
            </label>
            <label className="field-card">
              <span>Verification Code</span>
              <input type="text" placeholder="Enter 6-digit code" />
            </label>
            <button type="button">Log in and continue</button>
          </div>
        </div>

        <aside className="topic-card sticky-panel">
          <p className="section-kicker">After Login</p>
          <div className="benefit-list">
            {loginBenefits.map((item) => (
              <div key={item} className="benefit-item">
                <strong>✓</strong>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </aside>
      </section>
    </main>
  );
}
