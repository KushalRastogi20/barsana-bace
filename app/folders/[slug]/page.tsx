"use client";
import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import Link from "next/link";

interface MediaItem {
  _id: string;
  secureUrl: string;
  resourceType: "image" | "video";
  format: string;
  width?: number;
  height?: number;
  duration?: number;
  caption?: string;
  altText?: string;
  createdAt: string;
}
interface FolderData {
  _id: string;
  name: string;
  description: string;
  emoji: string;
  color: string;
  tag: string;
  coverImage?: string;
  mediaCount: number;
}
interface Pagination { page: number; pages: number; total: number; }

export default function FolderViewerPage() {
  const { slug } = useParams<{ slug: string }>();
  const [folder, setFolder] = useState<FolderData | null>(null);
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [pagination, setPagination] = useState<Pagination>({ page: 1, pages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [lightbox, setLightbox] = useState<MediaItem | null>(null);
  const [error, setError] = useState("");

  const fetchFolder = useCallback(async (page = 1, append = false) => {
    try {
      const { data } = await axios.get(`/api/folders/${slug}?page=${page}&limit=24`);
      setFolder(data.folder);
      setMedia((prev) => append ? [...prev, ...data.media] : data.media);
      setPagination(data.pagination);
    } catch {
      setError("This sacred gallery could not be found.");
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [slug]);

  useEffect(() => { fetchFolder(1); }, [fetchFolder]);

  useEffect(() => {
    if (!lightbox) return;
    const h = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(null);
      const idx = media.findIndex((m) => m._id === lightbox._id);
      if (e.key === "ArrowRight" && idx < media.length - 1) setLightbox(media[idx + 1]);
      if (e.key === "ArrowLeft" && idx > 0) setLightbox(media[idx - 1]);
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [lightbox, media]);

  /* ── Loading ── */
  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center" style={{ background: "var(--cream)" }}>
      <div className="text-5xl mb-3 animate-float">🪷</div>
      <p className="font-fell italic" style={{ color: "rgba(58,46,26,0.55)" }}>Entering sacred space…</p>
    </div>
  );

  /* ── Error ── */
  if (error || !folder) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4" style={{ background: "var(--cream)" }}>
      <div className="text-4xl">🙏</div>
      <p className="font-fell italic" style={{ color: "rgba(58,46,26,0.55)" }}>{error || "Gallery not found"}</p>
      <Link href="/" className="cta-btn px-6 py-2 text-xs">← Return to Home</Link>
    </div>
  );

  return (
    <main style={{ background: "var(--cream)", minHeight: "100vh" }}>

      {/* ── Header ── */}
      <div
        className="relative py-16 px-6 text-center overflow-hidden"
        style={{ background: "linear-gradient(180deg,#fffaed,#fdf2c0)" }}
      >
        {/* Back link */}
        <Link
          href="/"
          className="absolute top-5 left-5 font-cinzel-reg hover:opacity-70 transition-opacity"
          style={{ fontSize: "0.6rem", letterSpacing: "0.15em", color: "var(--gold-dark)" }}
        >
          ← BACK
        </Link>

        <div className="text-5xl md:text-6xl mb-3 animate-float">{folder.emoji}</div>

        <span
          className="inline-block px-3 py-0.5 rounded-full font-cinzel-reg mb-3"
          style={{ fontSize: "0.52rem", color: "rgba(58,46,26,0.6)", background: "rgba(255,255,255,0.5)", border: "1px solid rgba(58,46,26,0.12)" }}
        >
          {folder.tag}
        </span>

        <h1 className="font-cinzel font-black title-gold mb-2" style={{ fontSize: "clamp(1.6rem,5vw,2.8rem)" }}>
          {folder.name}
        </h1>

        {folder.description && (
          <p className="font-fell italic max-w-xl mx-auto mb-2" style={{ fontSize: "clamp(0.9rem,2vw,1.1rem)", color: "rgba(58,46,26,0.55)" }}>
            {folder.description}
          </p>
        )}

        <p className="section-label" style={{ color: "rgba(58,46,26,0.35)", fontSize: "0.52rem" }}>
          {pagination.total} Sacred {pagination.total === 1 ? "Item" : "Items"}
        </p>

        <div className="flex items-center justify-center gap-3 mt-4">
          <div className="divider" style={{ flex: 1, maxWidth: 80 }} />
          <span style={{ color: "var(--gold)", fontSize: "0.9rem" }}>✦</span>
          <div className="divider" style={{ flex: 1, maxWidth: 80 }} />
        </div>
      </div>

      {/* ── Media grid ── */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-10">
        {media.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-4xl mb-3 animate-float">🪷</div>
            <p className="font-fell italic" style={{ color: "rgba(58,46,26,0.45)" }}>No media in this gallery yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
            {media.map((item, i) => (
              <div
                key={item._id}
                className="gallery-item"
                style={{ height: "clamp(110px,16vw,190px)" }}
                onClick={() => setLightbox(item)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === "Enter" && setLightbox(item)}
                aria-label={item.caption || `Media ${i + 1}`}
              >
                {item.resourceType === "video" ? (
                  <video src={item.secureUrl} className="w-full h-full object-cover" muted preload="metadata" />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={item.secureUrl}
                    alt={item.altText || item.caption || ""}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                  />
                )}
                {item.resourceType === "video" && (
                  <div className="absolute top-2 right-2 rounded-full px-1.5 py-0.5 text-xs text-white" style={{ background: "rgba(0,0,0,0.55)" }}>▶</div>
                )}
                <div className="gallery-overlay">
                  {item.caption && (
                    <span className="font-fell italic text-xs" style={{ color: "rgba(253,246,227,0.9)" }}>{item.caption}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Load more */}
        {pagination.page < pagination.pages && (
          <div className="text-center mt-10">
            <button
              onClick={() => { setLoadingMore(true); fetchFolder(pagination.page + 1, true); }}
              disabled={loadingMore}
              className="cta-btn px-10 py-3 text-xs font-bold"
              style={{ opacity: loadingMore ? 0.6 : 1 }}
            >
              {loadingMore ? "Loading…" : "✦ Load More ✦"}
            </button>
          </div>
        )}
      </div>

      {/* ── Lightbox ── */}
      {lightbox && (() => {
        const idx = media.findIndex((m) => m._id === lightbox._id);
        return (
          <div className="lightbox-bg" onClick={() => setLightbox(null)}>
            {/* Close */}
            <button
              onClick={() => setLightbox(null)}
              className="absolute top-5 right-5 text-2xl transition-opacity hover:opacity-70 z-10"
              style={{ color: "rgba(253,246,227,0.7)" }}
              aria-label="Close"
            >
              ✕
            </button>

            {/* Prev */}
            {idx > 0 && (
              <button
                onClick={(e) => { e.stopPropagation(); setLightbox(media[idx - 1]); }}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-4xl px-2 transition-opacity hover:opacity-80 z-10"
                style={{ color: "rgba(253,246,227,0.65)" }}
                aria-label="Previous"
              >
                ‹
              </button>
            )}

            {/* Media */}
            <div
              className="max-w-5xl max-h-[88vh] w-full flex flex-col items-center gap-3 px-12"
              onClick={(e) => e.stopPropagation()}
            >
              {lightbox.resourceType === "video" ? (
                <video
                  src={lightbox.secureUrl}
                  controls
                  autoPlay
                  className="max-h-[78vh] w-auto max-w-full rounded-xl"
                  style={{ boxShadow: "0 0 40px rgba(232,169,0,0.15)" }}
                />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={lightbox.secureUrl}
                  alt={lightbox.altText || lightbox.caption || ""}
                  className="max-h-[78vh] w-auto max-w-full rounded-xl object-contain"
                  style={{ boxShadow: "0 0 40px rgba(232,169,0,0.15)" }}
                />
              )}
              {lightbox.caption && (
                <p className="font-fell italic text-sm text-center" style={{ color: "rgba(253,246,227,0.6)" }}>
                  {lightbox.caption}
                </p>
              )}
              <p className="font-cinzel-reg" style={{ fontSize: "0.5rem", color: "rgba(253,246,227,0.3)", letterSpacing: "0.2em" }}>
                {idx + 1} / {media.length}
              </p>
            </div>

            {/* Next */}
            {idx < media.length - 1 && (
              <button
                onClick={(e) => { e.stopPropagation(); setLightbox(media[idx + 1]); }}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-4xl px-2 transition-opacity hover:opacity-80 z-10"
                style={{ color: "rgba(253,246,227,0.65)" }}
                aria-label="Next"
              >
                ›
              </button>
            )}
          </div>
        );
      })()}
    </main>
  );
}
