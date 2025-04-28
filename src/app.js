import express from "express";
import path, { dirname, join } from "path";
import { fileURLToPath } from "url";

const app = express();
const PORT = process.env.PORT || 3000;
const __filepath = fileURLToPath(import.meta.url); // path of the current module/file
const __dirname = dirname(__filepath); // directory name of the current module/file
const staticPath = join(__dirname, "..", "public"); // path to the public directory

// Middleware to serve static files
app.use(express.static(staticPath));
// Middleware to parse JSON bodies
app.use(express.json());

/*
 * ENDPOINTSP
 */

// GET endpoint to serve the index.html file
app.get('/', (req, res) => {
  res.sendFile(join(staticPath, "index.html"));
});

// Check if the server is running
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
