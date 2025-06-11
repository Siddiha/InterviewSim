"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { registerSchema, type RegisterInput } from "@/lib/validations";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import ErrorMessage from "@/components/ui/ErrorMessage";
import { SuccessMessage } from "@/components/ui/ErrorMessage";

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const { register: registerUser } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterInput) => {
    setIsLoading(true);
    setError("");
    setSuccess("");

    const result = await registerUser(
      data.name,
      data.email,
      data.password,
      data.confirmPassword
    );

    if (!result.success) {
      setError(result.error || "Registration failed");
    } else {
      setSuccess("Registration successful! Redirecting to dashboard...");
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h1 className="text-center text-3xl font-bold text-gray-900">
            Create your account
          </h1>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{" "}
            <Link
              href="/auth/login"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              sign in to your existing account
            </Link>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          {error && <ErrorMessage message={error} />}
          {success && <SuccessMessage message={success} />}

          <div className="space-y-4">
            <Input
              {...register("name")}
              type="text"
              label="Full Name"
              placeholder="Enter your full name"
              error={errors.name?.message}
            />

            <Input
              {...register("email")}
              type="email"
              label="Email address"
              placeholder="Enter your email"
              error={errors.email?.message}
            />

            <Input
              {...register("password")}
              type="password"
              label="Password"
              placeholder="Create a password"
              error={errors.password?.message}
            />

            <Input
              {...register("confirmPassword")}
              type="password"
              label="Confirm Password"
              placeholder="Confirm your password"
              error={errors.confirmPassword?.message}
            />
          </div>

          <div className="text-sm text-gray-600">
            By creating an account, you agree to our{" "}
            <a href="#" className="text-blue-600 hover:text-blue-500">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="text-blue-600 hover:text-blue-500">
              Privacy Policy
            </a>
            .
          </div>

          <Button
            type="submit"
            className="w-full"
            loading={isLoading}
            disabled={isLoading}
          >
            Create Account
          </Button>
        </form>
      </div>
    </div>
  );
}
