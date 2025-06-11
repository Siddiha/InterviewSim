import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { z } from "zod";

export function validateRequest(schema: z.ZodType<any, any>) {
  return async (req: NextRequest) => {
    try {
      let data;
      const contentType = req.headers.get("content-type");

      if (contentType?.includes("application/json")) {
        data = await req.json();
      } else if (
        contentType?.includes("application/x-www-form-urlencoded") ||
        contentType?.includes("multipart/form-data")
      ) {
        // For form data, you might need to parse it differently or use a library
        // For now, we'll assume JSON for simplicity in validation
        data = Object.fromEntries(await req.formData());
      } else {
        // Assuming other requests might not have a body or are handled elsewhere
        data = {};
      }

      await schema.parseAsync(data);
      return null; // No validation errors
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Return a 400 response with validation errors
        return NextResponse.json(
          {
            status: "fail",
            message: "Validation failed",
            errors: error.errors,
          },
          { status: 400 }
        );
      }
      // Re-throw unexpected errors
      throw error;
    }
  };
}

// Example Usage in an API route:
/*
import { NextRequest, NextResponse } from 'next/server';
import { validateRequest } from '@/middleware/validation'; // Adjust the import path
import { z } from 'zod';

const userSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters long'),
});

export async function POST(req: NextRequest) {
  const validationErrorResponse = await validateRequest(userSchema)(req);
  if (validationErrorResponse) {
    return validationErrorResponse;
  }

  // If validation passes, process the request
  // const body = await req.json(); // Or get data from req in validateRequest
  // ... process valid data ...

  return NextResponse.json({ status: 'success', message: 'User created' });
}
*/
