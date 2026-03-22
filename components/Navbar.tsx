"use client";
import { useState } from "react";
import Link from "next/link";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const scrollToFolders = () => {
    document.getElementById("folders")?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  return (
    <>
      {/* Gold identity strip */}
      <div
        className="header-strip px-4 py-2.5 flex items-center justify-center gap-3 flex-wrap"
        role="banner"
      >
        <span
          className="font-devanagari text-xl leading-none"
          style={{ color: "var(--ink)", textShadow: "0 1px 0 rgba(255,255,255,.3)" }}
          aria-label="Om"
        >
          ॐ
        </span>
        <span
          className="font-cinzel font-bold tracking-widest"
          style={{ fontSize: "clamp(0.85rem, 2.8vw, 1.3rem)", color: "var(--ink)" }}
        >
          KRISHNA GALLERY
        </span>
        <span
          className="font-fell italic hidden sm:inline text-sm"
          style={{ color: "rgba(58,46,26,0.68)" }}
        >
          · ISKCON Divine Collection ·
        </span>
      </div>

      {/* Nav bar */}
      <nav
        className="sticky top-0 z-50 px-4 py-2.5"
        style={{
          background: "rgba(253,246,227,0.97)",
          borderBottom: "2px solid rgba(160,110,0,0.25)",
          backdropFilter: "blur(8px)",
          boxShadow: "0 2px 12px rgba(160,110,0,0.08)",
        }}
      >
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-3">
          {/* Logo */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xl animate-float">🪷</span>
            <span
              className="font-cinzel-reg font-bold hidden sm:block"
              style={{ fontSize: "0.6rem", letterSpacing: "0.2em", color: "var(--gold-dark)" }}
            >
              HARE KRISHNA
            </span>
          </div>

          {/* Desktop nav buttons */}
          <div className="hidden md:flex items-center gap-1.5 flex-wrap justify-center">
            <button className="scroll-btn" onClick={scrollToFolders}>
              Browse Gallery
            </button>
            <Link
              href="/admin"
              className="scroll-btn"
              style={{ background: "linear-gradient(180deg,#fffbe0,#f5e070)" }}
            >
              Admin
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 flex flex-col gap-1.5"
            onClick={() => setMenuOpen((p) => !p)}
            aria-label="Toggle menu"
          >
            {[0, 1, 2].map((i) => (
              <span key={i} className="block w-5 h-0.5 rounded" style={{ background: "var(--gold-dark)" }} />
            ))}
          </button>
        </div>

        {/* Mobile dropdown */}
        {menuOpen && (
          <div
            className="md:hidden mt-2 flex flex-wrap gap-2 justify-center pb-2 pt-2"
            style={{ borderTop: "1px solid rgba(160,110,0,0.15)" }}
          >
            <button className="scroll-btn" onClick={scrollToFolders}>Browse Gallery</button>
            <Link href="/admin" className="scroll-btn" onClick={() => setMenuOpen(false)}>Admin</Link>
          </div>
        )}
      </nav>
    </>
  );
}
