import express from "express";
import cors from "cors";
import healthRoutes from "./routes/healthroutes";
import userRoutes from "./routes/userroutes";
import authRoutes from "./routes/authroutes";
import resumeRoutes from "./routes/resumeroutes";
import { errormiddleware } from "./middleware/errormiddleware";
import jobdescriptionroutes from "./routes/jobdescriptionroutes";
import matchingroutes from "./routes/matchingroutes";
import analysisroutes from "./routes/analysisroutes";
import geminirotes from "./routes/geminiroutes";

const app = express();

// app.use(cors());

const allowedOrigin = process.env.FRONTEND_URL || "http://localhost:3000";

app.use(
  cors({
    origin: allowedOrigin,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/health", healthRoutes);
app.use("/api/users", userRoutes);
app.use("/api/resumes", resumeRoutes);
app.use("/api/job-descriptions", jobdescriptionroutes);
app.use("/api/matching", matchingroutes);
app.use("/api/analyses", analysisroutes);
app.use("/api/gemini", geminirotes);

app.use(errormiddleware);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
