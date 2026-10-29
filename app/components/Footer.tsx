"use client";

import { usePathname } from "next/navigation";
import { MapPin, MessageSquare, Instagram, Youtube } from "lucide-react";

export default function Footer() {
  const pathname = usePathname();

  if (pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    <footer className="bg-[#2C1810] text-stone-300 pt-12 pb-8 px-4 md:px-8 border-t border-stone-800">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 pb-8 border-b border-stone-800">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-900/50 flex items-center justify-center font-bold text-amber-400">
              H
            </div>
            <div>
              <h3 className="font-black text-amber-100 text-sm tracking-wide">HIMAPEBSI</h3>
              <p className="text-[10px] text-amber-400/80">FKIP Universitas Trunojoyo Madura</p>
            </div>
          </div>
          <p className="text-xs text-stone-400 leading-relaxed">
            Wadah, kreasi, dan pengabdian mahasiswa Pendidikan Bahasa dan Sastra Indonesia dalam mewujudkan insan akademis yang berbudaya dan berdaya saing.
          </p>
        </div>

        <div className="space-y-3">
          <h4 className="font-bold text-xs text-amber-200 tracking-wider uppercase">Sekretariat & Kontak</h4>
          <div className="space-y-2 text-xs text-stone-400">
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <span>Gedung Fakultas Keguruan dan Ilmu Pendidikan, Universitas Trunojoyo Madura.</span>
            </div>
            <a
              href="https://wa.me/6281234567890"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-900/40 text-emerald-300 border border-emerald-800/50 text-xs font-medium hover:bg-emerald-900/60 transition-all mt-1"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Kirim Kritik & Saran (WhatsApp)</span>
            </a>
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="font-bold text-xs text-amber-200 tracking-wider uppercase">Linimasa Media Sosial</h4>
          <p className="text-xs text-stone-400">Ikuti kabar kegiatan terbaru dan konten edukasi kebahasaan kami:</p>
          <div className="space-y-1.5">
            <a
              href="https://instagram.com/utm_himapebsi"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-xs text-stone-300 hover:text-amber-300 p-2 rounded-lg bg-stone-900/40 hover:bg-stone-900/80 border border-stone-800/60 transition-all"
            >
              <Instagram className="w-3.5 h-3.5 text-amber-500" />
              <span>Instagram (@utm_himapebsi)</span>
            </a>
            <a
              href="https://youtube.com/@pbsifip"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-xs text-stone-300 hover:text-amber-300 p-2 rounded-lg bg-stone-900/40 hover:bg-stone-900/80 border border-stone-800/60 transition-all"
            >
              <Youtube className="w-3.5 h-3.5 text-rose-500" />
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