"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Lock, Mail, KeyRound, Loader2, ArrowLeft, ShieldCheck } from "lucide-react";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.session) {
        router.push("/admin/dashboard");
        router.refresh();
      }
    } catch (err: any) {
      setErrorMsg(
        err.message || "Gagal masuk. Periksa kembali email dan kata sandi Anda."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#1F120B] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-amber-900/20">
        <div className="bg-[#2A1810] p-6 text-center text-amber-100 relative">
          <Link
            href="/"
            className="absolute left-4 top-4 text-amber-300 hover:text-white text-xs flex items-center gap-1 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Web Utama</span>
          </Link>
          <img
            src="/logo.png"
            alt="Logo HIMAPEBSI"
            className="w-12 h-12 object-contain mx-auto mb-3"
          />
          <h1 className="text-xl font-bold text-white tracking-wide">
            Portal Admin HIMAPEBSI
          </h1>
          <p className="text-xs text-amber-300/80 mt-1">
            Masuk untuk mengelola konten website & data organisasi
          </p>
        </div>

        <div className="p-6 md:p-8 space-y-6">
          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-medium flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1.5">
                Email Admin
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@himapebsi.or.id"
                  className="w-full pl-10 pr-4 py-2.5 text-xs border border-stone-300 rounded-xl focus:ring-2 focus:ring-amber-800 focus:outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1.5">
                Kata Sandi
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 text-xs border border-stone-300 rounded-xl focus:ring-2 focus:ring-amber-800 focus:outline-none transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#2A1810] hover:bg-amber-900 text-amber-100 rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-md transition-all disabled:opacity-50 mt-2"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin text-amber-200" />
              ) : (
                <Lock className="w-4 h-4 text-amber-300" />
              )}
              <span>{loading ? "Memverifikasi..." : "Masuk ke Dashboard"}</span>
            </button>
          </form>

          <div className="text-center pt-2">
            <p className="text-[11px] text-stone-400">
              Akses terbatas khusus pengurus & administrator HIMAPEBSI UTM.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
