import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Folder from "@/models/Folder";
import Media from "@/models/Media";
import AdminNav from "@/components/admin/AdminNav";
import Link from "next/link";
import { redirect } from "next/navigation";

async function getStats() {
  await connectDB();
  const [totalFolders, totalMedia, totalPublished] = await Promise.all([
    Folder.countDocuments(),
    Media.countDocuments(),
    Folder.countDocuments({ isPublished: true }),
  ]);
  const recentFolders = await Folder.find().sort({ createdAt: -1 }).limit(5).lean();
  return { totalFolders, totalMedia, totalPublished, recentFolders };
}

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/admin/login");
  }
  const { totalFolders, totalMedia, totalPublished, recentFolders } = await getStats();

  const stats = [
    { label: "Total Folders", value: totalFolders,               emoji: "📂", color: "#b07d00" },
    { label: "Total Media",   value: totalMedia,                 emoji: "🖼️", color: "#0d7a99" },
    { label: "Published",     value: totalPublished,             emoji: "✅", color: "#27ae60" },
    { label: "Drafts",        value: totalFolders-totalPublished, emoji: "📝", color: "#8e44ad" },
  ];

  return (
    <div className="flex min-h-screen" style={{ background: "var(--cream)" }}>
      <AdminNav />

      {/*
        Offset strategy:
          mobile  (< md):  no left offset; add bottom padding for the tab bar
          tablet  (md–lg): small left offset for the hamburger button area
          desktop (lg+):   full 14rem (w-56) left offset for the sidebar
      */}
      <main className="flex-1 lg:ml-56 p-4 sm:p-6 md:p-8 lg:p-10 pb-24 md:pb-10">

        {/* Header */}
        <div className="mb-6 md:mb-8 md:pl-0 pl-0 pt-2 md:pt-0">
          {/* On tablet, nudge content right of the hamburger */}
          <div className="md:pl-12 lg:pl-0">
            <span
              className="section-label mb-1"
              style={{ color: "rgba(58,46,26,0.38)", fontSize: "0.52rem" }}
            >
              Welcome back
            </span>
            <h1
              className="font-cinzel font-bold title-gold"
              style={{ fontSize: "clamp(1.1rem,3vw,2rem)" }}
            >
              🙏 {session?.user?.name ?? "Admin"}
            </h1>
            <p
              className="font-fell italic mt-1"
              style={{ fontSize: "0.9rem", color: "rgba(58,46,26,0.48)" }}
            >
              Manage the divine gallery with love and devotion
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 md:mb-8">
          {stats.map((s) => (
            <div
              key={s.label}
              className="admin-card p-4 sm:p-5"
              style={{ borderLeft: `4px solid ${s.color}` }}
            >
              <div className="text-xl sm:text-2xl mb-1.5 sm:mb-2">{s.emoji}</div>
              <div
                className="font-cinzel font-black text-xl sm:text-2xl md:text-3xl"
                style={{ color: s.color }}
              >
                {s.value}
              </div>
              <div
                className="font-fell italic text-xs mt-1"
                style={{ color: "rgba(58,46,26,0.5)" }}
              >
                {s.label}
              </div>
            </div>
          ))}
        </div>

        {/* Quick actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-6 md:mb-8">
          <Link
            href="/admin/folders"
            className="admin-card p-4 sm:p-5 flex items-center gap-3 sm:gap-4"
            style={{ textDecoration: "none" }}
          >
            <div className="text-2xl sm:text-3xl">📂</div>
            <div>
              <h3
                className="font-cinzel-reg font-bold text-sm mb-0.5"
                style={{ color: "var(--ink)" }}
              >
                Manage Folders
              </h3>
              <p
                className="font-fell italic text-xs"
                style={{ color: "rgba(58,46,26,0.5)" }}
              >
                Create, edit, delete gallery folders
              </p>
            </div>
          </Link>

          <Link
            href="/admin/upload"
            className="admin-card p-4 sm:p-5 flex items-center gap-3 sm:gap-4"
            style={{ textDecoration: "none" }}
          >
            <div className="text-2xl sm:text-3xl">⬆️</div>
            <div>
              <h3
                className="font-cinzel-reg font-bold text-sm mb-0.5"
                style={{ color: "var(--ink)" }}
              >
                Upload Media
              </h3>
              <p
                className="font-fell italic text-xs"
                style={{ color: "rgba(58,46,26,0.5)" }}
              >
                Upload photos &amp; videos to folders
              </p>
            </div>
          </Link>
        </div>

        {/* Recent folders */}
        <div>
          <h2
            className="font-cinzel-reg font-bold mb-3 sm:mb-4"
            style={{
              fontSize: "0.82rem",
              letterSpacing: "0.1em",
              color: "rgba(58,46,26,0.6)",
            }}
          >
            Recent Folders
          </h2>
          <div className="flex flex-col gap-2">
            {recentFolders.length === 0 && (
              <p
                className="font-fell italic text-sm"
                style={{ color: "rgba(58,46,26,0.42)" }}
              >
                No folders yet. Create your first one!
              </p>
            )}
            {recentFolders.map((f: any) => (
              <div
                key={f._id.toString()}
                className="admin-card px-3 sm:px-4 py-3 flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                  <span className="text-lg sm:text-xl shrink-0">{f.emoji}</span>
                  <div className="min-w-0">
                    <p
                      className="font-cinzel-reg font-bold text-xs truncate"
                      style={{ color: "var(--ink)" }}
                    >
                      {f.name}
                    </p>
                    <p
                      className="font-fell italic text-xs"
                      style={{ color: "rgba(58,46,26,0.42)" }}
                    >
                      {f.mediaCount} items · {f.isPublished ? "Published" : "Draft"}
                    </p>
                  </div>
                </div>
                <Link
                  href="/admin/folders"
                  className="font-cinzel-reg text-xs hover:opacity-70 transition-opacity shrink-0"
                  style={{
                    color: "var(--gold-dark)",
                    letterSpacing: "0.1em",
                    textDecoration: "none",
                  }}
                >
                  Manage →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}