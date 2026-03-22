"use client";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  { href: "/admin",         label: "Dashboard",   icon: "🏛️" },
  { href: "/admin/folders", label: "Folders",      icon: "📂" },
  { href: "/admin/upload",  label: "Upload Media", icon: "⬆️" },
  { href: "/",              label: "View Site",    icon: "🪷" },
];

export default function AdminNav() {
  const pathname = usePathname();
  return (
    <aside
      className="fixed top-0 left-0 h-full w-56 flex flex-col z-40"
      style={{ background: "linear-gradient(180deg,#fffaed,#fdf0c0)", borderRight: "2px solid rgba(160,110,0,0.2)" }}
    >
      {/* Logo */}
      <div className="px-5 py-5" style={{ borderBottom: "1px solid rgba(160,110,0,0.18)" }}>
        <div className="flex items-center gap-2 mb-0.5">
          <span className="text-xl animate-float">🪷</span>
          <span className="font-cinzel-reg font-bold" style={{ fontSize: "0.62rem", letterSpacing: "0.12em", color: "var(--ink)" }}>
            ISKCON Admin
          </span>
        </div>
        <p className="font-fell italic" style={{ fontSize: "0.75rem", color: "rgba(58,46,26,0.42)" }}>Divine Gallery</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
        {NAV.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all font-fell"
              style={{
                fontSize: "0.9rem",
                background: active ? "rgba(160,110,0,0.12)" : "transparent",
                color: active ? "var(--gold-dark)" : "rgba(58,46,26,0.6)",
                border: active ? "1px solid rgba(160,110,0,0.28)" : "1px solid transparent",
                fontWeight: active ? 600 : 400,
              }}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Sign out */}
      <div className="px-3 py-4" style={{ borderTop: "1px solid rgba(160,110,0,0.18)" }}>
        <button
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-fell transition-all"
          style={{ fontSize: "0.9rem", color: "rgba(58,46,26,0.4)" }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#c0392b")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(58,46,26,0.4)")}
        >
          <span>🚪</span>
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
