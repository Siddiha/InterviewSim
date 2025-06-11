"use client";

import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import Loading from "@/components/ui/Loading";
import ErrorMessage from "@/components/ui/ErrorMessage";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Textarea";
import { useAudioRecorder } from "@/hooks/useAudioRecorder";
import { useVideoRecorder } from "@/hooks/useVideoRecorder";

// Define an interface for the interview data fetched from the API
interface InterviewDetails {
  id: string;
  title: string;
  createdAt: string; // Or Date, depending on how you format it
  score: number | null;
  // Include other fields fetched from the API, e.g., questions
  questions: Array<{
    id: string;
    text: string;
    order: number;
    answers: Array<any>;
  }>; // Added basic question interface
}

export default function InterviewSessionPage() {
  const params = useParams();
  const interviewId = params.id;
  const { user, loading: authLoading } = useAuth();
  const [interview, setInterview] = useState<InterviewDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [isSavingAnswer, setIsSavingAnswer] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const {
    startRecording: startAudio,
    stopRecording: stopAudio,
    recording: audioRecording,
    audioBlob,
    error: audioError,
  } = useAudioRecorder();
  const {
    startRecording: startVideo,
    stopRecording: stopVideo,
    recording: videoRecording,
    videoBlob,
    error: videoError,
  } = useVideoRecorder();
  const [isUploadingRecording, setIsUploadingRecording] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInterviewDetails = async () => {
      if (!interviewId || !user) {
        // Wait for interviewId and user to be available
        if (!authLoading) setIsLoading(false); // Stop loading if auth is done but no user
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/interviews/${interviewId}`);
        if (response.ok) {
          const data: InterviewDetails = await response.json();
          setInterview(data);
        } else {
          const errorData = await response.json();
          setError(errorData.error || "Failed to fetch interview details.");
          setInterview(null);
        }
      } catch (error) {
        console.error("Error fetching interview details:", error);
        setError(
          "An unexpected error occurred while fetching interview details."
        );
        setInterview(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInterviewDetails();
  }, [interviewId, user, authLoading]); // Depend on interviewId, user, and authLoading

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (timerRunning) {
      timer = setInterval(() => {
        setTimeElapsed((prevTime) => prevTime + 1);
      }, 1000);
    }

    return () => clearInterval(timer);
  }, [timerRunning]);

  useEffect(() => {
    // Start the timer when interview data is loaded and available
    if (interview && !isLoading && !authLoading) {
      setTimerRunning(true);
    }
  }, [interview, isLoading, authLoading]);

  const currentQuestion = interview?.questions[currentQuestionIndex];

  const saveAnswer = async () => {
    if (!interviewId || !currentQuestion) {
      // Need interview and current question to save an answer
      return false; // Indicate save failed due to missing context
    }

    setIsSavingAnswer(true);
    setSaveError(null);
    setUploadError(null); // Clear previous upload errors

    let audioUrl: string | null = null;
    let videoUrl: string | null = null;

    // 1. Upload recordings if they exist
    if (audioBlob) {
      setIsUploadingRecording(true);
      const formData = new FormData();
      formData.append("file", audioBlob, `audio-${currentQuestion.id}.wav`);
      try {
        const uploadResponse = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });
        if (uploadResponse.ok) {
          const data = await uploadResponse.json();
          audioUrl = data.url;
        } else {
          const errorData = await uploadResponse.json();
          setUploadError(errorData.error || "Failed to upload audio.");
          setIsSavingAnswer(false); // Stop saving process if upload fails
          setIsUploadingRecording(false);
          return false; // Indicate save failed
        }
      } catch (error) {
        console.error("Audio upload error:", error);
        setUploadError("An unexpected error occurred during audio upload.");
        setIsSavingAnswer(false); // Stop saving process if upload fails
        setIsUploadingRecording(false);
        return false; // Indicate save failed
      } finally {
        setIsUploadingRecording(false);
      }
    }

    if (videoBlob) {
      setIsUploadingRecording(true); // Might overlap with audio, refine loading state if needed
      const formData = new FormData();
      formData.append("file", videoBlob, `video-${currentQuestion.id}.webm`);
      try {
        const uploadResponse = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });
        if (uploadResponse.ok) {
          const data = await uploadResponse.json();
          videoUrl = data.url;
        } else {
          const errorData = await uploadResponse.json();
          setUploadError(errorData.error || "Failed to upload video.");
          setIsSavingAnswer(false); // Stop saving process if upload fails
          setIsUploadingRecording(false);
          return false; // Indicate save failed
        }
      } catch (error) {
        console.error("Video upload error:", error);
        setUploadError("An unexpected error occurred during video upload.");
        setIsSavingAnswer(false); // Stop saving process if upload fails
        setIsUploadingRecording(false);
        return false; // Indicate save failed
      } finally {
        setIsUploadingRecording(false);
      }
    }

    // If there's no text answer and no recordings, maybe don't save anything?
    if (userAnswer === "" && !audioUrl && !videoUrl) {
      setIsSavingAnswer(false); // Stop saving process
      return true; // Treat as successful if nothing to save
    }

    // 2. Save answer text and recording URLs
    try {
      const response = await fetch(`/api/interviews/${interviewId}/answer`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          questionId: currentQuestion.id,
          answerText: userAnswer,
          audioUrl: audioUrl, // Include uploaded audio URL
          videoUrl: videoUrl, // Include uploaded video URL
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setSaveError(errorData.error || "Failed to save answer.");
        return false; // Indicate save failed
      }
      return true; // Indicate save was successful
    } catch (error) {
      console.error("Error saving answer:", error);
      setSaveError("An unexpected error occurred while saving your answer.");
      return false; // Indicate save failed
    } finally {
      setIsSavingAnswer(false);
    }
  };

  const handleNextQuestion = async () => {
    // Stop recordings before saving and moving to the next question
    stopAudio();
    stopVideo();
    const saved = await saveAnswer();
    if (saved) {
      setUserAnswer(""); // Clear input for next question
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handleEndInterview = async () => {
    // Stop recordings before saving and ending the interview
    stopAudio();
    stopVideo();
    const saved = await saveAnswer();
    if (saved) {
      // TODO: Redirect to results page or show completion message
      alert("Interview Ended and Answers Saved!"); // Placeholder
      // router.push(`/dashboard/interviews/${interviewId}/results`); // Example redirect
    }
  };

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
            Please login to view interview details.
          </p>
          <Link href="/auth/login">
            <Button>Go to Login</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (!interview) {
    return (
      <div className="container mx-auto px-4 py-8">
        <ErrorMessage message="Interview not found or you do not have permission to view it." />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">
        Interview Session: {interview.title}
      </h1>
      <p>Interview ID: {interview.id}</p>
      <p>Date: {new Date(interview.createdAt).toLocaleDateString()}</p>
      <p>Score: {interview.score !== null ? `${interview.score}%` : "N/A"}</p>

      {/* Timer Display */}
      <div className="mt-4 text-lg font-semibold text-gray-700">
        Time Elapsed:{" "}
        {Math.floor(timeElapsed / 60)
          .toString()
          .padStart(2, "0")}
        :
        {Math.floor(timeElapsed % 60)
          .toString()
          .padStart(2, "0")}
      </div>

      {/* Current Question */}
      {currentQuestion ? (
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">
            Question {currentQuestionIndex + 1}
          </h2>
          <p className="text-gray-800">{currentQuestion.text}</p>

          {/* Answer Input */}
          <div className="mt-6">
            <label
              htmlFor="userAnswer"
              className="block text-sm font-medium text-gray-700"
            >
              Your Answer
            </label>
            <Textarea
              id="userAnswer"
              name="userAnswer"
              value={userAnswer}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                setUserAnswer(e.target.value)
              }
              rows={6}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              placeholder="Type your answer here..."
            />
          </div>

          {/* Navigation Buttons (basic example) */}
          <div className="mt-6 flex justify-between">
            {currentQuestionIndex > 0 && (
              <Button
                onClick={() => setCurrentQuestionIndex((prev) => prev - 1)}
                variant="outline"
              >
                Previous Question
              </Button>
            )}
            {currentQuestionIndex < interview.questions.length - 1 ? (
              <Button onClick={handleNextQuestion} disabled={isSavingAnswer}>
                Next Question
              </Button>
            ) : (
              <Button onClick={handleEndInterview} disabled={isSavingAnswer}>
                {isSavingAnswer ? "Saving..." : "End Interview"}
              </Button>
            )}
          </div>
          {saveError && (
            <ErrorMessage
              message={`Save Error: ${saveError}`}
              className="mt-4"
            />
          )}
          {/* TODO: Add feedback/evaluation display */}
          {/* Recording Controls (basic example) */}
          <div className="mt-6 flex items-center space-x-4">
            {audioRecording ? (
              <Button onClick={stopAudio} variant="outline">
                Stop Audio Recording
              </Button>
            ) : (
              <Button onClick={startAudio}>Start Audio Recording</Button>
            )}
            {videoRecording ? (
              <Button onClick={stopVideo} variant="outline">
                Stop Video Recording
              </Button>
            ) : (
              <Button onClick={startVideo}>Start Video Recording</Button>
            )}
            {/* TODO: Display recording status or errors */}
            {(audioError || videoError) && (
              <ErrorMessage
                message={`Recording Error: ${audioError || videoError}`}
              />
            )}
          </div>
        </div>
      ) : (
        <p className="mt-8">No questions found for this interview.</p>
      )}
    </div>
  );
}
