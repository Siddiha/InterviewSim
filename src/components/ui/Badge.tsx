import { HTMLAttributes } from "react";
import { clsx } from "clsx";

interface BadgeProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "outline" | "destructive";
}

const Badge = ({
  className,
  variant = "default",
  children,
  ...props
}: BadgeProps) => {
  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        variant === "default" && "bg-blue-100 text-blue-800",
        variant === "secondary" && "bg-gray-100 text-gray-800",
        variant === "outline" && "border border-gray-200 text-gray-800",
        variant === "destructive" && "bg-red-100 text-red-800",
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};

export { Badge };
