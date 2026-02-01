import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const locale = request.cookies.get("NEXT_LOCALE")?.value || "de";

  // We will not redirect to /de/dashboard, instead we'll just let the request pass
  // and rely on the NextIntlClientProvider reading the cookie or the server component reading it.
  // Actually, next-intl usually requires middleware to rewrite the URL internally or set headers.

  // Minimal middleware to ensure we don't break existing auth flows if any.
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
