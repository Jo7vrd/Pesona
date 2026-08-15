"use client";

import { useRef } from "react";
import { GripVertical, Plus, X } from "lucide-react";

import type { Subsection } from "@/lib/types";
import { ImageField } from "@/components/admin/image-field";
import { RichTextEditor } from "@/components/admin/rich-text-editor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

/**
 * Editor daftar sub-bagian untuk memperkaya deskripsi konten, mis.
 * "Tujuh Pasal Larvul Ngabal". Tiap blok bisa berisi judul, teks, dan/atau
 * foto sisipan (dengan editor geser+zoom). Terkontrol lewat value/onChange
 * sehingga bisa dipakai dengan Controller react-hook-form.
 */
export function SubsectionEditor({
  value,
  onChange,
  modul = "umum",
}: {
  value: Subsection[];
  onChange: (value: Subsection[]) => void;
  modul?: string;
}) {
  const items = value ?? [];

  // Sinkronkan ref ke nilai terkini tiap render. patch() menulis ref ini
  // secara sinkron agar beberapa pembaruan beruntun dalam satu tick (mis.
  // ImageField memanggil onChange + onPositionChange + onZoomChange) saling
  // menumpuk, bukan saling menimpa memakai closure basi.
  const itemsRef = useRef(items);
  itemsRef.current = items;

  function patch(i: number, next: Partial<Subsection>) {
    const updated = itemsRef.current.map((it, idx) =>
      idx === i ? { ...it, ...next } : it
    );
    itemsRef.current = updated;
    onChange(updated);
  }
  function add() {
    onChange([...items, { judul: "", isi: "" }]);
  }
  function remove(i: number) {
    onChange(items.filter((_, idx) => idx !== i));
  }

  return (
    <div className="space-y-3">
      {items.length === 0 ? (
        <p className="text-muted-foreground text-sm">
          Belum ada sub-bagian. Tambahkan blok bertajuk (mis. sejarah, aturan,
          tips) untuk memperkaya deskripsi.
        </p>
      ) : null}

      {items.map((s, i) => (
        <div
          key={i}
          className="bg-muted/40 relative space-y-2 rounded-lg border p-3"
        >
          <div className="flex items-center gap-2">
            <GripVertical
              className="text-muted-foreground size-4 shrink-0"
              aria-hidden
            />
            <Input
              value={s.judul}
              onChange={(e) => patch(i, { judul: e.target.value })}
              placeholder="Judul sub-bagian"
              aria-label={`Judul sub-bagian ${i + 1}`}
            />
            <Button
              type="button"
              size="icon"
              variant="ghost"
              aria-label={`Hapus sub-bagian ${i + 1}`}
              className="text-destructive hover:text-destructive shrink-0"
              onClick={() => remove(i)}
            >
              <X className="size-4" />
            </Button>
          </div>
          <RichTextEditor
            value={s.isi}
            onChange={(v) => patch(i, { isi: v })}
            rows={3}
            placeholder="Isi sub-bagian… (boleh kosong bila hanya foto)"
          />
          <div>
            <p className="text-muted-foreground mb-1.5 text-xs font-medium">
              Foto sisipan (opsional)
            </p>
            <ImageField
              value={s.foto ?? ""}
              onChange={(url) => patch(i, { foto: url })}
              modul={modul}
              position={s.fotoPosisi}
              onPositionChange={(p) => patch(i, { fotoPosisi: p })}
              zoom={s.fotoZoom}
              onZoomChange={(z) => patch(i, { fotoZoom: z })}
            />
          </div>
        </div>
      ))}

      <Button type="button" variant="outline" size="sm" onClick={add}>
        <Plus className="size-4" aria-hidden />
        Tambah sub-bagian
      </Button>
    </div>
  );
}
