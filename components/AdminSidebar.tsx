"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  LayoutGrid,
  FileText,
  Users,
  GraduationCap,
  Home,
  LogOut,
  Menu,
  X,
} from "lucide-react";

export default function AdminSidebar() {
  const [isOpen, setIsOpen] = useState(false);
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
    { name: "Overview", href: "/admin/dashboard", icon: LayoutGrid },
    { name: "Kelola Artikel", href: "/admin/dashboard/artikel", icon: FileText },
    { name: "Pengurus & Kabinet", href: "/admin/dashboard/kabinet", icon: Users },
    { name: "Profil Prodi", href: "/admin/dashboard/prodi", icon: GraduationCap },
  ];

  return (
    <>
      {/* Top Bar khusus HP / Mobile Screen */}
      <div className="md:hidden bg-[#2A1810] text-amber-100 p-4 flex items-center justify-between border-b border-amber-900/50 sticky top-0 z-30 w-full shrink-0">
        <div className="flex items-center gap-3">
          <img
            src="/logo-hima.png"
            alt="Logo HIMAPEBSI"
            className="w-8 h-8 object-contain shrink-0"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "/favicon.ico";
            }}
          />
          <div>
            <h2 className="font-bold text-white text-xs leading-tight">Admin Panel</h2>
            <p className="text-[10px] text-amber-300/70">HIMAPEBSI & Prodi</p>
          </div>
        </div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 text-amber-200 hover:text-white rounded-xl bg-amber-900/40 border border-amber-800/40 focus:outline-none"
          aria-label="Toggle Navigation"
        >
          {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Overlay Gelap Saat Menu Mobile Terbuka */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-xs"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Utama (Drawer di HP, Fixed Sidebar di Desktop) */}
      <aside
        className={`fixed md:static top-0 left-0 bottom-0 z-50 w-64 bg-[#2A1810] text-amber-100 min-h-screen p-4 flex flex-col justify-between border-r border-amber-900/40 shrink-0 transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="space-y-6">
          {/* Header Admin Sidebar */}
          <div className="flex items-center justify-between px-2 py-3 border-b border-amber-900/50">
            <div className="flex items-center gap-3">
              <img
                src="/logo-hima.png"
                alt="Logo HIMAPEBSI"
                className="w-9 h-9 object-contain shrink-0"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/favicon.ico";
                }}
              />
              <div>
                <h2 className="font-bold text-white text-sm leading-tight">Admin Panel</h2>
                <p className="text-[11px] text-amber-300/70">HIMAPEBSI & Prodi</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="md:hidden text-amber-300 hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigasi Utama */}
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
                  onClick={() => setIsOpen(false)}
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

        {/* Navigasi Bawah */}
        <div className="pt-4 border-t border-amber-900/50 space-y-1">
          <Link
            href="/"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-amber-300/80 hover:text-amber-100 hover:bg-amber-900/30 rounded-xl transition-all"
          >
            <Home className="w-4 h-4" />
            <span>Ke Website Utama</span>
          </Link>
          <button
            onClick={() => {
              setIsOpen(false);
              handleLogout();
            }}
            className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-rose-300 hover:text-rose-100 hover:bg-rose-950/40 rounded-xl transition-all text-left"
          >
            <LogOut className="w-4 h-4" />
            <span>Keluar (Logout)</span>
          </button>
        </div>
      </aside>
    </>
  );
}
