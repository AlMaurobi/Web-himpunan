"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import { Users, Shield, Calendar, Layers, ArrowLeft, Sparkles, Loader2, User } from "lucide-react";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function ProfilHimpunanPage() {
  const [himpunan, setHimpunan] = useState<any>(null);
  const [pengurus, setPengurus] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const { data: hData } = await supabase
          .from("profil_himpunan")
          .select("*")
          .maybeSingle();

        if (hData) setHimpunan(hData);

        const { data: pData } = await supabase
          .from("pengurus_himpunan")
          .select("*")
          .order("id", { ascending: true });

        if (pData && pData.length > 0) setPengurus(pData);
      } catch (err) {
        console.error("Gagal mengambil data profil himpunan:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const judul = himpunan?.judul_halaman || "Profil Himpunan Mahasiswa PBSI";
  const subjudul = himpunan?.subjudul || "Himpunan Mahasiswa Pendidikan Bahasa dan Sastra Indonesia — Universitas Trunojoyo Madura";
  const periode = himpunan?.periode || "Periode 2025 / 2026";
  const status = himpunan?.status || "Himpunan Mahasiswa Program Studi (HMPS)";
  const visi = himpunan?.visi || '"Terwujudnya HIMAPEBSI sebagai wadah aspirasi, kreasi, dan pengabdian yang proaktif, solid, berbudaya, serta berintegritas tinggi."';

  let misiList: string[] = [
    "Membangun komunikasi harmonis dan inklusif antar-mahasiswa PBSI.",
    "Menyelenggarakan kegiatan kebahasaan, kesastraan, dan seni kebudayaan secara berkelanjutan.",
    "Menampung dan memperjuangkan aspirasi mahasiswa di tingkat jurusan dan fakultas."
  ];

  if (himpunan?.misi) {
    if (Array.isArray(himpunan.misi)) {
      misiList = himpunan.misi;
    } else if (typeof himpunan.misi === "string") {
      misiList = himpunan.misi.split("\n").filter((m: string) => m.trim().length > 0);
    }
  }

  const defaultStruktur = [
    { bidang: "Badan Pengurus Harian", jabatan: "Ketua Umum & Wakil Ketua", deskripsi: "Memimpin & mengoordinasikan seluruh arah kebijakan organisasi." },
    { bidang: "Badan Pengurus Harian", jabatan: "Sekretaris & Bendahara", deskripsi: "Mengelola administrasi, kesekretariatan, dan keuangan himpunan." },
    { bidang: "Divisi Organisasi", jabatan: "Divisi Penalaran & Keorganisasian", deskripsi: "Pengembangan kapasitas akademik dan kepemimpinan anggota." },
    { bidang: "Divisi Organisasi", jabatan: "Divisi Seni & Minat Bakat", deskripsi: "Pengembangan bakat sastra, seni pertunjukan, dan kebudayaan." },
    { bidang: "Divisi Organisasi", jabatan: "Divisi Humas & Media Komunikasi", deskripsi: "Pengelolaan media sosial, kemitraan eksternal, dan publikasi." },
    { bidang: "Divisi Organisasi", jabatan: "Divisi Pengabdian Masyarakat", deskripsi: "Pelaksanaan aksi sosial dan literasi kebahasaan untuk masyarakat." }
  ];

  const listStruktur = pengurus.length > 0 ? pengurus : defaultStruktur;

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-50 flex flex-col items-center justify-center p-6 text-stone-500 gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-amber-800" />
        <p className="text-xs font-semibold">Memuat data Profil Himpunan dari Database...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 py-10 px-4 md:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-stone-600 hover:text-stone-900 bg-white border border-stone-200 px-3.5 py-2 rounded-xl shadow-2xs transition-all"
        >
          <ArrowLeft className="w-4 h-4" /> Kembali ke Beranda
        </Link>

        {/* Header Banner */}
        <div className="bg-[#2C1810] text-amber-100 p-8 rounded-3xl shadow-md border border-amber-900/40 space-y-3 relative overflow-hidden">
          <div className="absolute -right-10 -bottom-10 opacity-10 text-amber-100 pointer-events-none">
            <Users className="w-64 h-64" />
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-900/60 border border-amber-700/50 text-xs font-medium text-amber-300">
            <Users className="w-4 h-4" /> Ormawa HIMAPEBSI
          </div>
          <h1 className="text-2xl md:text-4xl font-black text-white leading-tight">
            {judul}
          </h1>
          <p className="text-xs md:text-sm text-stone-300 max-w-3xl leading-relaxed">
            {subjudul}
          </p>
        </div>

        {/* Periode & Status */}
        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-2xs flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-amber-100 rounded-xl text-amber-900 shrink-0">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-[10px] font-bold text-stone-500 uppercase tracking-wider">Periode Kepengurusan</h3>
              <p className="text-sm md:text-base font-black text-stone-900">{periode}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-amber-100 rounded-xl text-amber-900 shrink-0">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-[10px] font-bold text-stone-500 uppercase tracking-wider">Status Organisasi</h3>
              <p className="text-sm md:text-base font-black text-stone-900">{status}</p>
            </div>
          </div>
        </div>

        {/* Visi & Misi Himpunan */}
        <div className="bg-white p-6 md:p-8 rounded-2xl border border-stone-200 shadow-2xs space-y-4">
          <h2 className="text-lg font-bold text-stone-900 border-b border-stone-100 pb-2 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-800" />
            Visi & Misi HIMAPEBSI
          </h2>
          <div className="space-y-4 text-xs md:text-sm text-stone-700 leading-relaxed">
            <div>
              <span className="font-bold text-stone-900 block mb-1">Visi Organisasi:</span>
              <p className="p-4 bg-amber-50/60 rounded-xl border border-amber-200/80 italic font-medium text-stone-800">
                {visi}
              </p>
            </div>
            <div>
              <span className="font-bold text-stone-900 block mb-2">Misi Utama:</span>
              <ul className="space-y-2 pl-1">
                {misiList.map((misiItem, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-900 text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span>{misiItem}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Struktur Kepengurusan / Struktural */}
        <div className="bg-white p-6 md:p-8 rounded-2xl border border-stone-200 shadow-2xs space-y-6">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <div className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-amber-800" />
              <h2 className="text-lg font-bold text-stone-900">Struktur Kepengurusan (Struktural)</h2>
            </div>
            <span className="text-[11px] text-stone-500 font-medium bg-stone-100 px-2.5 py-1 rounded-lg">
              {listStruktur.length} Divisi / Jabatan
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {listStruktur.map((item: any, idx: number) => {
              const isBph = (item.bidang || "").toLowerCase().includes("harian") || (item.bidang || "").toLowerCase().includes("bph");
              return (
                <div
                  key={idx}
                  className={`p-4 rounded-xl border transition-all space-y-2 ${
                    isBph
                      ? "bg-amber-50/70 border-amber-200/90 shadow-2xs"
                      : "bg-stone-50/60 border-stone-200"
                  }`}
                >
                  {item.foto_url && (
                    <div className="w-12 h-12 rounded-full overflow-hidden border border-amber-800/20 mb-2">
                      <img src={item.foto_url} alt={item.nama || item.jabatan} className="w-full h-full object-cover" />
                    </div>
                  )}
                  <span className={`text-[10px] font-bold uppercase tracking-wider block ${
                    isBph ? "text-amber-800" : "text-stone-500"
                  }`}>
                    {item.bidang || "Divisi Organisasi"}
                  </span>
                  <h4 className="font-bold text-sm text-stone-900 leading-snug">
                    {item.jabatan || item.nama}
                  </h4>
                  {(item.nama_anggota || item.deskripsi) && (
                    <p className="text-xs text-stone-600 leading-relaxed">
                      {item.nama_anggota || item.deskripsi}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}