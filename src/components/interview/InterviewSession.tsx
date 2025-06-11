import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import ProgressBar from "./ProgressBar"; // Assuming ProgressBar exists in the same directory
import Timer from "./Timer"; // Assuming Timer exists in the same directory
import QuestionDisplay from "./QuestionDisplay"; // Assuming QuestionDisplay exists
import QuestionForm from "./QuestionForm"; // Assuming QuestionForm exists
import ResponseRecorder from "./ResponseRecorder"; // Assuming ResponseRecorder exists
import EmptyState from "@/components/common/EmptyState"; // Using EmptyState
import LoadingState from "@/components/common/LoadingState"; // Using LoadingState

interface Question {
  id: string;
  text: string;
  // Add other question properties like type, options, etc.
}

interface InterviewSessionProps {
  interviewId: string;
  // Add other props like interview details, questions data, etc.
}

export default function InterviewSession({
  interviewId,
}: InterviewSessionProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [responses, setResponses] = useState<{ [questionId: string]: any }>({});

  useEffect(() => {
    // In a real application, fetch questions for the interviewId
    const fetchQuestions = async () => {
      try {
        // Simulate fetching data
        await new Promise((resolve) => setTimeout(resolve, 1000));
        const fetchedQuestions: Question[] = [
          { id: "q1", text: "Tell me about yourself." },
          { id: "q2", text: "What are your strengths and weaknesses?" },
          {
            id: "q3",
            text: "Describe a challenging situation you faced and how you overcame it.",
          },
        ];
        setQuestions(fetchedQuestions);
        setLoading(false);
      } catch (err) {
        setError("Failed to load questions.");
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [interviewId]);

  const handleAnswerSubmit = (answer: any) => {
    const currentQuestionId = questions[currentQuestionIndex]?.id;
    if (currentQuestionId) {
      setResponses((prev) => ({ ...prev, [currentQuestionId]: answer }));
    }
    // Move to the next question or finish
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      // Interview finished
      alert("Interview finished! Responses recorded."); // Replace with actual finish logic
      console.log("Recorded Responses:", responses);
    }
  };

  if (loading) {
    return <LoadingState message="Loading interview questions..." />;
  }

  if (error) {
    return <EmptyState title="Error" description={error} />;
  }

  if (questions.length === 0) {
    return (
      <EmptyState
        title="No Questions"
        description="No questions available for this interview."
      />
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <ProgressBar
          current={currentQuestionIndex + 1}
          total={questions.length}
        />
        <Timer />
      </div>
      {currentQuestion && (
        <>
          <QuestionDisplay question={currentQuestion} />
          {/* Assuming QuestionForm handles different question types */}
          <QuestionForm
            question={currentQuestion}
            onSubmit={handleAnswerSubmit}
          />
          {/* ResponseRecorder might be used to record audio/video responses */}
          {/* <ResponseRecorder questionId={currentQuestion.id} onRecordingComplete={(recording) => console.log('Recording complete', recording)} /> */}
        </>
      )}

      {/* Navigation buttons (Optional, if not using form submission for navigation) */}
      {/* <div className="mt-4 flex justify-between">
        <Button
          onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
          disabled={currentQuestionIndex === 0 || loading}
        >
          Previous
        </Button>
        <Button
          onClick={() => handleAnswerSubmit(responses[currentQuestion?.id] || null)} // Submit current answer and move next
          disabled={loading}
        >
          {currentQuestionIndex === questions.length - 1 ? 'Finish Interview' : 'Next'}
        </Button>
      </div> */}
    </div>
  );
}
