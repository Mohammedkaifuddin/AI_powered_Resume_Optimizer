// This is our homepage component.
// Next.js automatically renders this component at "/".
export default function Home() {
  // Everything inside return() is JSX.
  // JSX looks like HTML, but it is actually TypeScript + React syntax.
  return (
    // min-h-screen makes the page at least as tall as the screen.
    <main className="min-h-screen">

      {/* Main heading of our application */}
      <h1 className="text-4xl font-bold">
        AI Resume Matcher
      </h1>

      {/* Small description below the heading */}
      <p className="mt-4">
        Analyze your resume against a job description.
      </p>

    </main>
  );
}