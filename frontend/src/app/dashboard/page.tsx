"use client";

// React hooks.
import { useEffect, useState } from "react";

import { useRouter } from "next/navigation";

// Next.js navigation.
import Link from "next/link";

// Reusable API helper.
import { apiRequest, ApiError } from "@/lib/api";

// ==========================================================
// TYPES
// ==========================================================

// Resume returned by the backend.
type Resume = {
  id: string;
  fileName: string;
  fileType: string;
  createdAt: string;
};

// Job description returned by the backend.
type JobDescription = {
  id: string;
  title: string;
  description: string;
  createdAt: string;
};

type Analysis = {
  id: string;
  resumeId: string;
  jobDescriptionId: string;
  skillScore: number;
  keywordScore: number;
  score: number;
  createdAt: string;
};

export default function DashboardPage() {
  // ==========================================================
  // STATE
  // ==========================================================

  // Authentication state.
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);

  // Resume count.
  const [resumeCount, setResumeCount] = useState(0);

  // Job description count.
  const [jobDescriptionCount, setJobDescriptionCount] = useState(0);

  // Analysis count.
  const [analysisCount, setAnalysisCount] = useState(0);

  // Actual resumes.
  const [resumes, setResumes] = useState<Resume[]>([]);

  // Actual job descriptions.
  const [jobDescriptions, setJobDescriptions] = useState<JobDescription[]>([]);

  // Selected resume ID.
  const [selectedResumeId, setSelectedResumeId] = useState("");

  // Selected job description ID.
  const [selectedJobDescriptionId, setSelectedJobDescriptionId] = useState("");

  const [analyzing, setAnalyzing] = useState(false);

  const [analysisError, setAnalysisError] = useState("");

  const [analysisresult, setAnalysisresult] = useState<any>(null);

  const [analyses, setAnalyses] = useState<Analysis[]>([]);

  const [deletingresumeId, setdeletingresumeId] = useState<string | null>(null);

  const [deleteerror, setdeleteerror] = useState("");

  const [deletingjobid, setdeletingjobid] = useState<string | null>(null);

  const [jobdeleteerror, setjobdeleteerror] = useState("");

  const [deletingAnalysisId, setDeletingAnalysisId] = useState<string | null>(
    null,
  );

  const [anaysisresult, setanalysisresult] = useState<any>(null);

  const [selectedanalysisids, setselectedanalysisids] = useState<string[]>([]);

  const [comparing, setcomparing] = useState(false);

  const [comparisonerror, setcomparisonerror] = useState("");

  const [dashboardError, setDashboardError] = useState("");

  const [deleteModal, setDeleteModal] = useState<{
    type: "resume" | "analysis";
    id: string;
  } | null>(null);

  const router = useRouter();
  // ==========================================================
  // LOAD DATA
  // ==========================================================

  useEffect(() => {
    const loadDashboard = async () => {
      // Get JWT.
      const token = sessionStorage.getItem("token");

      // No token → login.
      if (!token) {
        window.location.href = "/login";
        return;
      }

      try {
        // ------------------------------------------------------
        // LOAD RESUMES
        // ------------------------------------------------------

        const resumeData = await apiRequest("/api/resumes");

        // Save resumes.
        setResumes(resumeData.resumes);

        // Save resume count.
        setResumeCount(resumeData.resumes.length);

        // Automatically select the first resume.
        if (resumeData.resumes.length > 0) {
          setSelectedResumeId(resumeData.resumes[0].id);
        }

        // ------------------------------------------------------
        // LOAD JOB DESCRIPTIONS
        // ------------------------------------------------------

        const jobData = await apiRequest("/api/job-descriptions");

        // Save job descriptions.
        setJobDescriptions(jobData.jobdescriptions);

        // Save job description count.
        setJobDescriptionCount(jobData.jobdescriptions.length);

        // Automatically select first job description.
        if (jobData.jobdescriptions.length > 0) {
          setSelectedJobDescriptionId(jobData.jobdescriptions[0].id);
        }

        // ------------------------------------------------------
        // LOAD ANALYSES
        // ------------------------------------------------------

        const analysisData = await apiRequest("/api/analyses");

        console.log("Analyses response:", analysisData);

        // Store analyses.
        setAnalyses(analysisData.analyses);

        // Store analysis count.
        setAnalysisCount(analysisData.analyses.length);
        // Everything worked.
        setAuthenticated(true);
      } catch (error) {
        console.error("Dashboard request failed:", error);

        // Only logout when the JWT is invalid/expired.
        if (error instanceof ApiError && error.status === 401) {
          sessionStorage.removeItem("token");
          window.location.href = "/login";
          return;
        }

        // For other errors, stay on the dashboard
        // and show an error message.
        if (error instanceof ApiError) {
          setDashboardError(error.message);
        } else {
          setDashboardError("Unable to load dashboard data. Please try again.");
        }

        setAuthenticated(true);
      }
    };

    loadDashboard();
  }, []);

  // ==========================================================
  // LOADING
  // ==========================================================

  if (authenticated === null) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-950 text-white">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-gray-700 border-t-white" />

          <p className="mt-4 text-gray-400">Loading dashboard...</p>
        </div>
      </main>
    );
  }

  //delete existing resume
  const handledeleteresume = async (resumeId: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this resume?",
    );

    if (!confirmed) {
      return;
    }

    const token = sessionStorage.getItem("token");

    if (!token) {
      window.location.href = "/login";
      return;
    }

    setdeletingresumeId(resumeId);
    setdeleteerror("");

    try {
      const response = await fetch(
        `http://localhost:5000/api/resumes/${resumeId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      // Read as TEXT first.
      const responseText = await response.text();

      console.log(
        "Delete response status:",
        response.status,
        response.statusText,
      );

      console.log("Delete response body:", responseText);

      // Parse JSON safely.
      let data;

      try {
        data = JSON.parse(responseText);
      } catch {
        console.error("Backend returned non-JSON response:", responseText);

        setdeleteerror(
          `Delete failed. Server returned ${response.status} ${response.statusText}.`,
        );

        return;
      }

      console.log("Delete resume response:", data);

      // Backend error.
      if (!response.ok) {
        setdeleteerror(data.message || "Failed to delete resume.");

        return;
      }

      // Remove from UI.
      setResumes((previous) =>
        previous.filter((resume) => resume.id !== resumeId),
      );

      // Update count.
      setResumeCount((previous) => Math.max(0, previous - 1));

      // Clear selected resume if necessary.
      if (selectedResumeId === resumeId) {
        setSelectedResumeId("");
      }
    } catch (error) {
      console.error("Delete resume failed:", error);

      setdeleteerror("Unable to connect to the backend.");
    } finally {
      setdeletingresumeId(null);
    }
  };

  //Deleting Job description

  const handledeletejobdescription = async (jobId: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this job description?",
    );

    if (!confirmed) {
      return;
    }

    const token = sessionStorage.getItem("token");

    if (!token) {
      window.location.href = "/login";
      return;
    }

    setdeletingjobid(jobId);
    setjobdeleteerror("");

    try {
      const response = await fetch(
        `http://localhost:5000/api/job-descriptions/${jobId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const responsetext = await response.text();

      console.log("Delete job response:", response.status, responsetext);

      let data;

      try {
        data = JSON.parse(responsetext);
      } catch {
        setjobdeleteerror(`Delete failed: server returned ${response.status}`);
        return;
      }

      if (!response.ok) {
        setjobdeleteerror(data.message || "Failed to delete job description");
        return;
      }

      // Remove from dashboard.
      setJobDescriptions((previous) =>
        previous.filter((job) => job.id !== jobId),
      );

      // Update count.
      setJobDescriptionCount((previous) => Math.max(0, previous - 1));

      // Clear selection if deleted job was selected.
      if (selectedJobDescriptionId === jobId) {
        setSelectedJobDescriptionId("");
      }
    } catch (error) {
      console.error("Delete job description failed:", error);

      setjobdeleteerror("Unable to connect to the backend.");
    } finally {
      setdeletingjobid(null);
    }
  };

  //Deleting analysis
  const handleDeleteAnalysis = async (analysisId: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this analysis?",
    );

    if (!confirmed) {
      return;
    }

    const token = sessionStorage.getItem("token");

    if (!token) {
      window.location.href = "/login";
      return;
    }

    setDeletingAnalysisId(analysisId);

    try {
      const response = await fetch(
        `http://localhost:5000/api/analyses/${analysisId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const responseText = await response.text();

      let data;

      try {
        data = JSON.parse(responseText);
      } catch {
        console.error("Backend returned non-JSON:", responseText);

        return;
      }

      console.log("Delete analysis response:", data);

      if (!response.ok) {
        console.error(data.message || "Failed to delete analysis.");

        return;
      }

      // Remove from dashboard immediately.
      setAnalyses((previous) =>
        previous.filter((analysis) => analysis.id !== analysisId),
      );

      // Update count.
      setAnalysisCount((previous) => Math.max(0, previous - 1));
    } catch (error) {
      console.error("Delete analysis failed:", error);
    } finally {
      setDeletingAnalysisId(null);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    window.location.href = "/login";
  };

  const handlecompareAnalysis = async () => {
    if (selectedanalysisids.length !== 2) {
      setcomparisonerror("Please select exactly 2 analyses to compare.");
      return;
    }

    const token = sessionStorage.getItem("token");

    if (!token) {
      window.location.href = "/login";
      return;
    }

    setcomparing(true);
    setcomparisonerror("");

    try {
      const [oldId, newId] = selectedanalysisids;

      const response = await fetch(
        `http://localhost:5000/api/analyses/compare/${oldId}/${newId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const responseText = await response.text();

      let data;

      try {
        data = JSON.parse(responseText);
      } catch {
        setcomparisonerror(`Server returned ${response.status}.`);
        return;
      }

      console.log("Comparison response:", data);

      if (!response.ok) {
        setcomparisonerror(data.message || "Comparison failed.");
        return;
      }

      // Store IDs temporarily so the comparison page
      // can use them.
      sessionStorage.setItem(
        "comparisonData",
        JSON.stringify({
          oldId,
          newId,
        }),
      );

      router.push(`/analysis/compare?old=${oldId}&new=${newId}`);
    } catch (error) {
      console.error("Comparison request failed:", error);

      setcomparisonerror("Unable to connect to the backend.");
    } finally {
      setcomparing(false);
    }
  };
  const toggleAnalysisSelection = (analysisId: string) => {
    setselectedanalysisids((previous) => {
      if (previous.includes(analysisId)) {
        return previous.filter((id) => id !== analysisId);
      }

      if (previous.length >= 2) {
        return previous;
      }

      return [...previous, analysisId];
    });

    setcomparisonerror("");
  };
  // ==========================================================
  // DASHBOARD
  // ==========================================================

  return (
    <main className="min-h-screen bg-gray-950 text-white">
      <div className="mx-auto max-w-6xl px-6 py-10">
        {/* ================================================== */}
        {/* HEADER */}
        {/* ================================================== */}

        <div className="mb-10 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-4xl font-bold">AI Resume Optimizer</h1>

            <p className="mt-2 text-gray-400">
              Analyze your resume and improve your job match.
            </p>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="rounded-lg border border-red-900 px-5 py-3 text-sm font-medium text-red-400 transition hover:bg-red-950 hover:text-red-300"
          >
            Logout
          </button>
        </div>

        {/* ================================================== */}
        {/* STATISTICS */}
        {/* ================================================== */}
        {dashboardError && (
          <div className="mb-6 rounded-xl border border-red-900 bg-red-950/40 p-4">
            <p className="text-sm text-red-400">{dashboardError}</p>

            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-3 rounded-lg border border-red-900 px-4 py-2 text-sm text-red-300 hover:bg-red-900/30"
            >
              Try Again
            </button>
          </div>
        )}
        <div className="grid gap-6 md:grid-cols-3">
          {/* Resume count */}
          <div className="rounded-xl border border-gray-800 bg-gray-900 p-6">
            <p className="text-sm text-gray-400">Resumes</p>

            <p className="mt-2 text-3xl font-bold">{resumeCount}</p>
          </div>

          {/* Job description count */}
          <div className="rounded-xl border border-gray-800 bg-gray-900 p-6">
            <p className="text-sm text-gray-400">Job Descriptions</p>

            <p className="mt-2 text-3xl font-bold">{jobDescriptionCount}</p>
          </div>

          {/* Analysis count */}
          <div className="rounded-xl border border-gray-800 bg-gray-900 p-6">
            <p className="text-sm text-gray-400">Analyses</p>

            <p className="mt-2 text-3xl font-bold">{analysisCount}</p>
          </div>
        </div>

        {/* ================================================== */}
        {/* RESUMES */}
        {/* ================================================== */}
        {deleteerror && (
          <p className="mt-4 text-sm text-red-400">{deleteerror}</p>
        )}
        <section className="mt-12">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">Your Resumes</h2>

            <Link
              href="/upload-resume"
              className="rounded-lg bg-white px-4 py-2 font-medium text-black hover:bg-gray-200"
            >
              + Upload Resume
            </Link>
          </div>

          {resumes.length === 0 ? (
            <div className="mt-5 rounded-xl border border-dashed border-gray-700 p-8 text-center">
              <p className="text-gray-400">No resumes uploaded yet.</p>

              <Link
                href="/upload-resume"
                className="mt-3 inline-block text-gray-300 underline"
              >
                Upload your first resume
              </Link>
            </div>
          ) : (
            <div className="mt-5 space-y-3">
              {resumes.map((resume) => (
                <div
                  key={resume.id}
                  className="rounded-xl border border-gray-800 bg-gray-900 p-5"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">📄 {resume.fileName}</p>

                      <p className="mt-1 text-sm text-gray-500">
                        {resume.fileType}
                      </p>
                    </div>

                    {/* Resume actions */}
                    <div className="flex items-center gap-3">
                      {/* View resume */}
                      <Link
                        href={`/resumes/${resume.id}`}
                        className="rounded-lg border border-gray-700 px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white"
                      >
                        View
                      </Link>

                      {/* Select resume */}
                      <label className="flex items-center gap-2 text-sm text-gray-400">
                        <input
                          type="radio"
                          name="resume"
                          value={resume.id}
                          checked={selectedResumeId === resume.id}
                          onChange={() => setSelectedResumeId(resume.id)}
                        />
                        Select
                      </label>
                      <div></div>
                      <button
                        type="button"
                        onClick={() =>
                          setDeleteModal({
                            type: "resume",
                            id: resume.id,
                          })
                        }
                        disabled={deletingresumeId === resume.id}
                        className="rounded-lg border border-red-900 px-4 py-2 text-sm text-red-400 hover:bg-red-950 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {deletingresumeId === resume.id
                          ? "Deleting..."
                          : "Delete"}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* ================================================== */}
        {/* JOB DESCRIPTIONS */}
        {/* ================================================== */}

        <section className="mt-12">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">Your Job Descriptions</h2>

            <Link
              href="/job-description"
              className="rounded-lg border border-gray-700 px-4 py-2 text-gray-300 hover:bg-gray-900"
            >
              + Add Job
            </Link>
          </div>

          {/* displaying error as job description not found */}
          {jobdeleteerror && (
            <p className="mt-3 text-sm text-red-400">{jobdeleteerror}</p>
          )}
          {jobDescriptions.length === 0 ? (
            <div className="mt-5 rounded-xl border border-dashed border-gray-700 p-8 text-center">
              <p className="text-gray-400">No job descriptions added yet.</p>

              <Link
                href="/job-description"
                className="mt-3 inline-block text-gray-300 underline"
              >
                Add your first job description
              </Link>
            </div>
          ) : (
            <div className="mt-5 space-y-3">
              {jobDescriptions.map((job) => (
                <div
                  key={job.id}
                  className="rounded-xl border border-gray-800 bg-gray-900 p-5"
                >
                  <div className="flex items-center justify-between gap-5">
                    <div className="min-w-0">
                      <p className="font-medium">{job.title}</p>

                      <p className="mt-2 line-clamp-2 text-sm text-gray-400">
                        {job.description}
                      </p>
                    </div>

                    {/* Job selection */}
                    <label className="flex shrink-0 items-center gap-2 text-sm text-gray-400">
                      <input
                        type="radio"
                        name="jobDescription"
                        value={job.id}
                        checked={selectedJobDescriptionId === job.id}
                        onChange={() => setSelectedJobDescriptionId(job.id)}
                      />
                      Select
                    </label>

                    <Link
                      href={`/job-descriptions/${job.id}`}
                      className="rounded-lg border border-gray-700 px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white"
                    >
                      View
                    </Link>

                    <button
                      type="button"
                      onClick={() => handledeletejobdescription(job.id)}
                      disabled={deletingjobid === job.id}
                      className="rounded-lg border border-red-900 px-4 py-2 text-sm text-red-400 hover:bg-red-950 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {deletingjobid === job.id ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* ================================================== */}
        {/* ANALYSIS HISTORY */}
        {/* ================================================== */}

        <section className="mt-12">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold">Analysis History</h2>

              <p className="mt-1 text-sm text-gray-500">
                Review your previous resume analyses.
              </p>
            </div>

            <span className="text-sm text-gray-500">
              {analyses.length}{" "}
              {analyses.length === 1 ? "analysis" : "analyses"}
            </span>
          </div>

          {analyses.length === 0 ? (
            <div className="mt-5 rounded-xl border border-dashed border-gray-700 p-8 text-center">
              <p className="text-gray-400">No analyses yet.</p>

              <p className="mt-2 text-sm text-gray-500">
                Analyze a resume against a job description to see your results
                here.
              </p>
            </div>
          ) : (
            <div className="mt-5 space-y-4">
              {analyses.map((analysis) => {
                const resume = resumes.find(
                  (item) => item.id === analysis.resumeId,
                );

                const job = jobDescriptions.find(
                  (item) => item.id === analysis.jobDescriptionId,
                );

                return (
                  <div
                    key={analysis.id}
                    className="rounded-xl border border-gray-800 bg-gray-900 p-6"
                  >
                    {/* Top row */}
                    <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                      {/* Analysis information */}
                      {/* Analysis information */}
                      <div className="flex items-start gap-4">
                        <input
                          type="checkbox"
                          checked={selectedanalysisids.includes(analysis.id)}
                          onChange={() => toggleAnalysisSelection(analysis.id)}
                          className="mt-1 h-4 w-4"
                        />

                        <div className="min-w-0">
                          <h3 className="truncate text-lg font-semibold">
                            {job?.title || "Job Description"}
                          </h3>

                          <p className="mt-2 text-sm text-gray-400">
                            📄 {resume?.fileName || "Resume"}
                          </p>

                          <p className="mt-1 text-sm text-gray-500">
                            {analysis.createdAt
                              ? new Date(analysis.createdAt).toLocaleDateString(
                                  "en-IN",
                                  {
                                    day: "numeric",
                                    month: "short",
                                    year: "numeric",
                                  },
                                )
                              : "Date unavailable"}
                          </p>
                        </div>
                      </div>

                      {/* Scores */}
                      <div className="grid grid-cols-3 gap-6">
                        <div className="text-center">
                          <p className="text-xs text-gray-500">Overall</p>

                          <p className="mt-1 text-2xl font-bold">
                            {analysis.score}%
                          </p>
                        </div>

                        <div className="text-center">
                          <p className="text-xs text-gray-500">Skills</p>

                          <p className="mt-1 text-2xl font-bold">
                            {analysis.skillScore}%
                          </p>
                        </div>

                        <div className="text-center">
                          <p className="text-xs text-gray-500">Keywords</p>

                          <p className="mt-1 text-2xl font-bold">
                            {analysis.keywordScore}%
                          </p>
                        </div>
                      </div>

                      {/* View button
                      <Link
                        href={`/analysis/${analysis.id}`}
                        className="rounded-lg border border-gray-700 px-5 py-3 text-center text-sm text-gray-300 transition hover:bg-gray-800 hover:text-white"
                      >
                        View Analysis
                      </Link> */}

                      <div className="flex flex-wrap gap-3">
                        <Link
                          href={`/analysis/${analysis.id}`}
                          className="rounded-lg border border-gray-700 px-5 py-3 text-center text-sm text-gray-300 transition hover:bg-gray-800 hover:text-white"
                        >
                          View Analysis
                        </Link>

                        <button
                          type="button"
                          onClick={() =>
                            setDeleteModal({
                              type: "analysis",
                              id: analysis.id,
                            })
                          }
                          disabled={deletingAnalysisId === analysis.id}
                          className="rounded-lg border border-red-900 px-5 py-3 text-sm text-red-400 hover:bg-red-950 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {deletingAnalysisId === analysis.id
                            ? "Deleting..."
                            : "Delete"}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Compare button */}
          {analyses.length >= 2 && (
            <div className="mt-5">
              <button
                type="button"
                onClick={handlecompareAnalysis}
                disabled={selectedanalysisids.length !== 2 || comparing}
                className="rounded-lg bg-white px-5 py-3 font-medium text-black hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {comparing
                  ? "Comparing..."
                  : `Compare Selected (${selectedanalysisids.length}/2)`}
              </button>

              {comparisonerror && (
                <p className="mt-3 text-sm text-red-400">{comparisonerror}</p>
              )}
            </div>
          )}
        </section>

        {/* ================================================== */}
        {/* ANALYZE SECTION */}
        {/* ================================================== */}

        <section className="mt-12 rounded-xl border border-gray-800 bg-gray-900 p-8">
          <h2 className="text-2xl font-semibold">Analyze Resume</h2>

          <p className="mt-2 text-gray-400">
            Select a resume and a job description, then analyze the match.
          </p>

          {/* Selected resume */}
          <div className="mt-6">
            <p className="text-sm text-gray-400">Selected Resume</p>

            <p className="mt-1 font-medium">
              {resumes.find((resume) => resume.id === selectedResumeId)
                ?.fileName || "No resume selected"}
            </p>
          </div>

          {/* Selected job */}
          <div className="mt-4">
            <p className="text-sm text-gray-400">Selected Job</p>

            <p className="mt-1 font-medium">
              {jobDescriptions.find(
                (job) => job.id === selectedJobDescriptionId,
              )?.title || "No job description selected"}
            </p>
          </div>

          {/* Analyze button */}
          <button
            type="button"
            // We will connect this button to
            // /api/matching/analyze next.
            onClick={async () => {
              // Make sure both selections exist.
              if (!selectedResumeId || !selectedJobDescriptionId) {
                return;
              }

              // Clear previous error.
              setAnalysisError("");

              // Start loading.
              setAnalyzing(true);

              try {
                // Get the JWT.
                const token = sessionStorage.getItem("token");

                // If JWT is missing, go to login.
                if (!token) {
                  window.location.href = "/login";
                  return;
                }

                // Send selected resume and job to backend.
                const response = await fetch(
                  "http://localhost:5000/api/matching/analyze",
                  {
                    // Backend expects POST.
                    method: "POST",

                    // Send JWT and JSON content type.
                    headers: {
                      "Content-Type": "application/json",
                      Authorization: `Bearer ${token}`,
                    },

                    // Send IDs to backend.
                    body: JSON.stringify({
                      resumeId: selectedResumeId,
                      jobDescriptionId: selectedJobDescriptionId,
                    }),
                  },
                );

                // Convert response to JSON.
                const data = await response.json();

                // Print response for debugging.
                console.log("Analysis response:", data);

                // Check for backend error.
                if (!response.ok) {
                  setAnalysisError(data.message || "Analysis failed.");
                  return;
                }

                console.log("Analysis successful:", data);

                // Save result before redirecting.
                setAnalysisresult(data);

                // Redirect to the analysis result page.
                router.push(`/analysis/${data.analysisId}`);
              } catch (error) {
                // Print actual error.
                console.error("Analysis request failed:", error);

                // Show user-friendly message.
                setAnalysisError("Unable to connect to the backend.");
              } finally {
                // Stop loading.
                setAnalyzing(false);
              }
            }}
            className="mt-6 w-full rounded-lg bg-white px-5 py-3 font-medium text-black hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {analyzing ? "Analyzing..." : "Analyze Resume"}
          </button>

          {/* ================================================== */}
          {/* ANALYSIS ERROR */}
          {/* ================================================== */}

          {analysisError && (
            <p className="mt-5 text-sm text-red-400">{analysisError}</p>
          )}
        </section>
      </div>

      {deleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
          <div className="w-full max-w-md rounded-xl border border-gray-800 bg-gray-900 p-6 shadow-xl">
            <h2 className="text-xl font-semibold text-white">
              Confirm Deletion
            </h2>

            <p className="mt-3 text-gray-400">
              Are you sure you want to delete this {deleteModal.type}?
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setDeleteModal(null)}
                className="rounded-lg border border-gray-700 px-5 py-2.5 text-sm text-gray-300 hover:bg-gray-800"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={async () => {
                  const item = deleteModal;

                  setDeleteModal(null);

                  if (item.type === "resume") {
                    await handledeleteresume(item.id);
                  } else {
                    await handleDeleteAnalysis(item.id);
                  }
                }}
                className="rounded-lg bg-red-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
