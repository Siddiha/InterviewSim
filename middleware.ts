import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Define the paths that require authentication
const protectedRoutes = [
  "/dashboard",
  "/dashboard/interviews",
  "/dashboard/practice",
];
const authRoutes = ["/auth/login", "/auth/register"];

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const { pathname } = request.nextUrl;

  // If the user is trying to access a protected route
  if (protectedRoutes.some((route) => pathname.startsWith(route))) {
    // If there is no token, redirect to login
    if (!token) {
      const url = request.nextUrl.clone();
      url.pathname = "/auth/login";
      return NextResponse.redirect(url);
    }
    // TODO: Add token verification logic here if needed (e.g., check against an API route)
  }

  // If the user is logged in (has a token) and tries to access an auth route, redirect to dashboard
  if (token && authRoutes.some((route) => pathname.startsWith(route))) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  // Continue as normal for all other cases
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)?"],
};
