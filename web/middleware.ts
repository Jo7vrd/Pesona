import { NextResponse, type NextRequest } from "next/server";

const SESSION_COOKIE = "kk_admin_session";

/**
 * Gerbang UX untuk /admin/** (FR-009): tanpa cookie sesi, pengguna
 * diarahkan ke halaman login. Otorisasi sesungguhnya tetap divalidasi
 * backend lewat JWT pada setiap permintaan API.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasSession = request.cookies.has(SESSION_COOKIE);

  if (pathname === "/admin/login") {
    if (hasSession) {
      return NextResponse.redirect(
        new URL("/admin/dashboard", request.url)
      );
    }
    return NextResponse.next();
  }

  if (!hasSession) {
    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("dari", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
