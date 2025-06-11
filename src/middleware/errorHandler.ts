import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export class AppError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public isOperational = true
  ) {
    super(message);
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export function errorHandler(
  error: Error | AppError,
  req: NextRequest
): NextResponse {
  if (error instanceof AppError) {
    return NextResponse.json(
      {
        status: "error",
        message: error.message,
      },
      { status: error.statusCode }
    );
  }

  // Log unexpected errors
  console.error("Unexpected error:", error);

  return NextResponse.json(
    {
      status: "error",
      message: "Internal server error",
    },
    { status: 500 }
  );
}
