"use client";

import { useRef } from "react";
import { Bold, Italic, Link2, List } from "lucide-react";

import { Textarea } from "@/components/ui/textarea";

/**
 * Editor teks sederhana dengan toolbar (tebal/miring/daftar/tautan) yang
 * menyisipkan markdown pada seleksi. Terkontrol lewat value/onChange, jadi
 * bisa dipakai dengan Controller react-hook-form. Hasil disimpan sebagai
 * markdown dan dirender aman di situs publik.
 */
export function RichTextEditor({
  value,
  onChange,
  id,
  placeholder,
  rows = 5,
  error,
}: {
  value: string;
  onChange: (value: string) => void;
  id?: string;
  placeholder?: string;
  rows?: number;
  error?: boolean;
}) {
  const ref = useRef<HTMLTextAreaElement>(null);

  function apply(before: string, after: string, fallback: string) {
    const ta = ref.current;
    if (!ta) return;
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const selected = value.slice(start, end) || fallback;
    const next =
      value.slice(0, start) + before + selected + after + value.slice(end);
    onChange(next);
    requestAnimationFrame(() => {
      ta.focus();
      ta.setSelectionRange(
        start + before.length,
        start + before.length + selected.length
      );
    });
  }

  function toggleList() {
    const ta = ref.current;
    if (!ta) return;
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    // Perluas ke awal baris pertama seleksi.
    const lineStart = value.lastIndexOf("\n", start - 1) + 1;
    const block = value.slice(lineStart, end);
    const listed = block
      .split("\n")
      .map((l) => (l.startsWith("- ") ? l : `- ${l}`))
      .join("\n");
    const next = value.slice(0, lineStart) + listed + value.slice(end);
    onChange(next);
    requestAnimationFrame(() => ta.focus());
  }

  const btn =
    "flex size-8 items-center justify-center rounded-md text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors";

  return (
    <div className={`rounded-xl border ${error ? "border-destructive" : ""}`}>
      <div className="flex items-center gap-0.5 border-b px-1.5 py-1">
        <button
          type="button"
          className={btn}
          aria-label="Tebal"
          title="Tebal"
          onClick={() => apply("**", "**", "teks tebal")}
        >
          <Bold className="size-4" />
        </button>
        <button
          type="button"
          className={btn}
          aria-label="Miring"
          title="Miring"
          onClick={() => apply("*", "*", "teks miring")}
        >
          <Italic className="size-4" />
        </button>
        <button
          type="button"
          className={btn}
          aria-label="Daftar"
          title="Daftar berpoin"
          onClick={toggleList}
        >
          <List className="size-4" />
        </button>
        <button
          type="button"
          className={btn}
          aria-label="Tautan"
          title="Tautan"
          onClick={() => apply("[", "](https://)", "teks tautan")}
        >
          <Link2 className="size-4" />
        </button>
        <span className="text-muted-foreground ml-auto pr-1 text-[11px]">
          Markdown
        </span>
      </div>
      <Textarea
        ref={ref}
        id={id}
        rows={rows}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-t-none border-0 focus-visible:ring-0"
      />
    </div>
  );
}
