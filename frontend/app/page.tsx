import Link from "next/link";

const sections = [
  {
    href: "/admin",
    title: "Admin Dashboard",
    description: "Guild setup, bot configuration, pricing, and ticket operations.",
  },
  {
    href: "/app",
    title: "User Workspace",
    description: "Authenticated user pages for orders, tickets, and alerts.",
  },
  {
    href: "/about",
    title: "Public Profile",
    description: "Public-facing About page and platform presentation.",
  },
];

export default function HomePage() {
  return (
    <main
      style={{
        padding: "48px 24px 80px",
        maxWidth: 1100,
        margin: "0 auto",
      }}
    >
      <section
        style={{
          padding: 32,
          border: "1px solid var(--line)",
          background: "var(--surface)",
          backdropFilter: "blur(18px)",
          borderRadius: 24,
          boxShadow: "0 20px 60px rgba(31, 37, 33, 0.08)",
        }}
      >
        <p style={{ letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--muted)" }}>
          Discord Platform
        </p>
        <h1 style={{ fontSize: "clamp(3rem, 8vw, 5.5rem)", lineHeight: 0.95, margin: "12px 0 16px" }}>
          One repo for bot, backend, frontend, and data.
        </h1>
        <p style={{ maxWidth: 720, fontSize: "1.1rem", color: "var(--muted)" }}>
          This scaffold separates the public site, admin dashboard, backend API, and Discord bot
          so each part can grow independently without turning the project into another monolith.
        </p>
      </section>

      <section
        style={{
          marginTop: 28,
          display: "grid",
          gap: 20,
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
        }}
      >
        {sections.map((section) => (
          <Link
            key={section.href}
            href={section.href}
            style={{
              display: "block",
              padding: 24,
              borderRadius: 20,
              border: "1px solid var(--line)",
              background: "rgba(255, 255, 255, 0.72)",
              minHeight: 220,
            }}
          >
            <p style={{ color: "var(--accent-2)", textTransform: "uppercase", letterSpacing: "0.12em" }}>
              Route
            </p>
            <h2 style={{ marginTop: 10, marginBottom: 12, fontSize: "1.8rem" }}>{section.title}</h2>
            <p style={{ color: "var(--muted)", lineHeight: 1.6 }}>{section.description}</p>
          </Link>
        ))}
      </section>
    </main>
  );
}
