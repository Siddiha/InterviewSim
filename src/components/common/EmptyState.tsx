import React from "react";

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  children?: React.ReactNode;
}

export default function EmptyState({
  title = "No data available",
  description = "There is nothing to display here at the moment.",
  icon,
  children,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center text-gray-500">
      {icon && <div className="mb-4 text-4xl">{icon}</div>}
      {title && (
        <h3 className="text-lg font-semibold text-gray-700">{title}</h3>
      )}
      {description && <p className="mt-2 text-sm">{description}</p>}
      {children && <div className="mt-4">{children}</div>}
    </div>
  );
}
