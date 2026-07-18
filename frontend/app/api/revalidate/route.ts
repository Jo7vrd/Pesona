import { revalidateTag } from "next/cache";
import { NextResponse, type NextRequest } from "next/server";

const VALID_TAGS = new Set(["makanan", "budaya", "bahasa", "destinasi"]);

/**
 * Webhook dari backend Go: dipanggil setelah admin mengubah konten agar
 * halaman publik (ISR dengan cache tag) langsung segar.
 */
export async function POST(request: NextRequest) {
  const secret = process.env.REVALIDATE_SECRET;
  if (!secret || request.headers.get("x-revalidate-secret") !== secret) {
    return NextResponse.json({ message: "Tidak diizinkan." }, { status: 401 });
  }

  let tag: unknown;
  try {
    ({ tag } = await request.json());
  } catch {
    return NextResponse.json({ message: "Body tidak valid." }, { status: 400 });
  }

  if (typeof tag !== "string" || !VALID_TAGS.has(tag)) {
    return NextResponse.json({ message: "Tag tidak dikenal." }, { status: 400 });
  }

  // Next 16: argumen kedua adalah profil kedaluwarsa; "max" = perilaku
  // lama (basmi cache tag sepenuhnya)
  revalidateTag(tag, "max");
  return NextResponse.json({ revalidated: tag, at: Date.now() });
}
