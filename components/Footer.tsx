"use client";
export default function Footer() {
  const scroll = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  const links = [
    { id: "folders", label: "Divine Gallery" },
    { id: "hero",    label: "Home" },
  ];

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
      <p className="font-fell italic text-xs" style={{ color: "rgba(58,46,26,0.4)" }}>
        All glories to Srila Prabhupada · ISKCON Divine Gallery
      </p>
    </footer>
  );
}
