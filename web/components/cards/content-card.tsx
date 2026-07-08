import Image from "next/image";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";

export function ContentCard({
  href,
  fotoUrl,
  nama,
  kategori,
  deskripsi,
}: {
  href: string;
  fotoUrl: string;
  nama: string;
  kategori: string;
  deskripsi: string;
}) {
  return (
    <Link
      href={href}
      className="group focus-visible:ring-ring block rounded-(--radius-card) focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
    >
      <article className="bg-card shadow-(--shadow-card) hover:shadow-(--shadow-card-hover) overflow-hidden rounded-(--radius-card) transition-all duration-300 group-hover:-translate-y-1">
        <div className="relative aspect-[4/5] overflow-hidden">
          <Image
            src={fotoUrl}
            alt={nama}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
          <Badge className="bg-background/85 text-foreground absolute top-3 left-3 rounded-full border-0 backdrop-blur-sm">
            {kategori}
          </Badge>
        </div>
        <div className="p-5">
          <h3 className="font-display text-xl">{nama}</h3>
          <p className="text-muted-foreground mt-2 line-clamp-2 text-sm leading-relaxed">
            {deskripsi}
          </p>
        </div>
      </article>
    </Link>
  );
}
