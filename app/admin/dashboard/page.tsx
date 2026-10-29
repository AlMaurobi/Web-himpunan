import Link from "next/link";
import { FileText, Users, Building2, Plus, ArrowRight } from "lucide-react";

export const dynamic = "force-dynamic";

export default function AdminOverviewPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold text-stone-900">Selamat Datang di Portal Admin</h1>
        <p className="text-stone-600 text-sm mt-1">
          Kelola publikasi artikel, periode kabinet pengurus, dan profil resmi Program Studi PBSI.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-stone-200/80 p-6 rounded-2xl shadow-sm space-y-3">
          <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center text-amber-900 font-bold">
            <FileText className="w-5 h-5" />
          </div>
          <h3 className="font-extrabold text-stone-900 text-lg">Kelola Artikel</h3>
          <p className="text-xs text-stone-600">Buat, perbarui, atau hapus pengumuman & berita kegiatan himpunan.</p>
          <Link
            href="/admin/dashboard/artikel"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-800 hover:text-amber-900 pt-2"
          >
            <span>Buka Modul</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="bg-white border border-stone-200/80 p-6 rounded-2xl shadow-sm space-y-3">
          <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-900 font-bold">
            <Users className="w-5 h-5" />
          </div>
          <h3 className="font-extrabold text-stone-900 text-lg">Pengurus & Kabinet</h3>
          <p className="text-xs text-stone-600">Atur periode kabinet aktif dan susunan struktur anggota pengurus.</p>
          <Link
            href="/admin/dashboard/kabinet"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 hover:text-emerald-900 pt-2"
          >
            <span>Buka Modul</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="bg-white border border-stone-200/80 p-6 rounded-2xl shadow-sm space-y-3">
          <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center text-amber-900 font-bold">
            <Building2 className="w-5 h-5" />
          </div>
          <h3 className="font-extrabold text-stone-900 text-lg">Profil Prodi</h3>
          <p className="text-xs text-stone-600">Perbarui sejarah, visi-misi, akreditasi, dan informasi Kaprodi PBSI.</p>
          <Link
            href="/admin/dashboard/prodi"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-800 hover:text-amber-900 pt-2"
          >
            <span>Buka Modul</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
