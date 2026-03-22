export const metadata = { title: "Admin — ISKCON Divine Gallery" };

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ background: "var(--cream)", minHeight: "100vh" }}>
      {children}
    </div>
  );
}
