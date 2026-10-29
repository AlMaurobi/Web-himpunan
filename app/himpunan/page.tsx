import { createClient } from "@/lib/supabase/server";
import { connection } from "next/server";
import { Users, Award } from "lucide-react";

export const instant = false;

export default async function HimpunanPublicPage() {
  await connection();
  const supabase = await createClient();

  const { data: cabinet } = await supabase.from("cabinets").select("*").eq("is_active", true).limit(1).single();

  let members: any[] = [];
  if (cabinet?.id) {
    const { data: mData } = await supabase
      .from("members")
      .select("*")
      .eq("cabinet_id", cabinet.id)
      .order("urutan", { ascending: true });
    if (mData) members = mData;
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-stone-800">
      

      <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12 w-full">
        {/* Header Kabinet */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-800 text-xs font-semibold shadow-sm">
            <Award className="w-4 h-4 text-emerald-700" />
            <span>Periode {cabinet?.periode || "2025/2026"}</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-stone-900">
            {cabinet?.nama_kabinet || "Himpunan Mahasiswa PBSI"}
          </h1>
          <p className="text-stone-600 text-base leading-relaxed">{cabinet?.visi || "Wadah aspirasi dan kreasi pengurus himpunan."}</p>
        </div>

        {/* List Pengurus */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-stone-900 flex items-center gap-2 border-b border-stone-200 pb-3">
            <Users className="w-5 h-5 text-amber-800" />
            <span>Struktur Kepengurusan</span>
          </h2>

          {members.length === 0 ? (
            <div className="bg-white border border-stone-200 rounded-2xl p-12 text-center text-stone-400 shadow-sm">
              Data susunan pengurus belum diunggah dari admin.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {members.map((m) => (
                <div key={m.id} className="bg-white border border-stone-200 rounded-2xl p-5 text-center space-y-3 shadow-sm hover:shadow-md transition-all">
                  {m.foto_url ? (
                    <img src={m.foto_url} alt={m.nama_lengkap} className="w-24 h-24 rounded-full object-cover mx-auto border-2 border-amber-700/30 shadow-sm" />
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-amber-100 text-amber-900 flex items-center justify-center mx-auto font-bold text-xl border border-amber-200">
                      {m.nama_lengkap[0]}
                    </div>
                  )}
                  <div>
                    <h3 className="font-bold text-stone-900 text-sm line-clamp-1">{m.nama_lengkap}</h3>
                    <p className="text-xs text-amber-800 font-semibold mt-0.5">{m.jabatan}</p>
                    <p className="text-xs text-stone-500">{m.divisi}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      
    </div>
  );
}

