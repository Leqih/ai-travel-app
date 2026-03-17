import Link from "next/link";

const chatGroups = [
  { key: "listing", title: "Listing Chats", count: 8, active: true },
  { key: "roommate", title: "Roommate Chats", count: 3, active: false },
  { key: "support", title: "Support Chats", count: 1, active: false }
];

const chatList = [
  {
    id: "emma",
    name: "Emma",
    role: "Subletter",
    listing: "Springfield 2B1B",
    preview: "You can move in around mid-August, and I can leave the furniture.",
    time: "09:24",
    unread: 2
  },
  {
    id: "jason",
    name: "Jason",
    role: "Landlord",
    listing: "Green St. Studio",
    preview: "We can schedule an in-person tour this Friday afternoon.",
    time: "Yesterday",
    unread: 0
  },
  {
    id: "sarah",
    name: "Sarah",
    role: "Roommate Match",
    listing: "Fall 2026 Roommate",
    preview: "My schedule is pretty regular, and I am open to an all-female apartment.",
    time: "Mon",
    unread: 1
  }
];

export function MessagesPage() {
  return (
    <main className="messages-shell app-mobile-shell">
      <section className="messages-header">
        <div className="detail-topbar">
          <div>
            <p className="eyebrow">Messages</p>
            <h1 className="page-title">Chat List</h1>
            <p className="page-text">Manage conversations around specific listings so you always know who you are talking to and which place it is about.</p>
          </div>
          <button className="icon-button" type="button">
            ＋
          </button>
        </div>
      </section>

      <section className="messages-categories">
        {chatGroups.map((group) => (
          <article
            key={group.key}
            className={`message-category-card${group.active ? " active" : ""}`}
          >
            <strong>{group.title}</strong>
            <p>{group.count} chats</p>
          </article>
        ))}
      </section>

      <section className="chat-list-section">
        {chatList.map((chat, index) => (
          <Link key={chat.id} className={`chat-list-card${index === 0 ? " active" : ""}`} href={`/messages/${chat.id}`}>
            <div className="chat-list-avatar" />
            <div className="chat-list-copy">
              <div className="chat-list-top">
                <strong>{chat.name}</strong>
                <span>{chat.time}</span>
              </div>
              <div className="chat-list-meta">
                <span className="chat-role">{chat.role}</span>
                <span>{chat.listing}</span>
              </div>
              <p>{chat.preview}</p>
            </div>
            {chat.unread ? <span className="chat-unread">{chat.unread}</span> : null}
          </Link>
        ))}
      </section>
    </main>
  );
}
