"use client";

import Link from "next/link";
import ShareButton from "@/components/ShareButton";

interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  cover_url?: string;
  created_at: string;
}

export default function ArticleCard({ article }: { article: Article }) {
  return (
    <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between">
      <div>
        {article.cover_url && (
          <img
            src={article.cover_url}
            alt={article.title}
            className="w-full h-48 object-cover"
          />
        )}
        <div className="p-4 space-y-2">
          <span className="inline-block px-2.5 py-1 bg-amber-100 text-amber-900 rounded-lg text-[10px] font-bold">
            Berita & Artikel
          </span>
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

      <div className="p-4 pt-0 flex items-center justify-between border-t border-stone-100 mt-2">
        <Link
          href={`/berita/${article.slug}`}
          className="text-xs font-bold text-amber-900 hover:underline inline-flex items-center gap-1"
        >
          Baca Selengkapnya →
        </Link>
        <ShareButton title={article.title} slug={article.slug} />
      </div>
    </div>
  );
}
