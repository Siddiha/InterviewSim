import { NextResponse } from "next/server";

export async function GET(request: Request) {
  // Example endpoint to get questions
  return NextResponse.json({ message: "Questions GET endpoint reached" });
}

export async function POST(request: Request) {
  // Example endpoint to create a new question
  const data = await request.json();
  console.log("Received data for questions POST:", data);
  return NextResponse.json({
    message: "Questions POST endpoint reached",
    receivedData: data,
  });
}

// Add other methods as needed
