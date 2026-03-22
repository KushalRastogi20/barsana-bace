"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const result = await signIn("credentials", { email, password, redirect: false });
    setLoading(false);
    if (result?.error) setError("Invalid credentials. Please try again.");
    else router.push("/admin");
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: "linear-gradient(180deg,#fffaed,#fdf0c0)" }}
    >
      {/* OM watermark */}
      <div className="fixed inset-0 flex items-center justify-center pointer-events-none select-none" aria-hidden="true" style={{ opacity: 0.04 }}>
        <span className="font-devanagari" style={{ fontSize: "min(50vw,360px)", color: "#b07d00", lineHeight: 1 }}>ॐ</span>
      </div>

      <div
        className="relative z-10 w-full max-w-md rounded-2xl p-8 md:p-10"
        style={{ background: "rgba(255,255,255,0.9)", border: "2px solid rgba(160,110,0,0.25)", boxShadow: "0 20px 60px rgba(160,110,0,0.15)", backdropFilter: "blur(8px)" }}
      >
        <div className="text-center mb-8">
          <div className="text-4xl mb-3 animate-float">🙏</div>
          <h1 className="font-cinzel font-bold title-gold mb-1" style={{ fontSize: "1.3rem" }}>Admin Sanctuary</h1>
          <p className="font-fell italic" style={{ color: "rgba(58,46,26,0.5)", fontSize: "0.9rem" }}>ISKCON Divine Gallery</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="section-label" style={{ fontSize: "0.55rem" }}>Email</label>
            <input
              type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              required autoComplete="email" className="admin-input" placeholder="admin@iskcon.org"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="section-label" style={{ fontSize: "0.55rem" }}>Password</label>
            <input
              type="password" value={password} onChange={(e) => setPassword(e.target.value)}
              required autoComplete="current-password" className="admin-input" placeholder="••••••••••"
            />
          </div>

          {error && (
            <p className="font-fell italic text-sm text-center" style={{ color: "#c0392b" }}>{error}</p>
          )}

          <button
            type="submit" disabled={loading}
            className="cta-btn w-full py-3 text-xs font-bold tracking-widest mt-2"
            style={{ opacity: loading ? 0.65 : 1 }}
          >
            {loading ? "Entering…" : "✦ Enter Admin Sanctuary ✦"}
          </button>
        </form>

        <p className="font-fell italic text-xs text-center mt-6" style={{ color: "rgba(58,46,26,0.3)" }}>
          Hare Krishna · Serving devotees with love
        </p>
      </div>
    </div>
  );
}
