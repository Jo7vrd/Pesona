"use client";

import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, Type } from "lucide-react";
import { toast } from "sonner";

import { adminApi } from "@/lib/api/admin";
import {
  BERANDA_FIELDS,
  BERANDA_GROUPS,
} from "@/lib/content/beranda-teks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";

const SETTINGS_KEY = ["admin", "settings"];

type Form = Record<string, string>;

/** Bangun form dari setelan: ambil teks Indonesia yang sudah di-override. */
function seedForm(berandaTeks?: Record<string, Record<string, string>>): Form {
  const f: Form = {};
  for (const field of BERANDA_FIELDS) {
    f[field.key] = berandaTeks?.[field.key]?.id ?? "";
  }
  return f;
}

export default function AdminTeksPage() {
  const queryClient = useQueryClient();
  const [form, setForm] = useState<Form>({});

  const { data, isPending } = useQuery({
    queryKey: SETTINGS_KEY,
    queryFn: () => adminApi.settings.get(),
  });

  useEffect(() => {
    if (data) setForm(seedForm(data.berandaTeks));
  }, [data]);

  const mutation = useMutation({
    mutationFn: () => {
      // Bangun berandaTeks: pertahankan terjemahan (en/zh) yang mungkin
      // sudah ada, hanya ubah teks Indonesia. Field kosong → hapus id
      // agar kembali ke teks bawaan.
      const next: Record<string, Record<string, string>> = {};
      for (const field of BERANDA_FIELDS) {
        const existing = data?.berandaTeks?.[field.key] ?? {};
        const idVal = (form[field.key] ?? "").trim();
        const merged: Record<string, string> = { ...existing };
        if (idVal) merged.id = idVal;
        else delete merged.id;
        if (Object.keys(merged).length > 0) next[field.key] = merged;
      }
      return adminApi.settings.update({ berandaTeks: next });
    },
    onSuccess: (saved) => {
      queryClient.setQueryData(SETTINGS_KEY, saved);
      toast.success("Teks beranda disimpan");
    },
    onError: (error) => toast.error(error.message),
  });

  function setField(key: string, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <div className="flex items-center gap-2">
          <Type className="text-lagoon-600 size-5" aria-hidden />
          <h1 className="text-xl font-semibold">Teks Beranda</h1>
        </div>
        <p className="text-muted-foreground mt-1 text-sm">
          Ubah tulisan yang tampil di halaman beranda. Biarkan kosong untuk
          memakai teks bawaan (ditampilkan sebagai contoh abu-abu). Terjemahan
          Inggris &amp; Mandarin mengikuti bawaan untuk saat ini.
        </p>
      </div>

      {isPending ? (
        <div className="space-y-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full rounded-xl" />
          ))}
        </div>
      ) : (
        <>
          {BERANDA_GROUPS.map((group) => (
            <section key={group.title} className="bg-card rounded-xl border p-5">
              <h2 className="font-semibold">{group.title}</h2>
              <div className="mt-4 space-y-4">
                {group.fields.map((field) => (
                  <div key={field.key} className="space-y-1.5">
                    <Label htmlFor={field.key}>{field.label}</Label>
                    {field.multiline ? (
                      <Textarea
                        id={field.key}
                        rows={3}
                        value={form[field.key] ?? ""}
                        placeholder={field.default}
                        onChange={(e) => setField(field.key, e.target.value)}
                      />
                    ) : (
                      <Input
                        id={field.key}
                        value={form[field.key] ?? ""}
                        placeholder={field.default}
                        onChange={(e) => setField(field.key, e.target.value)}
                      />
                    )}
                  </div>
                ))}
              </div>
            </section>
          ))}

          <div className="bg-background/80 sticky bottom-0 -mx-1 flex justify-end border-t py-4 backdrop-blur">
            <Button
              type="button"
              disabled={mutation.isPending}
              onClick={() => mutation.mutate()}
            >
              {mutation.isPending ? (
                <>
                  <Loader2 className="size-4 animate-spin" aria-hidden />
                  Menyimpan…
                </>
              ) : (
                "Simpan semua teks"
              )}
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
