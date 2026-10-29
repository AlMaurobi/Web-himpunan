import { Suspense } from "react";
import AdminSidebar from "./AdminSidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#FAF7F2] flex flex-col md:flex-row text-stone-800">
      <Suspense fallback={<div className="w-full md:w-64 bg-[#2A1810] shrink-0 h-16 md:h-auto" />}>
        <AdminSidebar />
      </Suspense>

      <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8">
        <div className="max-w-6xl mx-auto">{children}</div>
      </main>
    </div>
  );
}
