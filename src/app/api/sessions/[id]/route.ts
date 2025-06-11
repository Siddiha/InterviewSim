import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getUserFromRequest(request);

    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const sessionId = params.id;

    // Fetch the specific session for the logged-in user
    const session = await db.interviewSession.findUnique({
      where: {
        id: sessionId,
        userId: user.id, // Ensure the user owns this session
      },
      // Include related data: the interview and potentially questions/answers within this session
      include: {
        interview: {
          include: {
            questions: {
              orderBy: { order: "asc" },
            },
          },
        },
        // Include answers linked to this session if your schema supports it
        // answers: {
        //   where: { userId: user.id }, // Ensure answers are by the same user
        //   include: { question: true }, // Include the question associated with the answer
        //   orderBy: { createdAt: 'asc' },
        // },
      },
    });

    if (!session) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    // You might want to format the session data before returning it

    return NextResponse.json(session);
  } catch (error) {
    console.error("Error fetching session:", error);
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

    const sessionId = params.id;
    const body = await request.json();

    // Check if the session exists and belongs to the user
    const existingSession = await db.interviewSession.findUnique({
      where: {
        id: sessionId,
        userId: user.id,
      },
    });

    if (!existingSession) {
      return NextResponse.json(
        { error: "Session not found or does not belong to you" },
        { status: 404 }
      );
    }

    // Update the session in the database
    const updatedSession = await db.interviewSession.update({
      where: {
        id: sessionId,
      },
      data: {
        // Update fields based on the request body
        // Example: Update status or endTime
        status: body.status ?? existingSession.status,
        endTime: body.endTime ?? existingSession.endTime,
        // Add other updateable session fields here
      },
    });

    return NextResponse.json({
      message: "Session updated successfully",
      session: updatedSession,
    });
  } catch (error: any) {
    console.error("Error updating session:", error);
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

    const sessionId = params.id;

    // Check if the session exists and belongs to the user
    const existingSession = await db.interviewSession.findUnique({
      where: {
        id: sessionId,
        userId: user.id,
      },
    });

    if (!existingSession) {
      return NextResponse.json(
        { error: "Session not found or does not belong to you" },
        { status: 404 }
      );
    }

    // Delete the session from the database
    await db.interviewSession.delete({
      where: {
        id: sessionId,
      },
    });

    return NextResponse.json(
      { message: "Session deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting session:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
