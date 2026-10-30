import type { Metadata } from "next";
import { Suspense } from "react";
import "./globals.css";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";

export const metadata: Metadata = {
  title: "HIMAPEBSI & Prodi PBSI - Universitas Trunodjoyo Madura",
  description: "Website Resmi Himpunan Mahasiswa & Program Studi PBSI UTM",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body
        className="bg-stone-50 text-stone-900 antialiased flex flex-col min-h-screen"
        suppressHydrationWarning
      >
        <Suspense fallback={null}>
          <Navbar />
        </Suspense>
        <main className="flex-grow">{children}</main>
        <Suspense fallback={null}>
          <Footer />
        </Suspense>
      </body>
    </html>
  );
}
