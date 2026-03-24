"use client";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

const NAV = [
  { href: "/admin",         label: "Dashboard",   icon: "🏛️" },
  { href: "/admin/folders", label: "Folders",      icon: "📂" },
  { href: "/admin/upload",  label: "Upload Media", icon: "⬆️" },
  { href: "/",              label: "View Site",    icon: "🪷" },
];

export default function AdminNav() {
  const pathname = usePathname();
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Close drawer on route change
  useEffect(() => { setDrawerOpen(false); }, [pathname]);

  // Close drawer on Escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") setDrawerOpen(false); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const sidebarContent = (
    <>
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
    </>
  );

  return (
    <>
      {/* ── DESKTOP: fixed sidebar (lg+) ── */}
      <aside
        className="hidden lg:flex fixed top-0 left-0 h-full w-56 flex-col z-40"
        style={{
          background: "linear-gradient(180deg,#fffaed,#fdf0c0)",
          borderRight: "2px solid rgba(160,110,0,0.2)",
        }}
      >
        {sidebarContent}
      </aside>

      {/* ── TABLET: hamburger + slide-in drawer (md–lg) ── */}
      <div className="hidden md:flex lg:hidden">
        {/* Hamburger trigger */}
        <button
          onClick={() => setDrawerOpen(true)}
          className="fixed top-4 left-4 z-50 flex flex-col justify-center items-center w-10 h-10 rounded-xl gap-1.5"
          style={{
            background: "linear-gradient(135deg,#fffaed,#fdf0c0)",
            border: "1.5px solid rgba(160,110,0,0.28)",
            boxShadow: "0 2px 8px rgba(160,110,0,0.12)",
          }}
          aria-label="Open navigation"
        >
          <span className="block w-5 h-0.5 rounded" style={{ background: "var(--gold-dark, #b07d00)" }} />
          <span className="block w-5 h-0.5 rounded" style={{ background: "var(--gold-dark, #b07d00)" }} />
          <span className="block w-3.5 h-0.5 rounded" style={{ background: "var(--gold-dark, #b07d00)" }} />
        </button>

        {/* Backdrop */}
        {drawerOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
            onClick={() => setDrawerOpen(false)}
          />
        )}

        {/* Drawer */}
        <aside
          className="fixed top-0 left-0 h-full w-56 flex flex-col z-50 transition-transform duration-300"
          style={{
            background: "linear-gradient(180deg,#fffaed,#fdf0c0)",
            borderRight: "2px solid rgba(160,110,0,0.2)",
            transform: drawerOpen ? "translateX(0)" : "translateX(-100%)",
          }}
        >
          {/* Close button inside drawer */}
          <button
            onClick={() => setDrawerOpen(false)}
            className="absolute top-3 right-3 w-7 h-7 flex items-center justify-center rounded-lg font-fell text-sm transition-opacity hover:opacity-60"
            style={{ color: "rgba(58,46,26,0.5)" }}
            aria-label="Close navigation"
          >
            ✕
          </button>
          {sidebarContent}
        </aside>
      </div>

      {/* ── MOBILE: bottom tab bar (< md) ── */}
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 flex items-center justify-around px-2 py-2"
        style={{
          background: "linear-gradient(180deg,#fffdf5,#fdf0c0)",
          borderTop: "1.5px solid rgba(160,110,0,0.22)",
          boxShadow: "0 -4px 16px rgba(160,110,0,0.10)",
          paddingBottom: "calc(0.5rem + env(safe-area-inset-bottom))",
        }}
      >
        {NAV.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col items-center gap-0.5 px-2 py-1 rounded-xl transition-all min-w-0"
              style={{
                background: active ? "rgba(160,110,0,0.12)" : "transparent",
                border: active ? "1px solid rgba(160,110,0,0.22)" : "1px solid transparent",
                flex: 1,
                maxWidth: "4.5rem",
              }}
            >
              <span className="text-lg leading-none">{item.icon}</span>
              <span
                className="font-fell italic truncate w-full text-center"
                style={{
                  fontSize: "0.58rem",
                  color: active ? "var(--gold-dark, #b07d00)" : "rgba(58,46,26,0.5)",
                  fontWeight: active ? 600 : 400,
                  letterSpacing: "0.02em",
                }}
              >
                {item.label}
              </span>
            </Link>
          );
        })}

        {/* Sign out tab */}
        <button
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
          className="flex flex-col items-center gap-0.5 px-2 py-1 rounded-xl transition-all min-w-0 font-fell"
          style={{
            flex: 1,
            maxWidth: "4.5rem",
            background: "transparent",
            border: "1px solid transparent",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#c0392b")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "")}
        >
          <span className="text-lg leading-none">🚪</span>
          <span
            className="truncate w-full text-center"
            style={{ fontSize: "0.58rem", color: "rgba(58,46,26,0.45)", letterSpacing: "0.02em" }}
          >
            Sign Out
          </span>
        </button>
      </nav>
    </>
  );
}