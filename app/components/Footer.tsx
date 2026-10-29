import Link from "next/link";
import Image from "next/image";
import { MessageSquare, Instagram, Youtube, MapPin, ExternalLink } from "lucide-react";

export default function Footer() {
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
                <Instagram className="w-4 h-4 text-amber-400" />
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
                <Youtube className="w-4 h-4 text-red-400" />
                <span>YouTube (@pbsifip)</span>
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Bar Copyright */}
        <div className="mt-12 pt-6 border-t border-amber-900/40 text-center text-xs text-stone-400 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© {new Date().getFullYear()} HIMAPEBSI & Pendidikan Bahasa dan Sastra Indonesia. All rights reserved.</p>
          <p className="text-[11px] text-amber-200/60 font-medium">Warm Earth Theme • PBSI UTM</p>
        </div>
      </div>
    </footer>
  );
}
