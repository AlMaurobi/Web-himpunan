import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "HIMAPEBSI & Prodi PBSI - Universitas Trunojoyo Madura",
  description: "Website Resmi Himpunan Mahasiswa & Program Studi PBSI UTM",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className="bg-stone-50 text-stone-900 antialiased">{children}</body>
    </html>
  );
}