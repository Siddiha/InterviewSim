import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function authMiddleware(req: NextRequest) {
  // Replace with your actual secret
  const secret = process.env.NEXTAUTH_SECRET;

  if (!secret) {
    // Handle the case where the secret is not set
    console.error("NEXTAUTH_SECRET is not set");
    return NextResponse.json(
      {
        status: "error",
        message: "Server configuration error",
      },
      { status: 500 }
    );
  }

  const token = await getToken({ req, secret });

  if (!token) {
    return NextResponse.json(
      {
        status: "error",
        message: "Authentication required",
      },
      { status: 401 }
    );
  }

  // Add user info to request headers (example, adjust as needed)
  const requestHeaders = new Headers(req.headers);
  // Ensure these properties exist on your token type if using TypeScript
  // requestHeaders.set('x-user-id', token.sub as string);
  // requestHeaders.set('x-user-role', token.role as string);

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}
