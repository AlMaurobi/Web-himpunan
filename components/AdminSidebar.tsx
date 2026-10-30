"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  Users,
  Building2,
  Menu,
  X,
  LogOut,
} from "lucide-react";

export default function AdminSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const menuItems = [
    {
      label: "Overview",
      href: "/admin/dashboard",
      icon: LayoutDashboard,
    },
    {
      label: "Kelola Artikel",
      href: "/admin/dashboard/artikel",
      icon: FileText,
    },
    {
      label: "Pengurus & Kabinet",
      href: "/admin/dashboard/profil-himpunan",
      icon: Users,
    },
    {
      label: "Profil Prodi",
      href: "/admin/dashboard/profil-prodi",
      icon: Building2,
    },
  ];

  return (
    <>
      {/* Mobile Top Navbar */}
      <div className="md:hidden bg-[#2A1810] text-[#FAF7F2] p-4 flex items-center justify-between sticky top-0 z-40 shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 relative flex items-center justify-center shrink-0">
            <Image
              src="/logo.png"
              alt="Logo HIMAPEBSI"
              width={32}
              height={32}
              className="object-contain w-auto h-8"
              priority
            />
          </div>
          <div>
            <h2 className="font-extrabold text-sm leading-tight text-amber-100">Admin Panel</h2>
            <p className="text-[10px] text-stone-400">HIMAPEBSI & Prodi</p>
          </div>
        </div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 bg-stone-800/80 hover:bg-stone-700 text-stone-200 rounded-xl transition-all border border-stone-700/50"
          aria-label="Toggle Navigation"
        >
          {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Dark Backdrop Overlay di HP */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 md:hidden transition-opacity"
        />
      )}

      {/* Sidebar Main Wrapper */}
      <aside
        className={`fixed md:static top-0 left-0 bottom-0 z-50 w-64 bg-[#2A1810] text-[#FAF7F2] flex flex-col border-r border-stone-800/80 shadow-2xl md:shadow-none transition-transform duration-300 ease-in-out shrink-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        {/* Sidebar Header */}
        <div className="p-6 border-b border-stone-800/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 relative flex items-center justify-center shrink-0">
              <Image
                src="/logo.png"
                alt="Logo HIMAPEBSI"
                width={40}
                height={40}
                className="object-contain w-auto h-10"
                priority
              />
            </div>
            <div>
              <h2 className="font-extrabold text-base text-amber-100 leading-tight">Admin Panel</h2>
              <p className="text-xs text-stone-400">HIMAPEBSI & Prodi</p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="md:hidden p-1.5 text-stone-400 hover:text-stone-100 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === "/admin/dashboard"
                ? pathname === "/admin/dashboard"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-200 ${
                  isActive
                    ? "bg-amber-900/80 text-amber-100 font-semibold shadow-md border border-amber-700/50"
                    : "text-stone-300 hover:bg-stone-800/60 hover:text-stone-100"
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? "text-amber-300" : "text-stone-400"}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer / Keluar Dashboard */}
        <div className="p-4 border-t border-stone-800/80">
          <Link
            href="/"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-stone-400 hover:bg-red-950/40 hover:text-red-300 transition-all text-sm font-medium border border-transparent hover:border-red-900/40"
          >
            <LogOut className="w-5 h-5" />
            <span>Ke Halaman Depan</span>
          </Link>
        </div>
      </aside>
    </>
  );
}