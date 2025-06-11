import React from "react";

interface QuestionDisplayProps {
  question: {
    id: string;
    text: string;
    // Include other question properties needed for display
  };
}

export default function QuestionDisplay({ question }: QuestionDisplayProps) {
  return (
    <div className="mb-6">
      <h4 className="text-xl font-semibold text-gray-800">Question:</h4>
      <p className="mt-2 text-gray-700">{question.text}</p>
      {/* Add rendering logic for different question types if applicable */}
    </div>
  );
}
