import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/** Halaman yang wajib login. Semua halaman lain tetap publik. */
const PROTECTED_PREFIXES = ["/akun"];

function isProtected(pathname: string) {
  return PROTECTED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

/**
 * Dijalankan di setiap permintaan oleh proxy.ts:
 * 1. menyegarkan sesi login (token) bila perlu,
 * 2. mengalihkan pengunjung yang belum login dari halaman terlindungi.
 */
export async function updateSession(request: NextRequest) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  // Tanpa konfigurasi, jangan merusak halaman publik.
  if (!url || !key) {
    return isProtected(request.nextUrl.pathname)
      ? redirectToLogin(request)
      : NextResponse.next({ request });
  }

  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet, headers) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value),
        );
        supabaseResponse = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options),
        );
        Object.entries(headers).forEach(([headerName, headerValue]) =>
          supabaseResponse.headers.set(headerName, headerValue),
        );
      },
    },
  });

  // PENTING: jangan menaruh kode apa pun di antara createServerClient dan getClaims.
  // getClaims memeriksa keaslian token; jangan diganti getSession di server.
  const { data } = await supabase.auth.getClaims();
  const isLoggedIn = Boolean(data?.claims);

  if (!isLoggedIn && isProtected(request.nextUrl.pathname)) {
    const redirect = redirectToLogin(request);
    // Bawa cookie hasil penyegaran sesi dan header cache ke respons pengalihan.
    supabaseResponse.cookies
      .getAll()
      .forEach((cookie) => redirect.cookies.set(cookie));
    for (const header of ["cache-control", "expires", "pragma"]) {
      const value = supabaseResponse.headers.get(header);
      if (value) redirect.headers.set(header, value);
    }
    return redirect;
  }

  return supabaseResponse;
}

function redirectToLogin(request: NextRequest) {
  const loginUrl = request.nextUrl.clone();
  loginUrl.pathname = "/masuk";
  loginUrl.search = "";
  loginUrl.searchParams.set("next", request.nextUrl.pathname);
  return NextResponse.redirect(loginUrl);
}