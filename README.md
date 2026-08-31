# AI-Powered Resume Optimizer

An AI-powered full-stack web application that analyzes resumes against job descriptions, calculates match scores, identifies missing skills and keywords, and provides AI-powered recommendations using Google Gemini.

## 🚀 Features

- User registration and login
- JWT authentication and logout
- Resume upload (PDF/DOCX)
- Resume text extraction
- Job description management
- Resume-to-job matching
- Skill and keyword scoring
- Missing skill and keyword detection
- Google Gemini AI analysis
- Personalized resume recommendations
- Analysis history
- Detailed analysis results
- Compare previous analyses
- Delete resumes, job descriptions, and analyses
- Protected API routes
- File validation and upload limits

## 🛠️ Tech Stack

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

## 🏗️ Architecture


Next.js Frontend
       │
       ▼
Express REST API
       │
       ├── Authentication
       ├── Resume Management
       ├── Job Description Management
       ├── Resume Matching
       └── AI Analysis
              │
              ▼
        Google Gemini
              
       │
       ▼
     Prisma ORM
       │
       ▼
   PostgreSQL / Neon


## 🔄 Application Workflow


Register / Login
       ↓
Dashboard
       ↓
Upload Resume
       ↓
Create Job Description
       ↓
Resume ↔ Job Matching
       ↓
Skill + Keyword Scoring
       ↓
Gemini AI Analysis
       ↓
Recommendations
       ↓
Analysis History
       ↓
Compare Analyses


## 📊 Scoring

The current rule-based matcher calculates:


Overall Score =
Skill Score × 80% +
Keyword Score × 20%


The system identifies:

* Matched skills
* Missing skills
* Matched keywords
* Missing keywords

## 🤖 AI Analysis

Google Gemini analyzes the resume and job description to provide additional recommendations and insights for improving the candidate's resume.

## 🔐 Security

* JWT-based authentication
* Protected API routes
* User ownership validation
* Password hashing
* CORS configuration
* Environment variables for secrets
* PDF/DOCX validation
* 5 MB upload limit
* Global API error handling

## ⚙️ Local Setup

### Backend


cd backend
npm install


Create `backend/.env`:


DATABASE_URL=your_database_url
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_gemini_api_key
FRONTEND_URL=http://localhost:3000


Run:


npx prisma generate
npx prisma migrate dev
npm run dev


Backend runs on:


http://localhost:5000


### Frontend

cd frontend
npm install

Create `frontend/.env.local`:

NEXT_PUBLIC_API_URL=http://localhost:5000


Run:


npm run dev

Frontend runs on:


http://localhost:3000


## 🏭 Production Build

Backend:

cd backend
npm run build


Frontend:

cd frontend
npm run build


## 🔮 Future Improvements

* ATS compatibility score
* Advanced semantic resume matching
* AI-powered resume rewriting
* Resume optimization
* Job recommendation system
* Resume templates
* Automated testing
* Production deployment

## 👨‍💻 Author

**Mohammed Kaifuddin**



Then run:

```cmd
git add README.md
git commit -m "Add project README"
git push origin main
```
