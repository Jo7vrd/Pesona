import type { Metadata } from "next";
import { Caveat, Montserrat } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  display: "swap",
});

// Aksen tulisan tangan/brush untuk label lokasi hero
const caveat = Caveat({
  variable: "--font-brush",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
  ),
  title: {
    default: "Jelajah Kei Kecil — Wisata Desa Kei Kecil, Maluku Tenggara",
    template: "%s · Jelajah Kei Kecil",
  },
  description:
    "Portal resmi pariwisata Desa Kei Kecil, Maluku Tenggara. Jelajahi kuliner khas, budaya, terumbu karang, bahasa Kei, dan informasi keselamatan pesisir.",
  openGraph: {
    type: "website",
    locale: "id_ID",
    siteName: "Jelajah Kei Kecil",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${montserrat.variable} ${caveat.variable}`}>
      <body className="antialiased">
        {children}
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
