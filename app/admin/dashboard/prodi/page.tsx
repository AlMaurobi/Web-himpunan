"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { compressImage } from "@/lib/utils/image-compressor";
import { Building2, Save, Loader2, Upload } from "lucide-react";

export default function ProdiAdminPage() {
  const [sejarah, setSejarah] = useState("");
  const [visi, setVisi] = useState("");
  const [misi, setMisi] = useState("");
  const [akreditasi, setAkreditasi] = useState("Unggul");
  const [namaKaprodi, setNamaKaprodi] = useState("");
  const [fotoKaprodi, setFotoKaprodi] = useState<File | null>(null);
  const [currentFotoUrl, setCurrentFotoUrl] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [prodiId, setProdiId] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);

  const supabase = createClient();

  useEffect(() => {
    loadProdiData();
  }, []);

  async function loadProdiData() {
    const { data } = await supabase.from("prodi_profile").select("*").limit(1).single();
    if (data) {
      setProdiId(data.id);
      setSejarah(data.sejarah || "");
      setVisi(data.visi || "");
      setMisi(Array.isArray(data.misi) ? data.misi.join("\n") : "");
      setAkreditasi(data.akreditasi || "Unggul");
      setNamaKaprodi(data.nama_kaprodi || "");
      setCurrentFotoUrl(data.foto_kaprodi_url || null);
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMsg(null);

    try {
      let fotoUrl = currentFotoUrl;

      if (fotoKaprodi) {
        const compressed = await compressImage(fotoKaprodi);
        const fileName = `kaprodi-${Date.now()}.webp`;
        const { error: uploadErr } = await supabase.storage.from("members").upload(fileName, compressed, {
          contentType: "image/webp",
        });
        if (uploadErr) throw uploadErr;
        const { data } = supabase.storage.from("members").getPublicUrl(fileName);
        fotoUrl = data.publicUrl;
      }

      const misiArray = misi.split("\n").filter((m) => m.trim() !== "");

      if (prodiId) {
        const { error } = await supabase.from("prodi_profile").update({
          sejarah,
          visi,
          misi: misiArray,
          akreditasi,
          nama_kaprodi: namaKaprodi,
          foto_kaprodi_url: fotoUrl,
        }).eq("id", prodiId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("prodi_profile").insert({
          sejarah,
          visi,
          misi: misiArray,
          akreditasi,
          nama_kaprodi: namaKaprodi,
          foto_kaprodi_url: fotoUrl,
        });
        if (error) throw error;
      }

      setMsg("Data profil prodi berhasil diperbarui!");
      loadProdiData();
    } catch (err: any) {
      setMsg(`Gagal menyimpan data: ${err.message}`);
    }
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-stone-900 flex items-center gap-2">
          <Building2 className="w-6 h-6 text-amber-800" />
          <span>Kelola Profil Program Studi</span>
        </h1>
        <p className="text-stone-600 text-sm mt-1">
          Perbarui informasi resmi Program Studi (Sejarah, Visi-Misi, Akreditasi, dan Kaprodi)
        </p>
      </div>

      {msg && (
        <div className="p-4 bg-emerald-100 border border-emerald-300 text-emerald-800 text-sm rounded-xl font-medium">
          {msg}
        </div>
      )}

      <form onSubmit={handleSave} className="bg-white border border-stone-200/80 rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-stone-700 mb-2">Nama Kepala Program Studi (Kaprodi)</label>
            <input
              type="text"
              required
              value={namaKaprodi}
              onChange={(e) => setNamaKaprodi(e.target.value)}
              placeholder="misal: Dr. Nama Kaprodi, M.Pd."
              className="w-full px-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-stone-800 text-sm focus:outline-none focus:ring-2 focus:ring-amber-800 focus:border-transparent transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-stone-700 mb-2">Akreditasi Prodi</label>
            <select
              value={akreditasi}
              onChange={(e) => setAkreditasi(e.target.value)}
              className="w-full px-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-stone-800 text-sm focus:outline-none focus:ring-2 focus:ring-amber-800 focus:border-transparent transition-all"
            >
              <option value="Unggul">Unggul</option>
              <option value="A">A</option>
              <option value="Baik Sekali">Baik Sekali</option>
              <option value="B">B</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-stone-700 mb-2">Foto Resmi Kaprodi</label>
          <div className="flex items-center gap-4">
            {currentFotoUrl && (
              <img src={currentFotoUrl} alt="Foto Kaprodi" className="w-16 h-16 rounded-xl object-cover border border-stone-300 shadow-sm" />
            )}
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFotoKaprodi(e.target.files?.[0] || null)}
              className="text-xs text-stone-600 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-amber-100 file:text-amber-900 hover:file:bg-amber-200 cursor-pointer"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-stone-700 mb-2">Sejarah Singkat Prodi</label>
          <textarea
            required
            rows={3}
            value={sejarah}
            onChange={(e) => setSejarah(e.target.value)}
            placeholder="Tuliskan latar belakang singkat berdirinya program studi..."
            className="w-full px-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-stone-800 text-sm focus:outline-none focus:ring-2 focus:ring-amber-800 focus:border-transparent transition-all"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-stone-700 mb-2">Visi Program Studi</label>
          <textarea
            required
            rows={2}
            value={visi}
            onChange={(e) => setVisi(e.target.value)}
            placeholder="Visi prodi..."
            className="w-full px-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-stone-800 text-sm focus:outline-none focus:ring-2 focus:ring-amber-800 focus:border-transparent transition-all"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-stone-700 mb-2">Misi Program Studi (1 Poin Per Baris)</label>
          <textarea
            required
            rows={5}
            value={misi}
            onChange={(e) => setMisi(e.target.value)}
            placeholder="Pisahkan setiap poin misi dengan menekan Enter (baris baru)"
            className="w-full px-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-stone-800 text-sm focus:outline-none focus:ring-2 focus:ring-amber-800 focus:border-transparent transition-all"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-amber-800 hover:bg-amber-900 disabled:bg-amber-800/50 text-amber-50 font-semibold rounded-xl shadow-md shadow-amber-950/20 transition-all flex items-center justify-center gap-2 text-sm"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
          <span>Simpan Perubahan Profil Prodi</span>
        </button>
      </form>
    </div>
  );
}
