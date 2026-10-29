"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Plus, FileText, Image as ImageIcon, Calendar, Edit3, Trash2, Loader2 } from "lucide-react";

export default function ArtikelListPage() {
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const supabase = createClient();

  useEffect(() => {
    loadArticles();
  }, []);

  async function loadArticles() {
    setLoading(true);
    const { data } = await supabase
      .from("articles")
      .select("id, title, slug, excerpt, status, published_at, cover_image_url, categories(nama)")
      .order("created_at", { ascending: false });

    if (data) setArticles(data);
    setLoading(false);
  }

  const handleDelete = async (id: string, coverImageUrl?: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus artikel ini secara permanen?")) return;

    setDeletingId(id);

    try {
      // 1. Hapus file foto dari Supabase Storage jika ada
      if (coverImageUrl) {
        const fileName = coverImageUrl.split("/").pop();
        if (fileName) {
          await supabase.storage.from("posters").remove([fileName]);
        }
      }

      // 2. Hapus record dari database
      const { error } = await supabase.from("articles").delete().eq("id", id);
      if (error) throw error;

      setArticles(articles.filter((a) => a.id !== id));
    } catch (err: any) {
      alert(`Gagal menghapus artikel: ${err.message}`);
    }

    setDeletingId(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-stone-900">Kelola Artikel & Berita</h1>
          <p className="text-stone-600 text-sm mt-1">
            Daftar seluruh postingan kegiatan dan pengumuman himpunan
          </p>
        </div>
        <Link
          href="/admin/dashboard/artikel/buat"
          className="bg-amber-800 hover:bg-amber-900 text-amber-50 font-semibold px-4 py-2.5 rounded-xl flex items-center gap-2 shadow-md shadow-amber-950/20 transition-all text-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Artikel Baru</span>
        </Link>
      </div>

      {loading ? (
        <div className="bg-white border border-stone-200/80 rounded-2xl p-12 text-center text-stone-500 shadow-sm flex items-center justify-center gap-2">
          <Loader2 className="w-5 h-5 animate-spin text-amber-800" />
          <span>Memuat data artikel...</span>
        </div>
      ) : articles.length === 0 ? (
        <div className="bg-white border border-stone-200/80 rounded-2xl p-12 text-center shadow-sm">
          <FileText className="w-12 h-12 text-stone-400 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-stone-800">Belum Ada Artikel</h3>
          <p className="text-stone-500 text-sm mt-1 mb-6">
            Mulai publikasikan berita atau poster kegiatan pertama kamu.
          </p>
          <Link
            href="/admin/dashboard/artikel/buat"
            className="inline-flex items-center gap-2 text-sm text-amber-800 hover:text-amber-900 font-semibold"
          >
            <Plus className="w-4 h-4" /> Buat Artikel Sekarang
          </Link>
        </div>
      ) : (
        <div className="bg-white border border-stone-200/80 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-stone-700">
              <thead className="bg-stone-100 text-xs uppercase text-stone-600 border-b border-stone-200 font-bold">
                <tr>
                  <th className="py-3.5 px-4">Poster</th>
                  <th className="py-3.5 px-4">Judul & Ringkasan</th>
                  <th className="py-3.5 px-4">Kategori</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Tanggal Published</th>
                  <th className="py-3.5 px-4 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200">
                {articles.map((art: any) => (
                  <tr key={art.id} className="hover:bg-amber-50/50 transition-all">
                    <td className="py-3 px-4 w-20">
                      {art.cover_image_url ? (
                        <img
                          src={art.cover_image_url}
                          alt={art.title}
                          className="w-12 h-12 rounded-xl object-cover border border-stone-200 shadow-sm"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-stone-100 rounded-xl flex items-center justify-center text-stone-400">
                          <ImageIcon className="w-5 h-5" />
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-4 max-w-xs">
                      <p className="font-bold text-stone-900 truncate">{art.title}</p>
                      <p className="text-xs text-stone-500 truncate mt-0.5">{art.excerpt}</p>
                    </td>
                    <td className="py-3 px-4">
                      <span className="bg-amber-100 text-amber-900 px-2.5 py-1 rounded-full text-xs border border-amber-200 font-semibold">
                        {art.categories?.nama || "Umum"}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                          art.status === "published"
                            ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                            : "bg-amber-100 text-amber-800 border border-amber-300"
                        }`}
                      >
                        {art.status === "published" ? "Published" : "Draft"}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-xs text-stone-500">
                      {art.published_at ? (
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-stone-400" />
                          <span>{new Date(art.published_at).toLocaleDateString("id-ID")}</span>
                        </div>
                      ) : (
                        "-"
                      )}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <Link
                          href={`/admin/dashboard/artikel/edit/${art.id}`}
                          className="p-1.5 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded-lg transition-colors"
                          title="Edit Artikel"
                        >
                          <Edit3 className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(art.id, art.cover_image_url)}
                          disabled={deletingId === art.id}
                          className="p-1.5 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-colors disabled:opacity-50"
                          title="Hapus Artikel"
                        >
                          {deletingId === art.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
