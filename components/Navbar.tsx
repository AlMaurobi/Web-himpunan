"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Sembunyikan Navbar di halaman admin
  if (pathname?.startsWith("/admin")) return null;

  const navLinks = [
    { name: "Beranda", href: "/" },
    { name: "Himpunan", href: "/himpunan" },
    { name: "Prodi PBSI", href: "/prodi" },
    { name: "Berita & Artikel", href: "/berita" },
  ];

  return (
    <header className="bg-[#2A1810] text-amber-100 sticky top-0 z-50 shadow-md border-b border-amber-900/40">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand / Logo */}
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
                UTM Madura
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? "bg-amber-800/80 text-white shadow-2xs"
                      : "text-amber-200/80 hover:text-white hover:bg-amber-900/40"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
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

      {/* Mobile Drawer Navigation */}
      {isOpen && (
        <div className="md:hidden bg-[#2A1810] border-t border-amber-900/50 px-4 pt-2 pb-4 space-y-1">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`block px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? "bg-amber-800/80 text-white"
                    : "text-amber-200/80 hover:text-white hover:bg-amber-900/40"
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}
