"use client";

import { useEffect, useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight, Loader2, Pencil, Plus, Search, Trash2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { adminApi } from "@/lib/api/admin";
import { bahasaSchema, type BahasaInput } from "@/lib/schemas/bahasa";
import type { BahasaLokal } from "@/lib/types";
import { ConfirmDeleteDialog } from "@/components/admin/confirm-delete-dialog";
import { BahasaVideoSetting } from "./bahasa-video-setting";
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
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const PAGE_SIZE = 10;
const QUERY_KEY = ["admin", "bahasa"];
const EMPTY: BahasaInput = { bahasaIndonesia: "", bahasaKei: "", catatan: "" };

export default function AdminBahasaPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<BahasaLokal | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<BahasaLokal | null>(null);

  const { data: items, isPending } = useQuery({
    queryKey: QUERY_KEY,
    queryFn: () => adminApi.bahasa.list(),
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<BahasaInput>({
    resolver: zodResolver(bahasaSchema),
    defaultValues: EMPTY,
  });

  useEffect(() => {
    reset(
      editing
        ? {
            bahasaIndonesia: editing.bahasaIndonesia,
            bahasaKei: editing.bahasaKei,
            catatan: editing.catatan ?? "",
          }
        : EMPTY
    );
  }, [editing, reset]);

  function invalidate() {
    queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    queryClient.invalidateQueries({ queryKey: ["admin", "stats"] });
  }

  const saveMutation = useMutation({
    mutationFn: (values: BahasaInput) =>
      editing
        ? adminApi.bahasa.update(editing.id, values)
        : adminApi.bahasa.create(values),
    onSuccess: () => {
      invalidate();
      toast.success(editing ? "Perubahan disimpan" : "Kosakata ditambahkan");
      setFormOpen(false);
      setEditing(null);
    },
    onError: (error) => toast.error(error.message),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => adminApi.bahasa.remove(id),
    onSuccess: () => {
      invalidate();
      toast.success("Kosakata dihapus");
      setDeleteTarget(null);
    },
    onError: (error) => toast.error(error.message),
  });

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const all = items ?? [];
    return q
      ? all.filter(
          (e) =>
            e.bahasaIndonesia.toLowerCase().includes(q) ||
            e.bahasaKei.toLowerCase().includes(q)
        )
      : all;
  }, [items, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paginated = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  return (
    <div className="mx-auto max-w-4xl">
      <BahasaVideoSetting />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="relative w-full max-w-xs">
          <Search
            className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2"
            aria-hidden
          />
          <Input
            type="search"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Cari kosakata…"
            aria-label="Cari kosakata"
            className="pl-9"
          />
        </div>
        <Button
          onClick={() => {
            setEditing(null);
            setFormOpen(true);
          }}
        >
          <Plus className="size-4" aria-hidden />
          Tambah kosakata
        </Button>
      </div>

      <div className="mt-4 overflow-hidden rounded-xl border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Bahasa Indonesia</TableHead>
              <TableHead>Bahasa Kei</TableHead>
              <TableHead>Catatan</TableHead>
              <TableHead className="w-24 text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isPending ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell colSpan={4}>
                    <Skeleton className="h-5 w-2/3" />
                  </TableCell>
                </TableRow>
              ))
            ) : paginated.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="h-32 text-center">
                  <p className="font-medium">
                    {search ? "Tidak ada hasil" : "Belum ada kosakata"}
                  </p>
                  <p className="text-muted-foreground mt-1 text-sm">
                    {search
                      ? `Tidak ada kosakata cocok dengan "${search}".`
                      : "Mulai dengan menambahkan kosakata pertama."}
                  </p>
                </TableCell>
              </TableRow>
            ) : (
              paginated.map((entry) => (
                <TableRow key={entry.id}>
                  <TableCell className="font-medium">
                    {entry.bahasaIndonesia}
                  </TableCell>
                  <TableCell className="font-display text-base">
                    {entry.bahasaKei}
                  </TableCell>
                  <TableCell className="text-muted-foreground max-w-56 truncate text-sm">
                    {entry.catatan || "—"}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label={`Ubah ${entry.bahasaIndonesia}`}
                        onClick={() => {
                          setEditing(entry);
                          setFormOpen(true);
                        }}
                      >
                        <Pencil className="size-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label={`Hapus ${entry.bahasaIndonesia}`}
                        className="text-destructive hover:text-destructive"
                        onClick={() => setDeleteTarget(entry)}
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="mt-4 flex items-center justify-between text-sm">
        <p className="text-muted-foreground">
          {filtered.length} kosakata
          {search ? ` untuk "${search}"` : ""}
        </p>
        {totalPages > 1 ? (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              aria-label="Halaman sebelumnya"
              disabled={currentPage === 1}
              onClick={() => setPage((p) => p - 1)}
            >
              <ChevronLeft className="size-4" />
            </Button>
            <span className="text-muted-foreground tabular-nums">
              {currentPage} / {totalPages}
            </span>
            <Button
              variant="outline"
              size="icon"
              aria-label="Halaman berikutnya"
              disabled={currentPage === totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              <ChevronRight className="size-4" />
            </Button>
          </div>
        ) : null}
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
              {editing ? `Ubah "${editing.bahasaIndonesia}"` : "Tambah kosakata"}
            </DialogTitle>
            <DialogDescription>
              Pastikan ejaan bahasa Kei sudah dikonfirmasi penutur asli.
            </DialogDescription>
          </DialogHeader>
          <form
            onSubmit={handleSubmit((values) => saveMutation.mutate(values))}
            noValidate
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label htmlFor="bahasaIndonesia">Bahasa Indonesia</Label>
              <Input
                id="bahasaIndonesia"
                placeholder="Laut"
                aria-invalid={!!errors.bahasaIndonesia}
                {...register("bahasaIndonesia")}
              />
              {errors.bahasaIndonesia ? (
                <p role="alert" className="text-destructive text-sm">
                  {errors.bahasaIndonesia.message}
                </p>
              ) : null}
            </div>
            <div className="space-y-2">
              <Label htmlFor="bahasaKei">Bahasa Kei</Label>
              <Input
                id="bahasaKei"
                placeholder="Roa"
                aria-invalid={!!errors.bahasaKei}
                {...register("bahasaKei")}
              />
              {errors.bahasaKei ? (
                <p role="alert" className="text-destructive text-sm">
                  {errors.bahasaKei.message}
                </p>
              ) : null}
            </div>
            <div className="space-y-2">
              <Label htmlFor="catatan">Catatan (opsional)</Label>
              <Input
                id="catatan"
                placeholder="Konteks pemakaian, lafal, atau makna tambahan"
                aria-invalid={!!errors.catatan}
                {...register("catatan")}
              />
              {errors.catatan ? (
                <p role="alert" className="text-destructive text-sm">
                  {errors.catatan.message}
                </p>
              ) : null}
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
                "Tambah kosakata"
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
        itemName={deleteTarget?.bahasaIndonesia ?? ""}
        onConfirm={() => deleteTarget && deleteMutation.mutate(deleteTarget.id)}
        deleting={deleteMutation.isPending}
      />
    </div>
  );
}
