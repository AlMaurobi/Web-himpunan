"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { compressImage } from "@/lib/utils/image-compressor";
import { Plus, Users, Award, Loader2, Trash2, Edit3, X, CheckCircle2 } from "lucide-react";

export default function KabinetAdminPage() {
  const [cabinets, setCabinets] = useState<any[]>([]);
  const [members, setMembers] = useState<any[]>([]);
  const [activeCabinetId, setActiveCabinetId] = useState<string>("");

  // Form Tambah Kabinet Baru
  const [periode, setPeriode] = useState("");
  const [namaKabinet, setNamaKabinet] = useState("");
  const [visi, setVisi] = useState("");

  // Form Edit Kabinet
  const [editingCabinet, setEditingCabinet] = useState<any | null>(null);
  const [editPeriode, setEditPeriode] = useState("");
  const [editNamaKabinet, setEditNamaKabinet] = useState("");
  const [editVisi, setEditVisi] = useState("");
  const [editIsActive, setEditIsActive] = useState(false);

  // Form Anggota Pengurus Baru
  const [namaLengkap, setNamaLengkap] = useState("");
  const [jabatan, setJabatan] = useState("");
  const [divisi, setDivisi] = useState("");
  const [foto, setFoto] = useState<File | null>(null);

  const [loadingCabinet, setLoadingCabinet] = useState(false);
  const [savingEditCabinet, setSavingEditCabinet] = useState(false);
  const [loadingMember, setLoadingMember] = useState(false);
  const [deletingCabinetId, setDeletingCabinetId] = useState<string | null>(null);
  const [deletingMemberId, setDeletingMemberId] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);

  const supabase = createClient();

  useEffect(() => {
    loadCabinets();
  }, []);

  async function loadCabinets() {
    const { data } = await supabase.from("cabinets").select("*").order("periode", { ascending: false });
    if (data && data.length > 0) {
      setCabinets(data);
      if (!activeCabinetId) {
        const active = data.find((c) => c.is_active) || data[0];
        setActiveCabinetId(active.id);
        loadMembers(active.id);
      } else {
        loadMembers(activeCabinetId);
      }
    } else {
      setCabinets([]);
      setMembers([]);
    }
  }

  async function loadMembers(cabinetId: string) {
    const { data } = await supabase
      .from("members")
      .select("*")
      .eq("cabinet_id", cabinetId)
      .order("urutan", { ascending: true });
    if (data) setMembers(data);
    else setMembers([]);
  }

  const handleSelectCabinet = (id: string) => {
    setActiveCabinetId(id);
    loadMembers(id);
  };

  const handleTambahKabinet = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingCabinet(true);
    setMsg(null);

    const { error } = await supabase.from("cabinets").insert({
      periode,
      nama_kabinet: namaKabinet,
      visi,
      misi: JSON.stringify(["Mewujudkan organisasi yang inklusif dan kolaboratif"]),
      is_active: cabinets.length === 0,
    });

    if (error) {
      setMsg(`Gagal menambah kabinet: ${error.message}`);
    } else {
      setPeriode("");
      setNamaKabinet("");
      setVisi("");
      setMsg("Kabinet baru berhasil ditambahkan!");
      loadCabinets();
    }
    setLoadingCabinet(false);
  };

  const handleOpenEditModal = (cab: any) => {
    setEditingCabinet(cab);
    setEditPeriode(cab.periode || "");
    setEditNamaKabinet(cab.nama_kabinet || "");
    setEditVisi(cab.visi || "");
    setEditIsActive(cab.is_active || false);
  };

  const handleSaveEditKabinet = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCabinet) return;

    setSavingEditCabinet(true);
    setMsg(null);

    try {
      if (editIsActive) {
        await supabase.from("cabinets").update({ is_active: false }).neq("id", editingCabinet.id);
      }

      const { error } = await supabase
        .from("cabinets")
        .update({
          periode: editPeriode,
          nama_kabinet: editNamaKabinet,
          visi: editVisi,
          is_active: editIsActive,
        })
        .eq("id", editingCabinet.id);

      if (error) throw error;

      setMsg("Data periode kabinet berhasil diperbarui!");
      setEditingCabinet(null);
      loadCabinets();
    } catch (err: any) {
      setMsg(`Gagal memperbarui kabinet: ${err.message}`);
    }

    setSavingEditCabinet(false);
  };

  const handleHapusKabinet = async (cabId: string, cabNama: string) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus "${cabNama}" beserta seluruh data anggota di dalamnya?`)) return;

    setDeletingCabinetId(cabId);
    setMsg(null);

    try {
      await supabase.from("members").delete().eq("cabinet_id", cabId);
      const { error } = await supabase.from("cabinets").delete().eq("id", cabId);
      if (error) throw error;

      setMsg(`Kabinet "${cabNama}" berhasil dihapus.`);
      if (activeCabinetId === cabId) {
        setActiveCabinetId("");
      }
      loadCabinets();
    } catch (err: any) {
      setMsg(`Gagal menghapus kabinet: ${err.message}`);
    }

    setDeletingCabinetId(null);
  };

  const handleTambahAnggota = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeCabinetId) {
      setMsg("Silakan buat atau pilih kabinet terlebih dahulu!");
      return;
    }

    setLoadingMember(true);
    setMsg(null);

    try {
      let fotoUrl = "";
      if (foto) {
        const compressed = await compressImage(foto);
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.webp`;
        const { error: uploadError } = await supabase.storage.from("members").upload(fileName, compressed, {
          contentType: "image/webp",
        });
        if (uploadError) throw uploadError;
        const { data } = supabase.storage.from("members").getPublicUrl(fileName);
        fotoUrl = data.publicUrl;
      }

      const { error } = await supabase.from("members").insert({
        cabinet_id: activeCabinetId,
        nama_lengkap: namaLengkap,
        jabatan,
        divisi,
        foto_url: fotoUrl || null,
      });

      if (error) throw error;

      setNamaLengkap("");
      setJabatan("");
      setDivisi("");
      setFoto(null);
      setMsg("Anggota pengurus berhasil ditambahkan!");
      loadMembers(activeCabinetId);
    } catch (err: any) {
      setMsg(`Gagal menambah anggota: ${err.message}`);
    }
    setLoadingMember(false);
  };

  const handleHapusAnggota = async (id: string, fotoUrl?: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus anggota ini?")) return;

    setDeletingMemberId(id);

    try {
      if (fotoUrl) {
        const fileName = fotoUrl.split("/").pop();
        if (fileName) {
          await supabase.storage.from("members").remove([fileName]);
        }
      }

      const { error } = await supabase.from("members").delete().eq("id", id);
      if (error) throw error;

      setMembers(members.filter((m) => m.id !== id));
      setMsg("Anggota berhasil dihapus.");
    } catch (err: any) {
      setMsg(`Gagal menghapus anggota: ${err.message}`);
    }

    setDeletingMemberId(null);
  };

  const activeCabinetObj = cabinets.find((c) => c.id === activeCabinetId);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold text-stone-900">Kelola Kabinet & Pengurus</h1>
        <p className="text-stone-600 text-sm mt-1">
          Manajemen periode kepengurusan, edit periode kabinet, dan anggota himpunan
        </p>
      </div>

      {msg && (
        <div className="p-4 bg-emerald-100 border border-emerald-300 text-emerald-800 text-sm rounded-xl font-medium">
          {msg}
        </div>
      )}

      {/* Daftar Kabinet Terdaftar */}
      <div className="bg-white border border-stone-200/80 rounded-2xl p-6 shadow-sm space-y-4">
        <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2">
          <Award className="w-5 h-5 text-amber-800" />
          <span>Daftar Periode Kabinet Terdaftar</span>
        </h2>

        {cabinets.length === 0 ? (
          <p className="text-stone-500 text-sm">Belum ada kabinet terdaftar. Silakan tambahkan kabinet baru di bawah.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {cabinets.map((cab) => {
              const isSelected = cab.id === activeCabinetId;
              return (
                <div
                  key={cab.id}
                  className={`p-4 rounded-xl border transition-all flex flex-col justify-between space-y-3 ${
                    isSelected
                      ? "bg-amber-50/80 border-amber-800/60 ring-2 ring-amber-800/20 shadow-sm"
                      : "bg-stone-50 border-stone-200 hover:border-stone-300"
                  }`}
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-amber-900 bg-amber-100 px-2.5 py-0.5 rounded-full border border-amber-200">
                        {cab.periode}
                      </span>
                      {cab.is_active ? (
                        <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-300">
                          Aktif Sekarang
                        </span>
                      ) : (
                        <span className="text-[11px] font-medium text-stone-500 bg-stone-200 px-2 py-0.5 rounded-full">
                          Arsip
                        </span>
                      )}
                    </div>
                    <h3 className="font-extrabold text-stone-900 text-base">{cab.nama_kabinet}</h3>
                    <p className="text-xs text-stone-600 line-clamp-2">{cab.visi}</p>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-stone-200/80">
                    <button
                      onClick={() => handleSelectCabinet(cab.id)}
                      className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-colors ${
                        isSelected
                          ? "bg-amber-800 text-white"
                          : "bg-stone-200 hover:bg-stone-300 text-stone-800"
                      }`}
                    >
                      {isSelected ? "Kelola Anggota Ini" : "Pilih Kabinet Ini"}
                    </button>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleOpenEditModal(cab)}
                        className="p-1.5 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded-lg transition-colors"
                        title="Edit Kabinet"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleHapusKabinet(cab.id, cab.nama_kabinet)}
                        disabled={deletingCabinetId === cab.id}
                        className="p-1.5 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-colors disabled:opacity-50"
                        title="Hapus Kabinet"
                      >
                        {deletingCabinetId === cab.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Form Tambah Kabinet & Anggota */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white border border-stone-200/80 rounded-2xl p-6 space-y-4 shadow-sm">
          <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2">
            <Plus className="w-5 h-5 text-amber-800" />
            <span>Tambah Periode Kabinet Baru</span>
          </h2>
          <form onSubmit={handleTambahKabinet} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Periode Jabatan</label>
              <input
                type="text"
                required
                value={periode}
                onChange={(e) => setPeriode(e.target.value)}
                placeholder="misal: 2026/2027"
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-stone-800 text-sm focus:outline-none focus:ring-2 focus:ring-amber-800"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Nama Kabinet</label>
              <input
                type="text"
                required
                value={namaKabinet}
                onChange={(e) => setNamaKabinet(e.target.value)}
                placeholder="misal: Kabinet Cipta Karya"
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-stone-800 text-sm focus:outline-none focus:ring-2 focus:ring-amber-800"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Visi Utama Kabinet</label>
              <textarea
                required
                rows={2}
                value={visi}
                onChange={(e) => setVisi(e.target.value)}
                placeholder="Tuliskan visi singkat kabinet ini"
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-stone-800 text-sm focus:outline-none focus:ring-2 focus:ring-amber-800"
              />
            </div>
            <button
              type="submit"
              disabled={loadingCabinet}
              className="w-full py-2.5 bg-amber-800 hover:bg-amber-900 text-amber-50 font-semibold text-sm rounded-xl flex items-center justify-center gap-2 shadow-sm"
            >
              {loadingCabinet ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
              <span>Simpan Kabinet Baru</span>
            </button>
          </form>
        </div>

        <div className="bg-white border border-stone-200/80 rounded-2xl p-6 space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2">
              <Users className="w-5 h-5 text-emerald-800" />
              <span>Tambah Anggota Pengurus</span>
            </h2>
            {activeCabinetObj && (
              <span className="text-xs bg-amber-100 text-amber-900 px-2.5 py-0.5 rounded-full font-bold">
                {activeCabinetObj.nama_kabinet}
              </span>
            )}
          </div>

          <form onSubmit={handleTambahAnggota} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Nama Lengkap</label>
                <input
                  type="text"
                  required
                  value={namaLengkap}
                  onChange={(e) => setNamaLengkap(e.target.value)}
                  placeholder="Nama Pengurus"
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-stone-800 text-sm focus:outline-none focus:ring-2 focus:ring-amber-800"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Jabatan</label>
                <input
                  type="text"
                  required
                  value={jabatan}
                  onChange={(e) => setJabatan(e.target.value)}
                  placeholder="misal: Ketua Himpunan"
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-stone-800 text-sm focus:outline-none focus:ring-2 focus:ring-amber-800"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Divisi / Bidang</label>
              <input
                type="text"
                required
                value={divisi}
                onChange={(e) => setDivisi(e.target.value)}
                placeholder="misal: BPH / Kominfo / Pendidikan"
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-stone-800 text-sm focus:outline-none focus:ring-2 focus:ring-amber-800"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Foto Pengurus</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setFoto(e.target.files?.[0] || null)}
                className="w-full text-xs text-stone-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-amber-100 file:text-amber-900 hover:file:bg-amber-200 cursor-pointer"
              />
            </div>
            <button
              type="submit"
              disabled={loadingMember || !activeCabinetId}
              className="w-full py-2.5 bg-emerald-800 hover:bg-emerald-900 disabled:bg-stone-300 text-emerald-50 font-semibold text-sm rounded-xl flex items-center justify-center gap-2 shadow-sm"
            >
              {loadingMember ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
              <span>Tambah Anggota ke Kabinet Terpilih</span>
            </button>
          </form>
        </div>
      </div>

      {/* Tabel Anggota Pengurus */}
      <div className="bg-white border border-stone-200/80 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-stone-900">
            Daftar Pengurus — {activeCabinetObj ? activeCabinetObj.nama_kabinet : "Pilih Kabinet"} ({activeCabinetObj?.periode || "-"})
          </h3>
          <span className="text-xs text-stone-500 font-medium">{members.length} anggota terdaftar</span>
        </div>

        {members.length === 0 ? (
          <p className="text-stone-500 text-sm">Belum ada anggota pengurus ditambahkan pada periode kabinet ini.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {members.map((m) => (
              <div key={m.id} className="p-4 bg-stone-50 border border-stone-200 rounded-xl flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  {m.foto_url ? (
                    <img src={m.foto_url} alt={m.nama_lengkap} className="w-12 h-12 rounded-full object-cover border border-stone-300 shadow-sm" />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-900 flex items-center justify-center font-bold border border-amber-200">
                      {m.nama_lengkap[0]}
                    </div>
                  )}
                  <div>
                    <p className="font-bold text-sm text-stone-900">{m.nama_lengkap}</p>
                    <p className="text-xs text-amber-800 font-semibold">{m.jabatan}</p>
                    <p className="text-xs text-stone-500">{m.divisi}</p>
                  </div>
                </div>

                <button
                  onClick={() => handleHapusAnggota(m.id, m.foto_url)}
                  disabled={deletingMemberId === m.id}
                  className="p-1.5 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-colors shrink-0"
                  title="Hapus Pengurus"
                >
                  {deletingMemberId === m.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal Edit Kabinet */}
      {editingCabinet && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-stone-200 rounded-2xl max-w-lg w-full p-6 space-y-6 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-stone-200 pb-4">
              <h3 className="text-lg font-extrabold text-stone-900 flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-amber-800" />
                <span>Edit Periode Kabinet</span>
              </h3>
              <button
                onClick={() => setEditingCabinet(null)}
                className="p-1 text-stone-400 hover:text-stone-800 rounded-lg hover:bg-stone-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEditKabinet} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Periode Jabatan</label>
                <input
                  type="text"
                  required
                  value={editPeriode}
                  onChange={(e) => setEditPeriode(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-stone-800 text-sm focus:outline-none focus:ring-2 focus:ring-amber-800"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Nama Kabinet</label>
                <input
                  type="text"
                  required
                  value={editNamaKabinet}
                  onChange={(e) => setEditNamaKabinet(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-stone-800 text-sm focus:outline-none focus:ring-2 focus:ring-amber-800"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Visi Utama Kabinet</label>
                <textarea
                  required
                  rows={3}
                  value={editVisi}
                  onChange={(e) => setEditVisi(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-stone-800 text-sm focus:outline-none focus:ring-2 focus:ring-amber-800"
                />
              </div>

              <div className="flex items-center gap-3 p-3 bg-amber-50 rounded-xl border border-amber-200">
                <input
                  type="checkbox"
                  id="is_active_checkbox"
                  checked={editIsActive}
                  onChange={(e) => setEditIsActive(e.target.checked)}
                  className="w-4 h-4 text-amber-800 focus:ring-amber-800 rounded cursor-pointer"
                />
                <label htmlFor="is_active_checkbox" className="text-xs font-bold text-amber-900 cursor-pointer">
                  Jadikan Kabinet Aktif Periode Ini (Tampil di Web Publik)
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingCabinet(null)}
                  className="px-4 py-2 border border-stone-300 text-stone-700 text-sm font-semibold rounded-xl hover:bg-stone-100"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={savingEditCabinet}
                  className="px-5 py-2 bg-amber-800 hover:bg-amber-900 text-amber-50 text-sm font-semibold rounded-xl shadow-sm flex items-center gap-2"
                >
                  {savingEditCabinet ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4" />
                  )}
                  <span>Simpan Perubahan</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
