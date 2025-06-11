import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"; // Assuming Card component exists in ui
import { Button } from "@/components/ui/Button"; // Assuming Button component exists in ui
import { ArrowRight } from "lucide-react"; // Assuming lucide-react is installed for icons

interface InterviewCardProps {
  interview: {
    id: string;
    title: string;
    description: string;
    // Add other relevant interview properties here
  };
  onStartInterview: (interviewId: string) => void;
}

export default function InterviewCard({
  interview,
  onStartInterview,
}: InterviewCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{interview.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600">{interview.description}</p>
        {/* Add more details like number of questions, duration, etc. */}
        <div className="mt-4 text-right">
          <Button onClick={() => onStartInterview(interview.id)}>
            Start Interview <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
