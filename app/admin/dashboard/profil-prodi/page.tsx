"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import { ArrowLeft, Save, GraduationCap, Loader2 } from "lucide-react";
import Link from "next/link";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function AdminProfilProdiPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [judulHalaman, setJudulHalaman] = useState("");
  const [subjudul, setSubjudul] = useState("");
  const [namaKorprodi, setNamaKorprodi] = useState("");
  const [jabatanKorprodi, setJabatanKorprodi] = useState("");
  const [fotoKorprodi, setFotoKorprodi] = useState("");
  const [sambutan, setSambutan] = useState("");
  const [visi, setVisi] = useState("");
  const [misiText, setMisiText] = useState("");

  useEffect(() => {
    async function fetchData() {
      const { data } = await supabase.from("prodi_profile").select("*").maybeSingle();
      if (data) {
        setJudulHalaman(data.judul_halaman || data.title || "");
        setSubjudul(data.subjudul || data.subtitle || "");
        setNamaKorprodi(data.nama_korprodi || data.head_name || "");
        setJabatanKorprodi(data.jabatan_korprodi || data.head_title || "");
        setFotoKorprodi(data.foto_korprodi || data.head_image || "");
        setSambutan(data.sambutan || data.welcome_speech || data.description || "");
        setVisi(data.visi || data.vision || "");

        const rawMisi = data.misi || data.mission;
        if (Array.isArray(rawMisi)) {
          setMisiText(rawMisi.join("\n"));
        } else if (typeof rawMisi === "string") {
          setMisiText(rawMisi);
        }
      }
      setLoading(false);
    }
    fetchData();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const misiArray = misiText.split("\n").filter((item) => item.trim().length > 0);

    const payload = {
      judul_halaman: judulHalaman,
      subjudul: subjudul,
      nama_korprodi: namaKorprodi,
      jabatan_korprodi: jabatanKorprodi,
      foto_korprodi: fotoKorprodi,
      sambutan: sambutan,
      visi: visi,
      misi: misiArray,
      updated_at: new Date().toISOString(),
    };

    const { data: existing } = await supabase.from("prodi_profile").select("id").maybeSingle();

    let error = null;
    if (existing?.id) {
      const res = await supabase.from("prodi_profile").update(payload).eq("id", existing.id);
      error = res.error;
    } else {
      const res = await supabase.from("prodi_profile").insert([payload]);
      error = res.error;
    }

    setSaving(false);

    if (error) {
      alert("Gagal menyimpan ke prodi_profile: " + error.message);
    } else {
      alert("Profil Prodi berhasil diperbarui!");
      router.push("/admin/dashboard");
      router.refresh();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center p-6 text-stone-500 gap-2">
        <Loader2 className="w-5 h-5 animate-spin text-amber-800" />
        <span className="text-xs font-semibold">Memuat formulir prodi_profile...</span>
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
          <ArrowLeft className="w-4 h-4" /> Dashboard Admin
        </Link>
        <h1 className="text-xl font-bold text-stone-900 flex items-center gap-2">
          <GraduationCap className="w-5 h-5 text-amber-800" /> Pengaturan Profil Prodi
        </h1>
      </div>

      <form onSubmit={handleSave} className="bg-white p-6 rounded-2xl border border-stone-200 shadow-2xs space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">Judul Halaman</label>
            <input
              type="text"
              value={judulHalaman}
              onChange={(e) => setJudulHalaman(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-800"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">Subjudul Halaman</label>
            <input
              type="text"
              value={subjudul}
              onChange={(e) => setSubjudul(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-800"
            />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-amber-50/50 border border-amber-200 space-y-4">
          <h3 className="text-xs font-bold text-amber-900 uppercase tracking-wider">Informasi Koordinator Program Studi</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Nama Korprodi & Gelar</label>
              <input
                type="text"
                value={namaKorprodi}
                onChange={(e) => setNamaKorprodi(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-amber-800"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Jabatan / Instansi</label>
              <input
                type="text"
                value={jabatanKorprodi}
                onChange={(e) => setJabatanKorprodi(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-amber-800"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">URL Foto Korprodi (Opsional)</label>
            <input
              type="url"
              value={fotoKorprodi}
              onChange={(e) => setFotoKorprodi(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-amber-800"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">Sambutan Korprodi</label>
            <textarea
              rows={4}
              value={sambutan}
              onChange={(e) => setSambutan(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-amber-800"
            ></textarea>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-stone-700 mb-1">Visi Program Studi</label>
          <textarea
            rows={3}
            value={visi}
            onChange={(e) => setVisi(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-800"
          ></textarea>
        </div>

        <div>
          <label className="block text-xs font-bold text-stone-700 mb-1">Misi Program Studi (1 Misi per Baris)</label>
          <textarea
            rows={5}
            value={misiText}
            onChange={(e) => setMisiText(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-800"
          ></textarea>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full py-3 bg-amber-900 hover:bg-amber-800 text-amber-100 font-bold rounded-xl text-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? "Menyimpan ke Supabase..." : "Simpan Pengaturan Profil Prodi"}</span>
        </button>
      </form>
    </div>
  );
}