"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { apiRequest } from "@/lib/api";

type Resume = {
  id: string;
  userId: string;
  fileName: string;
  fileType: string;
  extractedText: string;
  createdAt: string;
};

export default function ResumePage() {
  // Get resume ID from URL.
  const params = useParams();

  const resumeId = params.id as string;

  // Resume data.
  const [resume, setResume] = useState<Resume | null>(null);

  // Loading state.
  const [loading, setLoading] = useState(true);

  // Error message.
  const [error, setError] = useState("");

  // ==========================================================
  // LOAD RESUME
  // ==========================================================

  useEffect(() => {
    const loadResume = async () => {
      // Check JWT.
      const token = sessionStorage.getItem("token");

      if (!token) {
        window.location.href = "/login";
        return;
      }

      try {
        // Request resume from backend.
        const data = await apiRequest(`/api/resumes/${resumeId}`);

        console.log("Resume details:", data);

        // Save resume.
        setResume(data.resume);
      } catch (error) {
        console.error("Failed to load resume:", error);

        setError("Unable to load resume.");
      } finally {
        setLoading(false);
      }
    };

    if (resumeId) {
      loadResume();
    }
  }, [resumeId]);

  // ==========================================================
  // LOADING
  // ==========================================================

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-950 text-white">
        <p className="text-gray-400">Loading resume...</p>
      </main>
    );
  }

  // ==========================================================
  // ERROR
  // ==========================================================

  if (error || !resume) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-950 text-white">
        <div className="text-center">
          <p className="text-red-400">{error || "Resume not found."}</p>

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
  // RESUME PAGE
  // ==========================================================

  return (
    <main className="min-h-screen bg-gray-950 text-white">
      <div className="mx-auto max-w-5xl px-6 py-10">
        {/* ================================================== */}
        {/* HEADER */}
        {/* ================================================== */}

        <div className="mb-8">
          <Link
            href="/dashboard"
            className="text-gray-400 underline hover:text-white"
          >
            ← Back to Dashboard
          </Link>

          <h1 className="mt-6 text-4xl font-bold">{resume.fileName}</h1>

          <p className="mt-2 text-gray-400">
            Resume details and extracted text
          </p>
        </div>

        {/* ================================================== */}
        {/* RESUME INFORMATION */}
        {/* ================================================== */}

        <section className="rounded-xl border border-gray-800 bg-gray-900 p-6">
          <h2 className="text-xl font-semibold">Resume Information</h2>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <div>
              <p className="text-sm text-gray-500">File Name</p>

              <p className="mt-1">{resume.fileName}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">File Type</p>

              <p className="mt-1">{resume.fileType}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Uploaded</p>

              <p className="mt-1">
                {new Date(resume.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </section>

        {/* ================================================== */}
        {/* EXTRACTED TEXT */}
        {/* ================================================== */}

        <section className="mt-8 rounded-xl border border-gray-800 bg-gray-900 p-6">
          <h2 className="text-xl font-semibold">Extracted Resume Text</h2>

          <div className="mt-5 max-h-[700px] overflow-y-auto rounded-lg border border-gray-800 bg-gray-950 p-6">
            <pre className="whitespace-pre-wrap font-sans text-sm leading-7 text-gray-300">
              {resume.extractedText}
            </pre>
          </div>
        </section>

        {/* ================================================== */}
        {/* ACTIONS */}
        {/* ================================================== */}

        <div className="mt-8 flex flex-wrap gap-4">
          <Link
            href="/dashboard"
            className="rounded-lg border border-gray-700 px-5 py-3 text-gray-300 hover:bg-gray-900 hover:text-white"
          >
            Back to Dashboard
          </Link>

          <Link
            href="/upload-resume"
            className="rounded-lg bg-white px-5 py-3 font-medium text-black hover:bg-gray-200"
          >
            Upload Another Resume
          </Link>
        </div>
      </div>
    </main>
  );
}
