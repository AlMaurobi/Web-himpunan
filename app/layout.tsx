import type { Metadata } from "next";
import { Suspense } from "react";
import "./globals.css";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";

export const metadata: Metadata = {
  title: "HIMAPEBSI - PBSI UTM",
  description: "Website Resmi Himpunan Mahasiswa Pendidikan Bahasa dan Sastra Indonesia",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="scroll-smooth">
      <body className="antialiased bg-[#FFFDF9] text-stone-800 flex flex-col min-h-screen">
        <Suspense fallback={null}>
          <Navbar />
        </Suspense>
        <div className="flex-1">
          {children}
        </div>
        <Suspense fallback={null}>
          <Footer />
        </Suspense>
      </body>
    </html>
  );
}