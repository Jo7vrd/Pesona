import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Foto pengembangan — diganti domain R2 saat backend live (Fase 8)
      { protocol: "https", hostname: "images.unsplash.com" },
      // Foto hasil unggahan admin saat pengembangan (disk lokal backend).
      { protocol: "http", hostname: "localhost", port: "8080" },
      // Produksi: tambahkan hostname bucket R2 publik Anda di sini, mis.
      // { protocol: "https", hostname: "aset.keikecil.id" },
    ],
    // AVIF dihilangkan: encoding-nya berat (terasa lag saat gambar
    // pertama dimuat) dengan selisih ukuran kecil dibanding WebP
    formats: ["image/webp"],
  },
};

export default nextConfig;
