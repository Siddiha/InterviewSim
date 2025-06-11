// Placeholder for authentication utility functions
import { compare, hash } from "bcryptjs";
import jwt, { Secret, SignOptions } from "jsonwebtoken";
import { NextRequest } from "next/server";
import { db } from "./db"; // Assuming db.ts is in the same directory

const JWT_SECRET: Secret = process.env.JWT_SECRET || "your-secret-key"; // Explicitly type as Secret
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d"; // Token expiration

export interface TokenPayload {
  userId: string;
  email: string;
}

// Helper function to hash passwords
export async function hashPassword(password: string): Promise<string> {
  return hash(password, 12); // Use a salt round of 12
}

// Helper function to compare passwords
export async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return compare(password, hashedPassword);
}

// Helper function to generate JWT token
export function generateToken(payload: object): string {
  return jwt.sign(
    payload,
    JWT_SECRET as string,
    { expiresIn: JWT_EXPIRES_IN } as SignOptions
  );
}

// Helper function to verify JWT token (optional, next-auth handles this if used)
export function verifyToken(token: string): any {
  try {
    return jwt.verify(token, JWT_SECRET as string);
  } catch (error) {
    return null;
  }
}

// Helper function to get user from request (assuming token in cookie or header)
export async function getUserFromRequest(
  req: NextRequest
): Promise<{ id: string; email: string; role: string } | null> {
  // Example: Get token from cookie (if using cookie-based auth)
  const token = req.cookies.get("token")?.value;

  if (!token) {
    // Example: Get token from Authorization header (if using Bearer token)
    const authHeader = req.headers.get("Authorization");
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const headerToken = authHeader.split(" ")[1];
      if (headerToken) {
        // Verify the header token
        const decoded = verifyToken(headerToken);
        if (decoded && decoded.userId) {
          // In a real app, fetch user from DB based on decoded.userId
          // For this example, we'll just return a mock user structure
          return {
            id: decoded.userId,
            email: decoded.email || "",
            role: decoded.role || "user",
          };
        }
      }
    }
    return null;
  }

  // Verify the cookie token
  const decoded = verifyToken(token);

  if (!decoded || !decoded.userId) {
    return null;
  }

  // In a real app, fetch user from DB based on decoded.userId
  // For this example, we'll just return a mock user structure
  return {
    id: decoded.userId,
    email: decoded.email || "",
    role: decoded.role || "user",
  };
}

export async function requireAuth(request: NextRequest) {
  const user = await getUserFromRequest(request);
  if (!user) {
    throw new Error("Authentication required");
  }
  return user;
}
