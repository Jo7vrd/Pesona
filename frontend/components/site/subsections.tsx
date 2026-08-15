import Image from "next/image";

import { BLUR_DATA_URL } from "@/lib/blur";
import type { Subsection } from "@/lib/types";
import { RichTr } from "@/components/site/rich-text";
import { Tr } from "@/components/site/tr";

/** Terjemahan opsional per sub-bagian (judul & isi), searah indeks items. */
export interface SubsectionTr {
  judul?: { en?: string; zh?: string };
  isi?: { en?: string; zh?: string };
}

/**
 * Menampilkan sub-bagian di bawah deskripsi konten (mis. pasal adat,
 * sejarah, tips). Tiap blok bisa punya judul, teks, dan/atau foto sisipan.
 * `tr` (searah indeks) memberi terjemahan EN/ZH per blok. Tidak merender
 * apa pun bila kosong.
 */
export function Subsections({
  items,
  tr,
  className = "",
}: {
  items?: Subsection[] | null;
  tr?: SubsectionTr[];
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
                  <Tr id={s.judul} en={tr?.[i]?.judul?.en} zh={tr?.[i]?.judul?.zh} />
                </h3>
              ) : null}
              {s.isi ? (
                <RichTr
                  id={s.isi}
                  en={tr?.[i]?.isi?.en}
                  zh={tr?.[i]?.isi?.zh}
                  className="text-muted-foreground mt-1.5 leading-relaxed"
                />
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
