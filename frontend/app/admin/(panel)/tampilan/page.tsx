"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  GripVertical,
  ImageIcon,
  Loader2,
  MapPin,
  PanelTop,
  Plus,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";

import { adminApi } from "@/lib/api/admin";
import type { HeroImage } from "@/lib/types";
import { ConfirmDeleteDialog } from "@/components/admin/confirm-delete-dialog";
import { ImageField } from "@/components/admin/image-field";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";

const HERO_KEY = ["admin", "hero"];
const SETTINGS_KEY = ["admin", "settings"];

const HERO_PAGES = [
  { slug: "destinasi", label: "Destinasi" },
  { slug: "makanan", label: "Kuliner" },
  { slug: "budaya", label: "Budaya" },
  { slug: "bahasa", label: "Bahasa Kei" },
  { slug: "peta", label: "Peta" },
  { slug: "kedaruratan", label: "Kedaruratan" },
] as const;

export default function AdminTampilanPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <HeroCarouselManager />
      <PageHeroesManager />
      <PetaKarangSetting />
    </div>
  );
}

/* ------------------------------------------------ Hero tiap halaman */

interface HeroDraft {
  url: string;
  pos: string;
  zoom: number;
}

function PageHeroesManager() {
  const queryClient = useQueryClient();
  const [savingSlug, setSavingSlug] = useState<string | null>(null);
  const [drafts, setDrafts] = useState<Record<string, HeroDraft>>({});

  const { data, isPending } = useQuery({
    queryKey: SETTINGS_KEY,
    queryFn: () => adminApi.settings.get(),
  });

  // Seed draft dari setelan tersimpan begitu tersedia.
  useEffect(() => {
    if (!data) return;
    const seeded: Record<string, HeroDraft> = {};
    for (const p of HERO_PAGES) {
      seeded[p.slug] = {
        url: data.heroImages?.[p.slug] ?? "",
        pos: data.heroImagePos?.[p.slug] ?? "50% 50%",
        zoom: data.heroImageZoom?.[p.slug] ?? 1,
      };
    }
    setDrafts(seeded);
  }, [data]);

  const mutation = useMutation({
    mutationFn: (v: { slug: string } & HeroDraft) =>
      adminApi.settings.update({
        heroImages: { [v.slug]: v.url || null },
        heroImagePos: { [v.slug]: v.pos },
        heroImageZoom: { [v.slug]: v.zoom },
      }),
    onMutate: (v) => setSavingSlug(v.slug),
    onSuccess: (saved) => {
      queryClient.setQueryData(SETTINGS_KEY, saved);
      toast.success("Foto hero halaman disimpan");
    },
    onError: (error) => toast.error(error.message),
    onSettled: () => setSavingSlug(null),
  });

  function patchDraft(slug: string, patch: Partial<HeroDraft>) {
    setDrafts((d) => ({
      ...d,
      [slug]: { ...(d[slug] ?? { url: "", pos: "50% 50%", zoom: 1 }), ...patch },
    }));
  }

  function isDirty(slug: string): boolean {
    const d = drafts[slug];
    if (!d) return false;
    return (
      d.url !== (data?.heroImages?.[slug] ?? "") ||
      d.pos !== (data?.heroImagePos?.[slug] ?? "50% 50%") ||
      d.zoom !== (data?.heroImageZoom?.[slug] ?? 1)
    );
  }

  return (
    <section className="bg-card rounded-xl border p-5">
      <div className="flex items-center gap-2">
        <PanelTop className="text-lagoon-600 size-4.5" aria-hidden />
        <h2 className="font-semibold">Foto hero tiap halaman</h2>
      </div>
      <p className="text-muted-foreground mt-1 text-sm">
        Gambar besar di bagian atas tiap halaman. Unggah, atur bingkai (geser
        &amp; zoom), lalu simpan. Kosongkan (tombol ✕) untuk kembali ke foto
        bawaan.
      </p>

      {isPending ? (
        <div className="mt-4 grid gap-5 sm:grid-cols-2">
          {HERO_PAGES.map((p) => (
            <Skeleton key={p.slug} className="aspect-[16/9] w-full rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="mt-4 grid gap-5 sm:grid-cols-2">
          {HERO_PAGES.map((p) => {
            const d = drafts[p.slug] ?? { url: "", pos: "50% 50%", zoom: 1 };
            return (
              <div key={p.slug}>
                <div className="mb-2 flex items-center gap-2">
                  <p className="text-sm font-medium">{p.label}</p>
                  {savingSlug === p.slug ? (
                    <Loader2 className="text-muted-foreground size-3.5 animate-spin" aria-hidden />
                  ) : null}
                </div>
                <ImageField
                  value={d.url}
                  onChange={(url) => patchDraft(p.slug, { url })}
                  modul="umum"
                  position={d.pos}
                  onPositionChange={(pos) => patchDraft(p.slug, { pos })}
                  zoom={d.zoom}
                  onZoomChange={(zoom) => patchDraft(p.slug, { zoom })}
                />
                <Button
                  type="button"
                  size="sm"
                  className="mt-2"
                  disabled={!isDirty(p.slug) || savingSlug === p.slug}
                  onClick={() => mutation.mutate({ slug: p.slug, ...d })}
                >
                  Simpan
                </Button>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}

/* ---------------------------------------------------------------- Hero */

function HeroCarouselManager() {
  const queryClient = useQueryClient();
  const [staged, setStaged] = useState("");
  const [stagedPos, setStagedPos] = useState("50% 50%");
  const [stagedZoom, setStagedZoom] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState<HeroImage | null>(null);

  const { data: images, isPending } = useQuery({
    queryKey: HERO_KEY,
    queryFn: () => adminApi.hero.list(),
  });

  const createMutation = useMutation({
    mutationFn: (input: { fotoUrl: string; fotoPosisi: string; fotoZoom: number }) => {
      const urutan = (images?.length ?? 0) + 1;
      return adminApi.hero.create({ ...input, urutan });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: HERO_KEY });
      setStaged("");
      setStagedPos("50% 50%");
      setStagedZoom(1);
      toast.success("Foto hero ditambahkan");
    },
    onError: (error) => toast.error(error.message),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => adminApi.hero.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: HERO_KEY });
      toast.success("Foto hero dihapus");
      setDeleteTarget(null);
    },
    onError: (error) => toast.error(error.message),
  });

  return (
    <section className="bg-card rounded-xl border p-5">
      <div className="flex items-center gap-2">
        <ImageIcon className="text-lagoon-600 size-4.5" aria-hidden />
        <h2 className="font-semibold">Foto hero beranda (carousel)</h2>
      </div>
      <p className="text-muted-foreground mt-1 text-sm">
        Foto latar besar di bagian atas beranda. Bila lebih dari satu, foto
        berganti otomatis setiap 7 detik. Foto pertama tampil lebih dulu.
      </p>

      {isPending ? (
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="aspect-[16/10] w-full rounded-lg" />
          ))}
        </div>
      ) : (
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {(images ?? []).map((img, i) => (
            <div
              key={img.id}
              className="group relative aspect-[16/10] overflow-hidden rounded-lg border"
            >
              <Image
                src={img.fotoUrl}
                alt={`Foto hero ${i + 1}`}
                fill
                sizes="240px"
                className="object-cover"
                style={{
                  objectPosition: img.fotoPosisi || "50% 50%",
                  transform: `scale(${img.fotoZoom || 1})`,
                  transformOrigin: img.fotoPosisi || "50% 50%",
                }}
                unoptimized={!img.fotoUrl.startsWith("/")}
              />
              <span className="bg-background/80 absolute top-1.5 left-1.5 flex items-center gap-1 rounded-md px-1.5 py-0.5 text-xs font-medium">
                <GripVertical className="size-3" aria-hidden />
                {i + 1}
              </span>
              <Button
                type="button"
                size="icon"
                variant="secondary"
                aria-label={`Hapus foto hero ${i + 1}`}
                className="absolute top-1.5 right-1.5 opacity-0 transition-opacity group-hover:opacity-100"
                onClick={() => setDeleteTarget(img)}
              >
                <Trash2 className="size-4" />
              </Button>
            </div>
          ))}
          {(images?.length ?? 0) === 0 ? (
            <p className="text-muted-foreground col-span-full py-4 text-sm">
              Belum ada foto hero. Tambahkan minimal satu di bawah.
            </p>
          ) : null}
        </div>
      )}

      <div className="mt-5 border-t pt-5">
        <p className="mb-2 text-sm font-medium">Tambah foto hero</p>
        <ImageField
          value={staged}
          onChange={setStaged}
          modul="hero"
          position={stagedPos}
          onPositionChange={setStagedPos}
          zoom={stagedZoom}
          onZoomChange={setStagedZoom}
        />
        {staged ? (
          <Button
            type="button"
            className="mt-3"
            disabled={createMutation.isPending}
            onClick={() =>
              createMutation.mutate({
                fotoUrl: staged,
                fotoPosisi: stagedPos,
                fotoZoom: stagedZoom,
              })
            }
          >
            {createMutation.isPending ? (
              <>
                <Loader2 className="size-4 animate-spin" aria-hidden />
                Menambahkan…
              </>
            ) : (
              <>
                <Plus className="size-4" aria-hidden />
                Tambahkan ke carousel
              </>
            )}
          </Button>
        ) : null}
      </div>

      <ConfirmDeleteDialog
        open={!!deleteTarget}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
        itemName={deleteTarget ? "foto hero ini" : ""}
        onConfirm={() => deleteTarget && deleteMutation.mutate(deleteTarget.id)}
        deleting={deleteMutation.isPending}
      />
    </section>
  );
}

/* ---------------------------------------------------------- Peta karang */

function PetaKarangSetting() {
  const queryClient = useQueryClient();
  const [foto, setFoto] = useState("");
  const [desk, setDesk] = useState("");

  const { data, isPending } = useQuery({
    queryKey: SETTINGS_KEY,
    queryFn: () => adminApi.settings.get(),
  });

  useEffect(() => {
    if (data) {
      setFoto(data.petaKarangFoto ?? "");
      setDesk(data.petaKarangDeskripsi ?? "");
    }
  }, [data]);

  const mutation = useMutation({
    mutationFn: () =>
      adminApi.settings.update({
        petaKarangFoto: foto || null,
        petaKarangDeskripsi: desk || null,
      }),
    onSuccess: (saved) => {
      queryClient.setQueryData(SETTINGS_KEY, saved);
      toast.success("Peta karang disimpan");
    },
    onError: (error) => toast.error(error.message),
  });

  const dirty =
    (data?.petaKarangFoto ?? "") !== foto ||
    (data?.petaKarangDeskripsi ?? "") !== desk;

  return (
    <section className="bg-card rounded-xl border p-5">
      <div className="flex items-center gap-2">
        <MapPin className="text-lagoon-600 size-4.5" aria-hidden />
        <h2 className="font-semibold">Peta terumbu karang</h2>
      </div>
      <p className="text-muted-foreground mt-1 text-sm">
        Gambar & keterangan peta karang yang tampil di halaman Peta.
        Kosongkan untuk menyembunyikan.
      </p>

      {isPending ? (
        <Skeleton className="mt-4 aspect-[16/9] w-full max-w-md rounded-lg" />
      ) : (
        <div className="mt-4 max-w-md space-y-3">
          <ImageField value={foto} onChange={setFoto} modul="umum" />
          <div className="space-y-1.5">
            <Label htmlFor="petaDesk">Deskripsi / keterangan</Label>
            <Textarea
              id="petaDesk"
              rows={3}
              value={desk}
              onChange={(e) => setDesk(e.target.value)}
              placeholder="Keterangan singkat peta karang…"
            />
          </div>
          <Button
            type="button"
            disabled={mutation.isPending || !dirty}
            onClick={() => mutation.mutate()}
          >
            {mutation.isPending ? (
              <>
                <Loader2 className="size-4 animate-spin" aria-hidden />
                Menyimpan…
              </>
            ) : (
              "Simpan peta karang"
            )}
          </Button>
        </div>
      )}
    </section>
  );
}
