# AI-Powered Resume Optimizer

An AI-powered full-stack web application that analyzes resumes against job descriptions, calculates job-match scores, identifies missing skills and keywords, and provides AI-generated recommendations for improving the resume.

## Features

- User registration and login
- JWT-based authentication
- Resume upload
- PDF and DOCX resume text extraction
- Resume management
- Job description management
- Resume-to-job matching
- Skill matching and scoring
- Keyword matching and scoring
- AI-powered resume analysis using Gemini
- AI recommendations
- Analysis history
- Detailed analysis results
- Delete analyses
- Compare two resume analyses
- Track changes between analyses
- Logout
- Protected API routes
- File upload validation
- Global API error handling

## Tech Stack

### Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS

### Backend

- Node.js
- Express.js
- TypeScript
- Prisma ORM

### Database

- PostgreSQL
- Neon PostgreSQL

### AI

- Google Gemini API

### Authentication

- JWT
- bcrypt

## Project Architecture

```text
AI_powered_Resume_Optimizer/
│
├── frontend/
│   └── Next.js application
│
├── backend/
│   ├── controllers/
│   ├── middleware/
│   ├── routes/
│   ├── services/
│   ├── validation/
│   └── prisma/
│
└── README.md



How It Works

User
 │
 ▼
Upload Resume
 │
 ▼
Extract Resume Text
 │
 ▼
Select Job Description
 │
 ▼
Resume ↔ Job Matching
 │
 ├── Skill Matching
 │
 ├── Keyword Matching
 │
 └── Score Calculation
 │
 ▼
Gemini AI Analysis
 │
 ▼
Recommendations
 │
 ▼
Analysis History
 │
 ▼
Compare Previous Analyses