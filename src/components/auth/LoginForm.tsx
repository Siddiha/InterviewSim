import React, { useState } from "react";
import { Input } from "@/components/ui/Input"; // Assuming Input component exists
import { Button } from "@/components/ui/Button"; // Assuming Button component exists
import Form from "@/components/common/Form"; // Using the generic Form component
// import { useForm } from '@/hooks/useForm'; // You might use the useForm hook for validation
// import { loginSchema } from '@/lib/validations'; // Assuming a login validation schema exists

interface LoginFormProps {
  onSubmit: (data: { email: string; password: string }) => void;
  loading?: boolean;
  error?: string | null;
}

export default function LoginForm({
  onSubmit,
  loading = false,
  error = null,
}: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Example using useState for form state and basic validation
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // Basic validation
    if (email.trim() && password.trim()) {
      onSubmit({ email, password });
    } else {
      alert("Please enter both email and password.");
    }
  };

  // If using useForm hook:
  // const { values, errors, isSubmitting, handleChange, handleSubmit } = useForm({
  //   initialValues: { email: '', password: '' },
  //   validationSchema: loginSchema,
  //   onSubmit: (data) => onSubmit(data),
  // });

  return (
    <Form onSubmit={handleSubmit}>
      <div className="grid gap-4 py-4">
        <div className="grid gap-2">
          <label htmlFor="email">Email</label>
          <Input
            id="email"
            type="email"
            placeholder="m@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            // { ... (useForm ? { value: values.email, onChange: handleChange('email') } : {}) }
            disabled={loading}
          />
          {/* {useForm && errors.email && <p className="text-red-500 text-sm">{errors.email}</p>} */}
        </div>
        <div className="grid gap-2">
          <label htmlFor="password">Password</label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            // { ... (useForm ? { value: values.password, onChange: handleChange('password') } : {}) }
            disabled={loading}
          />
          {/* {useForm && errors.password && <p className="text-red-500 text-sm">{errors.password}</p>} */}
        </div>
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
      </div>
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Logging in..." : "Login"}
      </Button>
    </Form>
  );
}
