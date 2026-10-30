"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import { ArrowLeft, Save, Users, Plus, Trash2, Loader2, Layers } from "lucide-react";
import Link from "next/link";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function AdminProfilHimpunanPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [judulHalaman, setJudulHalaman] = useState("");
  const [subjudul, setSubjudul] = useState("");
  const [periode, setPeriode] = useState("");
  const [status, setStatus] = useState("");
  const [visi, setVisi] = useState("");
  const [misiText, setMisiText] = useState("");

  const [membersList, setMembersList] = useState<any[]>([]);
  const [newDepartment, setNewDepartment] = useState("Divisi Organisasi");
  const [newPosition, setNewPosition] = useState("");
  const [newName, setNewName] = useState("");

  useEffect(() => {
    async function fetchData() {
      const { data: cData } = await supabase.from("cabinets").select("*").maybeSingle();
      if (cData) {
        setJudulHalaman(cData.name || cData.judul_halaman || "");
        setSubjudul(cData.description || cData.subjudul || "");
        setPeriode(cData.period || cData.periode || "");
        setStatus(cData.status || "");
        setVisi(cData.vision || cData.visi || "");

        const rawMisi = cData.mission || cData.misi;
        if (Array.isArray(rawMisi)) {
          setMisiText(rawMisi.join("\n"));
        } else if (typeof rawMisi === "string") {
          setMisiText(rawMisi);
        }
      }

      const { data: mData } = await supabase.from("members").select("*").order("id", { ascending: true });
      if (mData) setMembersList(mData);

      setLoading(false);
    }
    fetchData();
  }, []);

  const handleSaveKabinet = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const misiArray = misiText.split("\n").filter((item) => item.trim().length > 0);

    const payload = {
      name: judulHalaman,
      description: subjudul,
      period: periode,
      status: status,
      vision: visi,
      mission: misiArray,
      updated_at: new Date().toISOString(),
    };

    const { data: existing } = await supabase.from("cabinets").select("id").maybeSingle();

    let error = null;
    if (existing?.id) {
      const res = await supabase.from("cabinets").update(payload).eq("id", existing.id);
      error = res.error;
    } else {
      const res = await supabase.from("cabinets").insert([payload]);
      error = res.error;
    }

    setSaving(false);

    if (error) {
      alert("Gagal menyimpan ke tabel cabinets: " + error.message);
    } else {
      alert("Tabel cabinets berhasil diperbarui!");
      router.refresh();
    }
  };

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPosition.trim()) return alert("Nama Jabatan / Divisi wajib diisi!");

    const payload = {
      department: newDepartment,
      position: newPosition,
      name: newName,
    };

    const { data, error } = await supabase.from("members").insert([payload]).select().single();

    if (error) {
      alert("Gagal menambah ke tabel members: " + error.message);
    } else {
      setMembersList([...membersList, data]);
      setNewPosition("");
      setNewName("");
    }
  };

  const handleDeleteMember = async (id: number) => {
    if (!confirm("Hapus anggota/divisi ini dari tabel members?")) return;

    const { error } = await supabase.from("members").delete().eq("id", id);
    if (error) {
      alert("Gagal menghapus: " + error.message);
    } else {
      setMembersList(membersList.filter((item) => item.id !== id));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center p-6 text-stone-500 gap-2">
        <Loader2 className="w-5 h-5 animate-spin text-amber-800" />
        <span className="text-xs font-semibold">Memuat formulir cabinets & members...</span>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="flex items-center justify-between">
        <Link
          href="/admin/dashboard"
          className="inline-flex items-center gap-2 text-xs font-semibold text-stone-600 hover:text-stone-900 bg-white border border-stone-200 px-3 py-2 rounded-xl"
        >
          <ArrowLeft className="w-4 h-4" /> Dashboard Admin
        </Link>
        <h1 className="text-xl font-bold text-stone-900 flex items-center gap-2">
          <Users className="w-5 h-5 text-amber-800" /> Pengaturan Profil Himpunan & Periode
        </h1>
      </div>

      <form onSubmit={handleSaveKabinet} className="bg-white p-6 rounded-2xl border border-stone-200 shadow-2xs space-y-5">
        <h2 className="text-sm font-bold text-stone-900 border-b pb-2">1. Informasi Kabinet (cabinets)</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">Nama Halaman / Kabinet</label>
            <input
              type="text"
              value={judulHalaman}
              onChange={(e) => setJudulHalaman(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-800"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">Periode Kepengurusan (period)</label>
            <input
              type="text"
              value={periode}
              onChange={(e) => setPeriode(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-800"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">Deskripsi Ringkas</label>
            <input
              type="text"
              value={subjudul}
              onChange={(e) => setSubjudul(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-800"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">Status Organisasi</label>
            <input
              type="text"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-800"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-stone-700 mb-1">Visi Kabinet (vision)</label>
          <textarea
            rows={3}
            value={visi}
            onChange={(e) => setVisi(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-800"
          ></textarea>
        </div>

        <div>
          <label className="block text-xs font-bold text-stone-700 mb-1">Misi Kabinet (mission - 1 per baris)</label>
          <textarea
            rows={4}
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
          <span>{saving ? "Menyimpan..." : "Simpan Ke Tabel cabinets"}</span>
        </button>
      </form>

      <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-2xs space-y-6">
        <h2 className="text-sm font-bold text-stone-900 border-b pb-2 flex items-center gap-2">
          <Layers className="w-4 h-4 text-amber-800" /> 2. Kelola Anggota / Struktural (members)
        </h2>

        <form onSubmit={handleAddMember} className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-3">
          <h3 className="text-xs font-bold text-stone-700">Tambah Anggota / Jabatan ke Tabel members</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-stone-600 mb-1">Departemen / Bidang</label>
              <select
                value={newDepartment}
                onChange={(e) => setNewDepartment(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-stone-300 text-xs bg-white focus:outline-none"
              >
                <option value="Badan Pengurus Harian">Badan Pengurus Harian</option>
                <option value="Divisi Organisasi">Divisi Organisasi</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-stone-600 mb-1">Jabatan (position)</label>
              <input
                type="text"
                value={newPosition}
                onChange={(e) => setNewPosition(e.target.value)}
                placeholder="Ketua / Kadiv / Anggota"
                className="w-full px-3 py-2 rounded-lg border border-stone-300 text-xs bg-white focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-stone-600 mb-1">Nama Anggota / Deskripsi</label>
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Nama Mahasiswa / Tugas"
                className="w-full px-3 py-2 rounded-lg border border-stone-300 text-xs bg-white focus:outline-none"
              />
            </div>
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-amber-800 hover:bg-amber-700 text-amber-100 font-bold rounded-lg text-xs transition-all flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" /> Tambah ke Members
          </button>
        </form>

        <div className="space-y-2">
          <h3 className="text-xs font-bold text-stone-700">Daftar Anggota di Tabel members ({membersList.length})</h3>
          {membersList.length === 0 ? (
            <p className="text-xs text-stone-500 italic p-4 text-center">Tabel members masih kosong.</p>
          ) : (
            <div className="divide-y divide-stone-200 border rounded-xl overflow-hidden">
              {membersList.map((item) => (
                <div key={item.id} className="p-3 bg-white flex items-center justify-between gap-3 text-xs">
                  <div>
                    <span className="text-[10px] font-bold uppercase text-amber-800">
                      {item.department || item.bidang || "Divisi"}
                    </span>
                    <h4 className="font-bold text-stone-900 text-sm">
                      {item.position || item.jabatan || "Pengurus"}
                    </h4>
                    <p className="text-stone-500">{item.name || item.nama_anggota || item.deskripsi}</p>
                  </div>
                  <button
                    onClick={() => handleDeleteMember(item.id)}
                    className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}