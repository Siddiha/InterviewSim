// Placeholder for validation utility functions
import { z } from "zod";

// Auth schemas
export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const registerSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

// Interview schemas
export const createInterviewSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  type: z.enum(["TECHNICAL", "BEHAVIORAL", "CASE_STUDY", "GENERAL", "CODING"]),
  difficulty: z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED", "EXPERT"]),
  duration: z.number().min(5).max(180), // 5 minutes to 3 hours
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
