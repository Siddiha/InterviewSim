import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Textarea"; // Assuming Textarea exists in ui
import Form from "@/components/common/Form"; // Using the generic Form component

interface Question {
  id: string;
  text: string;
  // Add question type or other relevant properties
}

interface QuestionFormProps {
  question: Question;
  onSubmit: (answer: any) => void;
  loading?: boolean;
}

export default function QuestionForm({
  question,
  onSubmit,
  loading = false,
}: QuestionFormProps) {
  const [answer, setAnswer] = useState("");

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // Basic check if the answer is not empty for text type
    if (answer.trim()) {
      onSubmit(answer);
      setAnswer(""); // Clear the input after submission
    } else {
      alert("Please provide an answer."); // Simple alert for demonstration
    }
  };

  // Basic rendering based on implied text question type
  return (
    <Form onSubmit={handleSubmit}>
      <div className="grid gap-4 py-4">
        <div className="grid gap-2">
          <label htmlFor="answer" className="text-lg font-semibold">
            Your Answer:
          </label>
          <Textarea
            id="answer"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            disabled={loading}
            rows={6} // Provide some height for the textarea
          />
        </div>
      </div>
      <div className="flex justify-end">
        <Button type="submit" disabled={loading}>
          {loading ? "Submitting..." : "Submit Answer"}
        </Button>
      </div>
    </Form>
  );
}
