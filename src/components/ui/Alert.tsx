import { HTMLAttributes } from "react";
import { clsx } from "clsx";

interface AlertProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "destructive";
}

const Alert = ({
  className,
  variant = "default",
  children,
  ...props
}: AlertProps) => {
  return (
    <div
      className={clsx(
        "p-4 rounded-md",
        variant === "default" && "bg-blue-50 text-blue-800",
        variant === "destructive" && "bg-red-50 text-red-800",
        className
      )}
      role="alert"
      {...props}
    >
      {children}
    </div>
  );
};

export { Alert };
