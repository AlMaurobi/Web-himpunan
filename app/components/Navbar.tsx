"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, GraduationCap, Users, Newspaper, Lock, Menu, X } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Sembunyikan Navbar di halaman admin
  if (pathname?.startsWith("/admin")) return null;

  const navLinks = [
    { name: "Beranda", href: "/", icon: Home },
    { name: "Profil Prodi", href: "/prodi", icon: GraduationCap },
    { name: "Profil Himpunan", href: "/himpunan", icon: Users },
    { name: "Berita & Artikel", href: "/berita", icon: Newspaper },
  ];

  return (
    <header className="bg-[#2A1810] text-amber-100 sticky top-0 z-50 shadow-md border-b border-amber-900/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo Resmi HIMAPEBSI */}
          <Link href="/" className="flex items-center gap-3 group">
            <img
              src="/logo.png"
              alt="Logo HIMAPEBSI"
              className="w-10 h-10 object-contain shrink-0 group-hover:scale-105 transition-transform"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "/logo-hima.png";
              }}
            />
            <div>
              <span className="font-bold text-white text-base leading-tight block tracking-wide">
                HIMAPEBSI
              </span>
              <span className="text-[11px] text-amber-300/80 font-medium block">
                Pendidikan Bahasa dan Sastra Indonesia
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1.5">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? "bg-amber-800/80 text-white shadow-2xs"
                      : "text-amber-200/80 hover:text-white hover:bg-amber-900/40"
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{link.name}</span>
                </Link>
              );
            })}

            {/* Tombol Portal Admin */}
            <Link
              href="/admin/login"
              className="ml-2 flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-amber-600/50 text-amber-200 hover:text-white hover:bg-amber-800/40 text-xs font-semibold transition-all"
            >
              <Lock className="w-3.5 h-3.5 shrink-0 text-amber-400" />
              <span>Admin</span>
            </Link>
          </nav>

          {/* Mobile Hamburger Toggle */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-amber-200 hover:text-white rounded-xl bg-amber-900/40 border border-amber-800/40 focus:outline-none"
              aria-label="Toggle Menu"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {isOpen && (
        <div className="md:hidden bg-[#2A1810] border-t border-amber-900/50 px-4 pt-2 pb-4 space-y-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? "bg-amber-800/80 text-white"
                    : "text-amber-200/80 hover:text-white hover:bg-amber-900/40"
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{link.name}</span>
              </Link>
            );
          })}
          <Link
            href="/admin/login"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-amber-300 hover:bg-amber-900/40 transition-all border border-amber-800/40 mt-2"
          >
            <Lock className="w-4 h-4 text-amber-400" />
            <span>Portal Admin</span>
          </Link>
        </div>
      )}
    </header>
  );
}
