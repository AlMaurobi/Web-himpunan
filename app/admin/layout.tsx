import AdminSidebar from "@/components/AdminSidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-stone-100 flex flex-col md:flex-row">
      <AdminSidebar />
      <div className="flex-1 overflow-y-auto">{children}</div>
    </div>
  );
}