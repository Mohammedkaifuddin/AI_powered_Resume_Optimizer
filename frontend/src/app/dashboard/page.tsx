"use client";

import { useEffect, useState } from "react";

// Import our reusable API helper.
import { apiRequest } from "@/lib/api";

export default function DashboardPage() {

  // Stores whether authentication has been checked.
  const [authenticated, setAuthenticated] = useState<boolean | null>(
    null
  );

  // Stores the number of resumes.
  const [resumeCount, setResumeCount] = useState(0);

  useEffect(() => {

    // Create a function because we need async/await.
    const loadDashboard = async () => {

      // Get the JWT from browser storage.
      const token = sessionStorage.getItem("token");

      // No token means user isn't logged in.
      if (!token) {
        window.location.href = "/login";
        return;
      }

      try {

        // Ask our backend for the user's resumes.
        const data = await apiRequest(
          "/api/resumes"
        );

        // Store the number of resumes.
        setResumeCount(data.resumes.length);

        // User is authenticated.
        setAuthenticated(true);

      } catch (error) {

        // Something went wrong.
        console.error(
          "Dashboard request failed:",
          error
        );

        // Send the user back to login.
        sessionStorage.removeItem("token");

        window.location.href = "/login";
      }
    };

    loadDashboard();

  }, []);

  // Initial loading state.
  if (authenticated === null) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p>Loading dashboard...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-8">

      <h1 className="text-3xl font-bold">
        AI Resume Matcher Dashboard
      </h1>

      <p className="mt-4">
        Welcome back!
      </p>

      <div className="mt-6 rounded-lg border p-6">
        <h2 className="text-xl font-semibold">
          Your Resumes
        </h2>

        <p className="mt-2">
          {resumeCount} resume(s)
        </p>
      </div>

    </main>
  );
}