import { useStore } from "@/lib/store"; // Assuming you are using the Zustand store
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import LoadingPage from "@/components/ui/Loading"; // Assuming LoadingPage component exists

interface AuthGuardProps {
  children: React.ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const { isAuthenticated } = useStore();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      // Redirect to login page if not authenticated
      router.push("/auth/login"); // Assuming your login page is at /auth/login
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    // Optionally show a loading or redirecting message
    return <LoadingPage />;
  }

  return <>{children}</>;
}
