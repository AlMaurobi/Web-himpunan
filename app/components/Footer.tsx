"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { MessageSquare, MapPin, ExternalLink } from "lucide-react";

export default function Footer() {
  const [year, setYear] = useState<number>(2026);

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="bg-[#2A1810] text-[#FAF7F2] border-t border-amber-900/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-12">
          
          {/* Kolom 1: Identitas Himpunan */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Image
                src="/logo.png"
                alt="Logo HIMAPEBSI"
                width={44}
                height={44}
                className="object-contain w-auto h-11"
              />
              <div>
                <h3 className="font-extrabold text-amber-100 text-lg leading-tight">HIMAPEBSI</h3>
                <p className="text-xs text-amber-300/80 font-medium">FKIP Universitas Trunojoyo Madura</p>
              </div>
            </div>
            <p className="text-stone-300 text-xs sm:text-sm leading-relaxed">
              Wadah artikulasi, kreasi, dan pengabdian mahasiswa Pendidikan Bahasa dan Sastra Indonesia dalam mewujudkan insan akademis yang berbudaya dan berdaya saing.
            </p>
          </div>

          {/* Kolom 2: Sekretariat & Layanan Kritik Saran */}
          <div className="space-y-4">
            <h4 className="font-extrabold text-amber-100 text-base border-b border-amber-900/60 pb-2 inline-block">
              Sekretariat & Kontak
            </h4>
            <div className="space-y-3 text-xs sm:text-sm text-stone-300">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <p>Gedung Ormawa FKIP / Kampus Pendidikan Bahasa dan Sastra Indonesia, Universitas Trunojoyo Madura.</p>
              </div>
              <div className="pt-2">
                <a
                  href="https://wa.me/qr/HZL3ICPD5MVKK1"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-800/80 hover:bg-emerald-700 text-emerald-100 text-xs font-bold transition-all border border-emerald-600/50 shadow-sm"
                >
                  <MessageSquare className="w-4 h-4 text-emerald-300" />
                  <span>Kirim Kritik & Saran (WhatsApp)</span>
                  <ExternalLink className="w-3 h-3 text-emerald-300" />
                </a>
              </div>
            </div>
          </div>

          {/* Kolom 3: Linimasa Media Sosial */}
          <div className="space-y-4">
            <h4 className="font-extrabold text-amber-100 text-base border-b border-amber-900/60 pb-2 inline-block">
              Linimasa Media Sosial
            </h4>
            <p className="text-xs text-stone-300">
              Ikuti kabar kegiatan terbaru dan konten edukasi kebahasaan kami:
            </p>
            <div className="flex flex-col gap-2.5 pt-1">
              {/* Instagram */}
              <a
                href="https://www.instagram.com/utm_himapebsi?rpxt=anlucG8wdjlyajNu"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-3.5 py-2 rounded-xl bg-stone-900/60 hover:bg-amber-900/50 text-stone-200 hover:text-amber-100 text-xs font-semibold transition-all border border-stone-800 hover:border-amber-700/50"
              >
                <svg className="w-4 h-4 fill-amber-400" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
                <span>Instagram (@utm_himapebsi)</span>
              </a>

              {/* TikTok */}
              <a
                href="https://www.tiktok.com/@pbsifip?_r=1&_t=ZS-9AxlO2XlJno"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-3.5 py-2 rounded-xl bg-stone-900/60 hover:bg-amber-900/50 text-stone-200 hover:text-amber-100 text-xs font-semibold transition-all border border-stone-800 hover:border-amber-700/50"
              >
                <svg className="w-4 h-4 fill-amber-400" viewBox="0 0 24 24">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 1 1-5.2-1.74 2.89 2.89 0 0 1 2.31-1.42V9.01a6.34 6.34 0 0 0-3.6 1.11A6.33 6.33 0 0 0 3.7 19.34a6.33 6.33 0 0 0 10.7-4.49V9.26a8.28 8.28 0 0 0 5.19 1.83V7.64a4.85 4.85 0 0 1-.02-.95z"/>
                </svg>
                <span>TikTok (@pbsifip)</span>
              </a>

              {/* YouTube */}
              <a
                href="https://youtube.com/@pbsifip?si=lOs6x5pfDFluHVm9"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-3.5 py-2 rounded-xl bg-stone-900/60 hover:bg-amber-900/50 text-stone-200 hover:text-amber-100 text-xs font-semibold transition-all border border-stone-800 hover:border-amber-700/50"
              >
                <svg className="w-4 h-4 fill-red-400" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
                <span>YouTube (@pbsifip)</span>
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Bar Copyright */}
        <div className="mt-12 pt-6 border-t border-amber-900/40 text-center text-xs text-stone-400 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© {year} HIMAPEBSI & Pendidikan Bahasa dan Sastra Indonesia. All rights reserved.</p>
          <p className="text-[11px] text-amber-200/60 font-medium">Warm Earth Theme • PBSI UTM</p>
        </div>
      </div>
    </footer>
  );
}
