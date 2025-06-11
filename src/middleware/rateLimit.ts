import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

const store: RateLimitStore = {};
const WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS = 100; // 100 requests per minute

export function rateLimit(req: NextRequest): NextResponse | null {
  const ip = req.ip || "anonymous";
  const now = Date.now();

  if (!store[ip] || now > store[ip].resetTime) {
    store[ip] = {
      count: 1,
      resetTime: now + WINDOW_MS,
    };
    return null;
  }

  store[ip].count++;

  if (store[ip].count > MAX_REQUESTS) {
    return NextResponse.json(
      {
        status: "error",
        message: "Too many requests, please try again later.",
      },
      { status: 429 }
    );
  }

  return null;
}
