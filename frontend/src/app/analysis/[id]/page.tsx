"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { apiRequest } from "@/lib/api";

type AIAnalysis = {
  strengths?: string[];
  missingSkills?: string[];
  improvements?: string[];
  experienceGaps?: string[];
  keywordSuggestions?: string[];
  recommendation?: string;
};

type Analysis = {
  id: string;
  resumeId: string;
  jobDescriptionId: string;

  skillScore: number;
  keywordScore: number;
  score: number;

  matchedSkills: string[];
  missingSkills: string[];

  matchedKeywords: string[];
  missingKeywords: string[];

  createdAt: string;

  resume: {
    id: string;
    fileName: string;
    fileType: string;
  };

  jobDescription: {
    id: string;
    title: string;
    description: string;
  };

  aiAnalysis: AIAnalysis | null;
};

export default function AnalysisPage() {
  const params = useParams();

  const analysisId = params.id as string;

  const [analysis, setAnalysis] =
    useState<Analysis | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  // ==========================================================
  // LOAD ANALYSIS
  // ==========================================================

  useEffect(() => {
    const loadAnalysis = async () => {
      const token = sessionStorage.getItem("token");

      if (!token) {
        window.location.href = "/login";
        return;
      }

      try {
        console.log(
          "Loading analysis:",
          analysisId
        );

        const data = await apiRequest(
          `/api/analyses/${analysisId}`
        );

        console.log(
          "Analysis details:",
          data
        );

        if (!data.success || !data.analysis) {
          setError(
            data.message ||
              "Analysis not found."
          );
          return;
        }

        setAnalysis(data.analysis);

      } catch (error) {
        console.error(
          "Failed to load analysis:",
          error
        );

        setError(
          "Unable to load analysis."
        );

      } finally {
        setLoading(false);
      }
    };

    if (analysisId) {
      loadAnalysis();
    }
  }, [analysisId]);

  // ==========================================================
  // LOADING
  // ==========================================================

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-950 text-white">
        <p className="text-gray-400">
          Loading analysis...
        </p>
      </main>
    );
  }

  // ==========================================================
  // ERROR
  // ==========================================================

  if (error || !analysis) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-950 text-white">
        <div className="text-center">

          <p className="text-red-400">
            {error || "Analysis not found."}
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

  const ai = analysis.aiAnalysis;

  // ==========================================================
  // PAGE
  // ==========================================================

  return (
    <main className="min-h-screen bg-gray-950 text-white">

      <div className="mx-auto max-w-6xl px-6 py-10">

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

          <h1 className="mt-6 text-4xl font-bold">
            Resume Analysis
          </h1>

          <p className="mt-2 text-gray-400">
            AI-powered comparison of your resume
            against the selected job description.
          </p>

        </div>

        {/* ================================================== */}
        {/* ANALYSIS INFORMATION */}
        {/* ================================================== */}

        <section className="grid gap-4 md:grid-cols-3">

          {/* Resume */}

          <div className="rounded-xl border border-gray-800 bg-gray-900 p-5">

            <p className="text-sm text-gray-500">
              Resume
            </p>

            <p className="mt-2 font-semibold">
              📄 {analysis.resume?.fileName ||
                "Resume"}
            </p>

          </div>

          {/* Job Description */}

          <div className="rounded-xl border border-gray-800 bg-gray-900 p-5">

            <p className="text-sm text-gray-500">
              Job Description
            </p>

            <p className="mt-2 font-semibold">
              {analysis.jobDescription?.title ||
                "Job Description"}
            </p>

          </div>

          {/* Date */}

          <div className="rounded-xl border border-gray-800 bg-gray-900 p-5">

            <p className="text-sm text-gray-500">
              Analyzed
            </p>

            <p className="mt-2 font-semibold">
              {new Date(
                analysis.createdAt
              ).toLocaleDateString(
                "en-IN",
                {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                }
              )}
            </p>

          </div>

        </section>

        {/* ================================================== */}
        {/* SCORE */}
        {/* ================================================== */}

        <section className="mt-8 rounded-xl border border-gray-800 bg-gray-900 p-8">

          <div className="text-center">

            <p className="text-sm text-gray-500">
              Overall Match Score
            </p>

            <p className="mt-3 text-6xl font-bold">
              {analysis.score}%
            </p>

          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-2">

            <div className="rounded-lg bg-gray-950 p-5 text-center">

              <p className="text-sm text-gray-500">
                Skill Score
              </p>

              <p className="mt-2 text-3xl font-bold">
                {analysis.skillScore}%
              </p>

            </div>

            <div className="rounded-lg bg-gray-950 p-5 text-center">

              <p className="text-sm text-gray-500">
                Keyword Score
              </p>

              <p className="mt-2 text-3xl font-bold">
                {analysis.keywordScore}%
              </p>

            </div>

          </div>

        </section>

        {/* ================================================== */}
        {/* SKILLS */}
        {/* ================================================== */}

        <section className="mt-8 grid gap-6 md:grid-cols-2">

          {/* Matched Skills */}

          <div className="rounded-xl border border-gray-800 bg-gray-900 p-6">

            <h2 className="text-xl font-semibold">
              Matched Skills
            </h2>

            {analysis.matchedSkills?.length ? (

              <div className="mt-5 flex flex-wrap gap-2">

                {analysis.matchedSkills.map(
                  (skill, index) => (
                    <span
                      key={`${skill}-${index}`}
                      className="rounded-full border border-gray-700 px-3 py-1 text-sm text-gray-300"
                    >
                      {skill}
                    </span>
                  )
                )}

              </div>

            ) : (

              <p className="mt-4 text-gray-500">
                No matched skills.
              </p>

            )}

          </div>

          {/* Missing Skills */}

          <div className="rounded-xl border border-gray-800 bg-gray-900 p-6">

            <h2 className="text-xl font-semibold">
              Missing Skills
            </h2>

            {analysis.missingSkills?.length ? (

              <div className="mt-5 flex flex-wrap gap-2">

                {analysis.missingSkills.map(
                  (skill, index) => (
                    <span
                      key={`${skill}-${index}`}
                      className="rounded-full border border-red-900 px-3 py-1 text-sm text-red-400"
                    >
                      {skill}
                    </span>
                  )
                )}

              </div>

            ) : (

              <p className="mt-4 text-gray-500">
                No missing skills.
              </p>

            )}

          </div>

        </section>

        {/* ================================================== */}
        {/* KEYWORDS */}
        {/* ================================================== */}

        <section className="mt-8 grid gap-6 md:grid-cols-2">

          {/* Matched Keywords */}

          <div className="rounded-xl border border-gray-800 bg-gray-900 p-6">

            <h2 className="text-xl font-semibold">
              Matched Keywords
            </h2>

            {analysis.matchedKeywords?.length ? (

              <div className="mt-5 flex flex-wrap gap-2">

                {analysis.matchedKeywords.map(
                  (keyword, index) => (
                    <span
                      key={`${keyword}-${index}`}
                      className="rounded-full border border-gray-700 px-3 py-1 text-sm text-gray-300"
                    >
                      {keyword}
                    </span>
                  )
                )}

              </div>

            ) : (

              <p className="mt-4 text-gray-500">
                No matched keywords.
              </p>

            )}

          </div>

          {/* Missing Keywords */}

          <div className="rounded-xl border border-gray-800 bg-gray-900 p-6">

            <h2 className="text-xl font-semibold">
              Missing Keywords
            </h2>

            {analysis.missingKeywords?.length ? (

              <div className="mt-5 flex flex-wrap gap-2">

                {analysis.missingKeywords.map(
                  (keyword, index) => (
                    <span
                      key={`${keyword}-${index}`}
                      className="rounded-full border border-red-900 px-3 py-1 text-sm text-red-400"
                    >
                      {keyword}
                    </span>
                  )
                )}

              </div>

            ) : (

              <p className="mt-4 text-gray-500">
                No missing keywords.
              </p>

            )}

          </div>

        </section>

        {/* ================================================== */}
        {/* AI RECOMMENDATIONS */}
        {/* ================================================== */}

        {ai && (
          <section className="mt-8 rounded-xl border border-gray-800 bg-gray-900 p-6">

            <h2 className="text-2xl font-semibold">
              AI Recommendations
            </h2>

            {/* Strengths */}

            {ai.strengths?.length ? (
              <div className="mt-6">

                <h3 className="text-lg font-semibold">
                  Strengths
                </h3>

                <ul className="mt-3 space-y-2">

                  {ai.strengths.map(
                    (item, index) => (
                      <li
                        key={index}
                        className="text-gray-300"
                      >
                        • {item}
                      </li>
                    )
                  )}

                </ul>

              </div>
            ) : null}

            {/* Missing Skills */}

            {ai.missingSkills?.length ? (
              <div className="mt-6">

                <h3 className="text-lg font-semibold">
                  Skills to Improve
                </h3>

                <ul className="mt-3 space-y-2">

                  {ai.missingSkills.map(
                    (item, index) => (
                      <li
                        key={index}
                        className="text-gray-300"
                      >
                        • {item}
                      </li>
                    )
                  )}

                </ul>

              </div>
            ) : null}

            {/* Improvements */}

            {ai.improvements?.length ? (
              <div className="mt-6">

                <h3 className="text-lg font-semibold">
                  Improvements
                </h3>

                <ul className="mt-3 space-y-2">

                  {ai.improvements.map(
                    (item, index) => (
                      <li
                        key={index}
                        className="text-gray-300"
                      >
                        • {item}
                      </li>
                    )
                  )}

                </ul>

              </div>
            ) : null}

            {/* Experience Gaps */}

            {ai.experienceGaps?.length ? (
              <div className="mt-6">

                <h3 className="text-lg font-semibold">
                  Experience Gaps
                </h3>

                <ul className="mt-3 space-y-2">

                  {ai.experienceGaps.map(
                    (item, index) => (
                      <li
                        key={index}
                        className="text-gray-300"
                      >
                        • {item}
                      </li>
                    )
                  )}

                </ul>

              </div>
            ) : null}

            {/* Keywords */}

            {ai.keywordSuggestions?.length ? (
              <div className="mt-6">

                <h3 className="text-lg font-semibold">
                  Keyword Suggestions
                </h3>

                <div className="mt-3 flex flex-wrap gap-2">

                  {ai.keywordSuggestions.map(
                    (keyword, index) => (
                      <span
                        key={`${keyword}-${index}`}
                        className="rounded-full border border-gray-700 px-3 py-1 text-sm text-gray-300"
                      >
                        {keyword}
                      </span>
                    )
                  )}

                </div>

              </div>
            ) : null}

            {/* Recommendation */}

            {ai.recommendation ? (
              <div className="mt-6 rounded-lg border border-gray-800 bg-gray-950 p-5">

                <h3 className="text-lg font-semibold">
                  Recommendation
                </h3>

                <p className="mt-3 leading-7 text-gray-300">
                  {ai.recommendation}
                </p>

              </div>
            ) : null}

          </section>
        )}

        {/* ================================================== */}
        {/* ACTIONS */}
        {/* ================================================== */}

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