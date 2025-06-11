import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ message: "Logged out successfully" });

  // Clear the token cookie by setting its expiration to the past
  response.cookies.set("token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 0, // Expire the cookie immediately
    path: "/", // Ensure the path matches where the cookie was set
  });

  return response;
}

// Add other methods as needed
