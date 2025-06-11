"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import Link from "next/link";
// Assuming you might need ErrorMessage and Loading
// import ErrorMessage from '@/components/ui/ErrorMessage';
// import Loading from '@/components/ui/Loading';

// Define interfaces for interview parameters based on your validations.ts if available
interface InterviewParameters {
  type: string; // e.g., TECHNICAL, BEHAVIORAL
  difficulty: string; // e.g., BEGINNER, INTERMEDIATE
  duration: number; // in minutes
}

export default function PracticePage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [parameters, setParameters] = useState<InterviewParameters>({
    type: "TECHNICAL", // Default value
    difficulty: "BEGINNER", // Default value
    duration: 30, // Default duration in minutes
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setParameters((prev) => ({
      ...prev,
      [name]: name === "duration" ? parseInt(value, 10) : value,
    }));
  };

  const startInterview = async () => {
    if (!user) {
      setError("You must be logged in to start an interview.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/interviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(parameters),
      });

      if (response.ok) {
        const session = await response.json();
        // Assuming the API returns the new interview session ID or slug
        router.push(`/interview/${session.id}`); // Redirect to the interview session page
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Failed to start interview.");
      }
    } catch (error) {
      console.error("Error starting interview:", error);
      setError("An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  // Optional: Show loading or redirect if user is not authenticated
  if (authLoading) {
    // You might want a full page loading spinner here
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    // Redirect handled by middleware, but a message here is good practice
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-4">
            Please login to start a practice interview.
          </p>
          <Link href="/auth/login">
            <Button>Go to Login</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">
        Start a New Practice Interview
      </h1>

      {/* {error && <ErrorMessage message={error} />} */}

      <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
        <p>Select your interview parameters:</p>

        {/* Interview Type Selection (using basic select for now) */}
        <div>
          <label
            htmlFor="type"
            className="block text-sm font-medium text-gray-700"
          >
            Interview Type
          </label>
          <select
            id="type"
            name="type"
            value={parameters.type}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          >
            {/* TODO: Fetch actual interview types from backend if dynamic */}
            <option value="TECHNICAL">Technical</option>
            <option value="BEHAVIORAL">Behavioral</option>
            <option value="CASE_STUDY">Case Study</option>
            <option value="GENERAL">General</option>
            <option value="CODING">Coding</option>
          </select>
        </div>

        {/* Difficulty Selection (using basic select for now) */}
        <div>
          <label
            htmlFor="difficulty"
            className="block text-sm font-medium text-gray-700"
          >
            Difficulty
          </label>
          <select
            id="difficulty"
            name="difficulty"
            value={parameters.difficulty}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          >
            {/* TODO: Fetch actual difficulty levels from backend if dynamic */}
            <option value="BEGINNER">Beginner</option>
            <option value="INTERMEDIATE">Intermediate</option>
            <option value="ADVANCED">Advanced</option>
            <option value="EXPERT">Expert</option>
          </select>
        </div>

        {/* Duration Input */}
        <Input
          label="Duration (minutes)"
          id="duration"
          name="duration"
          type="number"
          value={parameters.duration}
          onChange={handleInputChange}
          min="5"
          max="180"
        />

        <Button onClick={startInterview} disabled={isLoading}>
          {isLoading ? "Starting..." : "Start Interview"}
        </Button>
      </div>
    </div>
  );
}
