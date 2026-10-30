"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import { FileText, Plus, Edit, Trash2, GraduationCap, Users, ArrowUpRight } from "lucide-react";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function AdminDashboardPage() {
  const [articlesList, setArticlesList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchArticles() {
      try {
        const { data } = await supabase.from("articles").select("*").order("id", { ascending: false });
        if (data) setArticlesList(data);
      } catch (err) {
        console.error("Gagal memuat artikel:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchArticles();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Apakah Anda yakin ingin menghapus artikel ini?")) return;
    const { error } = await supabase.from("articles").delete().eq("id", id);
    if (!error) {
      setArticlesList(articlesList.filter((a) => a.id !== id));
      alert("Artikel berhasil dihapus.");
    } else {
      alert("Gagal menghapus: " + error.message);
    }
  };

  return (
    <main className="p-4 md:p-8 space-y-6">
      <div className="bg-[#2A1810] text-amber-100 p-6 rounded-2xl flex flex-wrap items-center justify-between gap-4 shadow-md">
        <div>
          <h1 className="text-xl font-bold text-white">Portal Dashboard Admin</h1>
          <p className="text-xs text-stone-300">Tersambung ke Supabase (prodi_profile, cabinets, members, articles)</p>
        </div>
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-amber-900/60 hover:bg-amber-800 text-amber-200 text-xs font-semibold rounded-xl border border-amber-700/50 transition-all"
        >
          <span>Lihat Website</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link
          href="/admin/dashboard/profil-prodi"
          className="p-5 bg-white rounded-2xl border border-stone-200 shadow-2xs hover:shadow-md transition-all group flex items-start justify-between"
        >
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 text-amber-900 font-bold text-sm">
              <GraduationCap className="w-5 h-5 text-amber-800" />
              Pengaturan Profil Prodi
            </div>
            <p className="text-xs text-stone-500">Edit Sambutan Korprodi, Foto, Visi, Misi di tabel prodi_profile.</p>
          </div>
          <span className="text-xs font-bold text-amber-800 group-hover:translate-x-1 transition-transform">Kelola &rarr;</span>
        </Link>

        <Link
          href="/admin/dashboard/profil-himpunan"
          className="p-5 bg-white rounded-2xl border border-stone-200 shadow-2xs hover:shadow-md transition-all group flex items-start justify-between"
        >
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 text-amber-900 font-bold text-sm">
              <Users className="w-5 h-5 text-amber-800" />
              Pengaturan Kabinet & Pengurus
            </div>
            <p className="text-xs text-stone-500">Edit Periode, Visi Misi Kabinet, dan Anggota di Supabase.</p>
          </div>
          <span className="text-xs font-bold text-amber-800 group-hover:translate-x-1 transition-transform">Kelola &rarr;</span>
        </Link>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-2xs space-y-4">
        <div className="flex items-center justify-between border-b pb-4">
          <div>
            <h2 className="text-base font-bold text-stone-900 flex items-center gap-2">
              <FileText className="w-4 h-4 text-amber-800" /> Kelola Artikel & Kegiatan (articles)
            </h2>
            <p className="text-xs text-stone-500">Total {articlesList.length} artikel terdaftar</p>
          </div>
          <Link
            href="/admin/dashboard/artikel/tambah"
            className="px-4 py-2 bg-amber-900 hover:bg-amber-800 text-amber-100 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-all"
          >
            <Plus className="w-4 h-4" /> Tambah Artikel Baru
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-8 text-xs text-stone-500">Memuat artikel...</div>
        ) : articlesList.length === 0 ? (
          <div className="text-center py-8 text-xs text-stone-500">Belum ada artikel di tabel articles.</div>
        ) : (
          <div className="divide-y divide-stone-200 overflow-hidden">
            {articlesList.map((item) => (
              <div key={item.id} className="py-3 flex items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] font-bold text-amber-800 uppercase bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                    {item.category || item.kategori || "Kegiatan"}
                  </span>
                  <h3 className="font-bold text-stone-900 text-sm mt-1">{item.title || item.judul}</h3>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Link
                    href={`/admin/dashboard/artikel/edit/${item.id}`}
                    className="p-2 text-stone-600 hover:text-amber-800 hover:bg-amber-50 rounded-lg transition-all"
                  >
                    <Edit className="w-4 h-4" />
                  </Link>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-2 text-stone-600 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}