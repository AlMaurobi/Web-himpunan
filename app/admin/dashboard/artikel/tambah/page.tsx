"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Upload, Save, Link as LinkIcon, Loader2 } from "lucide-react";
import { createClient } from "@supabase/supabase-js";
import { compressImage } from "@/lib/compressor";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function TambahArtikelPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [judul, setJudul] = useState("");
  const [kategori, setKategori] = useState("");
  const [status, setStatus] = useState("published");
  const [excerpt, setExcerpt] = useState("");
  const [konten, setKonten] = useState("");
  const [tautan, setTautan] = useState("");
  const [filePoster, setFilePoster] = useState<File | null>(null);
  const [previewPoster, setPreviewPoster] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      const compressed = await compressImage(selectedFile);
      setFilePoster(compressed);
      setPreviewPoster(URL.createObjectURL(compressed));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!judul || !kategori || !excerpt || !konten) {
      alert("Mohon lengkapi semua kolom wajib (*)");
      return;
    }

    setLoading(true);
    try {
      let posterUrl = "";

      if (filePoster) {
        const fileExt = filePoster.name.split(".").pop();
        const fileName = `poster-${Date.now()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from("artikel")
          .upload(fileName, filePoster);

        if (uploadError) throw uploadError;

        const { data: publicUrlData } = supabase.storage
          .from("artikel")
          .getPublicUrl(fileName);

        posterUrl = publicUrlData.publicUrl;
      }

      const { error: insertError } = await supabase.from("artikel").insert([
        {
          judul,
          kategori,
          status,
          excerpt,
          konten,
          tautan_terkait: tautan || null,
          poster_url: posterUrl || null,
          created_at: new Date().toISOString(),
        },
      ]);

      if (insertError) throw insertError;

      alert("Artikel berhasil disimpan!");
      router.push("/admin/dashboard/artikel");
    } catch (err: any) {
      alert("Gagal menyimpan artikel: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      <div className="flex items-center gap-4">
        <Link
          href="/admin/dashboard/artikel"
          className="p-2.5 rounded-xl bg-white border border-stone-200 text-stone-700 hover:bg-stone-100 transition-all shadow-xs"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-black text-stone-900 tracking-tight">Buat Artikel Baru</h1>
          <p className="text-xs text-stone-500">Foto poster akan dikompresi otomatis ke format WebP (&lt; 200 KB)</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-6 md:p-8 rounded-3xl border border-stone-200/80 shadow-xs space-y-6">
        <div>
          <label className="block text-xs font-bold text-stone-800 mb-2">Judul Artikel / Kegiatan *</label>
          <input
            type="text"
            required
            value={judul}
            onChange={(e) => setJudul(e.target.value)}
            placeholder="misal: Pelatihan Kebahasaan dan Penulisan Karya Sastra 2026"
            className="w-full px-4 py-3 rounded-2xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-800/20"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-stone-800 mb-2">Kategori *</label>
            <select
              required
              value={kategori}
              onChange={(e) => setKategori(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-800/20 bg-white"
            >
              <option value="">-- Pilih Kategori --</option>
              <option value="Kegiatan Himpunan">Kegiatan Himpunan</option>
              <option value="Pengumuman Prodi">Pengumuman Prodi</option>
              <option value="Prestasi Mahasiswa">Prestasi Mahasiswa</option>
              <option value="Opini & Karya">Opini & Karya</option>
              <option value="Umum">Umum</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-800 mb-2">Status Publikasi</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-800/20 bg-white"
            >
              <option value="published">Langsung Publish</option>
              <option value="draft">Simpan Draft</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-stone-800 mb-2">Upload Poster / Foto Utama *</label>
          <div className="border-2 border-dashed border-stone-300 rounded-2xl p-6 text-center hover:bg-stone-50 transition-all relative">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
            />
            {previewPoster ? (
              <div className="space-y-2">
                <img src={previewPoster} alt="Preview" className="max-h-48 mx-auto rounded-xl object-contain" />
                <p className="text-xs text-amber-800 font-medium">Klik untuk mengganti foto</p>
              </div>
            ) : (
              <div className="space-y-2 text-stone-500">
                <Upload className="w-8 h-8 mx-auto text-stone-400" />
                <p className="text-sm font-semibold text-stone-700">Klik untuk memilih file poster dari HP/Komputer</p>
                <p className="text-xs text-stone-400">Format JPG/PNG otomatis dikompres ke WebP</p>
              </div>
            )}
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-stone-800 mb-2">Ringkasan Pendek (Excerpt) *</label>
          <textarea
            required
            rows={2}
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            placeholder="Ringkasan 1-2 kalimat yang tampil di kartu depan berita"
            className="w-full px-4 py-3 rounded-2xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-800/20"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-stone-800 mb-2">Isi Lengkap Artikel *</label>
          <textarea
            required
            rows={8}
            value={konten}
            onChange={(e) => setKonten(e.target.value)}
            placeholder="Tuliskan berita atau laporan kegiatan secara lengkap di sini..."
            className="w-full px-4 py-3 rounded-2xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-800/20"
          />
        </div>

        {/* Kolom Input Tautan Lampiran Khusus */}
        <div>
          <label className="block text-xs font-bold text-stone-800 mb-2 flex items-center gap-1.5">
            <LinkIcon className="w-3.5 h-3.5 text-amber-800" />
            <span>Tautan Lampiran / Berkas Terkait (Opsional)</span>
          </label>
          <input
            type="url"
            value={tautan}
            onChange={(e) => setTautan(e.target.value)}
            placeholder="misal: https://drive.google.com/file/d/... atau link Pendaftaran Zoom"
            className="w-full px-4 py-3 rounded-2xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-800/20"
          />
          <p className="text-[11px] text-stone-400 mt-1">Gunakan link Google Drive untuk dokumen PDF besar/Sertifikat agar menghemat storage Supabase.</p>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 px-6 rounded-2xl bg-amber-900 hover:bg-amber-800 text-amber-100 font-bold text-sm transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Menyimpan Artikel...</span>
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
  );
}
