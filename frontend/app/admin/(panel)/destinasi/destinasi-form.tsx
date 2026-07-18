"use client";

import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Video } from "lucide-react";
import { Controller, useForm } from "react-hook-form";

import { destinasiSchema, type DestinasiInput } from "@/lib/schemas/destinasi";
import type { Destinasi } from "@/lib/types";
import { ImageField } from "@/components/admin/image-field";
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
import { Textarea } from "@/components/ui/textarea";

const EMPTY: DestinasiInput = {
  nama: "",
  jenis: "Pantai",
  deskripsi: "",
  lat: 0,
  lng: 0,
  fotoUrl: "",
  videoYoutube: "",
};

export function DestinasiForm({
  initial,
  onSubmit,
  submitting,
}: {
  initial: Destinasi | null;
  onSubmit: (values: DestinasiInput) => void;
  submitting: boolean;
}) {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<DestinasiInput>({
    resolver: zodResolver(destinasiSchema),
    defaultValues: initial
      ? { ...initial, videoYoutube: initial.videoYoutube ?? "" }
      : EMPTY,
  });

  useEffect(() => {
    reset(
      initial ? { ...initial, videoYoutube: initial.videoYoutube ?? "" } : EMPTY
    );
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
        <Label htmlFor="nama">Nama destinasi</Label>
        <Input
          id="nama"
          placeholder="Pantai Ngurbloat (Pasir Panjang)"
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
        <Label>Jenis</Label>
        <Controller
          control={control}
          name="jenis"
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger aria-invalid={!!errors.jenis}>
                <SelectValue placeholder="Pilih jenis" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Pantai">Pantai</SelectItem>
                <SelectItem value="Snorkeling">Snorkeling</SelectItem>
                <SelectItem value="Gua">Gua</SelectItem>
                <SelectItem value="Pulau">Pulau</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
        {errors.jenis ? (
          <p role="alert" className="text-destructive text-sm">
            {errors.jenis.message}
          </p>
        ) : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor="deskripsi">Deskripsi</Label>
        <Textarea
          id="deskripsi"
          rows={5}
          placeholder="Ceritakan keistimewaan tempat ini dan tips berkunjung…"
          aria-invalid={!!errors.deskripsi}
          {...register("deskripsi")}
        />
        {errors.deskripsi ? (
          <p role="alert" className="text-destructive text-sm">
            {errors.deskripsi.message}
          </p>
        ) : null}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label htmlFor="lat">Latitude</Label>
          <Input
            id="lat"
            type="number"
            step="any"
            placeholder="-5.66"
            aria-invalid={!!errors.lat}
            {...register("lat", { valueAsNumber: true })}
          />
          {errors.lat ? (
            <p role="alert" className="text-destructive text-sm">
              {errors.lat.message}
            </p>
          ) : null}
        </div>
        <div className="space-y-2">
          <Label htmlFor="lng">Longitude</Label>
          <Input
            id="lng"
            type="number"
            step="any"
            placeholder="132.641"
            aria-invalid={!!errors.lng}
            {...register("lng", { valueAsNumber: true })}
          />
          {errors.lng ? (
            <p role="alert" className="text-destructive text-sm">
              {errors.lng.message}
            </p>
          ) : null}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="videoYoutube" className="flex items-center gap-1.5">
          <Video className="size-4 text-red-600" aria-hidden />
          Video YouTube (opsional)
        </Label>
        <Input
          id="videoYoutube"
          type="url"
          inputMode="url"
          placeholder="https://www.youtube.com/watch?v=…"
          aria-invalid={!!errors.videoYoutube}
          {...register("videoYoutube")}
        />
        <p className="text-muted-foreground text-xs">
          Hanya tautan YouTube yang diterima. Video tampil sebagai pemutar
          di halaman Destinasi situs publik.
        </p>
        {errors.videoYoutube ? (
          <p role="alert" className="text-destructive text-sm">
            {errors.videoYoutube.message}
          </p>
        ) : null}
      </div>

      <Button type="submit" disabled={submitting} className="w-full">
        {submitting ? (
          <>
            <Loader2 className="size-4 animate-spin" aria-hidden />
            Menyimpan…
          </>
        ) : initial ? (
          "Simpan perubahan"
        ) : (
          "Tambah destinasi"
        )}
      </Button>
    </form>
  );
}
