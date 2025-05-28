"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/Button";
import { Plus, Play, BarChart3, Settings, LogOut } from "lucide-react";

export default function DashboardPage() {
  const { user, loading, logout, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/auth/login");
    }
  }, [loading, isAuthenticated, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">
                Interview<span className="text-blue-600">Sim</span>
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">
                Welcome, {user.name}
              </span>
              <Button
                variant="ghost"
                onClick={logout}
                className="text-gray-500 hover:text-gray-700"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* New Interview Card */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                New Interview
              </h2>
              <Plus className="h-5 w-5 text-gray-400" />
            </div>
            <p className="text-gray-600 mb-4">
              Start a new interview session with our AI interviewer.
            </p>
            <Button className="w-full">
              <Play className="h-4 w-4 mr-2" />
              Start Interview
            </Button>
          </div>

          {/* Progress Card */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Your Progress
              </h2>
              <BarChart3 className="h-5 w-5 text-gray-400" />
            </div>
            <p className="text-gray-600 mb-4">
              Track your improvement and view your interview history.
            </p>
            <Button variant="outline" className="w-full">
              View Progress
            </Button>
          </div>

          {/* Settings Card */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Settings</h2>
              <Settings className="h-5 w-5 text-gray-400" />
            </div>
            <p className="text-gray-600 mb-4">
              Customize your interview preferences and account settings.
            </p>
            <Button variant="outline" className="w-full">
              Manage Settings
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
