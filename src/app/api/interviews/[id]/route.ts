import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/auth";
import { db } from "@/lib/db";
// Assuming you might have an update schema or reuse createInterviewSchema
// import { updateInterviewSchema } from '@/lib/validations';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getUserFromRequest(request);

    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const interviewId = params.id;

    // Fetch the specific interview for the logged-in user
    const interview = await db.interview.findUnique({
      where: {
        id: interviewId,
        userId: user.id, // Ensure the user owns this interview
      },
      // Include related data if needed (e.g., questions)
      // include: {
      //   questions: true,
      // },
    });

    if (!interview) {
      return NextResponse.json(
        { error: "Interview not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(interview);
  } catch (error) {
    console.error("Error fetching interview:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getUserFromRequest(request);

    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const interviewId = params.id;
    const body = await request.json();

    // Optional: Validate input using a Zod schema if you have one for updates
    // const validatedData = updateInterviewSchema.parse(body);

    // Check if the interview exists and belongs to the user
    const existingInterview = await db.interview.findUnique({
      where: {
        id: interviewId,
        userId: user.id,
      },
    });

    if (!existingInterview) {
      return NextResponse.json(
        { error: "Interview not found or does not belong to you" },
        { status: 404 }
      );
    }

    // Update the interview in the database
    const updatedInterview = await db.interview.update({
      where: {
        id: interviewId,
      },
      data: {
        // Update fields based on the request body
        // You should carefully select which fields are allowed to be updated
        title: body.title ?? existingInterview.title,
        description: body.description ?? existingInterview.description,
        status: body.status ?? existingInterview.status,
        // Add other updateable fields here
      },
    });

    return NextResponse.json({
      message: "Interview updated successfully",
      interview: updatedInterview,
    });
  } catch (error: any) {
    console.error("Error updating interview:", error);

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

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getUserFromRequest(request);

    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const interviewId = params.id;

    // Check if the interview exists and belongs to the user
    const existingInterview = await db.interview.findUnique({
      where: {
        id: interviewId,
        userId: user.id,
      },
    });

    if (!existingInterview) {
      return NextResponse.json(
        { error: "Interview not found or does not belong to you" },
        { status: 404 }
      );
    }

    // Delete the interview from the database
    await db.interview.delete({
      where: {
        id: interviewId,
      },
    });

    return NextResponse.json(
      { message: "Interview deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting interview:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
