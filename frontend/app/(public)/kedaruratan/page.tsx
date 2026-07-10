import type { Metadata } from "next";
import { Phone, TriangleAlert } from "lucide-react";

import { emergencyContacts, p3kGuides } from "@/lib/content/emergency";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { PageHeader } from "@/components/site/page-header";

export const metadata: Metadata = {
  title: "Informasi Kedaruratan Pesisir",
  description:
    "Kontak darurat dan panduan pertolongan pertama untuk kedaruratan pesisir di Kei Kecil, sengatan ubur-ubur, arus kuat, dan lainnya.",
  alternates: { canonical: "/kedaruratan" },
};

export default function KedaruratanPage() {
  return (
    <>
      <PageHeader
        pageKey="kedaruratan"
        eyebrow="Kedaruratan pesisir"
        title="Tenang, dan ikuti langkahnya"
        description="Simpan halaman ini sebelum ke pantai. Kontak penting bisa langsung dihubungi dari ponsel Anda."
        imageUrl="https://images.unsplash.com/photo-1476673160081-cf065607f449?w=2000&q=80"
      />

      <section className="container-page py-12 md:py-16">
        <div className="bg-coral-600/10 border-coral-600/30 text-coral-700 flex items-start gap-3 rounded-2xl border p-5">
          <TriangleAlert className="mt-0.5 size-5 shrink-0" aria-hidden />
          <p className="text-sm leading-relaxed font-medium">
            Perairan Kei mengalami meti (surut ekstrem) dan arus pasang yang
            berubah cepat. Selalu tanyakan kondisi laut kepada warga sebelum
            berenang atau menyeberang ke pasir timbul.
          </p>
        </div>

        <h2 className="font-display text-display mt-12">Kontak penting</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {emergencyContacts.map((c) => (
            <a
              key={c.telepon}
              href={`tel:${c.telepon}`}
              className="group bg-card shadow-(--shadow-card) hover:shadow-(--shadow-card-hover) focus-visible:ring-ring block rounded-(--radius-card) border p-6 transition-all hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
            >
              <span className="bg-coral-600/10 text-coral-700 flex size-11 items-center justify-center rounded-full">
                <c.icon className="size-5" aria-hidden />
              </span>
              <p className="mt-4 font-semibold">{c.nama}</p>
              <p className="text-muted-foreground mt-0.5 text-sm">{c.peran}</p>
              <p className="text-coral-700 mt-3 inline-flex items-center gap-1.5 text-2xl font-bold tabular-nums">
                <Phone className="size-4" aria-hidden />
                {c.telepon}
              </p>
            </a>
          ))}
        </div>

        <h2 className="font-display text-display mt-16">
          Pertolongan pertama
        </h2>
        <p className="text-muted-foreground mt-2 max-w-2xl text-sm leading-relaxed">
          Panduan ringkas untuk enam kejadian paling umum di pesisir. Panduan
          ini tidak menggantikan pertolongan medis profesional.
        </p>
        <Accordion type="single" collapsible className="mt-6 max-w-3xl">
          {p3kGuides.map((guide) => (
            <AccordionItem key={guide.id} value={guide.id}>
              <AccordionTrigger className="text-left text-base font-semibold">
                {guide.judul}
              </AccordionTrigger>
              <AccordionContent>
                <ol className="text-muted-foreground list-decimal space-y-2.5 pl-5 leading-relaxed">
                  {guide.langkah.map((langkah, i) => (
                    <li key={i}>{langkah}</li>
                  ))}
                </ol>
                {guide.peringatan ? (
                  <p className="bg-coral-600/10 text-coral-700 mt-4 rounded-xl p-4 text-sm leading-relaxed font-medium">
                    {guide.peringatan}
                  </p>
                ) : null}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>
    </>
  );
}
