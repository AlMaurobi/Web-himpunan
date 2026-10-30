"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import { FileText, Plus, Edit, Trash2, GraduationCap, Users, ArrowUpRight, LayoutDashboard } from "lucide-react";

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
    <div className="min-h-screen bg-stone-100 flex flex-col md:flex-row">
      {/* Sidebar Fungsional Samping */}
      <aside className="w-full md:w-64 bg-[#2C1810] text-amber-100 p-6 flex flex-col justify-between shrink-0 shadow-lg">
        <div className="space-y-6">
          <div className="flex items-center gap-3 border-b border-amber-900/60 pb-4">
            <div className="w-10 h-10 rounded-xl bg-amber-900/80 border border-amber-700/50 flex items-center justify-center font-bold text-white text-lg">
              A
            </div>
            <div>
              <h2 className="font-bold text-white text-sm">Admin Panel</h2>
              <p className="text-[11px] text-amber-300/80">HIMAPEBSI & Prodi</p>
            </div>
          </div>

          <nav className="space-y-1.5 text-xs font-semibold">
            <Link
              href="/admin/dashboard"
              className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-amber-900/80 text-white shadow-2xs"
            >
              <LayoutDashboard className="w-4 h-4 text-amber-300" /> Dashboard Utama
            </Link>
            <Link
              href="/admin/dashboard/profil-prodi"
              className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-stone-300 hover:bg-amber-900/40 hover:text-white transition-all"
            >
              <GraduationCap className="w-4 h-4 text-amber-400" /> Pengaturan Profil Prodi
            </Link>
            <Link
              href="/admin/dashboard/profil-himpunan"
              className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-stone-300 hover:bg-amber-900/40 hover:text-white transition-all"
            >
              <Users className="w-4 h-4 text-amber-400" /> Kabinet & Pengurus
            </Link>
          </nav>
        </div>

        <div className="pt-6 border-t border-amber-900/60">
          <Link
            href="/"
            className="flex items-center justify-center gap-2 w-full py-2.5 bg-amber-900/60 hover:bg-amber-800 text-amber-200 rounded-xl text-xs font-semibold border border-amber-700/50 transition-all"
          >
            <span>Lihat Website Live</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </aside>

      {/* Konten Utama */}
      <main className="flex-1 p-4 md:p-8 space-y-6 overflow-y-auto">
        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b pb-4">
            <div>
              <h1 className="text-lg font-bold text-stone-900 flex items-center gap-2">
                <FileText className="w-5 h-5 text-amber-800" /> Kelola Artikel & Kegiatan (articles)
              </h1>
              <p className="text-xs text-stone-500">Total {articlesList.length} artikel terdaftar secara real-time</p>
            </div>
            <Link
              href="/admin/dashboard/artikel/tambah"
              className="px-4 py-2.5 bg-amber-900 hover:bg-amber-800 text-amber-100 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-all"
            >
              <Plus className="w-4 h-4" /> Tambah Artikel Baru
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-12 text-xs text-stone-500">Memuat data artikel...</div>
          ) : articlesList.length === 0 ? (
            <div className="text-center py-12 text-xs text-stone-500">Belum ada artikel terdaftar di database Supabase.</div>
          ) : (
            <div className="divide-y divide-stone-200">
              {articlesList.map((item) => (
                <div key={item.id} className="py-4 flex items-center justify-between gap-4">
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
    </div>
  );
}