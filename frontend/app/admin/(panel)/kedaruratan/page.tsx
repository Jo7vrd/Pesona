"use client";

import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, Pencil, Plus, Trash2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { adminApi } from "@/lib/api/admin";
import {
  emergencyIconMap,
  emergencyIconOptions,
} from "@/lib/content/emergency";
import { emergencySchema, type EmergencyInput } from "@/lib/schemas/emergency";
import type { EmergencyContact } from "@/lib/types";
import { ConfirmDeleteDialog } from "@/components/admin/confirm-delete-dialog";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const QUERY_KEY = ["admin", "kedaruratan"];

const EMPTY: EmergencyInput = {
  nama: "",
  peran: "",
  telepon: "",
  ikon: "phone",
  urutan: 0,
};

export default function AdminKedaruratanPage() {
  const queryClient = useQueryClient();
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<EmergencyContact | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<EmergencyContact | null>(null);

  const { data: items, isPending } = useQuery({
    queryKey: QUERY_KEY,
    queryFn: () => adminApi.kedaruratan.list(),
  });

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<EmergencyInput>({
    resolver: zodResolver(emergencySchema),
    defaultValues: EMPTY,
  });

  useEffect(() => {
    reset(
      editing
        ? {
            nama: editing.nama,
            peran: editing.peran,
            telepon: editing.telepon,
            ikon: editing.ikon as EmergencyInput["ikon"],
            urutan: editing.urutan,
          }
        : { ...EMPTY, urutan: (items?.length ?? 0) + 1 }
    );
  }, [editing, items, reset]);

  function invalidate() {
    queryClient.invalidateQueries({ queryKey: QUERY_KEY });
  }

  const saveMutation = useMutation({
    mutationFn: (values: EmergencyInput) =>
      editing
        ? adminApi.kedaruratan.update(editing.id, values)
        : adminApi.kedaruratan.create(values),
    onSuccess: () => {
      invalidate();
      toast.success(editing ? "Perubahan disimpan" : "Kontak ditambahkan");
      setFormOpen(false);
      setEditing(null);
    },
    onError: (error) => toast.error(error.message),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => adminApi.kedaruratan.remove(id),
    onSuccess: () => {
      invalidate();
      toast.success("Kontak dihapus");
      setDeleteTarget(null);
    },
    onError: (error) => toast.error(error.message),
  });

  const ikon = watch("ikon");

  return (
    <div className="mx-auto max-w-4xl">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-lg font-semibold">Kontak darurat</h1>
          <p className="text-muted-foreground text-sm">
            Nomor yang tampil di halaman Kedaruratan. Tambahkan nomor lokal
            (Puskesmas, pos SAR, kepala desa) di samping nomor nasional.
          </p>
        </div>
        <Button
          onClick={() => {
            setEditing(null);
            setFormOpen(true);
          }}
        >
          <Plus className="size-4" aria-hidden />
          Tambah kontak
        </Button>
      </div>

      <div className="mt-4 overflow-hidden rounded-xl border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">#</TableHead>
              <TableHead>Nama</TableHead>
              <TableHead>Peran</TableHead>
              <TableHead>Telepon</TableHead>
              <TableHead className="w-24 text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isPending ? (
              Array.from({ length: 4 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell colSpan={5}>
                    <Skeleton className="h-5 w-2/3" />
                  </TableCell>
                </TableRow>
              ))
            ) : (items ?? []).length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-28 text-center">
                  <p className="font-medium">Belum ada kontak</p>
                  <p className="text-muted-foreground mt-1 text-sm">
                    Tambahkan kontak darurat pertama.
                  </p>
                </TableCell>
              </TableRow>
            ) : (
              (items ?? []).map((c) => {
                const Icon = emergencyIconMap[c.ikon] ?? emergencyIconMap.phone;
                return (
                  <TableRow key={c.id}>
                    <TableCell className="text-muted-foreground tabular-nums">
                      {c.urutan}
                    </TableCell>
                    <TableCell className="font-medium">
                      <span className="flex items-center gap-2">
                        <Icon className="text-coral-600 size-4" aria-hidden />
                        {c.nama}
                      </span>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {c.peran}
                    </TableCell>
                    <TableCell className="font-mono tabular-nums">
                      {c.telepon}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          aria-label={`Ubah ${c.nama}`}
                          onClick={() => {
                            setEditing(c);
                            setFormOpen(true);
                          }}
                        >
                          <Pencil className="size-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          aria-label={`Hapus ${c.nama}`}
                          className="text-destructive hover:text-destructive"
                          onClick={() => setDeleteTarget(c)}
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog
        open={formOpen}
        onOpenChange={(open) => {
          setFormOpen(open);
          if (!open) setEditing(null);
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editing ? `Ubah "${editing.nama}"` : "Tambah kontak darurat"}
            </DialogTitle>
            <DialogDescription>
              Pastikan nomor sudah diverifikasi dan aktif.
            </DialogDescription>
          </DialogHeader>
          <form
            onSubmit={handleSubmit((values) => saveMutation.mutate(values))}
            noValidate
            className="space-y-4"
          >
            <Field label="Nama" error={errors.nama?.message}>
              <Input placeholder="Puskesmas Kei Kecil" {...register("nama")} />
            </Field>
            <Field label="Peran / keterangan" error={errors.peran?.message}>
              <Input placeholder="Kesehatan setempat" {...register("peran")} />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Nomor telepon" error={errors.telepon?.message}>
                <Input
                  type="tel"
                  inputMode="tel"
                  placeholder="0916 123456"
                  {...register("telepon")}
                />
              </Field>
              <Field label="Urutan" error={errors.urutan?.message}>
                <Input
                  type="number"
                  min={0}
                  {...register("urutan", { valueAsNumber: true })}
                />
              </Field>
            </div>
            <div className="space-y-2">
              <Label>Ikon</Label>
              <Select
                value={ikon}
                onValueChange={(v) =>
                  setValue("ikon", v as EmergencyInput["ikon"])
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {emergencyIconOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button
              type="submit"
              disabled={saveMutation.isPending}
              className="w-full"
            >
              {saveMutation.isPending ? (
                <>
                  <Loader2 className="size-4 animate-spin" aria-hidden />
                  Menyimpan…
                </>
              ) : editing ? (
                "Simpan perubahan"
              ) : (
                "Tambah kontak"
              )}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      <ConfirmDeleteDialog
        open={!!deleteTarget}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
        itemName={deleteTarget?.nama ?? ""}
        onConfirm={() => deleteTarget && deleteMutation.mutate(deleteTarget.id)}
        deleting={deleteMutation.isPending}
      />
    </div>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {children}
      {error ? (
        <p role="alert" className="text-destructive text-sm">
          {error}
        </p>
      ) : null}
    </div>
  );
}
