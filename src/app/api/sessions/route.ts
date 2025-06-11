import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/auth";
import { db } from "@/lib/db";
// Assuming a schema for creating a session if needed
// import { createSessionSchema } from '@/lib/validations';

export async function GET(request: Request) {
  // Example endpoint to get interview sessions
  return NextResponse.json({ message: "Sessions GET endpoint reached" });
}

export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);

    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const body = await request.json();
    const { interviewId } = body; // Assuming the request body contains the interviewId

    if (!interviewId) {
      return NextResponse.json(
        { error: "interviewId is required" },
        { status: 400 }
      );
    }

    // Optional: Validate input using a Zod schema if you have one
    // const validatedData = createSessionSchema.parse(body);

    // Check if the interview exists and belongs to the user before creating a session
    const interview = await db.interview.findUnique({
      where: {
        id: interviewId,
        userId: user.id, // Ensure the user owns this interview
      },
    });

    if (!interview) {
      return NextResponse.json(
        { error: "Interview not found or does not belong to you" },
        { status: 404 }
      );
    }

    // Create a new interview session in the database
    const newSession = await db.interviewSession.create({
      data: {
        interviewId: interviewId,
        userId: user.id,
        // startTime is defaulted in the schema
        status: "in-progress", // Set initial status
        // Add other necessary fields based on your schema
      },
    });

    // You might want to return some initial session data or the first question

    return NextResponse.json(
      { message: "Session created successfully", sessionId: newSession.id },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creating session:", error);

    // Handle Zod validation errors if validation is applied
    // if (error.name === 'ZodError') {
    //   return NextResponse.json(
    //     { error: 'Invalid input data', details: error.errors },
    //     { status: 400 }
    //   );
    // }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Add other methods as needed
