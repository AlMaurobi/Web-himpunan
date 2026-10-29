import { createClient } from "@supabase/supabase-js";
import Link from "next/link";
import { ArrowLeft, Calendar, Tag, Share2 } from "lucide-react";
import ShareButtons from "@/app/components/ShareButtons";
import { notFound } from "next/navigation";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function generateStaticParams() {
  const { data: artikel } = await supabase.from("artikel").select("id");
  return (artikel || []).map((item) => ({ id: item.id.toString() }));
}

export default async function DetailArtikelPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const { data: artikel, error } = await supabase
    .from("artikel")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !artikel) {
    notFound();
  }

  const formattedDate = new Date(artikel.created_at).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  // Renderer paragraf & auto-link detector
  const renderFormattedContent = (content: string) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return content.split("\n").map((paragraph, pIdx) => {
      if (!paragraph.trim()) return null;
      const parts = paragraph.split(urlRegex);
      return (
        <p key={pIdx} className="mb-4 text-stone-700 leading-relaxed text-sm md:text-base">
          {parts.map((part, i) => {
            if (part.match(urlRegex)) {
              return (
                <a
                  key={i}
                  href={part}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-amber-800 hover:text-amber-900 underline font-medium break-all"
                >
                  {part}
                </a>
              );
            }
            return part;
          })}
        </p>
      );
    });
  };

  return (
    <main className="min-h-screen bg-[#FFFDF9] py-10 px-4 md:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <Link
          href="/#berita"
          className="inline-flex items-center gap-2 text-xs font-bold text-stone-600 hover:text-amber-900 transition-all bg-white px-4 py-2 rounded-xl border border-stone-200/80 shadow-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembalikan ke Daftar Berita</span>
        </Link>

        <header className="space-y-3">
          <div className="flex flex-wrap items-center gap-3 text-xs text-stone-500">
            <span className="px-3 py-1 bg-amber-100/80 text-amber-900 font-semibold rounded-full flex items-center gap-1">
              <Tag className="w-3 h-3" />
              {artikel.kategori}
            </span>
            <span className="flex items-center gap-1 font-medium">
              <Calendar className="w-3.5 h-3.5 text-stone-400" />
              {formattedDate}
            </span>
          </div>

          <h1 className="text-2xl md:text-4xl font-black text-stone-900 leading-tight">
            {artikel.judul}
          </h1>
        </header>

        {artikel.poster_url && (
          <div className="rounded-3xl overflow-hidden border border-stone-200 shadow-sm bg-stone-100 max-h-[500px] flex items-center justify-center">
            <img
              src={artikel.poster_url}
              alt={artikel.judul}
              className="w-full h-full object-contain max-h-[500px]"
            />
          </div>
        )}

        <div className="bg-white p-6 md:p-10 rounded-3xl border border-stone-200/80 shadow-xs">
          {renderFormattedContent(artikel.konten)}

          {artikel.tautan_terkait && (
            <div className="mt-8 p-4 rounded-2xl bg-amber-50 border border-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h4 className="font-bold text-sm text-stone-800">Dokumen / Lampiran Terkait</h4>
                <p className="text-xs text-stone-600">Unduh berkas resmi atau buka tautan eksternal</p>
              </div>
              <a
                href={artikel.tautan_terkait}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 bg-amber-900 hover:bg-amber-800 text-amber-100 rounded-xl text-xs font-bold transition-all flex items-center gap-2"
              >
                <span>Buka Tautan</span>
              </a>
            </div>
          )}

          <ShareButtons judul={artikel.judul} excerpt={artikel.excerpt} />
        </div>
      </div>
    </main>
  );
}