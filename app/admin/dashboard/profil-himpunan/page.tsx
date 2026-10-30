"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import { ArrowLeft, Users, Plus, Trash2, Edit2, CheckCircle2, Loader2, Calendar, Shield } from "lucide-react";
import Link from "next/link";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function AdminKabinetPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [cabinets, setCabinets] = useState<any[]>([]);
  const [selectedCabinetId, setSelectedCabinetId] = useState<number | null>(null);
  const [members, setMembers] = useState<any[]>([]);

  // State Form Kabinet Baru
  const [period, setPeriod] = useState("");
  const [name, setName] = useState("");
  const [vision, setVision] = useState("");

  // State Form Anggota Pengurus
  const [memberName, setMemberName] = useState("");
  const [position, setPosition] = useState("");
  const [department, setDepartment] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    fetchCabinets();
  }, []);

  useEffect(() => {
    if (selectedCabinetId) {
      fetchMembers(selectedCabinetId);
    }
  }, [selectedCabinetId]);

  async function fetchCabinets() {
    try {
      const { data, error } = await supabase.from("cabinets").select("*").order("id", { ascending: false });
      if (data && data.length > 0) {
        setCabinets(data);
        // Pilih kabinet aktif atau yang pertama secara default
        const activeCab = data.find((c) => c.is_active) || data[0];
        setSelectedCabinetId(activeCab.id);
      }
    } catch (err) {
      console.error("Gagal memuat kabinet:", err);
    } finally {
      setLoading(false);
    }
  }

  async function fetchMembers(cabId: number) {
    try {
      const { data } = await supabase.from("members").select("*").eq("cabinet_id", cabId).order("id", { ascending: true });
      setMembers(data || []);
    } catch (err) {
      console.error("Gagal memuat anggota:", err);
    }
  }

  const handleAddCabinet = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!period || !name) return alert("Periode dan Nama Kabinet wajib diisi!");

    // Jika ini kabinet pertama, jadikan aktif
    const isActive = cabinets.length === 0;

    const { data, error } = await supabase
      .from("cabinets")
      .insert([{ period, name, vision, is_active: isActive }])
      .select()
      .single();

    if (error) {
      alert("Gagal menambah kabinet: " + error.message);
    } else {
      setCabinets([data, ...cabinets]);
      setSelectedCabinetId(data.id);
      setPeriod("");
      setName("");
      setVision("");
      alert("Kabinet baru berhasil ditambahkan!");
    }
  };

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCabinetId) return alert("Pilih atau buat kabinet terlebih dahulu!");
    if (!memberName || !position) return alert("Nama Lengkap dan Jabatan wajib diisi!");

    const payload = {
      cabinet_id: selectedCabinetId,
      name: memberName,
      position: position,
      department: department,
      image_url: imageUrl,
    };

    const { data, error } = await supabase.from("members").insert([payload]).select().single();

    if (error) {
      alert("Gagal menambah pengurus: " + error.message);
    } else {
      setMembers([...members, data]);
      setMemberName("");
      setPosition("");
      setDepartment("");
      setImageUrl("");
    }
  };

  const handleDeleteCabinet = async (id: number) => {
    if (!confirm("Hapus periode kabinet ini beserta seluruh anggotanya?")) return;

    await supabase.from("members").delete().eq("cabinet_id", id);
    const { error } = await supabase.from("cabinets").delete().eq("id", id);

    if (!error) {
      setCabinets(cabinets.filter((c) => c.id !== id));
      const remaining = cabinets.filter((c) => c.id !== id);
      if (remaining.length > 0) setSelectedCabinetId(remaining[0].id);
      else setSelectedCabinetId(null);
    } else {
      alert("Gagal menghapus kabinet: " + error.message);
    }
  };

  const handleDeleteMember = async (id: number) => {
    if (!confirm("Hapus pengurus ini?")) return;
    const { error } = await supabase.from("members").delete().eq("id", id);
    if (!error) {
      setMembers(members.filter((m) => m.id !== id));
    }
  };

  const handleSetActive = async (id: number) => {
    // Nonaktifkan semua, lalu aktifkan yang dipilih
    for (const cab of cabinets) {
      await supabase.from("cabinets").update({ is_active: cab.id === id }).eq("id", cab.id);
    }
    fetchCabinets();
    alert("Status kabinet aktif berhasil diperbarui!");
  };

  const selectedCabinet = cabinets.find((c) => c.id === selectedCabinetId);

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center text-stone-500 gap-2">
        <Loader2 className="w-6 h-6 animate-spin text-amber-800" />
        <span className="text-xs font-semibold">Memuat data kabinet...</span>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-8 bg-stone-50 min-h-screen">
      {/* Top Bar */}
      <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs">
        <Link
          href="/admin/dashboard"
          className="inline-flex items-center gap-2 text-xs font-semibold text-stone-600 hover:text-stone-900 bg-stone-100 px-3 py-2 rounded-xl transition-all"
        >
          <ArrowLeft className="w-4 h-4" /> Kembali ke Dashboard
        </Link>
        <h1 className="text-base font-bold text-stone-900 flex items-center gap-2">
          <Users className="w-5 h-5 text-amber-800" /> Pengaturan Periode & Kabinet Himpunan
        </h1>
      </div>

      {/* SEKSI 1: Daftar Periode Kabinet Terdaftar */}
      <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-2xs space-y-4">
        <h2 className="text-sm font-bold text-stone-900 flex items-center gap-2 border-b pb-3">
          <Calendar className="w-4 h-4 text-amber-800" /> Daftar Periode Kabinet Terdaftar
        </h2>

        {cabinets.length === 0 ? (
          <p className="text-xs text-stone-500 italic py-4">Belum ada periode kabinet terdaftar. Tambahkan melalui form di bawah.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {cabinets.map((cab) => {
              const isSelected = cab.id === selectedCabinetId;
              return (
                <div
                  key={cab.id}
                  className={`p-5 rounded-2xl border transition-all space-y-3 relative ${
                    isSelected ? "border-amber-800 bg-amber-50/40 shadow-xs" : "border-stone-200 bg-white"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold px-2.5 py-1 bg-amber-100 text-amber-900 rounded-lg font-mono">
                      {cab.period}
                    </span>
                    {cab.is_active ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3" /> Aktif Sekarang
                      </span>
                    ) : (
                      <button
                        onClick={() => handleSetActive(cab.id)}
                        className="text-[10px] font-semibold text-stone-500 hover:text-amber-800 underline"
                      >
                        Jadikan Aktif
                      </button>
                    )}
                  </div>

                  <div>
                    <h3 className="font-black text-stone-900 text-base">{cab.name}</h3>
                    <p className="text-xs text-stone-600 mt-0.5 line-clamp-2">{cab.vision || "Belum ada visi utama."}</p>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-stone-200/60">
                    <button
                      onClick={() => setSelectedCabinetId(cab.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                        isSelected ? "bg-amber-900 text-amber-100" : "bg-stone-100 text-stone-700 hover:bg-stone-200"
                      }`}
                    >
                      {isSelected ? "Sedang Dikelola" : "Kelola Anggota Ini"}
                    </button>
                    <button
                      onClick={() => handleDeleteCabinet(cab.id)}
                      className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                      title="Hapus Kabinet"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* SEKSI 2 & 3: Form Tambah Kabinet Baru & Form Tambah Anggota Pengurus */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Form Tambah Periode Kabinet Baru */}
        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-2xs space-y-4">
          <h2 className="text-sm font-bold text-stone-900 border-b pb-3 flex items-center gap-2">
            <Plus className="w-4 h-4 text-amber-800" /> Tambah Periode Kabinet Baru
          </h2>

          <form onSubmit={handleAddCabinet} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Periode Jabatan</label>
              <input
                type="text"
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
                placeholder="misal: 2026/2027"
                className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-800"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Nama Kabinet</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="misal: Kabinet Cipta Karya"
                className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-800"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Visi Utama Kabinet</label>
              <textarea
                rows={3}
                value={vision}
                onChange={(e) => setVision(e.target.value)}
                placeholder="Tuliskan visi singkat kabinet ini"
                className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-800"
              ></textarea>
            </div>
            <button
              type="submit"
              className="w-full py-3 bg-[#8B4513] hover:bg-[#6b3410] text-white font-bold rounded-xl text-sm transition-all shadow-2xs"
            >
              + Simpan Kabinet Baru
            </button>
          </form>
        </div>

        {/* Form Tambah Anggota Pengurus */}
        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b pb-3">
            <h2 className="text-sm font-bold text-stone-900 flex items-center gap-2">
              <Users className="w-4 h-4 text-amber-800" /> Tambah Anggota Pengurus
            </h2>
            {selectedCabinet && (
              <span className="text-[11px] font-bold px-2.5 py-1 bg-amber-100 text-amber-900 rounded-md">
                {selectedCabinet.name} ({selectedCabinet.period})
              </span>
            )}
          </div>

          <form onSubmit={handleAddMember} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Nama Lengkap</label>
                <input
                  type="text"
                  value={memberName}
                  onChange={(e) => setMemberName(e.target.value)}
                  placeholder="Nama Pengurus"
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-800"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Jabatan</label>
                <input
                  type="text"
                  value={position}
                  onChange={(e) => setPosition(e.target.value)}
                  placeholder="misal: Ketua Himpunan"
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-800"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Divisi / Bidang</label>
              <input
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                placeholder="misal: BPH / Kominfo / Pendidikan"
                className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-800"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">URL Foto Pengurus (Opsional)</label>
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://... (link gambar)"
                className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-800"
              />
            </div>

            <button
              type="submit"
              disabled={!selectedCabinetId}
              className="w-full py-3 bg-[#0B5345] hover:bg-[#093e34] text-white font-bold rounded-xl text-sm transition-all shadow-2xs disabled:opacity-50"
            >
              + Tambah Anggota ke Kabinet Terpilih
            </button>
          </form>
        </div>
      </div>

      {/* SEKSI 4: Daftar Pengurus Berdasarkan Kabinet Terpilih */}
      <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-2xs space-y-4">
        <div className="flex items-center justify-between border-b pb-3">
          <h2 className="text-sm font-bold text-stone-900 flex items-center gap-2">
            <Shield className="w-4 h-4 text-amber-800" />
            Daftar Pengurus — {selectedCabinet ? `${selectedCabinet.name} (${selectedCabinet.period})` : "Pilih Kabinet"}
          </h2>
          <span className="text-xs font-bold text-stone-500 bg-stone-100 px-3 py-1 rounded-lg">
            {members.length} anggota terdaftar
          </span>
        </div>

        {members.length === 0 ? (
          <p className="text-xs text-stone-500 italic py-6 text-center">
            Belum ada anggota pengurus ditambahkan pada periode kabinet ini.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {members.map((m) => (
              <div key={m.id} className="p-4 rounded-xl border border-stone-200 bg-stone-50/50 flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-amber-100 border border-amber-800/30 flex items-center justify-center text-amber-900 font-bold overflow-hidden shrink-0">
                    {m.image_url ? (
                      <img src={m.image_url} alt={m.name} className="w-full h-full object-cover" />
                    ) : (
                      m.name?.charAt(0) || "P"
                    )}
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider block">
                      {m.department || "Divisi Umum"}
                    </span>
                    <h4 className="font-bold text-sm text-stone-900 leading-snug">{m.name}</h4>
                    <p className="text-xs text-stone-600 font-medium">{m.position}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleDeleteMember(m.id)}
                  className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-all shrink-0"
                  title="Hapus Pengurus"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}