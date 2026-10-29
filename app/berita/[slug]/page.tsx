import { createClient } from "@/lib/supabase/server";
import { connection } from "next/server";
import { notFound } from "next/navigation";
import Footer from "@/app/components/Footer";
import { Calendar, ArrowLeft, Tag } from "lucide-react";
import Link from "next/link";

export const instant = false;

export default async function ArtikelDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  await connection();
  const { slug } = await params;

  const supabase = await createClient();
  const { data: article } = await supabase
    .from("articles")
    .select("*, categories(nama)")
    .eq("slug", slug)
    .single();

  if (!article) {
    notFound();
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-stone-800">

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 w-full">
        <Link href="/berita" className="inline-flex items-center gap-2 text-xs font-semibold text-stone-600 hover:text-amber-900">
          <ArrowLeft className="w-4 h-4" /> Kembalikan ke Daftar Berita
        </Link>

        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <span className="text-xs bg-amber-100 text-amber-800 border border-amber-300 px-3 py-1 rounded-full font-medium flex items-center gap-1">
              <Tag className="w-3 h-3" />
              {article.categories?.nama || "Umum"}
            </span>
            {article.published_at && (
              <span className="text-xs text-stone-500 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {new Date(article.published_at).toLocaleDateString("id-ID", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            )}
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-stone-900 leading-tight">{article.title}</h1>
        </div>

        {article.cover_image_url && (
          <div className="rounded-2xl overflow-hidden border border-stone-200 shadow-md max-h-[500px]">
            <img src={article.cover_image_url} alt={article.title} className="w-full h-full object-cover" />
          </div>
        )}

        <div className="bg-white border border-stone-200 rounded-2xl p-6 sm:p-8 space-y-4 text-stone-800 leading-relaxed text-base whitespace-pre-line shadow-sm">
          {article.content}
        </div>
      </main>

      <Footer />
    </div>
  );
}
