import { HTMLAttributes } from "react";
import { clsx } from "clsx";

interface CardProps extends HTMLAttributes<HTMLDivElement> {}

const Card = ({ className, children, ...props }: CardProps) => {
  return (
    <div
      className={clsx(
        "rounded-lg border bg-card text-card-foreground shadow-sm",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {}

const CardHeader = ({ className, children, ...props }: CardHeaderProps) => (
  <div className={clsx("flex flex-col space-y-1.5 p-6", className)} {...props}>
    {children}
  </div>
);

interface CardTitleProps extends HTMLAttributes<HTMLHeadingElement> {}

const CardTitle = ({ className, children, ...props }: CardTitleProps) => (
  <h3
    className={clsx(
      "text-2xl font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  >
    {children}
  </h3>
);

interface CardDescriptionProps extends HTMLAttributes<HTMLParagraphElement> {}

const CardDescription = ({
  className,
  children,
  ...props
}: CardDescriptionProps) => (
  <p className={clsx("text-sm text-muted-foreground", className)} {...props}>
    {children}
  </p>
);

interface CardContentProps extends HTMLAttributes<HTMLDivElement> {}

const CardContent = ({ className, children, ...props }: CardContentProps) => (
  <div className={clsx("p-6 pt-0", className)} {...props}>
    {children}
  </div>
);

interface CardFooterProps extends HTMLAttributes<HTMLDivElement> {}

const CardFooter = ({ className, children, ...props }: CardFooterProps) => (
  <div className={clsx("flex items-center p-6 pt-0", className)} {...props}>
    {children}
  </div>
);

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
};
