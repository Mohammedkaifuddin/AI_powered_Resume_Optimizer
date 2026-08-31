"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { apiRequest } from "@/lib/api";

type JobDescription = {
  id: string;
  userId: string;
  title: string;
  description: string;
  createdAt: string;
};

export default function JobDescriptionPage() {
  const params = useParams();

  const jobDescriptionId = params.id as string;

  const [jobDescription, setJobDescription] =
    useState<JobDescription | null>(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  useEffect(() => {
    const loadJobDescription = async () => {
      const token = sessionStorage.getItem("token");

      if (!token) {
        window.location.href = "/login";
        return;
      }

      try {
        const data = await apiRequest(
          `/api/job-descriptions/${jobDescriptionId}`
        );

        console.log(
          "Job description details:",
          data
        );

        setJobDescription(
          data.jobdescription
        );
      } catch (error) {
        console.error(
          "Failed to load job description:",
          error
        );

        setError(
          "Unable to load job description."
        );
      } finally {
        setLoading(false);
      }
    };

    if (jobDescriptionId) {
      loadJobDescription();
    }
  }, [jobDescriptionId]);

  // ==========================================================
  // LOADING
  // ==========================================================

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-950 text-white">
        <p className="text-gray-400">
          Loading job description...
        </p>
      </main>
    );
  }

  // ==========================================================
  // ERROR
  // ==========================================================

  if (error || !jobDescription) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-950 text-white">
        <div className="text-center">

          <p className="text-red-400">
            {error ||
              "Job description not found."}
          </p>

          <Link
            href="/dashboard"
            className="mt-5 inline-block text-gray-300 underline hover:text-white"
          >
            ← Back to Dashboard
          </Link>

        </div>
      </main>
    );
  }

  // ==========================================================
  // PAGE
  // ==========================================================

  return (
    <main className="min-h-screen bg-gray-950 text-white">

      <div className="mx-auto max-w-5xl px-6 py-10">

        {/* Header */}
        <div className="mb-8">

          <Link
            href="/dashboard"
            className="text-gray-400 underline hover:text-white"
          >
            ← Back to Dashboard
          </Link>

          <h1 className="mt-6 text-4xl font-bold">
            {jobDescription.title}
          </h1>

          <p className="mt-2 text-gray-400">
            Job description
          </p>

        </div>

        {/* Information */}
        <section className="rounded-xl border border-gray-800 bg-gray-900 p-6">

          <h2 className="text-xl font-semibold">
            Job Information
          </h2>

          <div className="mt-5">

            <p className="text-sm text-gray-500">
              Title
            </p>

            <p className="mt-1 text-lg">
              {jobDescription.title}
            </p>

          </div>

          <div className="mt-5">

            <p className="text-sm text-gray-500">
              Created
            </p>

            <p className="mt-1">
              {new Date(
                jobDescription.createdAt
              ).toLocaleDateString()}
            </p>

          </div>

        </section>

        {/* Description */}
        <section className="mt-8 rounded-xl border border-gray-800 bg-gray-900 p-6">

          <h2 className="text-xl font-semibold">
            Description
          </h2>

          <div className="mt-5 rounded-lg border border-gray-800 bg-gray-950 p-6">

            <p className="whitespace-pre-wrap text-sm leading-7 text-gray-300">
              {jobDescription.description}
            </p>

          </div>

        </section>

        {/* Actions */}
        <div className="mt-8 flex flex-wrap gap-4">

          <Link
            href="/dashboard"
            className="rounded-lg border border-gray-700 px-5 py-3 text-gray-300 hover:bg-gray-900 hover:text-white"
          >
            Back to Dashboard
          </Link>

          <Link
            href="/job-description"
            className="rounded-lg bg-white px-5 py-3 font-medium text-black hover:bg-gray-200"
          >
            Add Another Job
          </Link>

        </div>

      </div>

    </main>
  );
}