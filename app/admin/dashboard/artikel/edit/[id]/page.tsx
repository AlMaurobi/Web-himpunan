"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import { ArrowLeft, Link as LinkIcon, Save } from "lucide-react";
import Link from "next/link";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const instant = false;

export default function EditArtikelPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();

  const [judul, setJudul] = useState("");
  const [kategori, setKategori] = useState("Kegiatan");
  const [posterUrl, setPosterUrl] = useState("");
  const [tautanTerkait, setTautanTerkait] = useState("");
  const [konten, setKonten] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function fetchArtikel() {
      const { data, error } = await supabase
        .from("artikel")
        .select("*")
        .eq("id", id)
        .single();

      if (error || !data) {
        alert("Artikel tidak ditemukan!");
        router.push("/admin/dashboard");
      } else {
        setJudul(data.judul || "");
        setKategori(data.kategori || "Kegiatan");
        setPosterUrl(data.poster_url || "");
        setTautanTerkait(data.tautan_terkait || "");
        setKonten(data.konten || "");
      }
      setLoading(false);
    }
    fetchArtikel();
  }, [id, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const { error } = await supabase
      .from("artikel")
      .update({
        judul,
        kategori,
        poster_url: posterUrl || null,
        tautan_terkait: tautanTerkait || null,
        konten,
      })
      .eq("id", id);

    setSaving(false);

    if (error) {
      alert("Gagal memperbarui artikel: " + error.message);
    } else {
      alert("Artikel berhasil diperbarui!");
      router.push("/admin/dashboard");
      router.refresh();
    }
  };

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center text-sm text-stone-500">
        Memuat data artikel...
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <Link
          href="/admin/dashboard"
          className="inline-flex items-center gap-2 text-xs font-semibold text-stone-600 hover:text-stone-900 bg-white border border-stone-200 px-3 py-2 rounded-xl"
        >
          <ArrowLeft className="w-4 h-4" /> Kembali ke Dashboard
        </Link>
        <h1 className="text-xl font-bold text-stone-900">Edit Artikel #{id}</h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-5">
        <div>
          <label className="block text-xs font-bold text-stone-700 mb-1">Judul Artikel</label>
          <input
            type="text"
            required
            value={judul}
            onChange={(e) => setJudul(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-800"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">Kategori</label>
            <select
              value={kategori}
              onChange={(e) => setKategori(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-800"
            >
              <option value="Kegiatan">Kegiatan</option>
              <option value="Pengumuman">Pengumuman</option>
              <option value="Prestasi">Prestasi</option>
              <option value="Opini & Karya">Opini & Karya</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">URL Poster / Sampul</label>
            <input
              type="url"
              value={posterUrl}
              onChange={(e) => setPosterUrl(e.target.value)}
              placeholder="https://..."
              className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-800"
            />
          </div>
        </div>

        {/* Panel Tautan Terkait / Lampiran Dokumen */}
        <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200/80 space-y-2">
          <label className="block text-xs font-bold text-amber-900 flex items-center gap-1.5">
            <LinkIcon className="w-4 h-4 text-amber-700" />
            Tautan Terkait / Lampiran Dokumen (Opsional)
          </label>
          <p className="text-[11px] text-stone-600">
            Sematkan tautan Google Drive, berkas PDF, dokumen resmi, atau URL pendaftaran eksternal.
          </p>
          <input
            type="url"
            value={tautanTerkait}
            onChange={(e) => setTautanTerkait(e.target.value)}
            placeholder="https://drive.google.com/..."
            className="w-full px-4 py-2.5 rounded-xl border border-stone-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-800"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-stone-700 mb-1">Konten Artikel</label>
          <textarea
            required
            rows={10}
            value={konten}
            onChange={(e) => setKonten(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-800"
          ></textarea>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full py-3 bg-amber-900 hover:bg-amber-800 text-amber-100 font-bold rounded-xl text-sm transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? "Perbarui..." : "Simpan Perubahan Artikel"}</span>
        </button>
      </form>
    </div>
  );
}