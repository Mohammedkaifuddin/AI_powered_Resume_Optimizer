"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { apiRequest } from "@/lib/api";

type ComparisonData = {
  changes: {
    addedSkills: never[];
    removedSkills: never[];
    resolvedMissingSkills: never[];
    newlyMissingSkills: never[];
    addedKeywords: never[];
    removedKeywords: never[];
    resolvedMissingKeywords: never[];
    newlyMissingKeywords: never[];
  };
  previous: {
    id: string;
    resumeId: string;
    jobDescriptionId: string;
    createdAt: string;
  };

  latest: {
    id: string;
    resumeId: string;
    jobDescriptionId: string;
    createdAt: string;
  };

  comparison: {
    overall: {
      previous: number;
      latest: number;
      change: number;
    };

    skills: {
      previous: number;
      latest: number;
      change: number;
    };

    keywords: {
      previous: number;
      latest: number;
      change: number;
    };

    changes?: {
      addedSkills: string[];
      removedSkills: string[];

      resolvedMissingSkills: string[];
      newlyMissingSkills: string[];

      addedKeywords: string[];
      removedKeywords: string[];

      resolvedMissingKeywords: string[];
      newlyMissingKeywords: string[];
    };
  };
};

function ComparePagecontent() {
  const searchParams = useSearchParams();

  const oldId = searchParams.get("old");
  const newId = searchParams.get("new");

  const [data, setData] = useState<ComparisonData | null>(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  useEffect(() => {
    const loadComparison = async () => {
      const token = sessionStorage.getItem("token");

      if (!token) {
        window.location.href = "/login";
        return;
      }

      if (!oldId || !newId) {
        setError("Two analysis IDs are required for comparison.");
        setLoading(false);
        return;
      }

      try {
        console.log("Loading comparison:", oldId, newId);

        const response = await apiRequest(
          `/api/analyses/compare/${oldId}/${newId}`,
        );

        console.log("Comparison data:", response);

        if (!response.success || !response.comparison) {
          setError(response.message || "Unable to compare analyses.");
          return;
        }

        setData(response);
      } catch (error) {
        console.error("Failed to load comparison:", error);

        setError("Unable to load comparison.");
      } finally {
        setLoading(false);
      }
    };

    loadComparison();
  }, [oldId, newId]);

  // ==========================================================
  // LOADING
  // ==========================================================

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-950 text-white">
        <p className="text-gray-400">Loading comparison...</p>
      </main>
    );
  }

  // ==========================================================
  // ERROR
  // ==========================================================

  if (error || !data) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-950 text-white">
        <div className="text-center">
          <p className="text-red-400">{error || "Comparison not found."}</p>

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

  const comparison = data.comparison;

  const changes = data.changes ?? {
    addedSkills: [],
    removedSkills: [],
    resolvedMissingSkills: [],
    newlyMissingSkills: [],
    addedKeywords: [],
    removedKeywords: [],
    resolvedMissingKeywords: [],
    newlyMissingKeywords: [],
  };

  const getRecommendation = () => {
    if (comparison.overall.change > 0) {
      if (changes.addedSkills.length > 0) {
        return `Your resume improved by ${comparison.overall.change}%. Keep building on this progress by highlighting your newly added skills more prominently in your resume.`;
      }

      if (changes.resolvedMissingSkills.length > 0) {
        return `Your resume improved by ${comparison.overall.change}%. You successfully addressed previously missing skills. Continue tailoring your resume to the job description.`;
      }

      return `Your resume improved by ${comparison.overall.change}%. Continue tailoring your skills and keywords to the target job description.`;
    }

    if (comparison.overall.change < 0) {
      return `Your resume score decreased by ${Math.abs(
        comparison.overall.change,
      )}%. Review the missing skills and keywords before your next analysis.`;
    }

    return "Your overall score has not changed. Try adding relevant skills and keywords from the job description.";
  };

  
  // ==========================================================
  // PAGE
  // ==========================================================

  return (
    <main className="min-h-screen bg-gray-950 text-white">
      <div className="mx-auto max-w-5xl px-6 py-10">
        {/* Header */}

        <div className="mb-10">
          <Link
            href="/dashboard"
            className="text-gray-400 underline hover:text-white"
          >
            ← Back to Dashboard
          </Link>

          <h1 className="mt-6 text-4xl font-bold">Resume Improvement</h1>

          <p className="mt-2 text-gray-400">
            Compare your previous and latest resume analysis.
          </p>
        </div>

        {/* ================================================== */}
        {/* OVERALL SCORE */}
        {/* ================================================== */}

        <section className="rounded-xl border border-gray-800 bg-gray-900 p-8">
          <h2 className="text-xl font-semibold">Overall Score</h2>

          <div className="mt-8 flex flex-col items-center justify-center gap-6 md:flex-row">
            <div className="text-center">
              <p className="text-sm text-gray-500">Previous</p>

              <p className="mt-2 text-5xl font-bold">
                {comparison.overall.previous}%
              </p>
            </div>

            <div className="text-3xl text-gray-600">→</div>

            <div className="text-center">
              <p className="text-sm text-gray-500">Latest</p>

              <p className="mt-2 text-5xl font-bold">
                {comparison.overall.latest}%
              </p>
            </div>
          </div>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500">Improvement</p>

            <p
              className={`mt-2 text-3xl font-bold ${
                comparison.overall.change > 0
                  ? "text-green-400"
                  : comparison.overall.change < 0
                    ? "text-red-400"
                    : "text-gray-400"
              }`}
            >
              {comparison.overall.change > 0 ? "+" : ""}
              {comparison.overall.change}%
            </p>
          </div>
        </section>

        {/* ================================================== */}
        {/* SKILL SCORE */}
        {/* ================================================== */}

        <section className="mt-6 rounded-xl border border-gray-800 bg-gray-900 p-6">
          <h2 className="text-xl font-semibold">Skill Score</h2>

          <div className="mt-5 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Previous</p>

              <p className="mt-1 text-3xl font-bold">
                {comparison.skills.previous}%
              </p>
            </div>

            <div className="text-2xl text-gray-600">→</div>

            <div>
              <p className="text-sm text-gray-500">Latest</p>

              <p className="mt-1 text-3xl font-bold">
                {comparison.skills.latest}%
              </p>
            </div>

            <div className="text-right">
              <p className="text-sm text-gray-500">Change</p>

              <p
                className={`mt-1 text-2xl font-bold ${
                  comparison.skills.change > 0
                    ? "text-green-400"
                    : comparison.skills.change < 0
                      ? "text-red-400"
                      : "text-gray-400"
                }`}
              >
                {comparison.skills.change > 0 ? "+" : ""}
                {comparison.skills.change}%
              </p>
            </div>
          </div>
        </section>

        {/* ================================================== */}
        {/* KEYWORD SCORE */}
        {/* ================================================== */}

        <section className="mt-6 rounded-xl border border-gray-800 bg-gray-900 p-6">
          <h2 className="text-xl font-semibold">Keyword Score</h2>

          <div className="mt-5 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Previous</p>

              <p className="mt-1 text-3xl font-bold">
                {comparison.keywords.previous}%
              </p>
            </div>

            <div className="text-2xl text-gray-600">→</div>

            <div>
              <p className="text-sm text-gray-500">Latest</p>

              <p className="mt-1 text-3xl font-bold">
                {comparison.keywords.latest}%
              </p>
            </div>

            <div className="text-right">
              <p className="text-sm text-gray-500">Change</p>

              <p
                className={`mt-1 text-2xl font-bold ${
                  comparison.keywords.change > 0
                    ? "text-green-400"
                    : comparison.keywords.change < 0
                      ? "text-red-400"
                      : "text-gray-400"
                }`}
              >
                {comparison.keywords.change > 0 ? "+" : ""}
                {comparison.keywords.change}%
              </p>
            </div>
          </div>
        </section>

        {/* ================================================== */}
        {/* CHANGES */}
        {/* ================================================== */}

        <section className="mt-8 grid gap-6 md:grid-cols-2">
          {/* Skills Added */}

          <div className="rounded-xl border border-gray-800 bg-gray-900 p-6">
            <h2 className="text-xl font-semibold">Skills Added</h2>

            {changes.addedSkills.length > 0 ? (
              <div className="mt-4 flex flex-wrap gap-2">
                {changes.addedSkills.map((skill, index) => (
                  <span
                    key={`${skill}-${index}`}
                    className="rounded-full border border-gray-700 px-3 py-1 text-sm text-gray-300"
                  >
                    + {skill}
                  </span>
                ))}
              </div>
            ) : (
              <p className="mt-4 text-gray-500">No new skills added.</p>
            )}
          </div>

          {/* Skills Removed */}

          <div className="rounded-xl border border-gray-800 bg-gray-900 p-6">
            <h2 className="text-xl font-semibold">Skills Removed</h2>

            {changes.removedSkills.length > 0 ? (
              <div className="mt-4 flex flex-wrap gap-2">
                {changes.removedSkills.map((skill, index) => (
                  <span
                    key={`${skill}-${index}`}
                    className="rounded-full border border-red-900 px-3 py-1 text-sm text-red-400"
                  >
                    - {skill}
                  </span>
                ))}
              </div>
            ) : (
              <p className="mt-4 text-gray-500">No skills removed.</p>
            )}
          </div>

          {/* Resolved Missing Skills */}

          <div className="rounded-xl border border-gray-800 bg-gray-900 p-6">
            <h2 className="text-xl font-semibold">Skills Improved</h2>

            {changes.resolvedMissingSkills.length > 0 ? (
              <div className="mt-4 flex flex-wrap gap-2">
                {changes.resolvedMissingSkills.map((skill, index) => (
                  <span
                    key={`${skill}-${index}`}
                    className="rounded-full border border-gray-700 px-3 py-1 text-sm text-gray-300"
                  >
                    ✓ {skill}
                  </span>
                ))}
              </div>
            ) : (
              <p className="mt-4 text-gray-500">
                No previously missing skills were resolved.
              </p>
            )}
          </div>

          {/* Newly Missing Skills */}

          <div className="rounded-xl border border-gray-800 bg-gray-900 p-6">
            <h2 className="text-xl font-semibold">Newly Missing Skills</h2>

            {changes.newlyMissingSkills.length > 0 ? (
              <div className="mt-4 flex flex-wrap gap-2">
                {changes.newlyMissingSkills.map((skill, index) => (
                  <span
                    key={`${skill}-${index}`}
                    className="rounded-full border border-red-900 px-3 py-1 text-sm text-red-400"
                  >
                    ! {skill}
                  </span>
                ))}
              </div>
            ) : (
              <p className="mt-4 text-gray-500">No newly missing skills.</p>
            )}
          </div>
        </section>

        {/* ================================================== */}
        {/* KEYWORD CHANGES */}
        {/* ================================================== */}

        <section className="mt-6 grid gap-6 md:grid-cols-2">
          {/* Keywords Added */}

          <div className="rounded-xl border border-gray-800 bg-gray-900 p-6">
            <h2 className="text-xl font-semibold">Keywords Added</h2>

            {changes.addedKeywords.length > 0 ? (
              <div className="mt-4 flex flex-wrap gap-2">
                {changes.addedKeywords.map((keyword, index) => (
                  <span
                    key={`${keyword}-${index}`}
                    className="rounded-full border border-gray-700 px-3 py-1 text-sm text-gray-300"
                  >
                    + {keyword}
                  </span>
                ))}
              </div>
            ) : (
              <p className="mt-4 text-gray-500">No new keywords added.</p>
            )}
          </div>

          {/* Keywords Removed */}

          <div className="rounded-xl border border-gray-800 bg-gray-900 p-6">
            <h2 className="text-xl font-semibold">Keywords Removed</h2>

            {changes.removedKeywords.length > 0 ? (
              <div className="mt-4 flex flex-wrap gap-2">
                {changes.removedKeywords.map((keyword, index) => (
                  <span
                    key={`${keyword}-${index}`}
                    className="rounded-full border border-red-900 px-3 py-1 text-sm text-red-400"
                  >
                    - {keyword}
                  </span>
                ))}
              </div>
            ) : (
              <p className="mt-4 text-gray-500">No keywords removed.</p>
            )}
          </div>
        </section>

        <section className="mt-8 rounded-xl border border-gray-800 bg-gray-900 p-6">
          <h2 className="text-xl font-semibold">🎯 What Changed?</h2>

          <p className="mt-4 leading-7 text-gray-300">{getRecommendation()}</p>

          {changes.addedSkills.length > 0 && (
            <div className="mt-6">
              <p className="font-medium">✓ Skills Added</p>

              <div className="mt-2 flex flex-wrap gap-2">
                {changes.addedSkills.map((skill, index) => (
                  <span
                    key={`${skill}-${index}`}
                    className="rounded-full border border-gray-700 px-3 py-1 text-sm text-gray-300"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {changes.resolvedMissingSkills.length > 0 && (
            <div className="mt-6">
              <p className="font-medium">✓ Missing Skills Resolved</p>

              <div className="mt-2 flex flex-wrap gap-2">
                {changes.resolvedMissingSkills.map((skill, index) => (
                  <span
                    key={`${skill}-${index}`}
                    className="rounded-full border border-gray-700 px-3 py-1 text-sm text-gray-300"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {changes.newlyMissingSkills.length > 0 && (
            <div className="mt-6">
              <p className="font-medium">⚠ Newly Missing Skills</p>

              <div className="mt-2 flex flex-wrap gap-2">
                {changes.newlyMissingSkills.map((skill, index) => (
                  <span
                    key={`${skill}-${index}`}
                    className="rounded-full border border-red-900 px-3 py-1 text-sm text-red-400"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* ================================================== */}
        {/* SUMMARY */}
        {/* ================================================== */}

        <section className="mt-8 rounded-xl border border-gray-800 bg-gray-900 p-6">
          <h2 className="text-xl font-semibold">Summary</h2>

          {comparison.overall.change > 0 && (
            <p className="mt-4 leading-7 text-gray-300">
              Your latest analysis shows an improvement of{" "}
              <span className="font-semibold text-white">
                {comparison.overall.change}%
              </span>{" "}
              in the overall resume match score.
            </p>
          )}

          {comparison.overall.change < 0 && (
            <p className="mt-4 leading-7 text-gray-300">
              Your latest analysis is{" "}
              <span className="font-semibold text-white">
                {Math.abs(comparison.overall.change)}%
              </span>{" "}
              lower than the previous analysis. Consider reviewing the missing
              skills and keywords.
            </p>
          )}

          {comparison.overall.change === 0 && (
            <p className="mt-4 leading-7 text-gray-300">
              Your overall resume match score has remained unchanged.
            </p>
          )}
        </section>

        {/* Actions */}

        <div className="mt-8 flex flex-wrap gap-4">
          <Link
            href="/dashboard"
            className="rounded-lg border border-gray-700 px-5 py-3 text-gray-300 hover:bg-gray-900 hover:text-white"
          >
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    </main>
  );
}


export default function Comparepage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-gray-950 text-white">
          <div className="text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-gray-700 border-t-white" />

            <p className="mt-4 text-gray-400">
              Loading comparison...
            </p>
          </div>
        </main>
      }
    >
      <ComparePagecontent />
    </Suspense>
  );
}