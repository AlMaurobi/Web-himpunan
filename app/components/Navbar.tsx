"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ShieldCheck } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { label: "Beranda", href: "/" },
    { label: "Profil Prodi", href: "/prodi" },
    { label: "Profil Himpunan", href: "/himpunan" },
    { label: "Berita & Kegiatan", href: "/berita" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#2A1810]/95 backdrop-blur-md border-b border-amber-900/40 text-amber-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <img
            src="/logo.png"
            alt="Logo HIMAPEBSI"
            className="w-10 h-10 object-contain rounded-xl group-hover:scale-105 transition-transform"
          />
          <div>
            <span className="font-extrabold text-white text-base block leading-none tracking-wide">HIMAPEBSI</span>
            <span className="text-[11px] text-amber-300/90 font-medium">Pendidikan Bahasa & Sastra Indonesia</span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? "bg-amber-700 text-amber-50 shadow-sm"
                    : "text-amber-200/80 hover:text-white hover:bg-amber-900/50"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
          <Link
            href="/admin/login"
            className="ml-4 px-3.5 py-1.5 border border-amber-600/50 hover:border-amber-500 bg-amber-950/60 hover:bg-amber-900 text-amber-200 hover:text-white rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
            <span>Portal Admin</span>
          </Link>
        </nav>

        {/* Mobile Toggle */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 text-amber-200 hover:text-white rounded-lg hover:bg-amber-900/50"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-[#20120B] border-b border-amber-900/40 px-4 pt-2 pb-4 space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                pathname === link.href ? "bg-amber-800 text-white" : "text-amber-200 hover:bg-amber-900/50"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/admin/login"
            onClick={() => setIsOpen(false)}
            className="block px-3 py-2 text-sm text-amber-400 font-semibold"
          >
            Portal Admin
          </Link>
        </div>
      )}
    </header>
  );
}
