import { Suspense } from "react";
import AdminSidebar from "@/components/AdminSidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-stone-100">
      <Suspense fallback={null}>
        <AdminSidebar />
      </Suspense>
      <div className="flex-1 overflow-y-auto">{children}</div>
    </div>
  );
}
