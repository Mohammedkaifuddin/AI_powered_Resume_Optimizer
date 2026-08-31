"use client";

// Import React state.
// useState lets us remember values typed into the form.
import { useState } from "react";
import Link from "next/link";

export default function LoginPage() {
  // Store the email entered by the user.
  const [email, setEmail] = useState("");

  // Store the password entered by the user.
  const [password, setPassword] = useState("");

  // This will tell us whether the request is currently being sent.
  const [loading, setLoading] = useState(false);

  // This will store any error message we want to show.
  const [error, setError] = useState("");

  // This function runs when the user submits the form.
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    // Stop the browser from refreshing the page.
    event.preventDefault();

    // Remove any previous error.
    setError("");

    // Show loading state.
    setLoading(true);

    try {
      // Send login request to our Express backend.
      const response = await fetch("http://localhost:5000/api/auth/login", {
        // Our backend expects POST.
        method: "POST",

        // Tell the backend that we're sending JSON.
        headers: {
          "Content-Type": "application/json",
        },

        // Convert our JavaScript object into JSON text.
        body: JSON.stringify({
          email,
          password,
        }),
      });

      // Convert the backend response from JSON text
      // into a JavaScript object.
      const data = await response.json();

      console.log("Login response:", data);

      // Check whether the backend says login failed.
      if (!response.ok) {
        // Show the backend error message.
        setError(data.message || "Login failed");

        // Stop here.
        return;
      }

      //check that the backend actually returned a token
      if(!data.token){
        setError("Login succeeded but no token was returned");
        return;
      }

      //store the jwt in the current browser session.
      //sessionStorage is available only in the browser
      //which is why this page is a client component

      sessionStorage.setItem("token", data.token);

      console.log("Token saved: ",!!sessionStorage.getItem("token"))

      //send the user to the dashboard
      window.location.href = "/dashboard";

    } catch (error) {
      // This catches network errors.
      console.error("Login request failed:", error);

      // Show a user-friendly message.
      setError("Unable to connect to the server");
    } finally {
      // Stop the loading state.
      setLoading(false);
    }
  };

  return (
    // Main page container.
    <main className="flex min-h-screen items-center justify-center px-4">
      {/* Login card */}
      <div className="w-full max-w-md rounded-xl border p-8 shadow-sm">
        {/* Page title */}
        <h1 className="text-3xl font-bold">Login</h1>

        {/* Small description */}
        <p className="mt-2 text-gray-600">
          Sign in to your AI Resume Matcher account.
        </p>

        {/* Login form */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {/* Email field */}
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

          {/* Password field */}
          <div>
            <label htmlFor="password" className="mb-1 block font-medium">
              Password
            </label>

            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter your password"
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
            {loading ? "Logging in..." : "Login"}
          </button>

          {/* Link to the registration page. */}
          <p className="mt-5 text-center text-sm text-gray-600">
             Don&apos;t have an account?{" "}
            <Link href="/register" className="font-medium text-grey-600 underline">
              Register
            </Link>
          </p>
        </form>
      </div>
    </main>
  );
}
