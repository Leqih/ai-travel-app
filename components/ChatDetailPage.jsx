import Link from "next/link";

const chatDetailMap = {
  emma: {
    name: "Emma",
    role: "Subletter",
    listing: "Springfield 2B1B",
    price: "$700 / mo",
    location: "Near campus · 8 min walk"
  },
  jason: {
    name: "Jason",
    role: "Landlord",
    listing: "Green St. Studio",
    price: "$920 / mo",
    location: "South Gate · 6 min bike"
  },
  sarah: {
    name: "Sarah",
    role: "Roommate Match",
    listing: "Fall 2026 Roommate",
    price: "Budget matched",
    location: "Quiet zone · engineering side"
  }
};

const quickQuestions = [
  "Is it still available?",
  "When can I move in?",
  "Is furniture included?",
  "Can I tour it in person?"
];

export function ChatDetailPage({ chatId }) {
  const chat = chatDetailMap[chatId] ?? chatDetailMap.emma;

  return (
    <main className="messages-shell app-mobile-shell">
      <section className="messages-header">
        <div className="detail-topbar">
          <Link className="page-back" href="/messages">
            Back
          </Link>
          <div className="chat-header-center">
            <strong>{chat.name}</strong>
            <p>{chat.role}</p>
          </div>
          <button className="icon-button" type="button">
            ⋯
          </button>
        </div>
      </section>

      <section className="chat-detail-card">
        <div className="listing-context-card">
          <div className="listing-context-thumb" />
          <div>
            <strong>{chat.listing}</strong>
            <p>
              {chat.price} · {chat.location}
            </p>
          </div>
          <Link className="section-link-button" href="/detail">
            View listing
          </Link>
        </div>

        <div className="message-thread">
          <div className="message-bubble incoming">
            Hi, is this place still available? I want to confirm the move-in timing.
          </div>
          <div className="message-bubble outgoing">
            Yes, it is. The earliest move-in would be mid-August, and we can also discuss leaving the furniture.
          </div>
          <div className="message-bubble incoming">
            Great, could we arrange a tour this week?
          </div>
        </div>

        <div className="quick-question-row">
          {quickQuestions.map((question) => (
            <button key={question} className="quick-question-chip" type="button">
              {question}
            </button>
          ))}
        </div>

        <div className="chat-action-row">
          <button className="secondary-button" type="button">
            Book a tour
          </button>
          <button className="secondary-button" type="button">
            Send photos
          </button>
          <button className="secondary-button" type="button">
            Safety tips
          </button>
        </div>
      </section>

      <section className="create-post-bar chat-compose-bar">
        <button className="create-post-icon" type="button">
          ＋
        </button>
        <div className="create-post-input">Message {chat.name} about {chat.listing}</div>
        <button className="create-post-send" type="button">
          ➤
        </button>
      </section>
    </main>
  );
}
