"use client";

import { useState } from "react";
import Image from "next/image";
import { Play } from "lucide-react";

/** Ambil ID video dari berbagai bentuk tautan YouTube; null bila bukan. */
export function youtubeId(url: string): string | null {
  const match = url.match(
    /(?:youtube\.com\/(?:watch\?v=|shorts\/|embed\/)|youtu\.be\/)([\w-]{6,})/
  );
  return match ? match[1] : null;
}

/**
 * Embed YouTube hemat: awalnya hanya thumbnail (tanpa skrip YouTube);
 * iframe player baru dimuat saat pengunjung menekan tombol putar.
 */
export function YouTubeEmbed({ url, title }: { url: string; title: string }) {
  const [playing, setPlaying] = useState(false);
  const id = youtubeId(url);
  if (!id) return null;

  return (
    <div className="relative aspect-video overflow-hidden rounded-(--radius-card) bg-black shadow-(--shadow-card)">
      {playing ? (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="absolute inset-0 h-full w-full border-0"
        />
      ) : (
        <button
          type="button"
          onClick={() => setPlaying(true)}
          aria-label={`Putar video: ${title}`}
          className="group focus-visible:ring-ring absolute inset-0 h-full w-full cursor-pointer focus-visible:ring-2 focus-visible:outline-none"
        >
          <Image
            src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`}
            alt=""
            fill
            sizes="(max-width: 768px) 100vw, 720px"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            unoptimized
          />
          <span className="absolute inset-0 bg-black/25 transition-colors group-hover:bg-black/15" />
          <span
            className="absolute top-1/2 left-1/2 flex size-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full text-white shadow-lg transition-transform duration-300 group-hover:scale-110"
            style={{ backgroundImage: "linear-gradient(135deg, #f4784a, #d46634)" }}
          >
            <Play className="ml-1 size-7 fill-current" aria-hidden />
          </span>
        </button>
      )}
    </div>
  );
}
