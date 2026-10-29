"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  LayoutDashboard,
  FileText,
  Users,
  Building2,
  LogOut,
  Globe,
} from "lucide-react";

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  };

  const navItems = [
    { label: "Overview", href: "/admin/dashboard", icon: LayoutDashboard },
    { label: "Kelola Artikel", href: "/admin/dashboard/artikel", icon: FileText },
    { label: "Pengurus & Kabinet", href: "/admin/dashboard/kabinet", icon: Users },
    { label: "Profil Prodi", href: "/admin/dashboard/prodi", icon: Building2 },
  ];

  return (
    <aside className="w-64 bg-[#2A1810] border-r border-amber-900/40 flex flex-col justify-between p-4 shrink-0 text-amber-50">
      <div>
        <div className="px-3 py-4 mb-6 border-b border-amber-900/40 flex items-center gap-3">
          <img src="/logo.png" alt="Logo HIMAPEBSI" className="w-9 h-9 object-contain rounded-xl" />
          <div>
            <h2 className="font-extrabold text-white text-base leading-none">Admin Panel</h2>
            <p className="text-[11px] text-amber-300/80 font-medium mt-1">HIMAPEBSI & Prodi</p>
          </div>
        </div>

        <nav className="space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? "bg-amber-800 text-white shadow-md shadow-amber-950/30"
                    : "text-amber-200/80 hover:text-white hover:bg-amber-900/50"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="space-y-2 pt-4 border-t border-amber-900/40">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-amber-200/80 hover:text-white hover:bg-amber-900/50 transition-all"
        >
          <Globe className="w-5 h-5" />
          <span>Lihat Web Publik</span>
        </Link>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-red-300 hover:text-red-100 hover:bg-red-950/50 transition-all text-left"
        >
          <LogOut className="w-5 h-5" />
          <span>Keluar (Logout)</span>
        </button>
      </div>
    </aside>
  );
}
