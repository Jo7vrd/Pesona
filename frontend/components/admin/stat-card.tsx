import Link from "next/link";
import { ArrowUpRight, type LucideIcon } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function StatCard({
  title,
  value,
  caption,
  icon: Icon,
  href,
  loading,
}: {
  title: string;
  value: number | undefined;
  caption: string;
  icon: LucideIcon;
  href: string;
  loading: boolean;
}) {
  return (
    <Card className="relative transition-shadow hover:shadow-(--shadow-card-hover)">
      <CardContent className="pt-6">
        <div className="flex items-start justify-between">
          <span className="bg-lagoon-600/15 text-lagoon-600 flex size-10 items-center justify-center rounded-full">
            <Icon className="size-5" aria-hidden />
          </span>
          <ArrowUpRight className="text-muted-foreground size-4" aria-hidden />
        </div>
        <p className="text-muted-foreground mt-4 text-sm">{title}</p>
        {loading ? (
          <Skeleton className="mt-1 h-9 w-16" />
        ) : (
          <p className="mt-1 text-3xl font-bold tabular-nums">{value ?? 0}</p>
        )}
        <p className="text-muted-foreground mt-1 text-xs">{caption}</p>
        <Link href={href} className="absolute inset-0" aria-label={title} />
      </CardContent>
    </Card>
  );
}
