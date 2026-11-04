import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Calendar, Tag } from "lucide-react";
import { connection } from "next/server";
import ShareButton from "@/components/ShareButton";

export default async function DetailBeritaPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  await connection();
  const { slug } = await params;
  const supabase = await createClient();

  const { data: article } = await supabase
    .from("articles")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!article) {
    notFound();
  }

  const formattedDate = new Date(article.created_at).toLocaleDateString("id-ID", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="min-h-screen bg-[#FAF8F5] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <Link
            href="/berita"
            className="inline-flex items-center gap-2 text-xs font-semibold text-stone-600 hover:text-amber-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembalikan ke Daftar Berita</span>
          </Link>
          <ShareButton title={article.title} slug={article.slug} />
        </div>

        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-3 text-xs text-stone-500">
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-amber-100 text-amber-900 rounded-full font-bold">
              <Tag className="w-3 h-3" />
              <span>Umum</span>
            </span>
            <span className="inline-flex items-center gap-1.5 font-medium">
              <Calendar className="w-3.5 h-3.5 text-stone-400" />
              <span>{formattedDate}</span>
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 leading-tight">
            {article.title}
          </h1>
        </div>

        {article.cover_url && (
          <div className="rounded-3xl overflow-hidden border border-stone-200 shadow-md">
            <img
              src={article.cover_url}
              alt={article.title}
              className="w-full max-h-[480px] object-cover"
            />
          </div>
        )}

        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-xs space-y-6">
          <div className="prose prose-stone max-w-none text-stone-700 text-sm sm:text-base leading-relaxed whitespace-pre-line">
            {article.content}
          </div>

          <div className="pt-6 border-t border-stone-100 flex items-center justify-between">
            <span className="text-xs font-medium text-stone-500">
              Sukai atau bagikan berita ini kepada rekan civitas akademika:
            </span>
            <ShareButton title={article.title} slug={article.slug} />
          </div>
        </div>
      </div>
    </div>
  );
}