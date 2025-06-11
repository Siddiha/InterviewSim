"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth"; // Assuming useAuth is needed for user context
import Loading from "@/components/ui/Loading"; // Assuming Loading component exists
import ErrorMessage from "@/components/ui/ErrorMessage"; // Assuming ErrorMessage component exists

interface Interview {
  id: string;
  title: string;
  date: string;
  score: number | null;
}

export default function InterviewsPage() {
  const { user, loading: authLoading } = useAuth(); // Use user context if needed
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInterviews = async () => {
      // Fetch interviews only if user is loaded and available
      if (!user && !authLoading) {
        setIsLoading(false);
        return;
      }
      if (!user) return; // Wait for user to be loaded

      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch("/api/interviews");
        if (response.ok) {
          const data: Interview[] = await response.json();
          setInterviews(data);
        } else {
          const errorData = await response.json();
          setError(errorData.error || "Failed to fetch interviews");
          setInterviews([]); // Clear interviews on error
        }
      } catch (error) {
        console.error("Error fetching interviews:", error);
        setError("An unexpected error occurred while fetching interviews.");
        setInterviews([]); // Clear interviews on error
      } finally {
        setIsLoading(false);
      }
    };

    fetchInterviews();
  }, [user, authLoading]); // Depend on user and authLoading state

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
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

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">My Interviews</h1>
      {interviews.length === 0 ? (
        <p>You haven't completed any interviews yet.</p>
      ) : (
        <ul className="space-y-4">
          {interviews.map((interview) => (
            <li
              key={interview.id}
              className="bg-white rounded-lg shadow-md p-4 flex justify-between items-center"
            >
              <div>
                <h2 className="text-lg font-semibold">{interview.title}</h2>
                <p className="text-sm text-gray-600">Date: {interview.date}</p>
                <p className="text-sm text-gray-600">
                  Score:{" "}
                  {interview.score !== null ? `${interview.score}%` : "N/A"}
                </p>
              </div>
              <Link
                href={`/dashboard/interviews/${interview.id}`}
                className="text-blue-600 hover:underline"
              >
                View Details
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
