"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X, ShieldCheck } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  // Sembunyikan Navbar publik jika berada di rute admin
  if (pathname.startsWith("/admin")) return null;

  const navLinks = [
    { label: "Beranda", href: "/" },
    { label: "Profil Prodi", href: "/prodi" },
    { label: "Profil Himpunan", href: "/himpunan" },
    { label: "Berita & Kegiatan", href: "/artikel" },
  ];

  return (
    <nav className="bg-[#2A1810] text-[#FAF7F2] border-b border-amber-900/40 sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Identitas */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 relative flex items-center justify-center shrink-0">
              <Image
                src="/logo.png"
                alt="Logo HIMAPEBSI"
                width={40}
                height={40}
                className="object-contain w-auto h-10 transition-transform duration-300 group-hover:scale-105"
                priority
              />
            </div>
            <div>
              <h1 className="font-extrabold text-base tracking-tight text-amber-100 group-hover:text-amber-300 transition-colors leading-tight">
                HIMAPEBSI
              </h1>
              <p className="text-[11px] text-amber-300/80 font-medium tracking-wide">
                Pendidikan Bahasa & Sastra Indonesia
              </p>
            </div>
          </Link>

          {/* Navigasi Desktop */}
          <div className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map((link) => {
              const isActive =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 ${
                    isActive
                      ? "bg-amber-900/80 text-amber-100 border border-amber-700/50 shadow-sm"
                      : "text-stone-300 hover:bg-stone-800/60 hover:text-stone-100"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}

            <Link
              href="/admin/login"
              className="ml-2 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-800/80 hover:bg-amber-700 text-amber-100 text-xs sm:text-sm font-bold border border-amber-600/50 shadow-sm transition-all hover:shadow-md"
            >
              <ShieldCheck className="w-4 h-4 text-amber-300" />
              <span>Portal Admin</span>
            </Link>
          </div>

          {/* Hamburger Menu Mobile */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-xl bg-stone-800/80 text-stone-200 hover:text-white border border-stone-700/50 transition-all"
              aria-label="Toggle Menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Menu Mobile Dropdown */}
      {isOpen && (
        <div className="md:hidden bg-[#2A1810] border-b border-amber-900/40 px-4 pt-2 pb-6 space-y-2">
          {navLinks.map((link) => {
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`block px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  isActive
                    ? "bg-amber-900/80 text-amber-100 border border-amber-700/50"
                    : "text-stone-300 hover:bg-stone-800/60 hover:text-stone-100"
                }`}
              >
                {link.label}
              </Link>
            );
          })}

          <Link
            href="/admin/login"
            onClick={() => setIsOpen(false)}
            className="flex items-center justify-center gap-2 px-4 py-2.5 mt-4 rounded-xl bg-amber-800 text-amber-100 font-bold text-sm border border-amber-600/50 shadow-sm"
          >
            <ShieldCheck className="w-4 h-4 text-amber-300" />
            <span>Portal Admin</span>
          </Link>
        </div>
      )}
    </nav>
  );
}
