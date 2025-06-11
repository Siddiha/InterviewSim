import React from "react";
import Loading from "@/components/ui/Loading";

interface LoadingStateProps {
  message?: string;
  size?: "sm" | "md" | "lg";
}

export default function LoadingState({
  message = "Loading...",
  size = "md",
}: LoadingStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center text-gray-500">
      <Loading size={size} />
      {message && <p className="mt-4 text-sm">{message}</p>}
    </div>
  );
}
