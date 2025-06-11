import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id;
  // Example endpoint to get a specific question by ID
  return NextResponse.json({ message: `Question ${id} GET endpoint reached` });
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id;
  const data = await request.json();
  // Example endpoint to update a specific question by ID
  console.log(`Received data to update question ${id}:`, data);
  return NextResponse.json({
    message: `Question ${id} PUT endpoint reached`,
    receivedData: data,
  });
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id;
  // Example endpoint to delete a specific question by ID
  console.log(`Received request to delete question ${id}`);
  return NextResponse.json({
    message: `Question ${id} DELETE endpoint reached`,
  });
}

// Add other methods as needed
