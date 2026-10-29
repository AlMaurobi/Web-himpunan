"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { compressImage } from "@/lib/utils/image-compressor";
import { ArrowLeft, Upload, Loader2, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default function EditArtikelPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  const [title, setTitle] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [status, setStatus] = useState("published");
  const [currentCoverUrl, setCurrentCoverUrl] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);

  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    async function loadData() {
      const { data: catData } = await supabase.from("categories").select("*");
      if (catData) setCategories(catData);

      const { data: artData } = await supabase.from("articles").select("*").eq("id", id).single();
      if (artData) {
        setTitle(artData.title || "");
        setCategoryId(artData.category_id || "");
        setExcerpt(artData.excerpt || "");
        setContent(artData.content || "");
        setStatus(artData.status || "published");
        setCurrentCoverUrl(artData.cover_image_url || null);
      }
      setLoading(false);
    }
    loadData();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErrorMsg(null);

    try {
      let coverImageUrl = currentCoverUrl;

      if (file) {
        if (currentCoverUrl) {
          const oldFileName = currentCoverUrl.split("/").pop();
          if (oldFileName) {
            await supabase.storage.from("posters").remove([oldFileName]);
          }
        }

        const compressedFile = await compressImage(file);
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.webp`;

        const { error: uploadError } = await supabase.storage
          .from("posters")
          .upload(fileName, compressedFile, {
            contentType: "image/webp",
            upsert: true,
          });

        if (uploadError) throw new Error(`Gagal upload poster: ${uploadError.message}`);

        const { data: urlData } = supabase.storage.from("posters").getPublicUrl(fileName);
        coverImageUrl = urlData.publicUrl;
      }

      const { error: updateError } = await supabase
        .from("articles")
        .update({
          title,
          excerpt,
          content,
          cover_image_url: coverImageUrl,
          category_id: categoryId || null,
          status,
          published_at: status === "published" ? new Date().toISOString() : null,
        })
        .eq("id", id);

      if (updateError) throw new Error(`Gagal memperbarui artikel: ${updateError.message}`);

      router.push("/admin/dashboard/artikel");
      router.refresh();
    } catch (err: any) {
      setErrorMsg(err.message || "Terjadi kesalahan saat memproses data");
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white border border-stone-200/80 rounded-2xl p-12 text-center text-stone-500 shadow-sm flex items-center justify-center gap-2">
        <Loader2 className="w-5 h-5 animate-spin text-amber-800" />
        <span>Memuat data artikel...</span>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/admin/dashboard/artikel"
          className="p-2 bg-white border border-stone-200 hover:bg-stone-100 rounded-xl text-stone-600 hover:text-stone-900 transition-all shadow-sm"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-extrabold text-stone-900">Edit Artikel</h1>
          <p className="text-stone-600 text-sm mt-0.5">Perbarui informasi atau ganti poster berita</p>
        </div>
      </div>

      {errorMsg && (
        <div className="p-4 bg-red-100 border border-red-300 text-red-800 text-sm rounded-xl font-medium">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white border border-stone-200/80 rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm">
        <div>
          <label className="block text-sm font-semibold text-stone-700 mb-2">Judul Artikel / Kegiatan *</label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-stone-800 text-sm focus:outline-none focus:ring-2 focus:ring-amber-800"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-stone-700 mb-2">Kategori</label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full px-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-stone-800 text-sm focus:outline-none focus:ring-2 focus:ring-amber-800"
            >
              <option value="">-- Pilih Kategori --</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.nama}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-stone-700 mb-2">Status Publikasi</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-stone-800 text-sm focus:outline-none focus:ring-2 focus:ring-amber-800"
            >
              <option value="published">Langsung Publish</option>
              <option value="draft">Simpan Sebagai Draft</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-stone-700 mb-2">Ganti Poster (Opsional)</label>
          <div className="flex items-center gap-4 mb-3">
            {currentCoverUrl && (
              <img src={currentCoverUrl} alt="Poster Saat Ini" className="w-20 h-20 rounded-xl object-cover border border-stone-300 shadow-sm" />
            )}
            <span className="text-xs text-stone-500">Pilih file baru jika ingin mengganti poster lama</span>
          </div>
          <div className="border-2 border-dashed border-stone-300 rounded-2xl p-6 text-center bg-stone-50/60 hover:border-amber-700 transition-all">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="hidden"
              id="poster-upload-edit"
            />
            <label htmlFor="poster-upload-edit" className="cursor-pointer flex flex-col items-center">
              <Upload className="w-8 h-8 text-amber-800 mb-2" />
              <span className="text-sm font-semibold text-stone-800">
                {file ? file.name : "Klik untuk memilih poster baru"}
              </span>
            </label>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-stone-700 mb-2">Ringkasan Pendek (Excerpt) *</label>
          <textarea
            required
            rows={2}
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            className="w-full px-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-stone-800 text-sm focus:outline-none focus:ring-2 focus:ring-amber-800"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-stone-700 mb-2">Isi Lengkap Artikel *</label>
          <textarea
            required
            rows={8}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full px-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-stone-800 text-sm focus:outline-none focus:ring-2 focus:ring-amber-800"
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full py-3 bg-amber-800 hover:bg-amber-900 disabled:bg-amber-800/50 text-amber-50 font-semibold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 text-sm"
        >
          {saving ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Memperbarui Artikel...</span>
            </>
          ) : (
            <>
              <CheckCircle2 className="w-5 h-5" />
              <span>Simpan Perubahan Artikel</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
