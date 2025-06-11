import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/auth";
import { db } from "@/lib/db";

// Define interfaces for the data structure returned by the Prisma query
interface Answer {
  id: string;
  text: string;
  // Add other fields if included in the Prisma query (e.g., audioUrl, videoUrl, feedback, score)
  // audioUrl?: string;
  // videoUrl?: string;
  // feedback?: string;
  // score?: number;
}

interface QuestionWithAnswers {
  id: string;
  text: string;
  order: number;
  answers: Answer[];
}

interface InterviewWithQuestionsAndAnswers {
  id: string;
  title: string;
  score: number | null;
  // feedback?: string; // If feedback is directly on the interview model
  questions: QuestionWithAnswers[];
}

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

    // Fetch the specific interview and its results for the logged-in user
    // This assumes your Prisma schema links Answers back to the Interview and includes score/feedback fields
    const interview = (await db.interview.findUnique({
      where: {
        id: interviewId,
        userId: user.id, // Ensure the user owns this interview
      },
      include: {
        // Include related data needed for results
        questions: {
          orderBy: { order: "asc" },
          include: {
            answers: {
              orderBy: { createdAt: "asc" },
              // TODO: Include feedback or scores associated with answers if they exist
            },
          },
        },
        // TODO: Include overall interview feedback or score if they exist directly on the interview model
      },
    })) as InterviewWithQuestionsAndAnswers | null;

    if (!interview) {
      return NextResponse.json(
        { error: "Interview results not found" },
        { status: 404 }
      );
    }

    // You might want to format the data before sending it to the frontend
    // For example, calculate an overall score if not stored directly
    const resultsData = {
      id: interview.id,
      title: interview.title,
      score: interview.score, // Assuming score is directly on the interview model
      // feedback: interview.feedback, // Assuming feedback is directly on the interview model
      questions: interview.questions.map((q: QuestionWithAnswers) => ({
        id: q.id,
        text: q.text,
        // Include answer details
        answers: q.answers.map((a: Answer) => ({
          id: a.id,
          text: a.text,
          // audioUrl: a.audioUrl, // Assuming these fields exist on Answer model
          // videoUrl: a.videoUrl,
          // TODO: Include answer-specific feedback/score
        })),
      })),
    };

    return NextResponse.json(resultsData);
  } catch (error) {
    console.error("Error fetching interview results:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Add other methods as needed (e.g., POST to submit results)
