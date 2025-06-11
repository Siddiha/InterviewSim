import { HTMLAttributes } from "react";
import { clsx } from "clsx";

interface ProgressProps extends HTMLAttributes<HTMLDivElement> {
  value: number;
}

const Progress = ({ value, className, ...props }: ProgressProps) => {
  return (
    <div
      className={clsx(
        "w-full h-2 bg-gray-200 rounded-full overflow-hidden",
        className
      )}
      {...props}
    >
      <div
        className="h-full bg-blue-600 transition-all duration-500 ease-in-out"
        style={{ width: `${value}%` }}
      ></div>
    </div>
  );
};

export { Progress };
