import { NextRequest, NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import path from "path";
import { getUserFromRequest } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);

    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Create a unique filename (e.g., using user ID, interview ID, question ID, timestamp)
    // This is a simplified example; consider a more robust naming strategy and storage solution (e.g., cloud storage)
    const filename = `${user.id}-${Date.now()}-${file.name}`.replace(
      /[^a-zA-Z0-9_.-]/g,
      "_"
    );

    // Define the upload directory path (relative to your project structure)
    // Make sure this directory exists and is accessible.
    // For a production app, store files outside the public directory and serve them securely.
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    // Ensure the upload directory exists
    // import { mkdir } from 'fs/promises';
    // await mkdir(uploadDir, { recursive: true });

    const filePath = path.join(uploadDir, filename);
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    await writeFile(filePath, buffer);

    // Construct the public URL to access the file
    const fileUrl = `/uploads/${filename}`;

    return NextResponse.json({ url: fileUrl }, { status: 201 });
  } catch (error) {
    console.error("Error uploading file:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Add other methods as needed (e.g., GET for listing uploaded files if applicable)
