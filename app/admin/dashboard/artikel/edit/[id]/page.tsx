"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useParams } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import { ArrowLeft, Save, Edit, Loader2 } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

function EditArtikelContent() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Kegiatan");
  const [imageUrl, setImageUrl] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    if (!id) return;

    async function fetchDetail() {
      const { data } = await supabase.from("articles").select("*").eq("id", id).maybeSingle();

      if (data) {
        setTitle(data.title || data.judul || "");
        setCategory(data.category || data.kategori || "Kegiatan");
        setImageUrl(data.image_url || data.foto_url || "");
        setContent(data.content || data.isi || "");
      } else {
        alert("Artikel tidak ditemukan di database!");
        router.push("/admin/dashboard/artikel");
      }
      setLoading(false);
    }

    fetchDetail();
  }, [id, router]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return alert("Judul dan Isi Artikel wajib diisi!");

    setSaving(true);

    const payload = {
      title: title,
      category: category,
      image_url: imageUrl,
      content: content,
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase.from("articles").update(payload).eq("id", id);

    setSaving(false);

    if (error) {
      alert("Gagal memperbarui artikel: " + error.message);
    } else {
      alert("Artikel berhasil diperbarui!");
      router.push("/admin/dashboard/artikel");
      router.refresh();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center text-stone-500 gap-2">
        <Loader2 className="w-5 h-5 animate-spin text-amber-800" />
        <span className="text-xs font-semibold">Memuat data artikel...</span>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 space-y-6">
      <div className="flex items-center justify-between">
        <Link
          href="/admin/dashboard/artikel"
          className="inline-flex items-center gap-2 text-xs font-semibold text-stone-600 hover:text-stone-900 bg-white border border-stone-200 px-3 py-2 rounded-xl"
        >
          <ArrowLeft className="w-4 h-4" /> Kembali ke Daftar Artikel
        </Link>
        <h1 className="text-base font-bold text-stone-900 flex items-center gap-2">
          <Edit className="w-5 h-5 text-amber-800" /> Edit Artikel
        </h1>
      </div>

      <form onSubmit={handleUpdate} className="bg-white p-6 rounded-2xl border border-stone-200 shadow-2xs space-y-5">
        <div>
          <label className="block text-xs font-bold text-stone-700 mb-1">Judul Artikel / Berita</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-800"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">Kategori</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-amber-800"
            >
              <option value="Kegiatan">Kegiatan</option>
              <option value="Berita Prodi">Berita Prodi</option>
              <option value="Prestasi">Prestasi</option>
              <option value="Pengumuman">Pengumuman</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">URL Gambar Sampul (Opsional)</label>
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-800"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-stone-700 mb-1">Isi Berkas / Konten Artikel</label>
          <textarea
            rows={10}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-800"
            required
          ></textarea>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full py-3 bg-amber-900 hover:bg-amber-800 text-amber-100 font-bold rounded-xl text-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? "Menyimpan Perubahan..." : "Simpan Perubahan Artikel"}</span>
        </button>
      </form>
    </div>
  );
}

export default function EditArtikelPage() {
  return (
    <Suspense fallback={<div className="p-8 text-xs text-stone-500">Memuat halaman edit artikel...</div>}>
      <EditArtikelContent />
    </Suspense>
  );
}