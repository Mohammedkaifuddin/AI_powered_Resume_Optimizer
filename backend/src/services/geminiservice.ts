// import { GoogleGenAI, ThinkingLevel } from "@google/genai";
// import { promise } from "zod";
// import { jobdescriptionschema } from "../validation/jobdescriptionschema";

// const ai = new GoogleGenAI({
//   apiKey: process.env.GEMINI_API_KEY,
// });

// export const testGemini = async (): Promise<string> => {
//   // This should appear immediately when the function starts.
//   console.log("1. Gemini test started");

//   // Check that the key exists without printing the actual key.
//   console.log("2. API key loaded:", Boolean(process.env.GEMINI_API_KEY));

//   console.log("3. Sending request to Gemini...");

//   try {
//     const response = await ai.models.generateContent({
//       model: "gemini-3.7-flash",
//       contents: "Say hello in one sentence.",
//       config: {
//         thinkingConfig: {
//           thinkingLevel: ThinkingLevel.LOW,
//         },
//       },
//     });

//     console.log("4. Gemini responded");

//     return response.text ?? "";
//   } catch (error) {
//     console.error("5. Gemini request failed:", error);
//     throw error;
//   }
// };
//---------------------------------
// export const analyzeresumewithgemini = async (
//   resumeText: string,
//   jobDescription: string,
// ): Promise<string> => {
//   console.log("Gemini analysis started");
//   const prompt = `
//     You are an expert resume and job-matching assistant.
//     Analyze the following resume against the job description.

//     RESUME:
//     ${resumeText}

//     JOB DESCRIPTION:
//     ${jobDescription}

//     Return the analysis with these sections:

//     1. Strengths
//     2. Missing Skills
//     3. Resume Improvements
//     4. Experience Suggestions
//     5. Keyword Suggestions
//     6. Overall Recommendations

//     Keep the response practical and concise.
//   `;

//   try {
//     console.log("Sending resume/JD to Gemini...");

//     //send the prompt to gemini.
//     const response = await ai.models.generateContent({
//       model: "gemini-2.5-flash",

//       //our complete prompt
//       contents: prompt,

//       config: {
//         thinkingConfig: {
//           thinkingLevel: ThinkingLevel.LOW,
//         },
//       },
//     });

//     return response.text ?? "";
//   } catch (error) {
//     console.error("Gemini analysis error:", error);
//     throw error;
//   }
// };

//-----------------------------------------

// export const analyzeResumeWithGemini = async (
//   resumeText: string,
//   jobDescription: string
// ): Promise<string> => {

//   // For now, use only a small amount of the resume text.
//   // This helps us test Gemini without sending a huge request.
//   const shortResume = resumeText.slice(0, 5000);

//   // Build a simple prompt.
//   const prompt = `
// You are a resume analyzer.

// Compare this resume with this job description.

// RESUME:
// ${shortResume}

// JOB DESCRIPTION:
// ${jobDescription}

// Give:
// 1. Strengths
// 2. Missing skills
// 3. One improvement suggestion
// `;

//   console.log("Sending small AI analysis request...");

//   try {
//     const response = await ai.models.generateContent({
//       model: "gemini-2.5-flash",

//       contents: prompt,

//       config: {
//         thinkingConfig: {
//           thinkingLevel: ThinkingLevel.LOW,
//         },
//       },
//     });

//     console.log("Gemini returned successfully.");

//     return response.text ?? "";

//   } catch (error) {
//     console.error("Gemini analysis error:", error);
//     throw error;
//   }
// };

//---------------------------

import { GoogleGenAI, ThinkingLevel } from "@google/genai";

// Create the Gemini client using the API key from .env.
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

// This describes the structure of the response
// we expect Gemini to return.
export interface AIResumeAnalysis {
  // Good things found in the resume.
  strengths: string[];

  // Skills required by the job but missing from the resume.
  missingSkills: string[];

  // Suggestions for improving the resume.
  improvements: string[];

  // Gaps between the candidate's experience
  // and the job requirements.
  experienceGaps: string[];

  // Keywords the candidate should consider adding
  // when they are truthful and relevant.
  keywordSuggestions: string[];

  // Overall recommendation from Gemini.
  recommendation: string;
}

// Analyze a resume against a job description
// and return a structured JSON result.
export const analyzeresumewithgemini = async (
  resumeText: string,
  jobDescription: string,
): Promise<AIResumeAnalysis> => {
  // Limit the resume text for our first implementation.
  // This reduces unnecessary request size.
  const shortResume = resumeText.slice(0, 10000);

  // Create the prompt for Gemini.
  const prompt = `
You are an expert resume and job-matching assistant.

Analyze the candidate's resume against the job description.

Important rules:

- Only identify skills that are actually required or useful for the job.
- Do not invent experience that is not present in the resume.
- Missing skills should be skills genuinely required by the job
  but not demonstrated in the resume.
- Suggestions must be practical and truthful.
- Do not recommend adding a skill unless the candidate can
  genuinely support it.
- Keep the response concise.

RESUME:
${shortResume}

JOB DESCRIPTION:
${jobDescription}
`;

  // Send the prompt to Gemini.
  const response = await ai.models.generateContent({
    // The Gemini model that is currently working for your API key.
    model: "gemini-3.6-flash",

    // Send our prompt.
    contents: prompt,

    // Tell Gemini that we want JSON.
    config: {
      // Ask for JSON output.
      responseMimeType: "application/json",

      // Define exactly what JSON structure we expect.
      responseSchema: {
        type: "object",

        properties: {
          strengths: {
            type: "array",

            items: {
              type: "string",
            },

            description: "Important strengths demonstrated by the resume.",
          },

          missingSkills: {
            type: "array",

            items: {
              type: "string",
            },

            description: "Important job skills not demonstrated by the resume.",
          },

          improvements: {
            type: "array",

            items: {
              type: "string",
            },

            description: "Practical suggestions for improving the resume.",
          },

          experienceGaps: {
            type: "array",

            items: {
              type: "string",
            },

            description:
              "Important experience requirements not clearly demonstrated.",
          },

          keywordSuggestions: {
            type: "array",

            items: {
              type: "string",
            },

            description:
              "Relevant keywords the candidate could use when truthful.",
          },

          recommendation: {
            type: "string",

            description:
              "Overall recommendation for improving the resume for this job.",
          },
        },

        // These fields are required.
        required: [
          "strengths",
          "missingSkills",
          "improvements",
          "experienceGaps",
          "keywordSuggestions",
          "recommendation",
        ],
      },

      // Keep the reasoning level low for this MVP.
      thinkingConfig: {
        thinkingLevel: ThinkingLevel.LOW,
      },
    },
  });

  // Gemini returns the structured JSON as text.
  const text = response.text ?? "{}";

  // Convert JSON text into a JavaScript object.
  const analysis = JSON.parse(text) as AIResumeAnalysis;

  // Return the structured object.
  return analysis;
};
