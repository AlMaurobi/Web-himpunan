"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { compressImage } from "@/lib/utils/image-compressor";
import { ArrowLeft, Save, Users, Plus, Trash2, Loader2, Upload } from "lucide-react";

export default function AdminKabinetPage() {
  const [loading, setLoading] = useState(true);
  const [savingCabinet, setSavingCabinet] = useState(false);
  const [savingMember, setSavingMember] = useState(false);

  // Data Kabinet
  const [cabinet, setCabinet] = useState({
    id: 1,
    periode: "2025/2026",
    nama_kabinet: "",
    visi: "",
    misi: "",
    logo_url: "",
    is_active: true,
  });
  const [logoFile, setLogoFile] = useState<File | null>(null);

  // Data Members
  const [members, setMembers] = useState<any[]>([]);

  // Form Member Baru
  const [namaLengkap, setNamaLengkap] = useState("");
  const [jabatan, setJabatan] = useState("");
  const [divisi, setDivisi] = useState("BPH");
  const [fotoUrlInput, setFotoUrlInput] = useState("");
  const [fotoFile, setFotoFile] = useState<File | null>(null);

  const supabase = createClient();

  const fetchData = async () => {
    try {
      // Fetch Kabinet Aktif
      const { data: cabData } = await supabase
        .from("cabinets")
        .select("*")
        .eq("is_active", true)
        .single();

      if (cabData) {
        setCabinet({
          id: cabData.id || 1,
          periode: cabData.periode || "2025/2026",
          nama_kabinet: cabData.nama_kabinet || "",
          visi: cabData.visi || "",
          misi: cabData.misi || "",
          logo_url: cabData.logo_url || cabData.foto_url || "",
          is_active: true,
        });
      }

      // Fetch Members
      const { data: memData } = await supabase
        .from("members")
        .select("*")
        .order("id", { ascending: true });

      if (memData) setMembers(memData);
    } catch (err: any) {
      console.error("Gagal memuat data kabinet:", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Simpan Informasi Kabinet + Logo
  const handleSaveCabinet = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingCabinet(true);
    try {
      let finalLogoUrl = cabinet.logo_url;

      if (logoFile) {
        const compressedBlob = await compressImage(logoFile);
        const fileName = `cabinet-logo-${Date.now()}.webp`;

        const { error: uploadError } = await supabase.storage
          .from("members")
          .upload(fileName, compressedBlob, {
            contentType: "image/webp",
            upsert: true,
          });

        if (uploadError) throw uploadError;

        const { data: publicUrlData } = supabase.storage
          .from("members")
          .getPublicUrl(fileName);

        finalLogoUrl = publicUrlData.publicUrl;
      }

      const { error } = await supabase.from("cabinets").upsert({
        ...cabinet,
        logo_url: finalLogoUrl,
      });

      if (error) throw error;
      setCabinet((prev) => ({ ...prev, logo_url: finalLogoUrl }));
      alert("Data & Logo Kabinet berhasil diperbarui!");
    } catch (err: any) {
      alert("Gagal menyimpan kabinet: " + err.message);
    } finally {
      setSavingCabinet(false);
    }
  };

  // Tambah Member / Pengurus Baru
  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!namaLengkap || !jabatan) {
      alert("Harap isi Nama Lengkap dan Jabatan.");
      return;
    }

    setSavingMember(true);
    try {
      let finalFotoUrl = fotoUrlInput;

      if (fotoFile) {
        const compressedBlob = await compressImage(fotoFile);
        const fileName = `member-${Date.now()}.webp`;

        const { error: uploadError } = await supabase.storage
          .from("members")
          .upload(fileName, compressedBlob, {
            contentType: "image/webp",
            upsert: true,
          });

        if (uploadError) throw uploadError;

        const { data: publicUrlData } = supabase.storage
          .from("members")
          .getPublicUrl(fileName);

        finalFotoUrl = publicUrlData.publicUrl;
      }

      if (!finalFotoUrl) {
        finalFotoUrl = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400";
      }

      const { error } = await supabase.from("members").insert([
        {
          nama_lengkap: namaLengkap,
          jabatan,
          divisi,
          foto_url: finalFotoUrl,
          cabinet_id: cabinet.id || 1,
        },
      ]);

      if (error) throw error;

      alert("Pengurus berhasil ditambahkan!");
      setNamaLengkap("");
      setJabatan("");
      setFotoUrlInput("");
      setFotoFile(null);
      fetchData();
    } catch (err: any) {
      alert("Gagal menambah pengurus: " + err.message);
    } finally {
      setSavingMember(false);
    }
  };

  // Hapus Member
  const handleDeleteMember = async (id: number, name: string) => {
    if (!confirm(`Hapus pengurus "${name}"?`)) return;
    const { error } = await supabase.from("members").delete().eq("id", id);
    if (!error) {
      setMembers(members.filter((m) => m.id !== id));
      alert("Pengurus berhasil dihapus.");
    } else {
      alert("Gagal menghapus: " + error.message);
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
    <main className="p-4 md:p-8 max-w-5xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <Link
          href="/admin/dashboard"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-600 hover:text-amber-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Kembali ke Dashboard
        </Link>
        <span className="text-xs font-bold bg-amber-100 text-amber-900 px-3 py-1 rounded-full border border-amber-200">
          Tabel: cabinets & members
        </span>
      </div>

      {/* SECTION 1: INFORMASI KABINET */}
      <div className="bg-white p-6 md:p-8 rounded-2xl border border-stone-200 shadow-2xs space-y-6">
        <div className="border-b pb-4">
          <h1 className="text-lg font-bold text-stone-900 flex items-center gap-2">
            <Users className="w-5 h-5 text-amber-800" /> Informasi Kabinet Aktif
          </h1>
          <p className="text-xs text-stone-500">Kelola Periode, Nama Kabinet, Logo, Visi, dan Misi Himpunan.</p>
        </div>

        <form onSubmit={handleSaveCabinet} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Nama Kabinet</label>
              <input
                type="text"
                required
                value={cabinet.nama_kabinet}
                onChange={(e) => setCabinet({ ...cabinet, nama_kabinet: e.target.value })}
                placeholder="Contoh: Kabinet Arunika Cita"
                className="w-full px-3.5 py-2 text-xs border border-stone-300 rounded-xl focus:ring-2 focus:ring-amber-800 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Periode Jabatan</label>
              <input
                type="text"
                required
                value={cabinet.periode}
                onChange={(e) => setCabinet({ ...cabinet, periode: e.target.value })}
                placeholder="2025/2026"
                className="w-full px-3.5 py-2 text-xs border border-stone-300 rounded-xl focus:ring-2 focus:ring-amber-800 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">Upload Logo / Foto Kabinet (WebP Auto)</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => e.target.files && setLogoFile(e.target.files[0])}
              className="w-full text-xs text-stone-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-amber-100 file:text-amber-900 hover:file:bg-amber-200"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">Visi Kabinet</label>
            <textarea
              rows={3}
              value={cabinet.visi}
              onChange={(e) => setCabinet({ ...cabinet, visi: e.target.value })}
              placeholder="Tuliskan visi kabinet..."
              className="w-full px-3.5 py-2 text-xs border border-stone-300 rounded-xl focus:ring-2 focus:ring-amber-800 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">Misi Kabinet</label>
            <textarea
              rows={4}
              value={cabinet.misi}
              onChange={(e) => setCabinet({ ...cabinet, misi: e.target.value })}
              placeholder="Tuliskan misi kabinet..."
              className="w-full px-3.5 py-2 text-xs border border-stone-300 rounded-xl focus:ring-2 focus:ring-amber-800 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={savingCabinet}
            className="w-full py-2.5 bg-amber-900 hover:bg-amber-800 text-amber-100 rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-2xs transition-all disabled:opacity-50"
          >
            {savingCabinet ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>Simpan Informasi Kabinet</span>
          </button>
        </form>
      </div>

      {/* SECTION 2: KELOLA ANGGOTA PENGURUS */}
      <div className="bg-white p-6 md:p-8 rounded-2xl border border-stone-200 shadow-2xs space-y-6">
        <div className="border-b pb-4">
          <h2 className="text-base font-bold text-stone-900 flex items-center gap-2">
            <Plus className="w-4 h-4 text-amber-800" /> Tambah Anggota Pengurus Baru
          </h2>
          <p className="text-xs text-stone-500">Foto pengurus otomatis dikompresi ke WebP saat diunggah.</p>
        </div>

        <form onSubmit={handleAddMember} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Nama Lengkap</label>
              <input
                type="text"
                required
                value={namaLengkap}
                onChange={(e) => setNamaLengkap(e.target.value)}
                placeholder="Nama Pengurus"
                className="w-full px-3.5 py-2 text-xs border border-stone-300 rounded-xl focus:ring-2 focus:ring-amber-800 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Jabatan</label>
              <input
                type="text"
                required
                value={jabatan}
                onChange={(e) => setJabatan(e.target.value)}
                placeholder="Ketua Umum / Sekretaris / Anggota"
                className="w-full px-3.5 py-2 text-xs border border-stone-300 rounded-xl focus:ring-2 focus:ring-amber-800 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Divisi / Departemen</label>
              <input
                type="text"
                required
                value={divisi}
                onChange={(e) => setDivisi(e.target.value)}
                placeholder="BPH / Kominfo / Pendidikan"
                className="w-full px-3.5 py-2 text-xs border border-stone-300 rounded-xl focus:ring-2 focus:ring-amber-800 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Unggah Foto (WebP Auto)</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => e.target.files && setFotoFile(e.target.files[0])}
                className="w-full text-xs text-stone-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-amber-100 file:text-amber-900 hover:file:bg-amber-200"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Atau URL Foto Eksternal</label>
              <input
                type="text"
                value={fotoUrlInput}
                onChange={(e) => setFotoUrlInput(e.target.value)}
                placeholder="https://..."
                className="w-full px-3.5 py-2 text-xs border border-stone-300 rounded-xl focus:ring-2 focus:ring-amber-800 focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={savingMember}
            className="w-full py-2.5 bg-stone-900 hover:bg-stone-800 text-stone-100 rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-2xs transition-all disabled:opacity-50"
          >
            {savingMember ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
            <span>Tambah Anggota Pengurus</span>
          </button>
        </form>

        {/* DAFTAR ANGGOTA */}
        <div className="pt-6 border-t border-stone-200 space-y-3">
          <h3 className="text-xs font-bold text-stone-800 uppercase tracking-wider">
            Daftar Anggota Terdaftar ({members.length})
          </h3>

          {members.length === 0 ? (
            <p className="text-xs text-stone-500 italic">Belum ada pengurus terdaftar.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {members.map((m) => (
                <div
                  key={m.id}
                  className="p-3 bg-stone-50 rounded-xl border border-stone-200 flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <img
                      src={m.foto_url || m.image_url}
                      alt={m.nama_lengkap || m.name}
                      className="w-9 h-9 rounded-full object-cover shrink-0 border border-amber-800/30"
                    />
                    <div className="min-w-0">
                      <p className="font-bold text-stone-900 text-xs truncate">{m.nama_lengkap || m.name}</p>
                      <p className="text-[10px] text-stone-500 truncate">{m.jabatan || m.position}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteMember(m.id, m.nama_lengkap || m.name)}
                    className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all shrink-0"
                    title="Hapus"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
