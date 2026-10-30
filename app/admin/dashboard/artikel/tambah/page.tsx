"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { compressImage } from "@/lib/utils/image-compressor";
import { ArrowLeft, Save, Upload, Loader2, FileText } from "lucide-react";

export default function TambahArtikelPage() {
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [status, setStatus] = useState<"draft" | "published">("published");
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null);
  const [coverImageUrlInput, setCoverImageUrlInput] = useState("");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  const router = useRouter();
  const supabase = createClient();

  const generateSlug = (val: string) => {
    setTitle(val);
    const generated = val
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9 -]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
    setSlug(generated);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setCoverImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !excerpt || !content) {
      alert("Harap isi Judul, Ringkasan, dan Konten Artikel.");
      return;
    }

    setSaving(true);
    try {
      let finalCoverUrl = coverImageUrlInput;

      // Jika ada file gambar diunggah, lakukan kompresi WebP & upload ke Supabase Storage
      if (coverImageFile) {
        setUploading(true);
        const compressedBlob = await compressImage(coverImageFile);
        const fileName = `article-${Date.now()}.webp`;

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("posters")
          .upload(fileName, compressedBlob, {
            contentType: "image/webp",
            upsert: true,
          });

        if (uploadError) {
          throw new Error("Gagal mengunggah foto: " + uploadError.message);
        }

        const { data: publicUrlData } = supabase.storage
          .from("posters")
          .getPublicUrl(fileName);

        finalCoverUrl = publicUrlData.publicUrl;
      }

      if (!finalCoverUrl) {
        finalCoverUrl = "https://images.unsplash.com/photo-1455390582262-044cdead277a?q=80&w=800";
      }

      // Insert ke tabel articles
      const { error } = await supabase.from("articles").insert([
        {
          title,
          slug: slug || `article-${Date.now()}`,
          excerpt,
          content,
          cover_image_url: finalCoverUrl,
          status,
          published_at: status === "published" ? new Date().toISOString() : null,
        },
      ]);

      if (error) throw error;

      alert("Artikel berhasil ditambahkan!");
      router.push("/admin/dashboard/artikel");
      router.refresh();
    } catch (err: any) {
      alert("Gagal menyimpan artikel: " + err.message);
    } finally {
      setSaving(false);
      setUploading(false);
    }
  };

  return (
    <main className="p-4 md:p-8 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <Link
          href="/admin/dashboard/artikel"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-600 hover:text-amber-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Kembali ke Daftar Artikel
        </Link>
      </div>

      <div className="bg-white p-6 md:p-8 rounded-2xl border border-stone-200 shadow-2xs space-y-6">
        <div className="border-b pb-4">
          <h1 className="text-lg font-bold text-stone-900 flex items-center gap-2">
            <FileText className="w-5 h-5 text-amber-800" /> Buat Artikel Baru
          </h1>
          <p className="text-xs text-stone-500">
            Foto sampul akan dikompresi otomatis ke format WebP hemat penyimpanan.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">Judul Artikel</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => generateSlug(e.target.value)}
              placeholder="Masukkan judul artikel..."
              className="w-full px-3.5 py-2 text-xs border border-stone-300 rounded-xl focus:ring-2 focus:ring-amber-800 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">Slug URL (Otomatis)</label>
            <input
              type="text"
              required
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="w-full px-3.5 py-2 text-xs border border-stone-300 rounded-xl bg-stone-50 font-mono focus:ring-2 focus:ring-amber-800 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Status Publikasi</label>
              <select
                value={status}
                onChange={(e: any) => setStatus(e.target.value)}
                className="w-full px-3.5 py-2 text-xs border border-stone-300 rounded-xl focus:ring-2 focus:ring-amber-800 focus:outline-none"
              >
                <option value="published">Published (Tampil di Web)</option>
                <option value="draft">Draft (Disimpan Saja)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Unggah Cover (Kompresi WebP)</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full text-xs text-stone-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-amber-100 file:text-amber-900 hover:file:bg-amber-200"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">
              Atau URL Cover Gambar Eksternal
            </label>
            <input
              type="text"
              value={coverImageUrlInput}
              onChange={(e) => setCoverImageUrlInput(e.target.value)}
              placeholder="https://..."
              className="w-full px-3.5 py-2 text-xs border border-stone-300 rounded-xl focus:ring-2 focus:ring-amber-800 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">Ringkasan (Excerpt)</label>
            <textarea
              rows={2}
              required
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="Tuliskan 1-2 kalimat ringkasan artikel..."
              className="w-full px-3.5 py-2 text-xs border border-stone-300 rounded-xl focus:ring-2 focus:ring-amber-800 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">Isi Konten Lengkap</label>
            <textarea
              rows={8}
              required
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Tuliskan isi lengkap artikel di sini..."
              className="w-full px-3.5 py-2 text-xs border border-stone-300 rounded-xl focus:ring-2 focus:ring-amber-800 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full py-2.5 bg-amber-900 hover:bg-amber-800 text-amber-100 rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all disabled:opacity-50"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>{uploading ? "Mengompresi & Mengunggah Gambar..." : "Menyimpan Artikel..."}</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Simpan Artikel</span>
              </>
            )}
          </button>
        </form>
      </div>
    </main>
  );
}
