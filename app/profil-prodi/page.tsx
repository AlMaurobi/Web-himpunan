"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import { GraduationCap, Target, Award, UserCheck, ArrowLeft, BookOpen, Loader2 } from "lucide-react";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function ProfilProdiPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const { data: prodi } = await supabase
          .from("prodi_profile")
          .select("*")
          .maybeSingle();

        if (prodi) setData(prodi);
      } catch (err) {
        console.error("Gagal mengambil data prodi_profile:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const judul = data?.judul_halaman || data?.title || "Profil Pendidikan Bahasa & Sastra Indonesia";
  const subjudul = data?.subjudul || data?.subtitle || "Fakultas Keguruan dan Ilmu Pendidikan — Universitas Trunojoyo Madura";
  const korprodiNama = data?.nama_korprodi || data?.head_name || "Koordinator Program Studi";
  const korprodiJabatan = data?.jabatan_korprodi || data?.head_title || "Prodi PBSI FKIP UTM";
  const sambutan = data?.sambutan || data?.welcome_speech || data?.description || "Selamat datang di laman resmi Program Studi Pendidikan Bahasa dan Sastra Indonesia (PBSI) UTM.";
  const visi = data?.visi || data?.vision || '"Menjadi Program Studi Pendidikan Bahasa dan Sastra Indonesia yang unggul, berdaya saing nasional, serta berkarakter kebudayaan pada tahun 2030."';

  let misiList: string[] = [
    "Menyelenggarakan pendidikan dan pembelajaran PBSI yang inovatif dan berbasis teknologi.",
    "Melaksanakan penelitian bidang kebahasaan, kesastraan, dan pengajarannya.",
    "Menyelenggarakan pengabdian masyarakat berbasis keilmuan dan kearifan lokal.",
    "Menjalin kemitraan strategis dengan institusi pendidikan dan lembaga kebudayaan."
  ];

  const rawMisi = data?.misi || data?.mission;
  if (rawMisi) {
    if (Array.isArray(rawMisi)) {
      misiList = rawMisi;
    } else if (typeof rawMisi === "string") {
      misiList = rawMisi.split("\n").filter((m: string) => m.trim().length > 0);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-50 flex flex-col items-center justify-center p-6 text-stone-500 gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-amber-800" />
        <p className="text-xs font-semibold">Memuat data prodi_profile dari Supabase...</p>
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

        <div className="bg-[#2C1810] text-amber-100 p-8 rounded-3xl shadow-md border border-amber-900/40 space-y-3 relative overflow-hidden">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-900/60 border border-amber-700/50 text-xs font-medium text-amber-300">
            <GraduationCap className="w-4 h-4" /> Program Studi PBSI
          </div>
          <h1 className="text-2xl md:text-4xl font-black text-white leading-tight">{judul}</h1>
          <p className="text-xs md:text-sm text-stone-300 max-w-3xl leading-relaxed">{subjudul}</p>
        </div>

        <div className="bg-white p-6 md:p-8 rounded-2xl border border-stone-200 shadow-2xs grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          <div className="flex flex-col items-center text-center space-y-3 border-b md:border-b-0 md:border-r border-stone-200 pb-6 md:pb-0 md:pr-6">
            <div className="w-28 h-28 rounded-full bg-amber-100 border-2 border-amber-800 flex items-center justify-center text-amber-900 font-bold text-2xl overflow-hidden shadow-inner">
              {data?.foto_korprodi || data?.head_image ? (
                <img src={data.foto_korprodi || data.head_image} alt={korprodiNama} className="w-full h-full object-cover" />
              ) : (
                <GraduationCap className="w-12 h-12 text-amber-900/60" />
              )}
            </div>
            <div>
              <h3 className="font-bold text-stone-900 text-sm md:text-base">{korprodiNama}</h3>
              <p className="text-xs text-amber-800 font-medium mt-0.5">{korprodiJabatan}</p>
            </div>
          </div>
          <div className="md:col-span-2 space-y-3">
            <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2 border-b border-stone-100 pb-2">
              <UserCheck className="w-5 h-5 text-amber-800" />
              Sambutan Koordinator Program Studi
            </h2>
            <p className="text-xs md:text-sm text-stone-600 leading-relaxed whitespace-pre-line">{sambutan}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-2xs space-y-3">
            <div className="inline-flex items-center gap-2 text-amber-900 font-bold text-sm">
              <Target className="w-4 h-4 text-amber-800" /> Visi Program Studi
            </div>
            <p className="text-xs md:text-sm text-stone-800 leading-relaxed bg-amber-50/60 p-4 rounded-xl border border-amber-200/80 font-medium italic">
              {visi}
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-2xs space-y-3">
            <div className="inline-flex items-center gap-2 text-amber-900 font-bold text-sm">
              <BookOpen className="w-4 h-4 text-amber-800" /> Misi Program Studi
            </div>
            <ul className="text-xs md:text-sm text-stone-700 space-y-2.5 pl-1 leading-relaxed">
              {misiList.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-900 text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}