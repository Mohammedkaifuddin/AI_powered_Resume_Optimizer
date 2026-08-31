"use client";

// useState lets us store values that change on the page.
import { useState } from "react";

// Next.js Link lets the user go back to the dashboard.
import Link from "next/link";

export default function UploadResumePage() {
  // Store the selected resume file.
  const [file, setFile] = useState<File | null>(null);

  // Store the upload status.
  const [loading, setLoading] = useState(false);

  // Store success message.
  const [success, setSuccess] = useState("");

  // Store error message.
  const [error, setError] = useState("");

  // ==========================================================
  // HANDLE FILE SELECTION
  // ==========================================================

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    // Get the first selected file.
    const selectedFile = event.target.files?.[0];

    // If no file was selected, stop.
    if (!selectedFile) {
      return;
    }

    // Remove old messages.
    setSuccess("");
    setError("");

    // Store the selected file.
    setFile(selectedFile);
  };

  // ==========================================================
  // HANDLE UPLOAD
  // ==========================================================

  const handleUpload = async () => {
    // Make sure a file has been selected.
    if (!file) {
      setError("Please select a resume first.");
      return;
    }

    // Get the JWT.
    const token = sessionStorage.getItem("token");

    // If there is no token, the user isn't logged in.
    if (!token) {
      window.location.href = "/login";
      return;
    }

    // Clear old messages.
    setSuccess("");
    setError("");

    // Start loading.
    setLoading(true);

    try {
      // ------------------------------------------------------
      // CREATE FORM DATA
      // ------------------------------------------------------

      // FormData is used for sending files.
      const formData = new FormData();

      // IMPORTANT:
      //
      // Your backend uses:
      //
      // upload.single("resume")
      //
      // Therefore the field name MUST be "resume".
      formData.append("resume", file);

      // ------------------------------------------------------
      // SEND REQUEST
      // ------------------------------------------------------

      // Send the resume to Express.
      const response = await fetch(
        "http://localhost:5000/api/resumes/upload",
        {
          // Backend expects POST.
          method: "POST",

          // Send JWT.
          headers: {
            Authorization: `Bearer ${token}`,
          },

          // Send the FormData.
          body: formData,
        }
      );

      // Convert backend response to JSON.
      const data = await response.json();

      // ------------------------------------------------------
      // HANDLE ERROR
      // ------------------------------------------------------

      if (!response.ok) {
        setError(
          data.message || "Resume upload failed."
        );

        return;
      }

      // ------------------------------------------------------
      // SUCCESS
      // ------------------------------------------------------

      // Show success message.
      setSuccess(
        data.message || "Resume uploaded successfully."
      );

      // Remove selected file from the UI.
      setFile(null);

      // Clear the file input.
      const fileInput = document.getElementById(
        "resume"
      ) as HTMLInputElement | null;

      if (fileInput) {
        fileInput.value = "";
      }

    } catch (error) {
      // Print the actual error for debugging.
      console.error(
        "Resume upload failed:",
        error
      );

      // Show user-friendly message.
      setError(
        "Unable to connect to the server."
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

      {/* Main container */}
      <div className="mx-auto max-w-2xl px-6 py-10">

        {/* Page header */}
        <div className="mb-8">

          {/* Back link */}
          <Link
            href="/dashboard"
            className="text-gray-400 underline"
          >
            ← Back to Dashboard
          </Link>

          {/* Page title */}
          <h1 className="mt-6 text-3xl font-bold">
            Upload Resume
          </h1>

          {/* Description */}
          <p className="mt-2 text-gray-400">
            Upload your PDF or DOCX resume for analysis.
          </p>

        </div>

        {/* Upload card */}
        <div className="rounded-xl border border-gray-800 bg-gray-900 p-8">

          {/* File input label */}
          <label
            htmlFor="resume"
            className="mb-2 block font-medium"
          >
            Choose Resume
          </label>

          {/* File input */}
          <input
            id="resume"
            type="file"

            // Only allow PDF and DOCX files.
            accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"

            // Handle file selection.
            onChange={handleFileChange}

            className="w-full rounded-lg border border-gray-700 bg-gray-950 p-3 text-sm"
          />

          {/* Selected file information */}
          {/* Selected file information */}
{file && (
  <div className="mt-4 flex items-center justify-between rounded-lg border border-gray-800 p-4">

    {/* File information */}
    <div>
      <p className="text-sm text-gray-400">
        Selected file
      </p>

      <p className="mt-1 font-medium">
        {file.name}
      </p>

      <p className="mt-1 text-sm text-gray-500">
        {(file.size / 1024 / 1024).toFixed(2)} MB
      </p>
    </div>

    {/* Remove selected file button */}
    <button
      type="button"

      // Remove the selected file from React state.
      onClick={() => {
        setFile(null);

        // Also clear the actual file input.
        const fileInput = document.getElementById(
          "resume"
        ) as HTMLInputElement | null;

        if (fileInput) {
          fileInput.value = "";
        }
      }}

      // Button styling.
      className="ml-4 flex h-8 w-8 items-center justify-center rounded-full text-gray-400 hover:bg-red-500/10 hover:text-red-400"

      // Accessibility description.
      aria-label="Remove selected resume"
    >
      ×
    </button>

  </div>
)}

          {/* Error message */}
          {error && (
            <p className="mt-4 text-sm text-red-400">
              {error}
            </p>
          )}

          {/* Success message */}
          {success && (
            <p className="mt-4 text-sm text-green-400">
              {success}
            </p>
          )}

          {/* Upload button */}
          <button
            type="button"

            // Disable button while uploading.
            disabled={loading}

            // Start upload.
            onClick={handleUpload}

            className="mt-6 w-full rounded-lg bg-white px-5 py-3 font-medium text-black hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading
              ? "Uploading..."
              : "Upload Resume"}
          </button>

        </div>

      </div>

    </main>
  );
}