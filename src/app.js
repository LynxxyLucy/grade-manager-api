import express from "express";
import path, { dirname, join } from "path";
import { fileURLToPath } from "url";
import authMiddleware from "./middleware/authMiddleware.js";
import authRoutes from "./routes/authRoutes.js"; // Import auth routes
import semesterRoutes from "./routes/semesterRoutes.js"; // Import year routes
import subjectRoutes from "./routes/subjectRoutes.js"; // Import subject routes
import gradeRoutes from "./routes/gradeRoutes.js"; // Import grade routes

const app = express();
const PORT = process.env.PORT || 3000;
const __filepath = fileURLToPath(import.meta.url); // path of the current module/file
const __dirname = dirname(__filepath); // directory name of the current module/file
const staticPath = join(__dirname, "..", "public"); // path to the public directory

// Middleware to serve static files
app.use(express.static(staticPath));
// Middleware to parse JSON bodies
app.use(express.json());

// GET endpoint to serve the index.html file
app.get("/", (req, res) => {
  res.sendFile(path.join(staticPath, "index.html"));
});

/*
 * API
 */
app.use("/auth", authRoutes);
app.use("/semesters", authMiddleware, semesterRoutes);
app.use("/subjects", authMiddleware, subjectRoutes);
app.use("/grades", authMiddleware, gradeRoutes);

// Check if the server is running
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
