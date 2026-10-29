"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { Menu, X, ShieldCheck } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  if (pathname?.startsWith("/admin")) {
    return null;
  }

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    if (pathname === "/") {
      e.preventDefault();
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    } else {
      e.preventDefault();
      router.push(`/#${id}`);
    }
  };

  return (
    <nav className="bg-[#2C1810] text-amber-100 sticky top-0 z-50 shadow-md border-b border-amber-900/40">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-3">
            <img src="/logo.png" alt="Logo HIMAPEBSI" className="w-9 h-9 object-contain" />
            <div>
              <span className="font-extrabold text-sm tracking-wide block leading-tight text-white">HIMAPEBSI</span>
              <span className="text-[10px] text-amber-400 block font-light">Pendidikan Bahasa & Sastra Indonesia</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6 text-xs font-semibold">
            <Link href="/" className="hover:text-amber-400 transition-colors">
              Beranda
            </Link>
            <a
              href="/#profil-prodi"
              onClick={(e) => handleNavClick(e, "profil-prodi")}
              className="hover:text-amber-400 transition-colors cursor-pointer"
            >
              Profil Prodi
            </a>
            <a
              href="/#profil-himpunan"
              onClick={(e) => handleNavClick(e, "profil-himpunan")}
              className="hover:text-amber-400 transition-colors cursor-pointer"
            >
              Profil Himpunan
            </a>
            <Link href="/berita" className="hover:text-amber-400 transition-colors">
              Berita & Kegiatan
            </Link>
            <Link
              href="/admin/login"
              className="px-4 py-2 bg-amber-800 hover:bg-amber-700 text-amber-100 rounded-xl transition-all font-bold flex items-center gap-1.5 border border-amber-700/60 shadow-xs"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Portal Admin</span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg text-amber-200 hover:text-white hover:bg-amber-900/50"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="md:hidden bg-[#22120C] border-b border-amber-900/50 px-4 pt-2 pb-4 space-y-2 text-xs font-semibold">
          <Link href="/" onClick={() => setIsOpen(false)} className="block py-2 hover:text-amber-400">
            Beranda
          </Link>
          <a
            href="/#profil-prodi"
            onClick={(e) => {
              setIsOpen(false);
              handleNavClick(e, "profil-prodi");
            }}
            className="block py-2 hover:text-amber-400 cursor-pointer"
          >
            Profil Prodi
          </a>
          <a
            href="/#profil-himpunan"
            onClick={(e) => {
              setIsOpen(false);
              handleNavClick(e, "profil-himpunan");
            }}
            className="block py-2 hover:text-amber-400 cursor-pointer"
          >
            Profil Himpunan
          </a>
          <Link href="/berita" onClick={() => setIsOpen(false)} className="block py-2 hover:text-amber-400">
            Berita & Kegiatan
          </Link>
          <Link
            href="/admin/login"
            onClick={() => setIsOpen(false)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-amber-800 text-amber-100 rounded-xl font-bold mt-2"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Portal Admin</span>
          </Link>
        </div>
      )}
    </nav>
  );
}