import Image from "next/image";

import { FadeIn } from "@/components/motion/fade-in";

export function PageHeader({
  eyebrow,
  title,
  description,
  imageUrl,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  /** Foto latar opsional — di-overlay gradien gelap agar teks tetap AA. */
  imageUrl?: string;
}) {
  return (
    <header className="bg-ocean-950 relative overflow-hidden text-white">
      {imageUrl ? (
        <>
          <Image
            src={imageUrl}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="from-ocean-950/95 via-ocean-950/70 to-ocean-950/30 absolute inset-0 bg-gradient-to-br" />
        </>
      ) : null}
      <div className="container-page relative pt-40 pb-16 md:pt-48 md:pb-20">
        <FadeIn>
          <p className="eyebrow text-lagoon-300 mb-4">{eyebrow}</p>
          <h1 className="font-display text-display-lg max-w-3xl font-bold text-balance">
            {title}
          </h1>
          {description ? (
            <p className="text-lede mt-5 max-w-2xl text-white/80">
              {description}
            </p>
          ) : null}
        </FadeIn>
      </div>
    </header>
  );
}
