import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { getAllBudaya, getBudayaById } from "@/lib/api/server";
import { getBudayaExtra } from "@/lib/content/budaya-extra";
import { Badge } from "@/components/ui/badge";
import { FadeIn } from "@/components/motion/fade-in";
import { ContentCard } from "@/components/cards/content-card";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const item = await getBudayaById(Number(id));
  if (!item) return { title: "Budaya tidak ditemukan" };
  return {
    title: item.nama,
    description: item.deskripsi.slice(0, 155),
    alternates: { canonical: `/budaya/${item.id}` },
    openGraph: { images: [{ url: item.fotoUrl }] },
  };
}

export default async function BudayaDetailPage({ params }: Props) {
  const { id } = await params;
  const numericId = Number(id);
  if (!Number.isInteger(numericId)) notFound();

  const item = await getBudayaById(numericId);
  if (!item) notFound();

  const related = (await getAllBudaya())
    .filter((b) => b.id !== item.id)
    .slice(0, 3);
  const extra = getBudayaExtra(item.nama);

  return (
    <article className="container-page pt-28 pb-16 md:pt-32 md:pb-24">
      <FadeIn>
        <Link
          href="/budaya"
          className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 text-sm font-medium transition-colors"
        >
          <ArrowLeft className="size-4" aria-hidden />
          Semua budaya
        </Link>

        <div className="relative mt-8 aspect-[21/9] overflow-hidden rounded-(--radius-card)">
          <Image
            src={item.fotoUrl}
            alt={item.nama}
            fill
            priority
            sizes="(max-width: 1152px) 100vw, 1152px"
            className="object-cover"
          />
        </div>

        <div className="mx-auto mt-10 max-w-2xl">
          <Badge variant="secondary" className="rounded-full">
            {item.kategori}
          </Badge>
          <h1 className="font-display text-display-lg mt-4 text-balance">
            {item.nama}
          </h1>
          <p className="text-muted-foreground mt-6 leading-relaxed">
            {item.deskripsi}
          </p>
        </div>
      </FadeIn>

      {extra ? (
        <section
          aria-labelledby="pasal-judul"
          className="mx-auto mt-16 max-w-2xl md:mt-20"
        >
          <FadeIn>
            <h2 id="pasal-judul" className="font-display text-display font-bold">
              {extra.judul}
            </h2>
            <p className="text-muted-foreground mt-3 leading-relaxed">
              {extra.pengantar}
            </p>
            <ol className="mt-8 space-y-4">
              {extra.pasal.map((p) => (
                <li
                  key={p.nomor}
                  className="bg-card shadow-(--shadow-card) rounded-2xl border p-6"
                >
                  <div className="flex items-start justify-between gap-4">
                    <span className="bg-brand-gradient flex size-9 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white">
                      {p.nomor}
                    </span>
                    <Badge variant="secondary" className="rounded-full">
                      {p.kelompok}
                    </Badge>
                  </div>
                  <p className="font-display mt-4 text-lg font-semibold italic">
                    &ldquo;{p.kei}&rdquo;
                  </p>
                  <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                    {p.arti}
                  </p>
                </li>
              ))}
            </ol>
            {extra.catatan ? (
              <p className="text-muted-foreground mt-6 text-xs leading-relaxed">
                {extra.catatan}
              </p>
            ) : null}
          </FadeIn>
        </section>
      ) : null}

      {related.length > 0 ? (
        <section aria-labelledby="terkait-judul" className="mt-20 md:mt-28">
          <FadeIn>
            <h2 id="terkait-judul" className="font-display text-display">
              Warisan lainnya
            </h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((b) => (
                <ContentCard
                  key={b.id}
                  href={`/budaya/${b.id}`}
                  fotoUrl={b.fotoUrl}
                  nama={b.nama}
                  kategori={b.kategori}
                  deskripsi={b.deskripsi}
                />
              ))}
            </div>
          </FadeIn>
        </section>
      ) : null}
    </article>
  );
}
