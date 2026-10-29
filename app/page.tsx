import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { connection } from "next/server";
import { ArrowRight, BookOpen, Award, Newspaper, Users, Calendar } from "lucide-react";

export const instant = false;

export default async function HomePage() {
  await connection();
  const supabase = await createClient();

  const [{ data: articles }, { data: activeCabinet }, { data: prodi }] = await Promise.all([
    supabase
      .from("articles")
      .select("id, title, slug, excerpt, cover_image_url, published_at, categories(nama)")
      .eq("status", "published")
      .order("published_at", { ascending: false })
      .limit(3),
    supabase.from("cabinets").select("*").eq("is_active", true).limit(1).single(),
    supabase.from("prodi_profile").select("*").limit(1).single(),
  ]);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-stone-800">
      

      {/* Hero Section */}
      <section className="relative py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full text-center space-y-6 scroll-mt-20" id="profil-prodi" >
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-100 border border-amber-300/80 text-amber-900 text-xs font-semibold shadow-sm">
          <Award className="w-4 h-4 text-amber-700" />
          <span>Program Studi Akreditasi {prodi?.akreditasi || "Unggul"}</span>
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-stone-900 max-w-4xl mx-auto leading-tight">
          Pendidikan Bahasa & Sastra Indonesia
        </h1>

        <p className="text-stone-600 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
          Menyatukan Bahasa, Memperdayakan Budaya.
        </p>
        <p className="text-stone-600 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
          Portal resmi integrasi civitas akademika dan Himpunan Mahasiswa PBSI.
        </p>


        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <Link
            href="/berita"
            className="px-6 py-3 bg-amber-800 hover:bg-amber-900 text-amber-50 font-medium rounded-xl shadow-md shadow-amber-900/20 transition-all flex items-center gap-2"
          >
            <span>Jelajahi Berita & Kegiatan</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/prodi"
            className="px-6 py-3 bg-white border border-stone-300 hover:bg-stone-100 text-stone-800 font-medium rounded-xl transition-all shadow-sm"
          >
            Profil Program Studi
          </Link>
        </div>
      </section>

      {/* Ringkasan Prodi & Himpunan */}
      <section className="py-12 bg-amber-100/40 border-y border-amber-200/60 scroll-mt-20 scroll-mt-20" id="profil-himpunan"   >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 bg-white border border-stone-200/80 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-amber-100 text-amber-800 rounded-xl flex items-center justify-center mb-4 border border-amber-300/60">
              <BookOpen className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-stone-900 mb-2">Akademik & Kesusastraan</h3>
            <p className="text-stone-600 text-sm leading-relaxed">
              Mengembangkan kompetensi kebahasaan, kesastraan, dan kependidikan secara bermartabat dan ilmiah.
            </p>
          </div>

          <div className="p-6 bg-white border border-stone-200/80 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-800 rounded-xl flex items-center justify-center mb-4 border border-emerald-300/60">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-stone-900 mb-2">
              {activeCabinet?.nama_kabinet || "Himpunan Mahasiswa"}
            </h3>
            <p className="text-stone-600 text-sm leading-relaxed">
              Periode {activeCabinet?.periode || "2025/2026"}. {activeCabinet?.visi || "Wadah aspirasi dan kreasi mahasiswa."}
            </p>
          </div>

          <div className="p-6 bg-white border border-stone-200/80 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-orange-100 text-orange-800 rounded-xl flex items-center justify-center mb-4 border border-orange-300/60">
              <Newspaper className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-stone-900 mb-2">Publikasi & Karya</h3>
            <p className="text-stone-600 text-sm leading-relaxed">
              Informasi terkini kegiatan kemahasiswaan, agenda program studi, seminar, dan esai sastra.
            </p>
          </div>
        </div>
      </section>

      {/* Berita Terbaru */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full space-y-8 scroll-mt-20" id="profil-prodi" >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-stone-900">Berita & Kegiatan Terbaru</h2>
            <p className="text-stone-600 text-sm mt-1">Liputan kegiatan terbaru dari prodi dan himpunan</p>
          </div>
          <Link href="/berita" className="text-sm font-semibold text-amber-800 hover:text-amber-900 flex items-center gap-1">
            Lihat Semua <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {!articles || articles.length === 0 ? (
          <div className="bg-white border border-stone-200 rounded-2xl p-12 text-center text-stone-500 shadow-sm">
            Belum ada berita yang dipublikasikan.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {articles.map((art: any) => (
              <div key={art.id} className="bg-white border border-stone-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col group">
                {art.cover_image_url && (
                  <div className="overflow-hidden h-48 bg-stone-100">
                    <img src={art.cover_image_url} alt={art.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  </div>
                )}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs bg-amber-100 text-amber-800 border border-amber-300/80 px-2.5 py-0.5 rounded-full font-medium">
                        {art.categories?.nama || "Umum"}
                      </span>
                      {art.published_at && (
                        <span className="text-xs text-stone-500 flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(art.published_at).toLocaleDateString("id-ID")}
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg font-bold text-stone-900 line-clamp-2 group-hover:text-amber-800 transition-colors">{art.title}</h3>
                    <p className="text-xs text-stone-600 line-clamp-3 leading-relaxed">{art.excerpt}</p>
                  </div>
                  <Link href={`/berita/${art.slug}`} className="text-xs font-semibold text-amber-800 hover:text-amber-900 flex items-center gap-1 pt-2">
                    Baca Selengkapnya <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      
    </div>
  );
}

