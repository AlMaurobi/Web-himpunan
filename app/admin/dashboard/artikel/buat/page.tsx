"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { compressImage } from "@/lib/utils/image-compressor";
import { ArrowLeft, Upload, Loader2, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default function BuatArtikelPage() {
  const [title, setTitle] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [status, setStatus] = useState("published");
  const [file, setFile] = useState<File | null>(null);

  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    async function loadCategories() {
      const { data } = await supabase.from("categories").select("*");
      if (data) setCategories(data);
    }
    loadCategories();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setErrorMsg("Wajib memilih foto/poster artikel!");
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    try {
      const compressedFile = await compressImage(file);

      const fileExt = "webp";
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = fileName;

      const { error: uploadError } = await supabase.storage
        .from("posters")
        .upload(filePath, compressedFile, {
          contentType: "image/webp",
          upsert: true,
        });

      if (uploadError) throw new Error(`Gagal upload poster: ${uploadError.message}`);

      const { data: urlData } = supabase.storage.from("posters").getPublicUrl(filePath);
      const coverImageUrl = urlData.publicUrl;

      const slug = title
        .toLowerCase()
        .replace(/[^a-z0-9 -]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-") + `-${Date.now().toString().slice(-4)}`;

      const { error: insertError } = await supabase.from("articles").insert({
        title,
        slug,
        excerpt,
        content,
        cover_image_url: coverImageUrl,
        category_id: categoryId || null,
        status,
        published_at: status === "published" ? new Date().toISOString() : null,
      });

      if (insertError) throw new Error(`Gagal menyimpan artikel: ${insertError.message}`);

      router.push("/admin/dashboard/artikel");
      router.refresh();
    } catch (err: any) {
      setErrorMsg(err.message || "Terjadi kesalahan saat memproses data");
      setLoading(false);
    }
  };

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
          <h1 className="text-2xl font-extrabold text-stone-900">Buat Artikel Baru</h1>
          <p className="text-stone-600 text-sm mt-0.5">
            Foto poster akan dikompresi otomatis ke format WebP (&lt; 500 KB)
          </p>
        </div>
      </div>

      {errorMsg && (
        <div className="p-4 bg-red-100 border border-red-300 text-red-800 text-sm rounded-xl font-medium">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white border border-stone-200/80 rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm">
        <div>
          <label className="block text-sm font-semibold text-stone-700 mb-2">
            Judul Artikel / Kegiatan *
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="misal: Pelatihan Kebahasaan dan Penulisan Karya Sastra 2026"
            className="w-full px-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-stone-800 text-sm focus:outline-none focus:ring-2 focus:ring-amber-800 focus:border-transparent transition-all"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-stone-700 mb-2">
              Kategori
            </label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full px-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-stone-800 text-sm focus:outline-none focus:ring-2 focus:ring-amber-800 focus:border-transparent transition-all"
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
            <label className="block text-sm font-semibold text-stone-700 mb-2">
              Status Publikasi
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-stone-800 text-sm focus:outline-none focus:ring-2 focus:ring-amber-800 focus:border-transparent transition-all"
            >
              <option value="published">Langsung Publish</option>
              <option value="draft">Simpan Sebagai Draft</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-stone-700 mb-2">
            Upload Poster / Foto Utama *
          </label>
          <div className="border-2 border-dashed border-stone-300 rounded-2xl p-6 text-center bg-stone-50/60 hover:border-amber-700 transition-all">
            <input
              type="file"
              accept="image/*"
              required
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="hidden"
              id="poster-upload"
            />
            <label htmlFor="poster-upload" className="cursor-pointer flex flex-col items-center">
              <Upload className="w-8 h-8 text-amber-800 mb-2" />
              <span className="text-sm font-semibold text-stone-800">
                {file ? file.name : "Klik untuk memilih file poster dari HP/Komputer"}
              </span>
              <span className="text-xs text-stone-500 mt-1">
                Format JPG/PNG otomatis dikompres ke WebP
              </span>
            </label>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-stone-700 mb-2">
            Ringkasan Pendek (Excerpt) *
          </label>
          <textarea
            required
            rows={2}
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            placeholder="Ringkasan 1-2 kalimat yang tampil di kartu depan berita"
            className="w-full px-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-stone-800 text-sm focus:outline-none focus:ring-2 focus:ring-amber-800 focus:border-transparent transition-all"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-stone-700 mb-2">
            Isi Lengkap Artikel *
          </label>
          <textarea
            required
            rows={8}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Tuliskan berita atau laporan kegiatan secara lengkap di sini..."
            className="w-full px-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-stone-800 text-sm focus:outline-none focus:ring-2 focus:ring-amber-800 focus:border-transparent transition-all"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-amber-800 hover:bg-amber-900 disabled:bg-amber-800/50 text-amber-50 font-semibold rounded-xl shadow-md shadow-amber-950/20 transition-all flex items-center justify-center gap-2 text-sm"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Mengompres Foto & Menyimpan Artikel...</span>
            </>
          ) : (
            <>
              <CheckCircle2 className="w-5 h-5" />
              <span>Simpan Artikel</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
