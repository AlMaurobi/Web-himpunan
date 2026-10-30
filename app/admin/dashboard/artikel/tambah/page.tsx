"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import { ArrowLeft, Save, PlusCircle } from "lucide-react";
import Link from "next/link";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function TambahArtikelPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [coverImageUrl, setCoverImageUrl] = useState("");
  const [content, setContent] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return alert("Judul dan Isi Artikel wajib diisi!");

    setSaving(true);

    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') + '-' + Math.floor(Math.random() * 1000);
    const autoExcerpt = excerpt.trim() || content.substring(0, 150) + "...";

    const payload = {
      title: title,
      slug: slug,
      excerpt: autoExcerpt,
      content: content,
      cover_image_url: coverImageUrl || null,
      status: "published",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase.from("articles").insert([payload]);

    setSaving(false);

    if (error) {
      alert("Gagal menambahkan artikel: " + error.message);
    } else {
      alert("Artikel berhasil diterbitkan!");
      router.push("/admin/dashboard/artikel");
      router.refresh();
    }
  };

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
          <PlusCircle className="w-5 h-5 text-amber-800" /> Buat Artikel / Berita Baru
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl border border-stone-200 shadow-2xs space-y-5">
        <div>
          <label className="block text-xs font-bold text-stone-700 mb-1">Judul Artikel / Berita</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Masukkan judul artikel yang menarik..."
            className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-800"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-stone-700 mb-1">Ringkasan / Excerpt (Opsional)</label>
          <input
            type="text"
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            placeholder="Ringkasan singkat artikel..."
            className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-800"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-stone-700 mb-1">URL Gambar Sampul (cover_image_url)</label>
          <input
            type="url"
            value={coverImageUrl}
            onChange={(e) => setCoverImageUrl(e.target.value)}
            placeholder="https://..."
            className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-800"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-stone-700 mb-1">Isi Berkas / Konten Artikel</label>
          <textarea
            rows={10}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Tuliskan berita secara rinci di sini..."
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
          <span>{saving ? "Menerbitkan Artikel..." : "Terbitkan Artikel"}</span>
        </button>
      </form>
    </div>
  );
}