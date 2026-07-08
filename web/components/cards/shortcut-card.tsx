import Link from "next/link";
import { ArrowUpRight, type LucideIcon } from "lucide-react";

export function ShortcutCard({
  href,
  icon: Icon,
  title,
  description,
}: {
  href: string;
  icon: LucideIcon;
  title: string;
  description: string;
}) {
  return (
    <Link
      href={href}
      className="group bg-card shadow-(--shadow-card) hover:shadow-(--shadow-card-hover) focus-visible:ring-ring block rounded-(--radius-card) p-6 transition-all duration-300 hover:-translate-y-1 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
    >
      <div className="flex items-start justify-between">
        <span className="bg-lagoon-300/30 text-lagoon-700 flex size-11 items-center justify-center rounded-full">
          <Icon className="size-5" aria-hidden />
        </span>
        <ArrowUpRight
          className="text-muted-foreground size-5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          aria-hidden
        />
      </div>
      <h3 className="mt-5 font-semibold">{title}</h3>
      <p className="text-muted-foreground mt-1.5 text-sm leading-relaxed">
        {description}
      </p>
    </Link>
  );
}
