"use client";

import { useState } from "react";
import { Share2, Copy, Check, MessageCircle } from "lucide-react";

interface ShareButtonProps {
  title: string;
  slug: string;
}

export default function ShareButton({ title, slug }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  // Ambil URL artikel lengkap
  const articleUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/berita/${slug}`
      : `https://web-himapebsi.vercel.app/berita/${slug}`;

  const handleShare = async () => {
    // Jika browser mendukung Web Share API (HP Mobile / Browser modern)
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: `Baca artikel "${title}" di Website HIMAPEBSI UTM:`,
          url: articleUrl,
        });
      } catch (err) {
        // User membatalkan share
      }
    } else {
      // Fallback menu untuk desktop browser
      setShowMenu(!showMenu);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(articleUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Gagal menyalin tautan:", err);
    }
  };

  const shareWhatsApp = () => {
    const text = encodeURIComponent(`*${title}*\n\nBaca selengkapnya di website HIMAPEBSI:\n${articleUrl}`);
    window.open(`https://api.whatsapp.com/send?text=${text}`, "_blank");
  };

  return (
    <div className="relative inline-block">
      <button
        onClick={handleShare}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-amber-100 hover:text-amber-900 rounded-xl transition-colors border border-stone-200 cursor-pointer"
        title="Bagikan Artikel"
      >
        <Share2 className="w-3.5 h-3.5 text-amber-800" />
        <span>Bagikan</span>
      </button>

      {/* Fallback Menu untuk Desktop Browser */}
      {showMenu && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-stone-200 p-2 z-50 space-y-1">
          <button
            onClick={shareWhatsApp}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-emerald-700 hover:bg-emerald-50 rounded-xl transition-colors text-left cursor-pointer"
          >
            <MessageCircle className="w-4 h-4 text-emerald-600" />
            <span>Bagikan ke WhatsApp</span>
          </button>
          <button
            onClick={copyToClipboard}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-stone-700 hover:bg-stone-100 rounded-xl transition-colors text-left cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-600" />
                <span className="text-emerald-600 font-bold">Tautan Tersalin!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-stone-500" />
                <span>Salin Tautan Artikel</span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
