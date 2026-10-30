"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { LayoutGrid, FileText, Users, GraduationCap, Home, LogOut } from "lucide-react";

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    if (confirm("Apakah Anda yakin ingin keluar dari panel admin?")) {
      await supabase.auth.signOut();
      router.push("/admin/login");
      router.refresh();
    }
  };

  const menuItems = [
    {
      name: "Overview",
      href: "/admin/dashboard",
      icon: LayoutGrid,
    },
    {
      name: "Kelola Artikel",
      href: "/admin/dashboard/artikel",
      icon: FileText,
    },
    {
      name: "Pengurus & Kabinet",
      href: "/admin/dashboard/kabinet",
      icon: Users,
    },
    {
      name: "Profil Prodi",
      href: "/admin/dashboard/prodi",
      icon: GraduationCap,
    },
  ];

  return (
    <aside className="w-64 bg-[#2A1810] text-amber-100 min-h-screen p-4 flex flex-col justify-between border-r border-amber-900/40 shrink-0">
      <div className="space-y-6">
        <div className="flex items-center gap-3 px-2 py-3 border-b border-amber-900/50">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-600 to-amber-800 flex items-center justify-center text-amber-100 font-bold text-lg shadow-sm">
            H
          </div>
          <div>
            <h2 className="font-bold text-white text-sm leading-tight">Admin Panel</h2>
            <p className="text-[11px] text-amber-300/70">HIMAPEBSI & Prodi</p>
          </div>
        </div>

        <nav className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === "/admin/dashboard"
                ? pathname === "/admin/dashboard"
                : pathname?.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? "bg-amber-800/80 text-white shadow-2xs"
                    : "text-amber-200/80 hover:text-white hover:bg-amber-900/40"
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="pt-4 border-t border-amber-900/50 space-y-1">
        <Link
          href="/"
          className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-amber-300/80 hover:text-amber-100 hover:bg-amber-900/30 rounded-xl transition-all"
        >
          <Home className="w-4 h-4" />
          <span>Ke Website Utama</span>
        </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-rose-300 hover:text-rose-100 hover:bg-rose-950/40 rounded-xl transition-all text-left"
        >
          <LogOut className="w-4 h-4" />
          <span>Keluar (Logout)</span>
        </button>
      </div>
    </aside>
  );
}
