"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { compressImage } from "@/lib/utils/image-compressor";
import { ArrowLeft, Save, Loader2, FileText } from "lucide-react";

function EditArtikelForm() {
  const params = useParams();
  const id = params?.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [status, setStatus] = useState<"draft" | "published">("published");
  const [coverImageUrl, setCoverImageUrl] = useState("");
  const [newCoverFile, setNewCoverFile] = useState<File | null>(null);

  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    if (!id) return;
    async function fetchArticle() {
      try {
        const { data, error } = await supabase
          .from("articles")
          .select("*")
          .eq("id", id)
          .single();

        if (error) throw error;
        if (data) {
          setTitle(data.title || "");
          setSlug(data.slug || "");
          setExcerpt(data.excerpt || "");
          setContent(data.content || "");
          setStatus(data.status || "published");
          setCoverImageUrl(data.cover_image_url || "");
        }
      } catch (err: any) {
        alert("Gagal memuat artikel: " + err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchArticle();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    setSaving(true);

    try {
      let finalCoverUrl = coverImageUrl;

      if (newCoverFile) {
        setUploading(true);
        const compressedBlob = await compressImage(newCoverFile);
        const fileName = `article-${Date.now()}.webp`;

        const { error: uploadError } = await supabase.storage
          .from("posters")
          .upload(fileName, compressedBlob, {
            contentType: "image/webp",
            upsert: true,
          });

        if (uploadError) throw uploadError;

        const { data: publicUrlData } = supabase.storage
          .from("posters")
          .getPublicUrl(fileName);

        finalCoverUrl = publicUrlData.publicUrl;
      }

      const { error } = await supabase
        .from("articles")
        .update({
          title,
          slug,
          excerpt,
          content,
          cover_image_url: finalCoverUrl,
          status,
          published_at: status === "published" ? new Date().toISOString() : null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id);

      if (error) throw error;

      alert("Artikel berhasil diperbarui!");
      router.push("/admin/dashboard/artikel");
      router.refresh();
    } catch (err: any) {
      alert("Gagal memperbarui artikel: " + err.message);
    } finally {
      setSaving(false);
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-6 h-6 animate-spin text-amber-800" />
      </div>
    );
  }

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
            <FileText className="w-5 h-5 text-amber-800" /> Edit Artikel
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">Judul Artikel</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2 text-xs border border-stone-300 rounded-xl focus:ring-2 focus:ring-amber-800 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">Slug URL</label>
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
                <option value="published">Published</option>
                <option value="draft">Draft</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Ganti Foto Cover (Optional)</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => e.target.files && setNewCoverFile(e.target.files[0])}
                className="w-full text-xs text-stone-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-amber-100 file:text-amber-900 hover:file:bg-amber-200"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">Ringkasan (Excerpt)</label>
            <textarea
              rows={2}
              required
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
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
                <span>{uploading ? "Mengompresi Gambar..." : "Memperbarui..."}</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Simpan Perubahan</span>
              </>
            )}
          </button>
        </form>
      </div>
    </main>
  );
}

export default function EditArtikelPage() {
  return (
    <Suspense
      fallback={
        <div className="p-8 flex items-center justify-center min-h-[400px]">
          <Loader2 className="w-6 h-6 animate-spin text-amber-800" />
        </div>
      }
    >
      <EditArtikelForm />
    </Suspense>
  );
}
