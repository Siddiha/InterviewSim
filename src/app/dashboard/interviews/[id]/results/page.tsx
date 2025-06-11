"use client";

import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import Loading from "@/components/ui/Loading";
import ErrorMessage from "@/components/ui/ErrorMessage";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

// Define interface for results data (placeholder)
interface InterviewResults {
  id: string;
  title: string;
  score: number | null;
  feedback?: string; // Example feedback field
  // TODO: Add more detailed results like per-question feedback, etc.
}

export default function InterviewResultsPage() {
  const params = useParams();
  const interviewId = params.id as string;
  const { user, loading: authLoading } = useAuth();
  const [results, setResults] = useState<InterviewResults | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchResults = async () => {
      if (!interviewId || !user) {
        if (!authLoading) setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        // TODO: Create this API route
        const response = await fetch(`/api/interviews/${interviewId}/results`);
        if (response.ok) {
          const data: InterviewResults = await response.json();
          setResults(data);
        } else {
          const errorData = await response.json();
          setError(errorData.error || "Failed to fetch interview results.");
          setResults(null);
        }
      } catch (error) {
        console.error("Error fetching interview results:", error);
        setError(
          "An unexpected error occurred while fetching interview results."
        );
        setResults(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchResults();
  }, [interviewId, user, authLoading]);

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <ErrorMessage message={error} />
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
            Please login to view interview results.
          </p>
          <Link href="/auth/login">
            <Button>Go to Login</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (!results) {
    return (
      <div className="container mx-auto px-4 py-8">
        <ErrorMessage message="Interview results not found or you do not have permission to view them." />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">
        Interview Results: {results.title}
      </h1>
      <p className="text-lg">
        Overall Score: {results.score !== null ? `${results.score}%` : "N/A"}
      </p>

      {results.feedback && (
        <div className="mt-4">
          <h2 className="text-xl font-semibold mb-2">Feedback</h2>
          <p>{results.feedback}</p>
        </div>
      )}

      {/* TODO: Display detailed per-question feedback and answers */}

      <div className="mt-8">
        <Link href="/dashboard/interviews">
          <Button variant="outline">Back to Interviews</Button>
        </Link>
      </div>
    </div>
  );
}
