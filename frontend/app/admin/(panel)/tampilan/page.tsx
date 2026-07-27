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
import { Skeleton } from "@/components/ui/skeleton";

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

function PageHeroesManager() {
  const queryClient = useQueryClient();
  const [savingSlug, setSavingSlug] = useState<string | null>(null);

  const { data, isPending } = useQuery({
    queryKey: SETTINGS_KEY,
    queryFn: () => adminApi.settings.get(),
  });

  const mutation = useMutation({
    mutationFn: (v: { slug: string; url: string }) =>
      adminApi.settings.update({ heroImages: { [v.slug]: v.url || null } }),
    onMutate: (v) => setSavingSlug(v.slug),
    onSuccess: (saved) => {
      queryClient.setQueryData(SETTINGS_KEY, saved);
      toast.success("Foto hero halaman disimpan");
    },
    onError: (error) => toast.error(error.message),
    onSettled: () => setSavingSlug(null),
  });

  return (
    <section className="bg-card rounded-xl border p-5">
      <div className="flex items-center gap-2">
        <PanelTop className="text-lagoon-600 size-4.5" aria-hidden />
        <h2 className="font-semibold">Foto hero tiap halaman</h2>
      </div>
      <p className="text-muted-foreground mt-1 text-sm">
        Gambar besar di bagian atas tiap halaman. Unggah untuk mengganti;
        kosongkan (tombol ✕) untuk kembali ke foto bawaan. Tersimpan otomatis.
      </p>

      {isPending ? (
        <div className="mt-4 grid gap-5 sm:grid-cols-2">
          {HERO_PAGES.map((p) => (
            <Skeleton key={p.slug} className="aspect-[16/9] w-full rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="mt-4 grid gap-5 sm:grid-cols-2">
          {HERO_PAGES.map((p) => (
            <div key={p.slug}>
              <div className="mb-2 flex items-center gap-2">
                <p className="text-sm font-medium">{p.label}</p>
                {savingSlug === p.slug ? (
                  <Loader2 className="text-muted-foreground size-3.5 animate-spin" aria-hidden />
                ) : null}
              </div>
              <ImageField
                value={data?.heroImages?.[p.slug] ?? ""}
                onChange={(url) => mutation.mutate({ slug: p.slug, url })}
                modul="umum"
              />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

/* ---------------------------------------------------------------- Hero */

function HeroCarouselManager() {
  const queryClient = useQueryClient();
  const [staged, setStaged] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<HeroImage | null>(null);

  const { data: images, isPending } = useQuery({
    queryKey: HERO_KEY,
    queryFn: () => adminApi.hero.list(),
  });

  const createMutation = useMutation({
    mutationFn: (fotoUrl: string) => {
      const urutan = (images?.length ?? 0) + 1;
      return adminApi.hero.create({ fotoUrl, urutan });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: HERO_KEY });
      setStaged("");
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
        <ImageField value={staged} onChange={setStaged} modul="hero" />
        {staged ? (
          <Button
            type="button"
            className="mt-3"
            disabled={createMutation.isPending}
            onClick={() => createMutation.mutate(staged)}
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

  const { data, isPending } = useQuery({
    queryKey: SETTINGS_KEY,
    queryFn: () => adminApi.settings.get(),
  });

  useEffect(() => {
    if (data) setFoto(data.petaKarangFoto ?? "");
  }, [data]);

  const mutation = useMutation({
    mutationFn: (petaKarangFoto: string) =>
      adminApi.settings.update({ petaKarangFoto: petaKarangFoto || null }),
    onSuccess: (saved) => {
      queryClient.setQueryData(SETTINGS_KEY, saved);
      toast.success("Foto peta karang disimpan");
    },
    onError: (error) => toast.error(error.message),
  });

  const dirty = (data?.petaKarangFoto ?? "") !== foto;

  return (
    <section className="bg-card rounded-xl border p-5">
      <div className="flex items-center gap-2">
        <MapPin className="text-lagoon-600 size-4.5" aria-hidden />
        <h2 className="font-semibold">Foto peta terumbu karang</h2>
      </div>
      <p className="text-muted-foreground mt-1 text-sm">
        Gambar peta/ilustrasi terumbu karang yang tampil di halaman Peta.
        Kosongkan untuk menyembunyikannya.
      </p>

      {isPending ? (
        <Skeleton className="mt-4 aspect-[16/9] w-full max-w-md rounded-lg" />
      ) : (
        <div className="mt-4 max-w-md">
          <ImageField value={foto} onChange={setFoto} modul="umum" />
          <Button
            type="button"
            className="mt-3"
            disabled={mutation.isPending || !dirty}
            onClick={() => mutation.mutate(foto)}
          >
            {mutation.isPending ? (
              <>
                <Loader2 className="size-4 animate-spin" aria-hidden />
                Menyimpan…
              </>
            ) : (
              "Simpan foto peta"
            )}
          </Button>
        </div>
      )}
    </section>
  );
}
