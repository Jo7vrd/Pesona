"use client";

import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { Controller, useForm } from "react-hook-form";

import { makananSchema, type MakananInput } from "@/lib/schemas/makanan";
import type { Makanan } from "@/lib/types";
import { ImageField } from "@/components/admin/image-field";
import { VideoYoutubeField } from "@/components/admin/video-youtube-field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

const EMPTY: MakananInput = {
  nama: "",
  kategori: "makanan",
  deskripsi: "",
  fotoUrl: "",
  isUnggulan: false,
  videoYoutube: "",
};

function toForm(item: Makanan): MakananInput {
  return { ...item, videoYoutube: item.videoYoutube ?? "" };
}

export function MakananForm({
  initial,
  onSubmit,
  submitting,
}: {
  initial: Makanan | null;
  onSubmit: (values: MakananInput) => void;
  submitting: boolean;
}) {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<MakananInput>({
    resolver: zodResolver(makananSchema),
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
        <Label htmlFor="nama">Nama sajian</Label>
        <Input
          id="nama"
          placeholder="Embal Goreng"
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
        <Label>Kategori</Label>
        <Controller
          control={control}
          name="kategori"
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger aria-invalid={!!errors.kategori}>
                <SelectValue placeholder="Pilih kategori" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="makanan">Makanan</SelectItem>
                <SelectItem value="minuman">Minuman</SelectItem>
                <SelectItem value="kudapan">Kudapan</SelectItem>
              </SelectContent>
            </Select>
          )}
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
          placeholder="Ceritakan bahan, rasa, dan kapan sajian ini biasa dinikmati…"
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
                Sajian unggulan muncul di seksi kuliner landing page.
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
        hint="Opsional. Hanya tautan YouTube. Video tampil sebagai pemutar di halaman detail sajian."
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
          "Tambah sajian"
        )}
      </Button>
    </form>
  );
}
