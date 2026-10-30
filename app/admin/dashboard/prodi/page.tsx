"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { ArrowLeft, Save, GraduationCap, Upload, Loader2 } from "lucide-react";

export default function AdminProdiPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    id: 1,
    sejarah: "",
    visi: "",
    misi: "",
    akreditasi: "A",
    nama_kaprodi: "",
    foto_kaprodi_url: "",
  });

  const supabase = createClient();

  useEffect(() => {
    async function fetchProdi() {
      try {
        const { data, error } = await supabase
          .from("prodi_profile")
          .select("*")
          .single();

        if (data && !error) {
          setFormData({
            id: data.id || 1,
            sejarah: data.sejarah || "",
            visi: data.visi || "",
            misi: data.misi || "",
            akreditasi: data.akreditasi || "A",
            nama_kaprodi: data.nama_kaprodi || "",
            foto_kaprodi_url: data.foto_kaprodi_url || "",
          });
        }
      } catch (err) {
        console.error("Gagal mengambil data prodi:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchProdi();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { error } = await supabase
        .from("prodi_profile")
        .upsert(formData);

      if (error) throw error;
      alert("Profil Prodi berhasil diperbarui!");
    } catch (err: any) {
      alert("Gagal menyimpan: " + err.message);
    } finally {
      setSaving(false);
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
          href="/admin/dashboard"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-600 hover:text-amber-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Kembali ke Dashboard
        </Link>
        <span className="text-xs font-bold bg-amber-100 text-amber-900 px-3 py-1 rounded-full border border-amber-200">
          Tabel: prodi_profile
        </span>
      </div>

      <div className="bg-white p-6 md:p-8 rounded-2xl border border-stone-200 shadow-2xs space-y-6">
        <div className="border-b pb-4">
          <h1 className="text-lg font-bold text-stone-900 flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-amber-800" /> Kelola Profil Prodi PBSI
          </h1>
          <p className="text-xs text-stone-500">Perbarui informasi sejarah, visi misi, dan profil Kaprodi.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Nama Kaprodi / Korprodi</label>
              <input
                type="text"
                value={formData.nama_kaprodi}
                onChange={(e) => setFormData({ ...formData, nama_kaprodi: e.target.value })}
                className="w-full px-3.5 py-2 text-xs border border-stone-300 rounded-xl focus:ring-2 focus:ring-amber-800 focus:outline-none"
                placeholder="Contoh: Dr. Nama Kaprodi, M.Pd."
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Akreditasi Prodi</label>
              <input
                type="text"
                value={formData.akreditasi}
                onChange={(e) => setFormData({ ...formData, akreditasi: e.target.value })}
                className="w-full px-3.5 py-2 text-xs border border-stone-300 rounded-xl focus:ring-2 focus:ring-amber-800 focus:outline-none"
                placeholder="Unggul / A / Baik Sekali"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">URL Foto Kaprodi</label>
            <input
              type="text"
              value={formData.foto_kaprodi_url}
              onChange={(e) => setFormData({ ...formData, foto_kaprodi_url: e.target.value })}
              className="w-full px-3.5 py-2 text-xs border border-stone-300 rounded-xl focus:ring-2 focus:ring-amber-800 focus:outline-none"
              placeholder="https://..."
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">Sejarah Singkat Prodi</label>
            <textarea
              rows={4}
              value={formData.sejarah}
              onChange={(e) => setFormData({ ...formData, sejarah: e.target.value })}
              className="w-full px-3.5 py-2 text-xs border border-stone-300 rounded-xl focus:ring-2 focus:ring-amber-800 focus:outline-none"
              placeholder="Tuliskan sejarah prodi..."
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">Visi Prodi</label>
            <textarea
              rows={3}
              value={formData.visi}
              onChange={(e) => setFormData({ ...formData, visi: e.target.value })}
              className="w-full px-3.5 py-2 text-xs border border-stone-300 rounded-xl focus:ring-2 focus:ring-amber-800 focus:outline-none"
              placeholder="Tuliskan visi..."
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">Misi Prodi</label>
            <textarea
              rows={4}
              value={formData.misi}
              onChange={(e) => setFormData({ ...formData, misi: e.target.value })}
              className="w-full px-3.5 py-2 text-xs border border-stone-300 rounded-xl focus:ring-2 focus:ring-amber-800 focus:outline-none"
              placeholder="Tuliskan misi..."
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full py-2.5 bg-amber-900 hover:bg-amber-800 text-amber-100 rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>Simpan Perubahan Profil Prodi</span>
          </button>
        </form>
      </div>
    </main>
  );
}
