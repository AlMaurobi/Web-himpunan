import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { connection } from "next/server";
import { Newspaper, Calendar, ArrowRight, Image as ImageIcon } from "lucide-react";

export const instant = false;

export default async function BeritaListPage() {
  await connection();
  const supabase = await createClient();

  const { data: articles } = await supabase
    .from("articles")
    .select("id, title, slug, excerpt, cover_image_url, published_at, categories(nama)")
    .eq("status", "published")
    .order("published_at", { ascending: false });

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-stone-800">
      

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 w-full">
        <div>
          <h1 className="text-3xl font-extrabold text-stone-900 flex items-center gap-3">
            <Newspaper className="w-8 h-8 text-amber-800" />
            <span>Berita & Kegiatan Himpunan</span>
          </h1>
          <p className="text-stone-600 text-sm mt-1">Dapatkan kabar dan dokumentasi kegiatan terbaru seputar prodi & himpunan</p>
        </div>

        {!articles || articles.length === 0 ? (
          <div className="bg-white border border-stone-200 rounded-2xl p-12 text-center text-stone-400 shadow-sm">
            Belum ada berita yang dipublikasikan.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {articles.map((art: any) => (
              <div key={art.id} className="bg-white border border-stone-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col group">
                {art.cover_image_url ? (
                  <div className="overflow-hidden h-48 bg-stone-100">
                    <img src={art.cover_image_url} alt={art.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  </div>
                ) : (
                  <div className="w-full h-48 bg-stone-100 flex items-center justify-center text-stone-400">
                    <ImageIcon className="w-8 h-8" />
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
      </main>

      
    </div>
  );
}

