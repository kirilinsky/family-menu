import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Belt 1: edge gate for admin-only routes. The page re-checks the session
// (belt 2) and the form is wrapped in AdminOnly (belt 3).
export default clerkMiddleware(async (auth, request) => {
  if (request.nextUrl.pathname.startsWith("/add-dish")) {
    const { userId } = await auth();
    if (!userId || userId !== process.env.ADMIN_USER_ID) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and static files
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
    // Clerk auto-proxy
    "/__clerk/:path*",
  ],
};
