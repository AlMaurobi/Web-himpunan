"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import { Users, Shield, Calendar, Layers, ArrowLeft } from "lucide-react";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function ProfilHimpunanPage() {
  const [himpunan, setHimpunan] = useState<any>(null);
  const [pengurus, setPengurus] = useState<any[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const { data: hData } = await supabase.from("profil_himpunan").select("*").maybeSingle();
        if (hData) setHimpunan(hData);

        const { data: pData } = await supabase.from("pengurus_himpunan").select("*").order("id", { ascending: true });
        if (pData && pData.length > 0) setPengurus(pData);
      } catch (e) {
        console.error("Gagal memuat profil himpunan:", e);
      }
    }
    fetchData();
  }, []);

  const periode = himpunan?.periode || "Periode 2025 / 2026";
  const status = himpunan?.status || "Himpunan Mahasiswa Program Studi (HMPS)";
  const visi = himpunan?.visi || '"Terwujudnya HIMAPEBSI sebagai wadah aspirasi, kreasi, dan pengabdian yang proaktif, solid, berbudaya, serta berintegritas tinggi."';
  
  let misiList: string[] = [
    "Membangun komunikasi harmonis dan inklusif antar-mahasiswa PBSI.",
    "Menyelenggarakan kegiatan kebahasaan, kesastraan, dan seni kebudayaan secara berkelanjutan.",
    "Menampung dan memperjuangkan aspirasi mahasiswa di tingkat jurusan dan fakultas."
  ];

  if (himpunan?.misi) {
    misiList = Array.isArray(himpunan.misi)
      ? himpunan.misi
      : typeof himpunan.misi === "string"
      ? himpunan.misi.split("\n").filter((item: string) => item.trim().length > 0)
      : misiList;
  }

  const defaultPengurus = [
    { bidang: "Badan Pengurus Harian", jabatan: "Ketua Umum & Wakil Ketua", deskripsi: "Memimpin & mengoordinasikan seluruh arah kebijakan organisasi." },
    { bidang: "Badan Pengurus Harian", jabatan: "Sekretaris & Bendahara", deskripsi: "Mengelola administrasi, kesekretariatan, dan keuangan himpunan." },
    { bidang: "Divisi Organisasi", jabatan: "Divisi Penalaran & Keorganisasian", deskripsi: "Pengembangan kapasitas akademik dan kepemimpinan anggota." },
    { bidang: "Divisi Organisasi", jabatan: "Divisi Seni & Minat Bakat", deskripsi: "Pengembangan bakat sastra, seni pertunjukan, dan kebudayaan." },
    { bidang: "Divisi Organisasi", jabatan: "Divisi Humas & Media Komunikasi", deskripsi: "Pengelolaan media sosial, kemitraan eksternal, dan publikasi." },
    { bidang: "Divisi Organisasi", jabatan: "Divisi Pengabdian Masyarakat", deskripsi: "Pelaksanaan aksi sosial dan literasi kebahasaan untuk masyarakat." }
  ];

  const listStruktur = pengurus.length > 0 ? pengurus : defaultPengurus;

  return (
    <div className="min-h-screen bg-stone-50 py-12 px-4 md:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-stone-600 hover:text-stone-900 bg-white border border-stone-200 px-3 py-2 rounded-xl"
        >
          <ArrowLeft className="w-4 h-4" /> Kembali ke Beranda
        </Link>

        {/* Header Section */}
        <div className="bg-[#2C1810] text-amber-100 p-8 rounded-3xl shadow-md border border-amber-900/40 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-900/60 border border-amber-700/50 text-xs font-medium text-amber-300">
            <Users className="w-4 h-4" /> Ormawa HIMAPEBSI
          </div>
          <h1 className="text-2xl md:text-4xl font-black text-white">
            {himpunan?.judul_halaman || "Profil Himpunan Mahasiswa PBSI"}
          </h1>
          <p className="text-xs md:text-sm text-stone-300 max-w-3xl leading-relaxed">
            {himpunan?.subjudul || "Himpunan Mahasiswa Pendidikan Bahasa dan Sastra Indonesia — Universitas Trunojoyo Madura"}
          </p>
        </div>

        {/* Periode & Identitas */}
        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-amber-100 rounded-xl text-amber-900">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-stone-500 uppercase tracking-wider">Periode Kepengurusan</h3>
              <p className="text-base font-black text-stone-900">{periode}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-amber-100 rounded-xl text-amber-900">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-stone-500 uppercase tracking-wider">Status Organisasi</h3>
              <p className="text-base font-black text-stone-900">{status}</p>
            </div>
          </div>
        </div>

        {/* Visi Misi Himpunan */}
        <div className="bg-white p-6 md:p-8 rounded-2xl border border-stone-200 shadow-xs space-y-4">
          <h2 className="text-lg font-bold text-stone-900 border-b pb-2 flex items-center gap-2">
            <Shield className="w-5 h-5 text-amber-800" />
            Visi & Misi HIMAPEBSI
          </h2>
          <div className="space-y-3 text-xs md:text-sm text-stone-700 leading-relaxed">
            <p className="font-semibold text-stone-900">Visi:</p>
            <p className="p-4 bg-stone-50 rounded-xl border border-stone-200 italic">
              {visi}
            </p>
            <p className="font-semibold text-stone-900 pt-2">Misi Utama:</p>
            <ul className="list-disc list-inside space-y-1.5 pl-2">
              {misiList.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Struktur Organisasi / Struktural */}
        <div className="bg-white p-6 md:p-8 rounded-2xl border border-stone-200 shadow-xs space-y-6">
          <div className="flex items-center gap-2 border-b pb-3">
            <Layers className="w-5 h-5 text-amber-800" />
            <h2 className="text-lg font-bold text-stone-900">Struktur Kepengurusan (Struktural)</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {listStruktur.map((item: any, idx: number) => (
              <div 
                key={idx} 
                className={`p-4 rounded-xl border space-y-1 ${
                  item.bidang?.includes("Harian") ? "bg-amber-50/60 border-amber-200" : "bg-stone-50 border-stone-200"
                }`}
              >
                <span className={`text-[10px] font-bold uppercase tracking-wider ${
                  item.bidang?.includes("Harian") ? "text-amber-800" : "text-stone-500"
                }`}>
                  {item.bidang || "Divisi Organisasi"}
                </span>
                <h4 className="font-bold text-sm text-stone-900">{item.jabatan || item.nama}</h4>
                <p className="text-xs text-stone-600">{item.deskripsi || item.nama_anggota}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}