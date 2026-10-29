"use client";

import { usePathname } from "next/navigation";
import { MapPin, MessageSquare } from "lucide-react";

export default function Footer() {
  const pathname = usePathname();

  if (pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    <footer className="bg-[#2C1810] text-stone-300 pt-12 pb-8 px-4 md:px-8 border-t border-stone-800">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 pb-8 border-b border-stone-800">
        {/* Kolom 1: Logo & Deskripsi */}
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <img
              src="/logo.png"
              alt="Logo HIMAPEBSI"
              className="w-10 h-10 object-contain"
            />
            <div>
              <h3 className="font-black text-amber-100 text-sm tracking-wide">HIMAPEBSI</h3>
              <p className="text-[10px] text-amber-400/80">FKIP Universitas Trunojoyo Madura</p>
            </div>
          </div>
          <p className="text-xs text-stone-400 leading-relaxed">
            Wadah, kreasi, dan pengabdian mahasiswa Pendidikan Bahasa dan Sastra Indonesia dalam mewujudkan insan akademis yang berbudaya dan berdaya saing.
          </p>
        </div>

        {/* Kolom 2: Kontak & Sekretariat */}
        <div className="space-y-3">
          <h4 className="font-bold text-xs text-amber-200 tracking-wider uppercase">Sekretariat & Kontak</h4>
          <div className="space-y-2 text-xs text-stone-400">
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <span>Gedung Fakultas Keguruan dan Ilmu Pendidikan, Universitas Trunojoyo Madura.</span>
            </div>
            <a
              href="https://wa.me/qr/HZL3ICPD5MVKK1?s=v"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-900/40 text-emerald-300 border border-emerald-800/50 text-xs font-medium hover:bg-emerald-900/60 transition-all mt-1"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Kirim Kritik & Saran (WhatsApp)</span>
            </a>
          </div>
        </div>

        {/* Kolom 3: Media Sosial */}
        <div className="space-y-3">
          <h4 className="font-bold text-xs text-amber-200 tracking-wider uppercase">Linimasa Media Sosial</h4>
          <p className="text-xs text-stone-400">Ikuti kabar kegiatan terbaru dan konten edukasi kebahasaan kami:</p>
          <div className="space-y-1.5">
            {/* Instagram */}
            <a
              href="https://instagram.com/utm_himapebsi"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-xs text-stone-300 hover:text-amber-300 p-2 rounded-lg bg-stone-900/40 hover:bg-stone-900/80 border border-stone-800/60 transition-all"
            >
              <svg className="w-3.5 h-3.5 text-amber-500 fill-current" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
              <span>Instagram (@utm_himapebsi)</span>
            </a>

            {/* TikTok */}
            <a
              href="https://tiktok.com/@pbsifip"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-xs text-stone-300 hover:text-amber-300 p-2 rounded-lg bg-stone-900/40 hover:bg-stone-900/80 border border-stone-800/60 transition-all"
            >
              <svg className="w-3.5 h-3.5 text-cyan-400 fill-current" viewBox="0 0 24 24">
                <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.24-2.39.63-4.81 2.32-6.5 1.62-1.65 3.97-2.48 6.27-2.17.01 1.42-.01 2.83 0 4.25-.97-.13-1.97.08-2.8.58-1.07.63-1.76 1.83-1.74 3.08.01 1.09.52 2.12 1.38 2.79 1.05.81 2.47 1.02 3.73.57 1.22-.42 2.13-1.52 2.33-2.78.11-1.01.04-2.03.04-3.05V.02z"/>
              </svg>
              <span>TikTok (@pbsifip)</span>
            </a>

            {/* YouTube */}
            <a
              href="https://youtube.com/@pbsifip"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-xs text-stone-300 hover:text-amber-300 p-2 rounded-lg bg-stone-900/40 hover:bg-stone-900/80 border border-stone-800/60 transition-all"
            >
              <svg className="w-3.5 h-3.5 text-rose-500 fill-current" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
              <span>YouTube (@pbsifip)</span>
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto pt-6 text-center text-[11px] text-stone-500">
        © 2026 HIMAPEBSI & Pendidikan Bahasa dan Sastra Indonesia. All rights reserved.
      </div>
    </footer>
  );
}