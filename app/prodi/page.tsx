import { createClient } from "@/lib/supabase/server";
import { connection } from "next/server";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import { Building2, Award, CheckCircle2, UserCheck } from "lucide-react";

export const instant = false;

export default async function ProdiPublicPage() {
  await connection();
  const supabase = await createClient();

  const { data: prodi } = await supabase.from("prodi_profile").select("*").limit(1).single();

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-stone-800">
      <Navbar />

      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12 w-full">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-100 border border-amber-300/80 text-amber-900 text-xs font-semibold shadow-sm">
            <Award className="w-4 h-4 text-amber-700" />
            <span>Akreditasi {prodi?.akreditasi || "Unggul"}</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-stone-900">
            Program Studi Pendidikan Bahasa & Sastra Indonesia
          </h1>
        </div>

        {/* Kaprodi Card & Sejarah */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          <div className="bg-white border border-stone-200 rounded-2xl p-6 text-center space-y-4 shadow-sm">
            {prodi?.foto_kaprodi_url ? (
              <img
                src={prodi.foto_kaprodi_url}
                alt={prodi.nama_kaprodi}
                className="w-32 h-32 rounded-2xl object-cover mx-auto border-2 border-amber-700/30 shadow-md"
              />
            ) : (
              <div className="w-32 h-32 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center mx-auto">
                <UserCheck className="w-12 h-12" />
              </div>
            )}
            <div>
              <h3 className="font-bold text-stone-900 text-base">{prodi?.nama_kaprodi || "Kepala Program Studi"}</h3>
              <p className="text-xs text-amber-800 font-semibold mt-0.5">Koordinator Program Studi</p>
            </div>
          </div>

          <div className="md:col-span-2 bg-white border border-stone-200 rounded-2xl p-6 space-y-3 shadow-sm">
            <h2 className="text-xl font-bold text-stone-900 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-amber-800" />
              <span>Sejarah Program Studi</span>
            </h2>
            <p className="text-stone-600 text-sm leading-relaxed whitespace-pre-line">
              {prodi?.sejarah || "Informasi sejarah program studi sedang diperbarui."}
            </p>
          </div>
        </div>

        {/* Visi & Misi */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white border border-stone-200 rounded-2xl p-6 space-y-3 shadow-sm">
            <h3 className="text-lg font-bold text-amber-900">Visi Program Studi</h3>
            <p className="text-stone-700 text-sm leading-relaxed">{prodi?.visi || "Menjadi program studi yang unggul dan berdaya saing."}</p>
          </div>

          <div className="bg-white border border-stone-200 rounded-2xl p-6 space-y-3 shadow-sm">
            <h3 className="text-lg font-bold text-emerald-900">Misi Program Studi</h3>
            <ul className="space-y-2 text-stone-700 text-sm">
              {Array.isArray(prodi?.misi) && prodi.misi.length > 0 ? (
                prodi.misi.map((m: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                    <span>{m}</span>
                  </li>
                ))
              ) : (
                <li className="text-stone-400">Misi program studi belum dimasukkan.</li>
              )}
            </ul>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
