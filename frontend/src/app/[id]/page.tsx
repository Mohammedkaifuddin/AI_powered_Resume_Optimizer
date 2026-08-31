"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { apiRequest } from "@/lib/api";

// ==========================================================
// TYPES
// ==========================================================

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

  aiAnalysis: AIAnalysis | null;
};

type AIAnalysis = {
  strengths?: string[];
  missingSkills?: string[];
  improvements?: string[];
  experienceGaps?: string[];
  keywordSuggestions?: string[];
  recommendation?: string;
};

// ==========================================================
// PAGE
// ==========================================================

export default function AnalysisPage() {
  // Get analysis ID from URL.
  const params = useParams();

  const analysisId = params.id as string;

  // Store analysis.
  const [analysis, setAnalysis] = useState<Analysis | null>(null);

  // Loading state.
  const [loading, setLoading] = useState(true);

  // Error state.
  const [error, setError] = useState("");

  // ==========================================================
  // LOAD ANALYSIS
  // ==========================================================

  useEffect(() => {
    const loadAnalysis = async () => {
      // Get JWT.
      const token = sessionStorage.getItem("token");

      // No token → login.
      if (!token) {
        window.location.href = "/login";
        return;
      }

      try {
        // Request analysis from backend.
        //
        // IMPORTANT:
        // This assumes your backend supports:
        //
        // GET /api/analyses/:id
        //
        const data = await apiRequest(`/api/analyses/${analysisId}`);

        console.log("Analysis details:", data);

        // Save analysis.
        setAnalysis(data.analysis);
      } catch (error) {
        console.error("Failed to load analysis:", error);

        setError("Unable to load analysis.");
      } finally {
        setLoading(false);
      }
    };

    // Don't call API without an ID.
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
        <p className="text-gray-400">Loading analysis...</p>
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
          <p className="text-red-400">{error || "Analysis not found."}</p>

          <Link
            href="/dashboard"
            className="mt-5 inline-block text-gray-300 underline"
          >
            ← Back to Dashboard
          </Link>
        </div>
      </main>
    );
  }

  // ==========================================================
  // AI DATA
  // ==========================================================

  const ai = analysis.aiAnalysis;

  // ==========================================================
  // UI
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

          <h1 className="mt-6 text-4xl font-bold">Resume Analysis</h1>

          <p className="mt-2 text-gray-400">
            AI-powered comparison between your resume and the selected job
            description.
          </p>
        </div>

        {/* ================================================== */}
        {/* OVERALL SCORE */}
        {/* ================================================== */}

        <section className="rounded-2xl border border-gray-800 bg-gray-900 p-8">
          <div className="text-center">
            <p className="text-sm text-gray-400">Overall Match Score</p>

            <p className="mt-3 text-7xl font-bold">{analysis.score}%</p>
          </div>

          {/* Score cards */}
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <div className="rounded-xl border border-gray-800 bg-gray-950 p-5 text-center">
              <p className="text-sm text-gray-400">Skill Score</p>

              <p className="mt-2 text-3xl font-bold">{analysis.skillScore}%</p>
            </div>

            <div className="rounded-xl border border-gray-800 bg-gray-950 p-5 text-center">
              <p className="text-sm text-gray-400">Keyword Score</p>

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
          {/* Matched skills */}
          <div className="rounded-xl border border-gray-800 bg-gray-900 p-6">
            <h2 className="text-xl font-semibold">✓ Matched Skills</h2>

            <div className="mt-4 flex flex-wrap gap-2">
              {analysis.matchedSkills.length === 0 ? (
                <p className="text-sm text-gray-500">No matched skills.</p>
              ) : (
                analysis.matchedSkills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-full border border-gray-700 px-3 py-1 text-sm text-gray-300"
                  >
                    {skill}
                  </span>
                ))
              )}
            </div>
          </div>

          {/* Missing skills */}
          <div className="rounded-xl border border-gray-800 bg-gray-900 p-6">
            <h2 className="text-xl font-semibold">⚠ Missing Skills</h2>

            <div className="mt-4 flex flex-wrap gap-2">
              {analysis.missingSkills.length === 0 ? (
                <p className="text-sm text-gray-500">No missing skills 🎉</p>
              ) : (
                analysis.missingSkills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-full border border-gray-700 px-3 py-1 text-sm text-gray-400"
                  >
                    {skill}
                  </span>
                ))
              )}
            </div>
          </div>
        </section>

        {/* ================================================== */}
        {/* KEYWORDS */}
        {/* ================================================== */}

        <section className="mt-8 grid gap-6 md:grid-cols-2">
          {/* Matched keywords */}
          <div className="rounded-xl border border-gray-800 bg-gray-900 p-6">
            <h2 className="text-xl font-semibold">✓ Matched Keywords</h2>

            <div className="mt-4 flex flex-wrap gap-2">
              {analysis.matchedKeywords.map((keyword) => (
                <span
                  key={keyword}
                  className="rounded-full border border-gray-700 px-3 py-1 text-sm text-gray-300"
                >
                  {keyword}
                </span>
              ))}
            </div>
          </div>

          {/* Missing keywords */}
          <div className="rounded-xl border border-gray-800 bg-gray-900 p-6">
            <h2 className="text-xl font-semibold">Missing Keywords</h2>

            <div className="mt-4 flex flex-wrap gap-2">
              {analysis.missingKeywords.map((keyword) => (
                <span
                  key={keyword}
                  className="rounded-full border border-gray-700 px-3 py-1 text-sm text-gray-400"
                >
                  {keyword}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* ================================================== */}
        {/* AI ANALYSIS */}
        {/* ================================================== */}

        {ai && (
          <section className="mt-8">
            <div className="rounded-2xl border border-gray-800 bg-gray-900 p-8">
              <h2 className="text-2xl font-semibold">AI Recommendations</h2>

              {/* -------------------------------------------- */}
              {/* STRENGTHS */}
              {/* -------------------------------------------- */}

              {ai.strengths && ai.strengths.length > 0 && (
                <div className="mt-7">
                  <h3 className="text-lg font-semibold">Strengths</h3>

                  <ul className="mt-3 space-y-2">
                    {ai.strengths.map((item, index) => (
                      <li key={index} className="text-gray-300">
                        • {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* -------------------------------------------- */}
              {/* MISSING SKILLS */}
              {/* -------------------------------------------- */}

              {ai.missingSkills && ai.missingSkills.length > 0 && (
                <div className="mt-7">
                  <h3 className="text-lg font-semibold">
                    AI-Detected Missing Skills
                  </h3>

                  <ul className="mt-3 space-y-2">
                    {ai.missingSkills.map((item, index) => (
                      <li key={index} className="text-gray-300">
                        • {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* -------------------------------------------- */}
              {/* IMPROVEMENTS */}
              {/* -------------------------------------------- */}

              {ai.improvements && ai.improvements.length > 0 && (
                <div className="mt-7">
                  <h3 className="text-lg font-semibold">Improvements</h3>

                  <ul className="mt-3 space-y-2">
                    {ai.improvements.map((item, index) => (
                      <li key={index} className="text-gray-300">
                        • {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* -------------------------------------------- */}
              {/* EXPERIENCE GAPS */}
              {/* -------------------------------------------- */}

              {ai.experienceGaps && ai.experienceGaps.length > 0 && (
                <div className="mt-7">
                  <h3 className="text-lg font-semibold">Experience Gaps</h3>

                  <ul className="mt-3 space-y-2">
                    {ai.experienceGaps.map((item, index) => (
                      <li key={index} className="text-gray-300">
                        • {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* -------------------------------------------- */}
              {/* KEYWORD SUGGESTIONS */}
              {/* -------------------------------------------- */}

              {ai.keywordSuggestions && ai.keywordSuggestions.length > 0 && (
                <div className="mt-7">
                  <h3 className="text-lg font-semibold">Keyword Suggestions</h3>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {ai.keywordSuggestions.map((keyword) => (
                      <span
                        key={keyword}
                        className="rounded-full border border-gray-700 px-3 py-1 text-sm text-gray-300"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* -------------------------------------------- */}
              {/* FINAL RECOMMENDATION */}
              {/* -------------------------------------------- */}

              {ai.recommendation && (
                <div className="mt-8 rounded-xl border border-gray-800 bg-gray-950 p-5">
                  <h3 className="font-semibold">Recommendation</h3>

                  <p className="mt-3 leading-7 text-gray-300">
                    {ai.recommendation}
                  </p>
                </div>
              )}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
