import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/auth";
import { db } from "@/lib/db";
import { createInterviewSchema } from "@/lib/validations";
// Assuming you have a validation schema for creating interviews
// import { createInterviewSchema } from '@/lib/validations';

interface InterviewData {
  id: string;
  title: string;
  createdAt: Date;
  score: number | null;
}

export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);

    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // Fetch interviews for the logged-in user
    const interviews = await db.interview.findMany({
      where: { userId: user.id },
      orderBy: {
        createdAt: "desc",
      },
      // Select fields you want to return to the frontend
      select: {
        id: true,
        title: true,
        createdAt: true,
        score: true, // Assuming an interview has a score field
      },
    });

    // Format the date for each interview (optional, could be done on frontend)
    const formattedInterviews = interviews.map((interview: InterviewData) => ({
      ...interview,
      date: new Date(interview.createdAt).toLocaleDateString(),
    }));

    return NextResponse.json(formattedInterviews);
  } catch (error) {
    console.error("Error fetching interviews:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);

    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const body = await request.json();

    // 1. Validate input using Zod schema
    const validatedData = createInterviewSchema.parse(body);

    // 2. Create a new interview session in the database
    const newInterview = await db.interview.create({
      data: {
        userId: user.id,
        title: validatedData.title || `New ${validatedData.type} Interview`, // Use provided title or generate one
        description: validatedData.description,
        type: validatedData.type,
        difficulty: validatedData.difficulty,
        duration: validatedData.duration,
        status: "draft", // Initial status
        // Add other necessary fields based on your schema
      },
    });

    // TODO: Potentially generate initial questions here or in a separate step

    // 3. Return the ID of the newly created interview session
    return NextResponse.json({ id: newInterview.id }, { status: 201 });
  } catch (error: any) {
    console.error("Error creating new interview:", error);

    // Handle Zod validation errors
    if (error.name === "ZodError") {
      return NextResponse.json(
        { error: "Invalid input data", details: error.errors },
        { status: 400 }
      );
    }

    // Handle other potential errors
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
