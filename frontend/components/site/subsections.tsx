import type { Subsection } from "@/lib/types";

/**
 * Menampilkan sub-bagian bertajuk di bawah deskripsi konten (mis. pasal
 * adat, sejarah, tips). Tidak merender apa pun bila kosong.
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
    <div className={`space-y-6 ${className}`}>
      {items.map((s, i) => (
        <section key={i} className="border-lagoon-600/30 border-l-2 pl-4">
          <h3 className="font-display text-lg font-semibold">{s.judul}</h3>
          <p className="text-muted-foreground mt-1.5 leading-relaxed whitespace-pre-line">
            {s.isi}
          </p>
        </section>
      ))}
    </div>
  );
}
