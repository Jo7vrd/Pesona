import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="flex min-h-svh items-center">
      <div className="container-page section-y">
        <p className="eyebrow mb-4">Maluku Tenggara · Indonesia</p>
        <h1 className="font-display text-display-xl max-w-3xl text-balance">
          Jelajah Kei Kecil
        </h1>
        <p className="text-lede text-muted-foreground mt-6 max-w-xl">
          Pasir sehalus tepung, laguna sebening kaca, dan budaya yang hidup.
          Situs sedang dibangun — desain sistem sudah aktif.
        </p>
        <div className="mt-10 flex flex-wrap items-center gap-3">
          <Button size="lg" className="rounded-full px-7">
            Mulai jelajah
          </Button>
          <Button
            size="lg"
            className="rounded-full bg-coral-600 px-7 text-white hover:bg-coral-700"
          >
            Lihat kuliner
          </Button>
          <Button size="lg" variant="outline" className="rounded-full px-7">
            Bahasa Kei
          </Button>
        </div>
      </div>
    </main>
  );
}
