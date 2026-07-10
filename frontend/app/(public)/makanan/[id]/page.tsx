import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { getAllMakanan, getMakananById } from "@/lib/api/server";
import {
  kategoriMakananTr,
  makananDescTr,
} from "@/lib/content/i18n-content";
import { Badge } from "@/components/ui/badge";
import { FadeIn } from "@/components/motion/fade-in";
import { FoodCard, kategoriMakananLabel } from "@/components/cards/food-card";
import { Tr } from "@/components/site/tr";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const item = await getMakananById(Number(id));
  if (!item) return { title: "Kuliner tidak ditemukan" };
  return {
    title: item.nama,
    description: item.deskripsi.slice(0, 155),
    alternates: { canonical: `/makanan/${item.id}` },
    openGraph: { images: [{ url: item.fotoUrl }] },
  };
}

export default async function MakananDetailPage({ params }: Props) {
  const { id } = await params;
  const numericId = Number(id);
  if (!Number.isInteger(numericId)) notFound();

  const item = await getMakananById(numericId);
  if (!item) notFound();

  const related = (await getAllMakanan())
    .filter((m) => m.id !== item.id && m.kategori === item.kategori)
    .slice(0, 3);

  return (
    <article className="container-page pt-28 pb-16 md:pt-32 md:pb-24">
      <FadeIn>
        <Link
          href="/makanan"
          className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 text-sm font-medium transition-colors"
        >
          <ArrowLeft className="size-4" aria-hidden />
          <Tr id="Semua kuliner" en="All cuisine" zh="全部美食" />
        </Link>

        <div className="mt-8 grid items-start gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="relative aspect-[4/3] overflow-hidden rounded-(--radius-card) lg:col-span-7">
            <Image
              src={item.fotoUrl}
              alt={item.nama}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 58vw"
              className="object-cover"
            />
          </div>
          <div className="lg:col-span-5">
            <Badge variant="secondary" className="rounded-full">
              <Tr
                id={kategoriMakananLabel[item.kategori]}
                en={kategoriMakananTr[item.kategori]?.en}
                zh={kategoriMakananTr[item.kategori]?.zh}
              />
            </Badge>
            <h1 className="font-display text-display-lg mt-4 text-balance">
              {item.nama}
            </h1>
            <p className="text-muted-foreground mt-6 leading-relaxed">
              <Tr
                id={item.deskripsi}
                en={makananDescTr[item.id]?.en}
                zh={makananDescTr[item.id]?.zh}
              />
            </p>
          </div>
        </div>
      </FadeIn>

      {related.length > 0 ? (
        <section aria-labelledby="terkait-judul" className="mt-20 md:mt-28">
          <FadeIn>
            <h2 id="terkait-judul" className="font-display text-display">
              <Tr id="Sajian serupa" en="Similar dishes" zh="类似菜品" />
            </h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((m) => (
                <FoodCard key={m.id} item={m} />
              ))}
            </div>
          </FadeIn>
        </section>
      ) : null}
    </article>
  );
}
