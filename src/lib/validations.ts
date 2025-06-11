// Placeholder for validation utility functions
import { z } from "zod";

// Auth schemas
export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const registerSchema = z.object({
  name: z.string().min(2, "Name is required and must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
});

// Interview schemas
export const createInterviewSchema = z.object({
  type: z.string().min(1, "Interview type is required"),
  difficulty: z.string().min(1, "Difficulty is required"),
  duration: z.number().min(1, "Duration must be at least 1 minute"),
  title: z.string().optional(),
  description: z.string().optional(),
});

export const createQuestionSchema = z.object({
  text: z.string().min(1, "Question text is required"),
  type: z.enum(["TEXT", "MULTIPLE_CHOICE", "CODING", "VIDEO", "AUDIO"]),
  category: z.string().default("general"),
  difficulty: z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED", "EXPERT"]),
  timeLimit: z.number().optional(),
  order: z.number().default(0),
});

// Types
export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type CreateInterviewInput = z.infer<typeof createInterviewSchema>;
export type CreateQuestionInput = z.infer<typeof createQuestionSchema>;
