import { Suspense } from "react";
import AdminSidebar from "@/components/AdminSidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-stone-100 overflow-x-hidden">
      <Suspense fallback={null}>
        <AdminSidebar />
      </Suspense>
      <main className="flex-1 min-w-0 overflow-y-auto w-full">
        {children}
      </main>
    </div>
  );
}
