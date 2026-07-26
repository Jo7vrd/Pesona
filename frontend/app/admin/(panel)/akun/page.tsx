"use client";

import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  KeyRound,
  Loader2,
  Pencil,
  Plus,
  Power,
  ShieldCheck,
  Trash2,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { adminApi } from "@/lib/api/admin";
import {
  createAdminSchema,
  editAdminSchema,
  resetPasswordSchema,
  type CreateAdminForm,
  type EditAdminForm,
  type ResetPasswordForm,
} from "@/lib/schemas/admin-account";
import type { AdminAccount, AdminSession } from "@/lib/types";
import { ConfirmDeleteDialog } from "@/components/admin/confirm-delete-dialog";
import { Badge } from "@/components/ui/badge";
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

const QUERY_KEY = ["admin", "admins"];

function roleLabel(role: string) {
  return role === "super_admin" ? "Super admin" : "Admin";
}

export default function AdminAkunPage() {
  const queryClient = useQueryClient();
  const [session, setSession] = useState<AdminSession | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [editing, setEditing] = useState<AdminAccount | null>(null);
  const [resetting, setResetting] = useState<AdminAccount | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AdminAccount | null>(null);

  useEffect(() => {
    adminApi.me().then((user) => {
      if (user) setSession({ token: "", user });
    });
  }, []);

  const { data: admins, isPending } = useQuery({
    queryKey: QUERY_KEY,
    queryFn: () => adminApi.admins.list(),
  });

  function invalidate() {
    queryClient.invalidateQueries({ queryKey: QUERY_KEY });
  }

  const toggleMutation = useMutation({
    mutationFn: (a: AdminAccount) =>
      adminApi.admins.update(a.id, {
        nama: a.nama,
        role: a.role,
        isActive: !a.isActive,
      }),
    onSuccess: (saved) => {
      invalidate();
      toast.success(saved.isActive ? "Akun diaktifkan" : "Akun dinonaktifkan");
    },
    onError: (error) => toast.error(error.message),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => adminApi.admins.remove(id),
    onSuccess: () => {
      invalidate();
      toast.success("Akun dihapus");
      setDeleteTarget(null);
    },
    onError: (error) => toast.error(error.message),
  });

  // Hanya super admin yang boleh membuka halaman ini.
  if (session && session.user.role !== "super_admin") {
    return (
      <div className="mx-auto max-w-md py-16 text-center">
        <ShieldCheck className="text-muted-foreground mx-auto size-10" aria-hidden />
        <h1 className="mt-4 text-lg font-semibold">Akses terbatas</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Hanya super admin yang dapat mengelola akun.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-lg font-semibold">Akun admin</h1>
          <p className="text-muted-foreground text-sm">
            Buat satu akun untuk tiap operator agar jejak perubahan jelas dan
            akses mudah dicabut.
          </p>
        </div>
        <Button onClick={() => setCreateOpen(true)}>
          <Plus className="size-4" aria-hidden />
          Tambah admin
        </Button>
      </div>

      <div className="mt-4 overflow-hidden rounded-xl border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nama</TableHead>
              <TableHead>Username</TableHead>
              <TableHead>Peran</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-40 text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isPending ? (
              Array.from({ length: 3 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell colSpan={5}>
                    <Skeleton className="h-5 w-2/3" />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              (admins ?? []).map((a) => {
                const self = session?.user.id === a.id;
                return (
                  <TableRow key={a.id}>
                    <TableCell className="font-medium">
                      {a.nama}
                      {self ? (
                        <span className="text-muted-foreground ml-2 text-xs">
                          (Anda)
                        </span>
                      ) : null}
                    </TableCell>
                    <TableCell className="font-mono text-sm">
                      {a.username}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={a.role === "super_admin" ? "default" : "secondary"}
                        className="rounded-full"
                      >
                        {roleLabel(a.role)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={a.isActive ? "secondary" : "outline"}
                        className="rounded-full"
                      >
                        {a.isActive ? "Aktif" : "Nonaktif"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          aria-label={`Ubah ${a.nama}`}
                          onClick={() => setEditing(a)}
                        >
                          <Pencil className="size-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          aria-label={`Reset kata sandi ${a.nama}`}
                          onClick={() => setResetting(a)}
                        >
                          <KeyRound className="size-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          aria-label={a.isActive ? `Nonaktifkan ${a.nama}` : `Aktifkan ${a.nama}`}
                          disabled={self || toggleMutation.isPending}
                          onClick={() => toggleMutation.mutate(a)}
                        >
                          <Power
                            className={a.isActive ? "size-4" : "size-4 text-muted-foreground"}
                          />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          aria-label={`Hapus ${a.nama}`}
                          className="text-destructive hover:text-destructive"
                          disabled={self}
                          onClick={() => setDeleteTarget(a)}
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

      <CreateAdminDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        onDone={invalidate}
      />
      <EditAdminDialog
        admin={editing}
        onOpenChange={(open) => !open && setEditing(null)}
        onDone={invalidate}
      />
      <ResetPasswordDialog
        admin={resetting}
        onOpenChange={(open) => !open && setResetting(null)}
      />
      <ConfirmDeleteDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        itemName={deleteTarget ? `akun "${deleteTarget.nama}"` : ""}
        onConfirm={() => deleteTarget && deleteMutation.mutate(deleteTarget.id)}
        deleting={deleteMutation.isPending}
      />
    </div>
  );
}

/* ------------------------------------------------------- Create dialog */

function CreateAdminDialog({
  open,
  onOpenChange,
  onDone,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDone: () => void;
}) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreateAdminForm>({
    resolver: zodResolver(createAdminSchema),
    defaultValues: { nama: "", username: "", password: "", role: "admin" },
  });

  useEffect(() => {
    if (open) reset({ nama: "", username: "", password: "", role: "admin" });
  }, [open, reset]);

  const mutation = useMutation({
    mutationFn: (values: CreateAdminForm) => adminApi.admins.create(values),
    onSuccess: () => {
      onDone();
      toast.success("Akun admin dibuat");
      onOpenChange(false);
    },
    onError: (error) => toast.error(error.message),
  });

  const role = watch("role");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Tambah akun admin</DialogTitle>
          <DialogDescription>
            Buat akun untuk satu operator. Bagikan username &amp; kata sandi
            awal secara pribadi; minta mereka menggantinya nanti.
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={handleSubmit((values) => mutation.mutate(values))}
          noValidate
          className="space-y-4"
        >
          <Field label="Nama lengkap" error={errors.nama?.message}>
            <Input placeholder="Maria Rahakbauw" {...register("nama")} />
          </Field>
          <Field label="Username" error={errors.username?.message}>
            <Input
              placeholder="maria"
              autoCapitalize="none"
              {...register("username")}
            />
          </Field>
          <Field label="Kata sandi awal" error={errors.password?.message}>
            <Input
              type="text"
              placeholder="Minimal 8 karakter"
              {...register("password")}
            />
          </Field>
          <div className="space-y-2">
            <Label>Peran</Label>
            <Select value={role} onValueChange={(v) => setValue("role", v as CreateAdminForm["role"])}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Admin (operator konten)</SelectItem>
                <SelectItem value="super_admin">
                  Super admin (bisa kelola akun)
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button type="submit" disabled={mutation.isPending} className="w-full">
            {mutation.isPending ? (
              <>
                <Loader2 className="size-4 animate-spin" aria-hidden />
                Membuat…
              </>
            ) : (
              "Buat akun"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

/* --------------------------------------------------------- Edit dialog */

function EditAdminDialog({
  admin,
  onOpenChange,
  onDone,
}: {
  admin: AdminAccount | null;
  onOpenChange: (open: boolean) => void;
  onDone: () => void;
}) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<EditAdminForm>({
    resolver: zodResolver(editAdminSchema),
    defaultValues: { nama: "", role: "admin" },
  });

  useEffect(() => {
    if (admin) reset({ nama: admin.nama, role: admin.role });
  }, [admin, reset]);

  const mutation = useMutation({
    mutationFn: (values: EditAdminForm) =>
      adminApi.admins.update(admin!.id, { ...values, isActive: admin!.isActive }),
    onSuccess: () => {
      onDone();
      toast.success("Perubahan disimpan");
      onOpenChange(false);
    },
    onError: (error) => toast.error(error.message),
  });

  const role = watch("role");

  return (
    <Dialog open={!!admin} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Ubah akun</DialogTitle>
          <DialogDescription>
            Ubah nama tampilan atau peran akun.
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={handleSubmit((values) => mutation.mutate(values))}
          noValidate
          className="space-y-4"
        >
          <Field label="Nama lengkap" error={errors.nama?.message}>
            <Input {...register("nama")} />
          </Field>
          <div className="space-y-2">
            <Label>Peran</Label>
            <Select value={role} onValueChange={(v) => setValue("role", v as EditAdminForm["role"])}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Admin (operator konten)</SelectItem>
                <SelectItem value="super_admin">
                  Super admin (bisa kelola akun)
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button type="submit" disabled={mutation.isPending} className="w-full">
            {mutation.isPending ? (
              <>
                <Loader2 className="size-4 animate-spin" aria-hidden />
                Menyimpan…
              </>
            ) : (
              "Simpan perubahan"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

/* ------------------------------------------------ Reset password dialog */

function ResetPasswordDialog({
  admin,
  onOpenChange,
}: {
  admin: AdminAccount | null;
  onOpenChange: (open: boolean) => void;
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ResetPasswordForm>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: "" },
  });

  useEffect(() => {
    if (admin) reset({ password: "" });
  }, [admin, reset]);

  const mutation = useMutation({
    mutationFn: (values: ResetPasswordForm) =>
      adminApi.admins.resetPassword(admin!.id, values.password),
    onSuccess: () => {
      toast.success("Kata sandi diperbarui");
      onOpenChange(false);
    },
    onError: (error) => toast.error(error.message),
  });

  return (
    <Dialog open={!!admin} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Reset kata sandi</DialogTitle>
          <DialogDescription>
            Atur kata sandi baru untuk {admin?.nama}. Sampaikan secara pribadi.
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={handleSubmit((values) => mutation.mutate(values))}
          noValidate
          className="space-y-4"
        >
          <Field label="Kata sandi baru" error={errors.password?.message}>
            <Input
              type="text"
              placeholder="Minimal 8 karakter"
              {...register("password")}
            />
          </Field>
          <Button type="submit" disabled={mutation.isPending} className="w-full">
            {mutation.isPending ? (
              <>
                <Loader2 className="size-4 animate-spin" aria-hidden />
                Menyimpan…
              </>
            ) : (
              "Simpan kata sandi"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

/* ------------------------------------------------------------- helpers */

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
