import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Foto pengembangan — diganti domain R2 saat backend live (Fase 8)
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
    // AVIF dihilangkan: encoding-nya berat (terasa lag saat gambar
    // pertama dimuat) dengan selisih ukuran kecil dibanding WebP
    formats: ["image/webp"],
  },
};

export default nextConfig;
