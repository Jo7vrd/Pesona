import { Download, ExternalLink, FileText } from "lucide-react";

import { Button } from "@/components/ui/button";

const PDF_URL = "/panduan/buku-panduan-pesona.pdf";

/**
 * Buku panduan operator desa. PDF disimpan sebagai aset statis; halaman
 * ini menyematkan pratinjau sekaligus menyediakan unduhan.
 */
export default function PanduanPage() {
  return (
    <div className="mx-auto max-w-4xl">
      <div className="bg-card rounded-xl border p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <span className="bg-lagoon-600/10 text-lagoon-600 flex size-11 shrink-0 items-center justify-center rounded-xl">
              <FileText className="size-5.5" aria-hidden />
            </span>
            <div>
              <h2 className="text-lg font-semibold">Buku Panduan Operator</h2>
              <p className="text-muted-foreground mt-1 text-sm">
                Panduan lengkap mengelola situs Pesona Kei untuk operator desa:
                masuk admin, menambah konten, mengunggah foto, dan menyematkan
                video.
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button asChild variant="outline">
              <a href={PDF_URL} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="size-4" aria-hidden />
                Buka di tab baru
              </a>
            </Button>
            <Button asChild>
              <a href={PDF_URL} download="Buku Panduan Pesona Kei.pdf">
                <Download className="size-4" aria-hidden />
                Unduh PDF
              </a>
            </Button>
          </div>
        </div>
      </div>

      <div className="mt-6 overflow-hidden rounded-xl border">
        <iframe
          src={`${PDF_URL}#view=FitH`}
          title="Buku Panduan Operator Pesona Kei"
          className="h-[75svh] w-full border-0 bg-white"
        />
      </div>

      <p className="text-muted-foreground mt-3 text-center text-xs">
        Jika pratinjau tidak muncul, gunakan tombol{" "}
        <span className="font-medium">Unduh PDF</span> di atas.
      </p>
    </div>
  );
}
