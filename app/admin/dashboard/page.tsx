import { createClient } from "@/lib/supabase/server";
import { connection } from "next/server";
import { FileText, Users, FolderKanban, ShieldCheck } from "lucide-react";

export const instant = false;

export default async function DashboardOverviewPage() {
  await connection();

  const supabase = await createClient();

  const [{ count: totalArticles }, { count: totalCabinets }, { data: profile }] =
    await Promise.all([
      supabase.from("articles").select("*", { count: "exact", head: true }),
      supabase.from("cabinets").select("*", { count: "exact", head: true }),
      supabase.from("profiles").select("nama_lengkap, role, periode_jabatan").single(),
    ]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-stone-900">
          Selamat Datang, {profile?.nama_lengkap || "Pengurus"} 👋
        </h1>
        <p className="text-stone-600 mt-1 text-sm">
          Role: <span className="text-amber-800 font-bold uppercase">{profile?.role || "Admin"}</span> | Periode: {profile?.periode_jabatan || "2025/2026"}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-stone-200/80 p-6 rounded-2xl shadow-sm flex items-center gap-4">
          <div className="p-3.5 bg-amber-100 text-amber-800 rounded-xl border border-amber-200">
            <FileText className="w-7 h-7" />
          </div>
          <div>
            <p className="text-xs text-stone-500 font-semibold uppercase tracking-wider">Total Artikel/Berita</p>
            <h3 className="text-3xl font-extrabold text-stone-900 mt-1">{totalArticles || 0}</h3>
          </div>
        </div>

        <div className="bg-white border border-stone-200/80 p-6 rounded-2xl shadow-sm flex items-center gap-4">
          <div className="p-3.5 bg-emerald-100 text-emerald-800 rounded-xl border border-emerald-200">
            <FolderKanban className="w-7 h-7" />
          </div>
          <div>
            <p className="text-xs text-stone-500 font-semibold uppercase tracking-wider">Kabinet Terekam</p>
            <h3 className="text-3xl font-extrabold text-stone-900 mt-1">{totalCabinets || 0}</h3>
          </div>
        </div>

        <div className="bg-white border border-stone-200/80 p-6 rounded-2xl shadow-sm flex items-center gap-4">
          <div className="p-3.5 bg-purple-100 text-purple-800 rounded-xl border border-purple-200">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <div>
            <p className="text-xs text-stone-500 font-semibold uppercase tracking-wider">Akses Sistem</p>
            <h3 className="text-lg font-bold text-emerald-700 mt-1">Terverifikasi</h3>
          </div>
        </div>
      </div>

      <div className="bg-white border border-stone-200/80 rounded-2xl p-6 shadow-sm">
        <h2 className="text-lg font-bold text-stone-900 mb-3">Panduan Cepat Admin</h2>
        <ul className="list-disc list-inside space-y-2 text-stone-600 text-sm leading-relaxed">
          <li>
            Gunakan menu <strong className="text-amber-800">Kelola Artikel</strong> untuk mempublikasikan berita terbaru atau poster kegiatan.
          </li>
          <li>
            Gunakan menu <strong className="text-amber-800">Pengurus & Kabinet</strong> untuk mengelola data struktur himpunan periode berjalan.
          </li>
          <li>
            Foto yang diunggah akan dikompres otomatis ke format WebP untuk menghemat kuota penyimpanan.
          </li>
        </ul>
      </div>
    </div>
  );
}
