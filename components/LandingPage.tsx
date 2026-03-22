"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Link from "next/link";
import { type Leela } from "@/lib/data";

/* ══════════════════════════════════════════════
   PETAL RAIN
══════════════════════════════════════════════ */
function PetalRain() {
  useEffect(() => {
    const container = document.getElementById("petal-root");
    if (!container) return;
    const PETALS = ["🌸", "🌺", "🪷"];
    let alive = true;
    const spawn = () => {
      if (!alive) return;
      const p = document.createElement("span");
      p.className = "petal animate-petal";
      p.textContent = PETALS[Math.floor(Math.random() * PETALS.length)];
      p.style.left = `${Math.random() * 100}vw`;
      p.style.top = "0";
      p.style.fontSize = `${Math.random() * 0.6 + 0.5}rem`;
      const dur = Math.random() * 6 + 8;
      p.style.animationDuration = `${dur}s`;
      p.style.animationDelay = `${Math.random() * 2}s`;
      container.appendChild(p);
      setTimeout(() => p.remove(), (dur + 4) * 1000);
    };
    const iv = setInterval(spawn, 2400);
    return () => { alive = false; clearInterval(iv); };
  }, []);
  return (
    <div
      id="petal-root"
      className="fixed inset-0 pointer-events-none overflow-hidden"
      style={{ zIndex: 2 }}
      aria-hidden="true"
    />
  );
}

/* ══════════════════════════════════════════════
   NAVBAR
══════════════════════════════════════════════ */
function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const scrollToFolders = () => {
    document.getElementById("folders")?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  return (
    <>
      {/* Gold identity strip */}
      {/* <div className="header-strip px-4 py-2.5 flex items-center justify-center gap-3 flex-wrap">
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
          style={{ color: "rgba(58,46,26,0.7)" }}
        >
          · ISKCON Divine Collection ·
        </span>
      </div> */}

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
            <Link href="/admin" className="scroll-btn" style={{ background: "linear-gradient(180deg,#fffbe0,#f5e070)" }}>
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
          <div className="md:hidden mt-2 flex flex-wrap gap-2 justify-center pb-2 border-t pt-2" style={{ borderColor: "rgba(160,110,0,0.15)" }}>
            <button className="scroll-btn" onClick={scrollToFolders}>Browse Gallery</button>
            <Link href="/admin" className="scroll-btn">Admin</Link>
          </div>
        )}
      </nav>
    </>
  );
}

/* ══════════════════════════════════════════════
   HERO
══════════════════════════════════════════════ */
function Hero() {
  return (
    <header
      className="relative flex flex-col items-center justify-center text-center px-4 py-10 md:py-14 overflow-hidden"
      style={{ background: "linear-gradient(180deg,#fffaed 0%,#fdf2c0 60%,#fdf6e3 100%)" }}
    >
      {/* Faint OM watermark */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
        aria-hidden="true"
        style={{ opacity: 0.04 }}
      >
        <span className="font-devanagari" style={{ fontSize: "min(50vw,340px)", color: "#b07d00", lineHeight: 1 }}>ॐ</span>
      </div>

      <div className="relative z-10 max-w-2xl mx-auto">
        {/* Floating OM */}
        {/* <div
          className="animate-float mb-3"
          style={{ fontFamily: "'Noto Serif Devanagari',serif", fontSize: "clamp(2.2rem,6vw,3.5rem)", color: "#b07d00", filter: "drop-shadow(0 2px 6px rgba(160,100,0,0.3))" }}
          aria-label="Om"
        >
          ॐ
        </div> */}

        {/* Title */}
        <h1 className="font-cinzel font-black title-gold leading-tight mb-2" style={{ fontSize: "clamp(1.9rem,6.5vw,4rem)" }}>
          Hare Krishna
        </h1>

        {/* Subtitle */}
        <p className="font-fell italic mb-1" style={{ fontSize: "clamp(0.85rem,2vw,1.05rem)", letterSpacing: "0.16em", color: "rgba(58,46,26,0.58)" }}>
          A.C. Bhaktivedanta Swami Prabhupāda
        </p>
        <p className="section-label mb-6" style={{ color: "rgba(58,46,26,0.38)", fontSize: "0.54rem" }}>
          ISKCON Divine Photo &amp; Video Gallery
        </p>

        {/* Maha Mantra */}
        <p className="mantra-gold font-bold mb-6" style={{ fontSize: "clamp(0.68rem,1.8vw,0.92rem)", lineHeight: 2.2 }}>
          Hare Krishna Hare Krishna · Krishna Krishna Hare Hare
          <br />
          Hare Rama Hare Rama · Rama Rama Hare Hare
        </p>

        {/* Divider */}
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="divider" style={{ flex: 1, maxWidth: 80 }} />
          <span style={{ color: "var(--gold)", fontSize: "1rem" }}>🪷 ✦ 🪷</span>
          <div className="divider" style={{ flex: 1, maxWidth: 80 }} />
        </div>

        {/* CTA */}
        <button
          className="cta-btn px-8 py-2.5 text-xs shadow-md"
          onClick={() => document.getElementById("folders")?.scrollIntoView({ behavior: "smooth" })}
        >
          ✦ Enter Divine Gallery ✦
        </button>
      </div>
    </header>
  );
}

/* ══════════════════════════════════════════════
   FOLDER CARD
══════════════════════════════════════════════ */
const CARD_EMOJIS = ["📸", "🎉", "🌅", "🎊", "🎬"];

function FolderCard({ folder, index, mediaCount, coverImage }: {
  folder: Leela;
  index: number;
  mediaCount: number;
  coverImage?: string;
}) {
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [entering, setEntering] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.05 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const enter = () => {
    if (entering) return;
    setEntering(true);

    // Sacred entrance overlay
    const ov = document.createElement("div");
    ov.className = "entrance-overlay";
    ov.innerHTML = `
      <div style="font-size:3rem;line-height:1">${folder.emoji}</div>
      <div style="font-family:'Cinzel Decorative',serif;font-size:clamp(1rem,3vw,1.3rem);color:#7a5500;letter-spacing:0.18em;text-align:center">✦ Entering Sacred Space ✦</div>
      <div style="font-family:'IM Fell English',serif;font-style:italic;color:#3a2e1a;font-size:clamp(0.9rem,2vw,1.1rem);text-align:center">${folder.title}</div>
    `;
    document.body.appendChild(ov);
    requestAnimationFrame(() => { ov.style.opacity = "1"; });
    setTimeout(() => {
      ov.style.opacity = "0";
      setTimeout(() => { ov.remove(); router.push(`/folders/${folder.slug}`); }, 450);
    }, 1400);
  };

  return (
    <div
      ref={ref}
      className="folder-card"
      onClick={enter}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && enter()}
      aria-label={`Open ${folder.title} gallery`}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(22px)",
        transition: `opacity 0.55s ease ${index * 0.08}s, transform 0.55s ease ${index * 0.08}s`,
      }}
    >
      {/* Cover image */}
      {coverImage && (
        <img
          src={coverImage}
          alt={folder.title}
          className="absolute inset-0 w-full h-full object-cover"
          style={{ zIndex: 0, filter: "grayscale(15%) brightness(0.88)" }}
        />
      )}

      {/* Faint emoji watermark (no cover) */}
      {!coverImage && (
        <div
          className="absolute right-2 bottom-0 pointer-events-none select-none"
          aria-hidden="true"
          style={{ fontSize: "clamp(3rem,7vw,5rem)", opacity: 0.22, filter: "grayscale(1)", zIndex: 0, lineHeight: 1 }}
        >
          {CARD_EMOJIS[index % CARD_EMOJIS.length]}
        </div>
      )}

      {/* Content overlay — always on top, always legible */}
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(110deg, rgba(250,230,120,0.97) 50%, rgba(232,169,0,0.6) 100%)",
          zIndex: 1,
        }}
        aria-hidden="true"
      />

      {/* Text content */}
      <div className="relative p-5 md:p-6" style={{ zIndex: 2 }}>
        <span className="card-tag">{folder.tag}</span>

        <h3 className="card-title">{folder.title}</h3>

        <p className="card-subtitle">{folder.subtitle}</p>

        <div className="flex items-center justify-between">
          {mediaCount > 0 && (
            <span className="card-count">{mediaCount} items</span>
          )}
          <span className="card-link ml-auto">View Gallery →</span>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   FOLDERS SECTION
══════════════════════════════════════════════ */
function FoldersSection() {
  const [folders, setFolders] = useState<Leela[]>([]);

  useEffect(() => {
    axios.get("/api/leelas")
      .then(({ data }) => {
        if (Array.isArray(data)) {
          // Map DB response to Leela interface
          const mappedFolders: Leela[] = data.map((item: any) => ({
            id: item._id || item.slug,
            title: item.name || item.title || item.slug,
            subtitle: item.description || item.subtitle || "",
            emoji: item.emoji,
            color: item.color,
            tag: item.tag,
            slug: item.slug,
            coverImage: item.coverImage,
            mediaCount: item.mediaCount || 0,
          }));
          setFolders(mappedFolders);
        }
      })
      .catch(() => {});
  }, []);

  if (folders.length === 0) {
    return (
      <section
        id="folders"
        className="px-4 md:px-8 py-8 md:py-12"
        style={{ background: "#fdf6e3" }}
      >
        <div className="max-w-5xl mx-auto text-center">
          <p>Loading divine collections...</p>
        </div>
      </section>
    );
  }

  return (
    <section
      id="folders"
      className="px-4 md:px-8 py-8 md:py-12"
      style={{ background: "#fdf6e3" }}
    >
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-7">
          <span className="section-label mb-1" style={{ color: "rgba(58,46,26,0.38)", fontSize: "0.52rem" }}>
            Sacred Collections
          </span>
          <h2 className="font-cinzel font-bold title-gold" style={{ fontSize: "clamp(1.4rem,3.5vw,2.2rem)" }}>
            Divine Gallery
          </h2>
          <div className="flex items-center justify-center gap-3 mt-3">
            <div className="divider" style={{ flex: 1, maxWidth: 64 }} />
            <span style={{ color: "var(--gold)", fontSize: "0.9rem" }}>✦</span>
            <div className="divider" style={{ flex: 1, maxWidth: 64 }} />
          </div>
        </div>

        {/* Dynamic grid based on number of folders */}
        <div className={`grid gap-4 md:gap-5 ${folders.length <= 3 ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'}`}>
          {folders.map((folder, i) => (
            <FolderCard
              key={String(folder.id)}
              folder={folder}
              index={i}
              mediaCount={folder.mediaCount ?? 0}
              coverImage={folder.coverImage}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════
   FOOTER
══════════════════════════════════════════════ */
function Footer() {
  return (
    <footer
      className="py-6 px-6 text-center"
      style={{ background: "linear-gradient(0deg,#f0cc60,#f5d878)", borderTop: "2px solid rgba(160,110,0,0.3)" }}
    >
      <p
        className="font-cinzel-reg tracking-widest mb-1"
        style={{ fontSize: "0.5rem", color: "rgba(58,46,26,0.52)" }}
      >
        ✦ Hare Krishna Hare Krishna Krishna Krishna Hare Hare ✦ Hare Rama Hare Rama Rama Rama Hare Hare ✦
      </p>
      <p className="font-fell italic text-xs" style={{ color: "rgba(58,46,26,0.38)" }}>
        All glories to Srila Prabhupada · ISKCON Divine Gallery ·{" "}
        <Link href="/admin" className="underline underline-offset-2 hover:opacity-70 transition-opacity">
          Admin
        </Link>
      </p>
    </footer>
  );
}

/* ══════════════════════════════════════════════
   ROOT EXPORT
══════════════════════════════════════════════ */
export default function LandingPage() {
  return (
    <>
      <PetalRain />
      <Navbar />
      <main>
        <Hero />
        <FoldersSection />
      </main>
      <Footer />
    </>
  );
}
