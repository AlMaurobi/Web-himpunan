import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#1C100A] border-t border-amber-950 text-amber-200/70 text-sm mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <img src="/logo.png" alt="Logo HIMAPEBSI" className="w-8 h-8 object-contain rounded-lg" />
            <span className="font-bold text-amber-100 text-lg">HIMAPEBSI</span>
          </div>
          <p className="text-amber-200/60 text-xs leading-relaxed">
            Himpunan Mahasiswa Pendidikan Bahasa dan Sastra Indonesia. Wadah aspirasi, kreasi, dan keilmuan bahasa & kesusastraan Nusantara.
          </p>
        </div>

        <div>
          <h4 className="text-amber-100 font-semibold text-sm mb-3">Navigasi Cepat</h4>
          <ul className="space-y-2 text-xs">
            <li><Link href="/" className="hover:text-amber-300 transition-all">Beranda Utama</Link></li>
            <li><Link href="/prodi" className="hover:text-amber-300 transition-all">Profil Program Studi</Link></li>
            <li><Link href="/himpunan" className="hover:text-amber-300 transition-all">Struktur Himpunan</Link></li>
            <li><Link href="/berita" className="hover:text-amber-300 transition-all">Berita & Kegiatan</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-amber-100 font-semibold text-sm mb-3">Sekretariat & Kontak</h4>
          <p className="text-xs text-amber-200/60 leading-relaxed">
            Gedung Ormawa FKIP / Kampus Pendidikan Bahasa dan Sastra Indonesia.
          </p>
        </div>
      </div>

      <div className="border-t border-amber-950/80 py-4 text-center text-xs text-amber-400/50">
        <p>© {new Date().getFullYear()} HIMAPEBSI. Dikembangkan untuk Kemajuan Akademik & Organisasi.</p>
      </div>
    </footer>
  );
}
