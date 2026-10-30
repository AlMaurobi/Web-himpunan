import { Suspense } from "react";
import AdminSidebar from "@/components/AdminSidebar";

export const dynamic = "force-dynamic";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-stone-100 flex flex-col md:flex-row">
      <Suspense fallback={<div className="w-64 bg-[#2A1810] min-h-screen" />}>
        <AdminSidebar />
      </Suspense>
      <div className="flex-1 overflow-y-auto">{children}</div>
    </div>
  );
}