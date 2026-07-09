import { Skeleton } from "@/components/ui/skeleton";

/**
 * Skeleton rute publik: kerangka page header + grid kartu, tampil
 * instan saat navigasi sementara data halaman diambil.
 */
export default function PublicLoading() {
  return (
    <div aria-busy="true" aria-label="Memuat konten">
      <div className="bg-brand-gradient">
        <div className="container-page pt-40 pb-16 md:pt-48 md:pb-20">
          <Skeleton className="h-4 w-40 bg-white/20" />
          <Skeleton className="mt-5 h-12 w-full max-w-xl bg-white/25" />
          <Skeleton className="mt-3 h-12 w-2/3 max-w-md bg-white/25" />
          <Skeleton className="mt-6 h-5 w-full max-w-lg bg-white/20" />
        </div>
      </div>
      <div className="container-page py-12 md:py-16">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="bg-card overflow-hidden rounded-(--radius-card) border"
            >
              <Skeleton className="aspect-[4/5] rounded-none" />
              <div className="space-y-3 p-5">
                <Skeleton className="h-6 w-2/3" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-4/5" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
