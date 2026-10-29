import Link from "next/link";
import { GraduationCap, Target, Award, UserCheck, ArrowLeft } from "lucide-react";

export default function ProfilProdiPage() {
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
            <GraduationCap className="w-4 h-4" /> Program Studi PBSI
          </div>
          <h1 className="text-2xl md:text-4xl font-black text-white">
            Profil Pendidikan Bahasa & Sastra Indonesia
          </h1>
          <p className="text-xs md:text-sm text-stone-300 max-w-3xl leading-relaxed">
            Fakultas Keguruan dan Ilmu Pendidikan — Universitas Trunojoyo Madura
          </p>
        </div>

        {/* Korprodi & Sambutan */}
        <div className="bg-white p-6 md:p-8 rounded-2xl border border-stone-200 shadow-xs grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          <div className="flex flex-col items-center text-center space-y-3 border-b md:border-b-0 md:border-r border-stone-200 pb-6 md:pb-0 md:pr-6">
            <div className="w-28 h-28 rounded-full bg-amber-100 border-2 border-amber-800 flex items-center justify-center text-amber-900 font-bold text-2xl">
              PBSI
            </div>
            <div>
              <h3 className="font-bold text-stone-900 text-sm md:text-base">Koordinator Program Studi</h3>
              <p className="text-xs text-amber-800 font-medium mt-0.5">Prodi PBSI FKIP UTM</p>
            </div>
          </div>
          <div className="md:col-span-2 space-y-3">
            <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-amber-800" />
              Sambutan Koordinator Program Studi
            </h2>
            <p className="text-xs md:text-sm text-stone-600 leading-relaxed">
              Selamat datang di laman resmi Program Studi Pendidikan Bahasa dan Sastra Indonesia (PBSI) Universitas Trunojoyo Madura. Kami berkomitmen untuk menyelenggarakan pendidikan berkualitas tinggi yang mengintegrasikan keilmuan bahasa, sastra, dan pedagogi dengan nilai-nilai kebudayaan serta perkembangan teknologi digital.
            </p>
          </div>
        </div>

        {/* Visi & Misi */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-3">
            <div className="inline-flex items-center gap-2 text-amber-900 font-bold text-sm">
              <Target className="w-4 h-4 text-amber-800" />
              Visi Program Studi
            </div>
            <p className="text-xs md:text-sm text-stone-700 leading-relaxed bg-amber-50/50 p-4 rounded-xl border border-amber-100">
              "Menjadi Program Studi Pendidikan Bahasa dan Sastra Indonesia yang unggul, berdaya saing nasional, serta berkarakter kebudayaan pada tahun 2030."
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-3">
            <div className="inline-flex items-center gap-2 text-amber-900 font-bold text-sm">
              <Award className="w-4 h-4 text-amber-800" />
              Misi Program Studi
            </div>
            <ul className="text-xs md:text-sm text-stone-700 space-y-2 list-disc list-inside leading-relaxed">
              <li>Menyelenggarakan pendidikan dan pembelajaran PBSI yang inovatif dan berbasis teknologi.</li>
              <li>Melaksanakan penelitian bidang kebahasaan, kesastraan, dan pengajarannya.</li>
              <li>Menyelenggarakan pengabdian masyarakat berbasis keilmuan dan kearifan lokal.</li>
              <li>Menjalin kemitraan strategis dengan institusi pendidikan dan lembaga kebudayaan.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}