"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import { FileText, Plus, Edit, Trash2, ArrowLeft, Loader2 } from "lucide-react";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function AdminArtikelListPage() {
  const [articlesList, setArticlesList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchArticles();
  }, []);

  async function fetchArticles() {
    try {
      const { data } = await supabase.from("articles").select("*").order("created_at", { ascending: false });
      if (data) setArticlesList(data);
    } catch (err) {
      console.error("Gagal memuat artikel:", err);
    } finally {
      setLoading(false);
    }
  }

  const handleDelete = async (id: string | number) => {
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
    <div className="max-w-5xl mx-auto p-4 md:p-8 space-y-6">
      <div className="flex items-center justify-between">
        <Link
          href="/admin/dashboard"
          className="inline-flex items-center gap-2 text-xs font-semibold text-stone-600 hover:text-stone-900 bg-white border border-stone-200 px-3 py-2 rounded-xl"
        >
          <ArrowLeft className="w-4 h-4" /> Kembali ke Dashboard
        </Link>
        <Link
          href="/admin/dashboard/artikel/tambah"
          className="px-4 py-2 bg-amber-900 hover:bg-amber-800 text-amber-100 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-all"
        >
          <Plus className="w-4 h-4" /> Tambah Artikel Baru
        </Link>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-2xs space-y-4">
        <h1 className="text-lg font-bold text-stone-900 flex items-center gap-2 border-b pb-4">
          <FileText className="w-5 h-5 text-amber-800" /> Daftar Berita & Artikel (articles)
        </h1>

        {loading ? (
          <div className="flex items-center justify-center py-12 text-stone-500 gap-2">
            <Loader2 className="w-5 h-5 animate-spin text-amber-800" />
            <span className="text-xs font-semibold">Memuat artikel...</span>
          </div>
        ) : articlesList.length === 0 ? (
          <div className="text-center py-12 text-xs text-stone-500">
            Belum ada artikel di tabel articles. Klik "Tambah Artikel Baru" untuk membuat berita.
          </div>
        ) : (
          <div className="divide-y divide-stone-200">
            {articlesList.map((item) => (
              <div key={item.id} className="py-4 flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-amber-800 uppercase bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                    {item.category || item.kategori || "Kegiatan"}
                  </span>
                  <h3 className="font-bold text-stone-900 text-sm">{item.title || item.judul}</h3>
                  <p className="text-xs text-stone-500 line-clamp-1">{item.excerpt || item.description || item.content}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Link
                    href={`/admin/dashboard/artikel/edit/${item.id}`}
                    className="p-2 text-stone-600 hover:text-amber-800 hover:bg-amber-50 rounded-lg transition-all"
                    title="Edit"
                  >
                    <Edit className="w-4 h-4" />
                  </Link>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-2 text-stone-600 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                    title="Hapus"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}