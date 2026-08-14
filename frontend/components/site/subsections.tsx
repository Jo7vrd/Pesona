import Image from "next/image";

import { BLUR_DATA_URL } from "@/lib/blur";
import type { Subsection } from "@/lib/types";

/**
 * Menampilkan sub-bagian di bawah deskripsi konten (mis. pasal adat,
 * sejarah, tips). Tiap blok bisa punya judul, teks, dan/atau foto sisipan.
 * Tidak merender apa pun bila kosong.
 */
export function Subsections({
  items,
  className = "",
}: {
  items?: Subsection[] | null;
  className?: string;
}) {
  if (!items || items.length === 0) return null;
  return (
    <div className={`space-y-8 ${className}`}>
      {items.map((s, i) => (
        <section key={i} className="space-y-4">
          {s.judul || s.isi ? (
            <div className="border-lagoon-600/30 border-l-2 pl-4">
              {s.judul ? (
                <h3 className="font-display text-lg font-semibold">
                  {s.judul}
                </h3>
              ) : null}
              {s.isi ? (
                <p className="text-muted-foreground mt-1.5 leading-relaxed whitespace-pre-line">
                  {s.isi}
                </p>
              ) : null}
            </div>
          ) : null}
          {s.foto ? (
            <div className="relative aspect-[16/9] overflow-hidden rounded-(--radius-card)">
              <Image
                src={s.foto}
                alt={s.judul || "Foto"}
                fill
                sizes="(max-width: 1024px) 100vw, 720px"
                placeholder="blur"
                blurDataURL={BLUR_DATA_URL}
                style={{
                  objectPosition: s.fotoPosisi || "50% 50%",
                  transform: `scale(${s.fotoZoom || 1})`,
                  transformOrigin: s.fotoPosisi || "50% 50%",
                }}
                className="object-cover"
              />
            </div>
          ) : null}
        </section>
      ))}
    </div>
  );
}
