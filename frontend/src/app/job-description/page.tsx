"use client";

// React hook for storing form values and loading state.
import { useState } from "react";

// Next.js Link allows navigation back to the dashboard.
import Link from "next/link";

export default function JobDescriptionPage() {
  // ==========================================================
  // FORM STATE
  // ==========================================================

  // Store the job title entered by the user.
  const [title, setTitle] = useState("");

  // Store the complete job description.
  const [description, setDescription] = useState("");

  // Store whether the request is currently being sent.
  const [loading, setLoading] = useState(false);

  // Store success message.
  const [success, setSuccess] = useState("");

  // Store error message.
  const [error, setError] = useState("");

  // ==========================================================
  // HANDLE FORM SUBMISSION
  // ==========================================================

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    // Prevent the browser from refreshing the page.
    event.preventDefault();

    // Remove previous messages.
    setSuccess("");
    setError("");

    // ========================================================
    // VALIDATION
    // ========================================================

    // Check whether title is empty.
    if (!title.trim()) {
      setError("Please enter a job title.");
      return;
    }

    // Check whether job description is empty.
    if (!description.trim()) {
      setError("Please enter the job description.");
      return;
    }

    // ========================================================
    // CHECK JWT
    // ========================================================

    // Get the logged-in user's JWT.
    const token = sessionStorage.getItem("token");

    // If token doesn't exist, user must login.
    if (!token) {
      window.location.href = "/login";
      return;
    }

    // Start loading.
    setLoading(true);

    try {
      // ======================================================
      // SEND REQUEST TO BACKEND
      // ======================================================

      // Send POST request to our backend.
      const response = await fetch(
        "http://localhost:5000/api/job-descriptions",
        {
          // Backend expects POST.
          method: "POST",

          // Tell Express we're sending JSON.
          headers: {
            "Content-Type": "application/json",

            // Send JWT for authentication.
            Authorization: `Bearer ${token}`,
          },

          // Convert our JavaScript object into JSON.
          body: JSON.stringify({
            title: title.trim(),
            description: description.trim(),
          }),
        }
      );

      // Convert backend response into JSON.
      const data = await response.json();

      // Print response for debugging.
      console.log(
        "Job description response:",
        data
      );

      // ======================================================
      // HANDLE BACKEND ERROR
      // ======================================================

      if (!response.ok) {
        // Display backend error.
        setError(
          data.message ||
            "Failed to save job description."
        );

        return;
      }

      // ======================================================
      // SUCCESS
      // ======================================================

      // Display success message.
      setSuccess(
        data.message ||
          "Job description saved successfully."
      );

      // Clear the form.
      setTitle("");
      setDescription("");

    } catch (error) {
      // Print actual error in console.
      console.error(
        "Job description request failed:",
        error
      );

      // Show user-friendly error.
      setError(
        "Unable to connect to the backend server."
      );

    } finally {
      // Stop loading.
      setLoading(false);
    }
  };

  // ==========================================================
  // PAGE UI
  // ==========================================================

  return (
    <main className="min-h-screen bg-gray-950 text-white">

      {/* Main page container */}
      <div className="mx-auto max-w-3xl px-6 py-10">

        {/* ================================================== */}
        {/* HEADER */}
        {/* ================================================== */}

        <div className="mb-8">

          {/* Back to dashboard */}
          <Link
            href="/dashboard"
            className="text-gray-400 underline hover:text-white"
          >
            ← Back to Dashboard
          </Link>

          {/* Page title */}
          <h1 className="mt-6 text-3xl font-bold">
            Add Job Description
          </h1>

          {/* Description */}
          <p className="mt-2 text-gray-400">
            Add a job description to compare it with your
            resume.
          </p>

        </div>

        {/* ================================================== */}
        {/* FORM */}
        {/* ================================================== */}

        <form
          onSubmit={handleSubmit}
          className="rounded-xl border border-gray-800 bg-gray-900 p-8"
        >

          {/* ------------------------------------------------ */}
          {/* JOB TITLE */}
          {/* ------------------------------------------------ */}

          <div>

            {/* Label */}
            <label
              htmlFor="title"
              className="mb-2 block font-medium"
            >
              Job Title
            </label>

            {/* Input */}
            <input
              id="title"
              type="text"
              value={title}

              // Update title when user types.
              onChange={(event) =>
                setTitle(event.target.value)
              }

              // Example placeholder.
              placeholder="Java Backend Developer"

              className="w-full rounded-lg border border-gray-700 bg-gray-950 px-4 py-3 text-white outline-none focus:border-gray-500"
            />

          </div>

          {/* ------------------------------------------------ */}
          {/* JOB DESCRIPTION */}
          {/* ------------------------------------------------ */}

          <div className="mt-6">

            {/* Label */}
            <label
              htmlFor="description"
              className="mb-2 block font-medium"
            >
              Job Description
            </label>

            {/* Textarea */}
            <textarea
              id="description"
              value={description}

              // Update description while typing.
              onChange={(event) =>
                setDescription(event.target.value)
              }

              // Give the user a useful example.
              placeholder="Looking for a Java developer with Spring Boot, REST APIs, SQL and Docker experience."

              // Make textarea comfortable to use.
              rows={12}

              className="w-full resize-y rounded-lg border border-gray-700 bg-gray-950 px-4 py-3 text-white outline-none focus:border-gray-500"
            />

          </div>

          {/* ------------------------------------------------ */}
          {/* ERROR */}
          {/* ------------------------------------------------ */}

          {error && (
            <p className="mt-5 text-sm text-red-400">
              {error}
            </p>
          )}

          {/* ------------------------------------------------ */}
          {/* SUCCESS */}
          {/* ------------------------------------------------ */}

          {success && (
            <p className="mt-5 text-sm text-green-400">
              {success}
            </p>
          )}

          {/* ------------------------------------------------ */}
          {/* SUBMIT BUTTON */}
          {/* ------------------------------------------------ */}

          <button
            type="submit"

            // Disable button while request is running.
            disabled={loading}

            className="mt-6 w-full rounded-lg bg-white px-5 py-3 font-medium text-black hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading
              ? "Saving..."
              : "Save Job Description"}
          </button>

        </form>

      </div>

    </main>
  );
}