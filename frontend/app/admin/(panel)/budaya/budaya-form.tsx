"use client";

import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { Controller, useForm } from "react-hook-form";

import { budayaSchema, type BudayaInput } from "@/lib/schemas/budaya";
import type { Budaya } from "@/lib/types";
import { ImageField } from "@/components/admin/image-field";
import { VideoYoutubeField } from "@/components/admin/video-youtube-field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

const EMPTY: BudayaInput = {
  nama: "",
  kategori: "",
  deskripsi: "",
  fotoUrl: "",
  isUnggulan: false,
  videoYoutube: "",
};

function toForm(item: Budaya): BudayaInput {
  return { ...item, videoYoutube: item.videoYoutube ?? "" };
}

export function BudayaForm({
  initial,
  onSubmit,
  submitting,
}: {
  initial: Budaya | null;
  onSubmit: (values: BudayaInput) => void;
  submitting: boolean;
}) {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<BudayaInput>({
    resolver: zodResolver(budayaSchema),
    defaultValues: initial ? toForm(initial) : EMPTY,
  });

  useEffect(() => {
    reset(initial ? toForm(initial) : EMPTY);
  }, [initial, reset]);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="space-y-5 px-4 pb-6"
    >
      <div className="space-y-2">
        <Label>Foto</Label>
        <Controller
          control={control}
          name="fotoUrl"
          render={({ field }) => (
            <ImageField
              value={field.value}
              onChange={field.onChange}
              error={errors.fotoUrl?.message}
            />
          )}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="nama">Nama warisan budaya</Label>
        <Input
          id="nama"
          placeholder="Sasi Laut"
          aria-invalid={!!errors.nama}
          {...register("nama")}
        />
        {errors.nama ? (
          <p role="alert" className="text-destructive text-sm">
            {errors.nama.message}
          </p>
        ) : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor="kategori">Kategori</Label>
        <Input
          id="kategori"
          placeholder="Tradisi konservasi, Hukum adat, Festival…"
          aria-invalid={!!errors.kategori}
          {...register("kategori")}
        />
        {errors.kategori ? (
          <p role="alert" className="text-destructive text-sm">
            {errors.kategori.message}
          </p>
        ) : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor="deskripsi">Deskripsi</Label>
        <Textarea
          id="deskripsi"
          rows={5}
          placeholder="Jelaskan makna, sejarah, dan bagaimana tradisi ini dijalankan…"
          aria-invalid={!!errors.deskripsi}
          {...register("deskripsi")}
        />
        {errors.deskripsi ? (
          <p role="alert" className="text-destructive text-sm">
            {errors.deskripsi.message}
          </p>
        ) : null}
      </div>

      <Controller
        control={control}
        name="isUnggulan"
        render={({ field }) => (
          <div className="flex items-center justify-between rounded-xl border p-4">
            <div>
              <Label htmlFor="unggulan">Tampilkan di beranda</Label>
              <p className="text-muted-foreground mt-0.5 text-xs">
                Budaya unggulan muncul di seksi budaya landing page.
              </p>
            </div>
            <Switch
              id="unggulan"
              checked={field.value}
              onCheckedChange={field.onChange}
            />
          </div>
        )}
      />

      <VideoYoutubeField
        registration={register("videoYoutube")}
        error={errors.videoYoutube?.message}
        hint="Opsional. Hanya tautan YouTube. Video tampil sebagai pemutar di halaman detail budaya."
      />

      <Button type="submit" disabled={submitting} className="w-full">
        {submitting ? (
          <>
            <Loader2 className="size-4 animate-spin" aria-hidden />
            Menyimpan…
          </>
        ) : initial ? (
          "Simpan perubahan"
        ) : (
          "Tambah budaya"
        )}
      </Button>
    </form>
  );
}
