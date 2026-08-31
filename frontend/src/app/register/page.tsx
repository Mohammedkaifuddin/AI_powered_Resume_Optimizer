"use client";

// useState lets us store what the user types.
import { useState } from "react";
import Link from "next/link";
import { apiRequest } from "@/lib/api";

export default function RegisterPage() {
  // Store user's name.
  const [name, setName] = useState("");

  // Store user's email.
  const [email, setEmail] = useState("");

  // Store user's password.
  const [password, setPassword] = useState("");

  // Tell the UI whether registration is happening.
  const [loading, setLoading] = useState(false);

  // Store error messages.
  const [error, setError] = useState("");

  // This function runs when the form is submitted.
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    // Prevent normal browser page refresh.
    event.preventDefault();

    // Remove any previous error.
    setError("");

    // Start loading state.
    setLoading(true);

    try {
      // Send registration request to our Express backend.
      const response = await apiRequest("/api/auth/register", {
        // Our backend expects POST.
        method: "POST",

        // Tell Express that the body is JSON.
        headers: {
          "Content-Type": "application/json",
        },

        // Convert our JavaScript object into JSON text.
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      // Convert the response into a JavaScript object.
      const data = await response.json();

      // Check whether registration failed.
      if (!response.ok) {
        setError(data.message || "Registration failed");

        return;
      }

      // For now, print the successful response.
      // Later we'll redirect the user to login/dashboard.
      console.log("Registration successful:", data);
    } catch (error) {
      // This catches network errors.
      console.error("Registration request failed:", error);

      // Show a friendly message.
      setError("Unable to connect to the server");
    } finally {
      // Stop loading state.
      setLoading(false);
    }
  };

  return (
    // Center the registration card.
    <main className="flex min-h-screen items-center justify-center px-4">
      {/* Registration card */}
      <div className="w-full max-w-md rounded-xl border p-8 shadow-sm">
        {/* Title */}
        <h1 className="text-3xl font-bold">Create Account</h1>

        {/* Description */}
        <p className="mt-2 text-gray-600">
          Create your AI Resume Matcher account.
        </p>

        {/* Registration form */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {/* Name */}
          <div>
            <label htmlFor="name" className="mb-1 block font-medium">
              Name
            </label>

            <input
              id="name"
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Enter your name"
              className="w-full rounded-md border px-3 py-2"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="mb-1 block font-medium">
              Email
            </label>

            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Enter your email id"
              className="w-full rounded-md border px-3 py-2"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="mb-1 block font-medium">
              Password
            </label>

            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter a password"
              className="w-full rounded-md border px-3 py-2"
              required
            />
          </div>

          {/* Error message */}
          {error && <p className="text-sm text-red-600">{error}</p>}

          {/* Submit button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-black px-4 py-2 text-white disabled:opacity-50"
          >
            {loading ? "Creating account..." : "Register"}
          </button>

          {/* Link back to login. */}
          <p className="mt-4 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link href="/login" className="font-medium text-grey-600 underline">
              Login
            </Link>
          </p>
        </form>
      </div>
    </main>
  );
}
