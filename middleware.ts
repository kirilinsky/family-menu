import { NextResponse, type NextRequest } from "next/server";

// Belt 1: edge gate for admin-only routes. The page itself re-checks
// the session (belt 2) and the form is wrapped in AdminOnly (belt 3).
const SESSION_COOKIE = "padmenu_session";
const ADMIN_TOKEN = "admin-dev";

export function middleware(request: NextRequest) {
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  if (token !== ADMIN_TOKEN) {
    return NextResponse.redirect(new URL("/", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/add-dish"],
};
