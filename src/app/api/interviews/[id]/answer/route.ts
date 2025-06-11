import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(
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
    const { questionId, answerText } = body; // Assuming body contains questionId and answerText

    if (!questionId || answerText === undefined) {
      return NextResponse.json(
        { error: "Missing questionId or answerText" },
        { status: 400 }
      );
    }

    // Verify the interview exists and belongs to the user
    const interview = await db.interview.findUnique({
      where: {
        id: interviewId,
        userId: user.id,
      },
    });

    if (!interview) {
      return NextResponse.json(
        { error: "Interview not found or does not belong to you" },
        { status: 404 }
      );
    }

    // Verify the question exists within this interview
    const question = await db.question.findFirst({
      where: {
        id: questionId,
        interviewId: interviewId, // Ensure question belongs to this interview
      },
    });

    if (!question) {
      return NextResponse.json(
        { error: "Question not found within this interview" },
        { status: 404 }
      );
    }

    // Save the user's answer
    // This assumes you have an Answer model linked to Question and User/Interview
    const newAnswer = await db.answer.create({
      data: {
        text: answerText,
        questionId: questionId,
        interviewId: interviewId, // Link answer directly to interview as well
        userId: user.id, // Link answer directly to user
        // Add other relevant fields like recording URL if applicable
      },
    });

    // TODO: Potentially trigger AI evaluation here or in a separate process

    return NextResponse.json(
      { message: "Answer saved successfully", answerId: newAnswer.id },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error saving answer:", error);

    // You might want specific error handling for database errors
    // if (error.code === 'P...') // Prisma error codes

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
