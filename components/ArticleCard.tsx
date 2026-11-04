"use client";

import Link from "next/link";
import ShareButton from "@/components/ShareButton";

interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  cover_url?: string;
  image_url?: string;
  cover?: string;
  created_at: string;
}

export default function ArticleCard({ article }: { article: Article }) {
  const imageUrl = article.cover_url || article.image_url || article.cover;
  const formattedDate = new Date(article.created_at).toLocaleDateString("id-ID");

  return (
    <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between">
      <div>
        {imageUrl && (
          <img
            src={imageUrl}
            alt={article.title}
            className="w-full h-48 object-cover"
          />
        )}
        <div className="p-4 space-y-3">
          {/* Metadata Row: Kategori, Tanggal, dan Tombol Share (Area Lingkaran Merah) */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="inline-block px-2.5 py-1 bg-amber-100 text-amber-900 rounded-lg text-[10px] font-bold">
                Umum
              </span>
              <span className="text-[11px] text-stone-400 font-medium">
                {formattedDate}
              </span>
            </div>
            <ShareButton title={article.title} slug={article.slug} />
          </div>

          <h3 className="font-bold text-stone-800 text-sm line-clamp-2">
            {article.title}
          </h3>
          {article.excerpt && (
            <p className="text-stone-600 text-xs line-clamp-2">
              {article.excerpt}
            </p>
          )}
        </div>
      </div>

      <div className="p-4 pt-0 mt-2">
        <Link
          href={`/berita/${article.slug}`}
          className="text-xs font-bold text-amber-900 hover:underline inline-flex items-center gap-1"
        >
          Baca Selengkapnya →
        </Link>
      </div>
    </div>
  );
}