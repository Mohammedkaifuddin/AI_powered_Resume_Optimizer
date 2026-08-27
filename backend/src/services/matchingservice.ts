// ------------------------------------------------------------
// SKILLS
// ------------------------------------------------------------

// Skills that our basic matcher understands.
const skills = [
  "java",
  "python",
  "javascript",
  "typescript",
  "c++",
  "react",
  "next.js",
  "node.js",
  "express",
  "spring boot",
  "sql",
  "postgresql",
  "mysql",
  "mongodb",
  "redis",
  "docker",
  "kubernetes",
  "aws",
  "git",
  "rest api",
  "graphql",
  "fastapi",
];


// ------------------------------------------------------------
// KEYWORDS
// ------------------------------------------------------------

// General software-development related keywords.
const keywords = [
  "backend",
  "frontend",
  "full stack",
  "software development",
  "api",
  "rest",
  "microservices",
  "database",
  "cloud",
  "testing",
  "deployment",
  "agile",
  "debugging",
];


// ------------------------------------------------------------
// NORMALIZE TEXT
// ------------------------------------------------------------

// Converts text into a predictable format.
const normalizeText = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
};


// ------------------------------------------------------------
// CHECK FOR A SKILL
// ------------------------------------------------------------

// Checks whether a complete skill/keyword exists in the text.
const containsSkill = (
  text: string,
  skill: string
): boolean => {

  // Normalize both values before comparing.
  const normalizedText = normalizeText(text);
  const normalizedSkill = normalizeText(skill);

  // Skills containing special characters need
  // simpler matching.
  if (
    normalizedSkill.includes(".") ||
    normalizedSkill.includes("+") ||
    normalizedSkill.includes("#")
  ) {
    return normalizedText.includes(normalizedSkill);
  }

  // Split the text into words.
  const words = normalizedText.split(" ");

  // Split the skill into words.
  const skillWords = normalizedSkill.split(" ");

  // For a one-word skill, require an exact word match.
  if (skillWords.length === 1) {
    return words.includes(normalizedSkill);
  }

  // For multi-word skills such as "spring boot",
  // compare complete phrases.
  for (
    let i = 0;
    i <= words.length - skillWords.length;
    i++
  ) {
    const phrase = words
      .slice(i, i + skillWords.length)
      .join(" ");

    if (phrase === normalizedSkill) {
      return true;
    }
  }

  return false;
};


// ------------------------------------------------------------
// EXTRACT SKILLS
// ------------------------------------------------------------

// Finds known technical skills in a piece of text.
const extractskills = (text: string): string[] => {
  return skills.filter((skill) =>
    containsSkill(text, skill)
  );
};


// ------------------------------------------------------------
// EXTRACT KEYWORDS
// ------------------------------------------------------------

// Finds general job-related keywords.
const extractkeywords = (text: string): string[] => {
  return keywords.filter((keyword) =>
    containsSkill(text, keyword)
  );
};


// ------------------------------------------------------------
// WEIGHTS
// ------------------------------------------------------------

// These weights represent the importance of selected skills.
//
// IMPORTANT:
// This is an MVP rule-based system.
// Later Gemini will help us determine importance dynamically.
const skillWeights: Record<string, number> = {
  java: 20,
  "spring boot": 20,
  postgresql: 15,
  docker: 10,
  aws: 15,
  kubernetes: 10,
  "rest api": 10,
};


// ------------------------------------------------------------
// CALCULATE WEIGHTED SKILL SCORE
// ------------------------------------------------------------

const calculateWeightedSkillScore = (
  jobSkills: string[],
  matchedSkills: string[]
): number => {

  // Total possible points for skills recognized
  // in the current job description.
  let totalWeight = 0;

  // Points earned by the resume.
  let matchedWeight = 0;

  // Go through every skill required by the job.
  for (const skill of jobSkills) {

    // Get the weight of this skill.
    //
    // If we haven't defined a weight,
    // give it a default weight of 5.
    const weight = skillWeights[skill] ?? 5;

    // Add the skill's weight to the total.
    totalWeight += weight;

    // If the resume contains this skill,
    // give the resume those points.
    if (matchedSkills.includes(skill)) {
      matchedWeight += weight;
    }
  }

  // If no skills were detected,
  // return 0 instead of dividing by zero.
  if (totalWeight === 0) {
    return 0;
  }

  // Convert the earned points into a percentage.
  return Math.round(
    (matchedWeight / totalWeight) * 100
  );
};


// ------------------------------------------------------------
// MAIN MATCHING FUNCTION
// ------------------------------------------------------------

export const matchresumetojob = (
  resumetext: string,
  jobdescriptiontext: string
) => {

  // Find technical skills in resume.
  const resumeskills = extractskills(resumetext);

  // Find technical skills required by job.
  const jobskills = extractskills(jobdescriptiontext);

  // Find skills that exist in both.
  const matchedskills = jobskills.filter((skill) =>
    resumeskills.includes(skill)
  );

  // Find required skills missing from the resume.
  const missingskills = jobskills.filter(
    (skill) => !resumeskills.includes(skill)
  );

  // Calculate weighted skill score.
  const skillScore = calculateWeightedSkillScore(
    jobskills,
    matchedskills
  );


  // ----------------------------------------------------------
  // KEYWORD MATCHING
  // ----------------------------------------------------------

  // Extract keywords from resume.
  const resumekeywords = extractkeywords(resumetext);

  // Extract keywords from job description.
  const jobkeywords = extractkeywords(jobdescriptiontext);

  // Find matching keywords.
  const matchedkeywords = jobkeywords.filter((keyword) =>
    resumekeywords.includes(keyword)
  );

  // Find missing keywords.
  const missingkeywords = jobkeywords.filter(
    (keyword) => !resumekeywords.includes(keyword)
  );

  // Calculate keyword score.
  const keywordScore =
    jobkeywords.length === 0
      ? 0
      : Math.round(
          (matchedkeywords.length / jobkeywords.length) * 100
        );


  // ----------------------------------------------------------
  // FINAL SCORE
  // ----------------------------------------------------------

  // Give technical skills more importance.
  //
  // Skill score   = 80%
  // Keyword score = 20%
  const score = Math.round(
    skillScore * 0.8 +
    keywordScore * 0.2
  );


  // ----------------------------------------------------------
  // RETURN RESULT
  // ----------------------------------------------------------

  return {
    resumeskills,
    jobskills,

    matchedskills,
    missingskills,

    resumekeywords,
    jobkeywords,

    matchedkeywords,
    missingkeywords,

    skillScore,
    keywordScore,

    score,
  };
};