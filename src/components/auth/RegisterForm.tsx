import React, { useState } from "react";
import { Input } from "@/components/ui/Input"; // Assuming Input component exists
import { Button } from "@/components/ui/Button"; // Assuming Button component exists
import Form from "@/components/common/Form"; // Using the generic Form component
// import { useForm } from '@/hooks/useForm'; // You might use the useForm hook for validation
// import { registerSchema } from '@/lib/validations'; // Assuming a registration validation schema exists

interface RegisterFormProps {
  onSubmit: (data: { name: string; email: string; password: string }) => void;
  loading?: boolean;
  error?: string | null;
}

export default function RegisterForm({
  onSubmit,
  loading = false,
  error = null,
}: RegisterFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Example using useState for form state and basic validation
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // Basic validation
    if (name.trim() && email.trim() && password.trim()) {
      onSubmit({ name, email, password });
    } else {
      alert("Please fill in all fields.");
    }
  };

  // If using useForm hook:
  // const { values, errors, isSubmitting, handleChange, handleSubmit } = useForm({
  //   initialValues: { name: '', email: '', password: '' },
  //   validationSchema: registerSchema,
  //   onSubmit: (data) => onSubmit(data),
  // });

  return (
    <Form onSubmit={handleSubmit}>
      <div className="grid gap-4 py-4">
        <div className="grid gap-2">
          <label htmlFor="name">Name</label>
          <Input
            id="name"
            type="text"
            placeholder="Your Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            // { ... (useForm ? { value: values.name, onChange: handleChange('name') } : {}) }
            disabled={loading}
          />
          {/* {useForm && errors.name && <p className="text-red-500 text-sm">{errors.name}</p>} */}
        </div>
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
        {loading ? "Registering..." : "Register"}
      </Button>
    </Form>
  );
}
