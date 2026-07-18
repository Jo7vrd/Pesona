"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ChevronLeft,
  ChevronRight,
  Pencil,
  Plus,
  Search,
  Trash2,
  Video,
} from "lucide-react";
import { toast } from "sonner";

import { adminApi } from "@/lib/api/admin";
import type { DestinasiInput } from "@/lib/schemas/destinasi";
import type { Destinasi } from "@/lib/types";
import { ConfirmDeleteDialog } from "@/components/admin/confirm-delete-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DestinasiForm } from "./destinasi-form";

const PAGE_SIZE = 8;
const QUERY_KEY = ["admin", "destinasi"];

export default function AdminDestinasiPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Destinasi | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Destinasi | null>(null);

  const { data: items, isPending } = useQuery({
    queryKey: QUERY_KEY,
    queryFn: () => adminApi.destinasi.list(),
  });

  function invalidate() {
    queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    queryClient.invalidateQueries({ queryKey: ["admin", "stats"] });
  }

  const saveMutation = useMutation({
    mutationFn: (values: DestinasiInput) =>
      editing
        ? adminApi.destinasi.update(editing.id, values)
        : adminApi.destinasi.create(values),
    onSuccess: () => {
      invalidate();
      toast.success(editing ? "Perubahan disimpan" : "Destinasi ditambahkan");
      setFormOpen(false);
      setEditing(null);
    },
    onError: (error) => toast.error(error.message),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => adminApi.destinasi.remove(id),
    onSuccess: () => {
      invalidate();
      toast.success("Destinasi dihapus");
      setDeleteTarget(null);
    },
    onError: (error) => toast.error(error.message),
  });

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const all = items ?? [];
    return q ? all.filter((d) => d.nama.toLowerCase().includes(q)) : all;
  }, [items, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paginated = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  return (
    <div className="mx-auto max-w-5xl">
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
            placeholder="Cari destinasi…"
            aria-label="Cari destinasi"
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
          Tambah destinasi
        </Button>
      </div>

      <div className="mt-4 overflow-hidden rounded-xl border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-20">Foto</TableHead>
              <TableHead>Nama</TableHead>
              <TableHead>Jenis</TableHead>
              <TableHead>Video</TableHead>
              <TableHead className="w-24 text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isPending ? (
              Array.from({ length: 4 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <Skeleton className="size-12 rounded-lg" />
                  </TableCell>
                  <TableCell colSpan={4}>
                    <Skeleton className="h-5 w-2/3" />
                  </TableCell>
                </TableRow>
              ))
            ) : paginated.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-32 text-center">
                  <p className="font-medium">
                    {search ? "Tidak ada hasil" : "Belum ada destinasi"}
                  </p>
                  <p className="text-muted-foreground mt-1 text-sm">
                    {search
                      ? `Tidak ada destinasi bernama "${search}".`
                      : "Mulai dengan menambahkan destinasi pertama."}
                  </p>
                </TableCell>
              </TableRow>
            ) : (
              paginated.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <div className="relative size-12 overflow-hidden rounded-lg">
                      <Image
                        src={item.fotoUrl}
                        alt=""
                        fill
                        sizes="48px"
                        className="object-cover"
                        unoptimized={item.fotoUrl.startsWith("data:")}
                      />
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{item.nama}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="rounded-full">
                      {item.jenis}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {item.videoYoutube ? (
                      <Badge className="rounded-full bg-red-600 text-white">
                        <Video className="size-3" aria-hidden />
                        YouTube
                      </Badge>
                    ) : (
                      <span className="text-muted-foreground text-sm">—</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label={`Ubah ${item.nama}`}
                        onClick={() => {
                          setEditing(item);
                          setFormOpen(true);
                        }}
                      >
                        <Pencil className="size-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label={`Hapus ${item.nama}`}
                        className="text-destructive hover:text-destructive"
                        onClick={() => setDeleteTarget(item)}
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
          {filtered.length} destinasi
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

      <Sheet
        open={formOpen}
        onOpenChange={(open) => {
          setFormOpen(open);
          if (!open) setEditing(null);
        }}
      >
        <SheetContent className="w-full overflow-y-auto sm:max-w-md">
          <SheetHeader>
            <SheetTitle>
              {editing ? `Ubah ${editing.nama}` : "Tambah destinasi"}
            </SheetTitle>
            <SheetDescription>
              {editing
                ? "Perbarui informasi destinasi lalu simpan."
                : "Lengkapi informasi destinasi baru untuk halaman publik."}
            </SheetDescription>
          </SheetHeader>
          <DestinasiForm
            initial={editing}
            onSubmit={(values) => saveMutation.mutate(values)}
            submitting={saveMutation.isPending}
          />
        </SheetContent>
      </Sheet>

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
