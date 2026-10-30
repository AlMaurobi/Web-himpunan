"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, GraduationCap, Users, Newspaper, Home, Lock } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Sembunyikan Navbar di halaman admin
  if (pathname?.startsWith("/admin")) return null;

  const navItems = [
    { name: "Beranda", href: "/", icon: Home },
    { name: "Profil Prodi", href: "/prodi", icon: GraduationCap },
    { name: "Profil Himpunan", href: "/himpunan", icon: Users },
    { name: "Berita & Artikel", href: "/berita", icon: Newspaper },
  ];

  return (
    <nav className="bg-[#2A1810] text-amber-100 sticky top-0 z-50 shadow-md border-b border-amber-900/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-600 to-amber-800 flex items-center justify-center text-amber-100 font-bold text-lg shadow-sm group-hover:scale-105 transition-transform">
              H
            </div>
            <div>
              <span className="font-bold text-white tracking-wide block text-sm sm:text-base">HIMAPEBSI</span>
              <span className="text-[10px] text-amber-300/80 block -mt-1">UTM Madura</span>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
                    isActive
                      ? "bg-amber-800/80 text-white shadow-2xs"
                      : "text-amber-200/80 hover:text-white hover:bg-amber-900/50"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
            <Link
              href="/admin/login"
              className="ml-2 px-3 py-1.5 bg-amber-900/40 hover:bg-amber-800 text-amber-300 text-xs font-medium rounded-lg border border-amber-800/50 flex items-center gap-1.5 transition-all"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Admin</span>
            </Link>
          </div>

          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-amber-200 hover:text-white hover:bg-amber-900/50 transition-colors"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-[#2A1810] border-t border-amber-900/40 px-4 pt-2 pb-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive ? "bg-amber-800 text-white" : "text-amber-200 hover:bg-amber-900/50"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.name}</span>
              </Link>
            );
          })}
          <Link
            href="/admin/login"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-amber-300 bg-amber-950/60 border border-amber-900/50 mt-2"
          >
            <Lock className="w-4 h-4" />
            <span>Portal Admin</span>
          </Link>
        </div>
      )}
    </nav>
  );
}
