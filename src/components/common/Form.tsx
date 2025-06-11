import React from "react";

interface FormProps extends React.FormHTMLAttributes<HTMLFormElement> {
  children: React.ReactNode;
}

export default function Form({ children, ...props }: FormProps) {
  return <form {...props}>{children}</form>;
}
