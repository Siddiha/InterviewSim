import React, { useState } from "react";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import Form from "@/components/common/Form"; // Using the generic Form component

interface CreateInterviewFormProps {
  onSubmit: (data: { title: string; description: string }) => void;
  loading?: boolean;
}

export default function CreateInterviewForm({
  onSubmit,
  loading = false,
}: CreateInterviewFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // Basic validation (can be enhanced with Zod)
    if (title.trim() && description.trim()) {
      onSubmit({ title, description });
    } else {
      alert("Please fill in both title and description."); // Simple alert for demonstration
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <label htmlFor="title" className="text-right">
            Title
          </label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="col-span-3"
            disabled={loading}
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <label htmlFor="description" className="text-right">
            Description
          </label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="col-span-3"
            disabled={loading}
          />
        </div>
      </div>
      <div className="flex justify-end">
        <Button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create Interview"}
        </Button>
      </div>
    </Form>
  );
}
