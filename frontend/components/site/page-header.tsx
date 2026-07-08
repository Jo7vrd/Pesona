import { FadeIn } from "@/components/motion/fade-in";

export function PageHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <header className="bg-ocean-950 text-white">
      <div className="container-page pt-36 pb-16 md:pt-44 md:pb-20">
        <FadeIn>
          <p className="eyebrow text-lagoon-300 mb-4">{eyebrow}</p>
          <h1 className="font-display text-display-lg max-w-3xl text-balance">
            {title}
          </h1>
          {description ? (
            <p className="text-lede mt-5 max-w-2xl text-white/75">
              {description}
            </p>
          ) : null}
        </FadeIn>
      </div>
    </header>
  );
}
