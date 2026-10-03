import { NextRequest, NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);

/**
 * Task-Level Security & Role-Based Access Control (RBAC) Middleware.
 * Enforces role isolation, blocks privilege escalation, and stops unauthorized
 * cross-role requests at the routing boundary.
 */
export default async function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  // 1. Read authenticated role & unit cookies
  const role = request.cookies.get("silaibook_role")?.value;
  const sectionParam = searchParams.get("tab") || searchParams.get("section");

  // 2. Strict Admin Module Security:
  // Global User and Access Auditor are strictly blocked from obtaining or inheriting admin permissions.
  const isTargetingAdmin =
    pathname.includes("/admin") ||
    sectionParam === "mainAdmin" ||
    sectionParam === "main_admin_overview";

  if (isTargetingAdmin) {
    if (role !== "main_admin") {
      const localeMatch = pathname.match(/^\/(en|gu|hi)/);
      const locale = localeMatch ? localeMatch[1] : "en";
      const redirectUrl = new URL(`/${locale}/dashboard`, request.url);
      redirectUrl.searchParams.set("access_denied", "true");
      return NextResponse.redirect(redirectUrl);
    }
  }

  // 3. Strict Verification & Salary Task Protection for Tailors
  const isManagerOrOwnerTask =
    sectionParam === "verification" ||
    sectionParam === "salary" ||
    sectionParam === "audit";

  if (isManagerOrOwnerTask && role === "tailor") {
    const localeMatch = pathname.match(/^\/(en|gu|hi)/);
    const locale = localeMatch ? localeMatch[1] : "en";
    const redirectUrl = new URL(`/${locale}/dashboard`, request.url);
    redirectUrl.searchParams.set("access_denied", "true");
    return NextResponse.redirect(redirectUrl);
  }

  // 4. Pass through next-intl routing middleware
  const response = intlMiddleware(request);

  // 5. Enforce Production Security Headers
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Permissions-Policy",
    "camera=(self), microphone=(), geolocation=()"
  );

  return response;
}

export const config = {
  // Match all pathnames except for
  // - api routes
  // - _next (Next.js internals)
  // - static files (images, icons, etc.)
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
