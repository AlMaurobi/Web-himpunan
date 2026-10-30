"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Plus, Edit, Trash2, ArrowLeft, FileText, Loader2, Eye } from "lucide-react";

export default function AdminArticlesPage() {
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  const fetchArticles = async () => {
    try {
      const { data, error } = await supabase
        .from("articles")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      if (data) setArticles(data);
    } catch (err: any) {
      console.error("Gagal memuat artikel:", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Hapus artikel "${title}"?`)) return;
    const { error } = await supabase.from("articles").delete().eq("id", id);
    if (!error) {
      setArticles(articles.filter((a) => a.id !== id));
      alert("Artikel berhasil dihapus.");
    } else {
      alert("Gagal menghapus: " + error.message);
    }
  };

  return (
    <main className="p-4 md:p-8 space-y-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between">
        <Link
          href="/admin/dashboard"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-600 hover:text-amber-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Kembali ke Dashboard
        </Link>
        <span className="text-xs font-bold bg-amber-100 text-amber-900 px-3 py-1 rounded-full border border-amber-200">
          Tabel: articles (UUID)
        </span>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-2xs space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b pb-4">
          <div>
            <h1 className="text-lg font-bold text-stone-900 flex items-center gap-2">
              <FileText className="w-5 h-5 text-amber-800" /> Kelola Artikel & Berita
            </h1>
            <p className="text-xs text-stone-500">Total {articles.length} artikel terdaftar di database</p>
          </div>
          <Link
            href="/admin/dashboard/artikel/tambah"
            className="px-4 py-2 bg-amber-900 hover:bg-amber-800 text-amber-100 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-all"
          >
            <Plus className="w-4 h-4" /> Tambah Artikel Baru
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-12 flex flex-col items-center gap-2 text-stone-500 text-xs">
            <Loader2 className="w-6 h-6 animate-spin text-amber-800" />
            <span>Memuat data artikel...</span>
          </div>
        ) : articles.length === 0 ? (
          <div className="text-center py-12 text-xs text-stone-500">
            Belum ada artikel. Klik tombol di atas untuk membuat artikel pertama.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-stone-700">
              <thead className="bg-stone-50 text-stone-900 font-bold border-b border-stone-200 uppercase text-[10px]">
                <tr>
                  <th className="p-3">Judul Artikel</th>
                  <th className="p-3">Slug</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Tanggal Dibuat</th>
                  <th className="p-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200">
                {articles.map((item) => (
                  <tr key={item.id} className="hover:bg-stone-50/80 transition-colors">
                    <td className="p-3 font-semibold text-stone-900 max-w-xs truncate">
                      {item.title}
                    </td>
                    <td className="p-3 text-stone-500 max-w-xs truncate font-mono text-[11px]">
                      {item.slug}
                    </td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-0.5 rounded-md font-bold text-[10px] uppercase ${
                          item.status === "published"
                            ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                            : "bg-amber-100 text-amber-800 border border-amber-200"
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="p-3 text-stone-500">
                      {new Date(item.created_at).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          href={`/berita/${item.slug}`}
                          target="_blank"
                          className="p-1.5 text-stone-600 hover:text-amber-800 hover:bg-amber-50 rounded-lg transition-all"
                          title="Pratinjau Artikel"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <Link
                          href={`/admin/dashboard/artikel/edit/${item.id}`}
                          className="p-1.5 text-stone-600 hover:text-amber-800 hover:bg-amber-50 rounded-lg transition-all"
                          title="Edit Artikel"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(item.id, item.title)}
                          className="p-1.5 text-stone-600 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                          title="Hapus Artikel"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}
