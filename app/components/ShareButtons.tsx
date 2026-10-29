"use client";

import { useState } from "react";
import { Share2, Link2, Check, MessageCircle } from "lucide-react";

interface ShareProps {
  judul: string;
  excerpt?: string;
}

export default function ShareButtons({ judul, excerpt }: ShareProps) {
  const [copied, setCopied] = useState(false);

  const handleNativeShare = async () => {
    const shareUrl = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: judul,
          text: excerpt || judul,
          url: shareUrl,
        });
      } catch (err) {
        // Shared cancelled
      }
    } else {
      handleCopyLink();
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWhatsAppShare = () => {
    const text = encodeURIComponent(`*${judul}*\n\nBaca selengkapnya di web HIMAPEBSI:\n${window.location.href}`);
    window.open(`https://api.whatsapp.com/send?text=${text}`, "_blank");
  };

  return (
    <div className="flex items-center gap-2 pt-4 border-t border-stone-200 mt-6">
      <span className="text-xs font-bold text-stone-500 mr-2">Bagikan:</span>
      <button
        type="button"
        onClick={handleNativeShare}
        className="px-3 py-2 rounded-xl bg-amber-900 text-amber-100 text-xs font-semibold hover:bg-amber-800 transition-all flex items-center gap-1.5 cursor-pointer"
      >
        <Share2 className="w-3.5 h-3.5" />
        <span>Bagikan</span>
      </button>

      <button
        type="button"
        onClick={handleWhatsAppShare}
        className="px-3 py-2 rounded-xl bg-emerald-700 text-emerald-50 text-xs font-semibold hover:bg-emerald-800 transition-all flex items-center gap-1.5 cursor-pointer"
      >
        <MessageCircle className="w-3.5 h-3.5" />
        <span>WhatsApp</span>
      </button>

      <button
        type="button"
        onClick={handleCopyLink}
        className="px-3 py-2 rounded-xl bg-stone-100 text-stone-700 text-xs font-semibold hover:bg-stone-200 transition-all flex items-center gap-1.5 cursor-pointer"
      >
        {copied ? (
          <>
            <Check className="w-3.5 h-3.5 text-emerald-600" />
            <span className="text-emerald-600">Tersalin!</span>
          </>
        ) : (
          <>
            <Link2 className="w-3.5 h-3.5 text-stone-500" />
            <span>Salin Link</span>
          </>
        )}
      </button>
    </div>
  );
}