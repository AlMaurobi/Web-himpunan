import { Suspense } from "react";
import AdminSidebar from "./AdminSidebar";

export const instant = false;

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#FAF7F2] flex text-stone-800">
      <Suspense fallback={<div className="w-64 bg-[#2A1810] shrink-0" />}>
        <AdminSidebar />
      </Suspense>

      <main className="flex-1 overflow-y-auto p-8">
        <div className="max-w-6xl mx-auto">{children}</div>
      </main>
    </div>
  );
}
