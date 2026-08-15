/**
 * Markdown ringan & AMAN untuk deskripsi/isi konten yang dikelola admin.
 *
 * Keamanan: seluruh masukan di-escape lebih dulu (semua < > & " jadi
 * entitas), baru format terbatas diterapkan dengan menyisipkan tag milik
 * kita sendiri. Jadi HTML apa pun yang diketik admin (mis. <script>) tak
 * pernah dieksekusi — aman dari XSS.
 *
 * Didukung: **tebal**, *miring* / _miring_, [teks](url), daftar "- ",
 * dan baris baru (paragraf/`<br>`). Sengaja minimal.
 */

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Format inline pada teks yang SUDAH di-escape. */
function inline(escaped: string): string {
  let out = escaped;
  // Tautan [teks](url) — hanya http/https/mailto, sisanya dibiarkan teks.
  out = out.replace(
    /\[([^\]]+)\]\((https?:\/\/[^\s)]+|mailto:[^\s)]+)\)/g,
    (_m, text: string, url: string) =>
      `<a href="${url}" target="_blank" rel="noopener noreferrer" class="underline">${text}</a>`
  );
  // **tebal**
  out = out.replace(/\*\*([^*\n]+)\*\*/g, "<strong>$1</strong>");
  // *miring* atau _miring_
  out = out.replace(/(^|[^*])\*([^*\n]+)\*/g, "$1<em>$2</em>");
  out = out.replace(/(^|[^_])_([^_\n]+)_/g, "$1<em>$2</em>");
  return out;
}

/**
 * Ubah markdown → string HTML aman. Blok dipisah baris kosong jadi <p>;
 * baris berawalan "- " atau "* " jadi <ul><li>; baris tunggal jadi <br>.
 */
export function renderMarkdown(src: string): string {
  if (!src) return "";
  const blocks = src.replace(/\r\n/g, "\n").split(/\n{2,}/);
  const html = blocks
    .map((block) => {
      const lines = block.split("\n");
      const isList = lines.every((l) => /^\s*[-*]\s+/.test(l));
      if (isList) {
        const items = lines
          .map((l) => `<li>${inline(escapeHtml(l.replace(/^\s*[-*]\s+/, "")))}</li>`)
          .join("");
        return `<ul class="list-disc space-y-1 pl-5">${items}</ul>`;
      }
      return `<p>${inline(escapeHtml(block)).replace(/\n/g, "<br>")}</p>`;
    })
    .join("");
  return html;
}

/** Buang penanda markdown → teks polos (untuk kartu/pratinjau/OG). */
export function stripMarkdown(src: string): string {
  if (!src) return "";
  return src
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/_([^_]+)_/g, "$1")
    .replace(/^\s*[-*]\s+/gm, "")
    .replace(/\s*\n\s*/g, " ")
    .trim();
}
