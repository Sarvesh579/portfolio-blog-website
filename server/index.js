import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
dotenv.config(); // ✅ MUST be before anything else

import express from "express";
import mongoose from "mongoose";
import cors from "cors";

/* ---------------- ROUTES ---------------- */
import blogRoutes from "./routes/blogRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import adminBlogRoutes from "./routes/adminBlogRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import certificationRoutes from "./routes/certificationRoutes.js";

/* ---------------- APP ---------------- */
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


/* ---------------- MIDDLEWARE ---------------- */
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://your-frontend.vercel.app"
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

/* ---------------- ROUTES ---------------- */

/**
 * PUBLIC ROUTES
 */
app.use("/api/blogs", blogRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/certifications", certificationRoutes);

/**
 * ADMIN ROUTES
 * - /api/admin/login
 * - /api/admin/logout
 */
app.use("/api/admin", adminRoutes);

/**
 * ADMIN BLOG CRUD (PROTECTED internally by requireAdmin)
 * - GET    /api/admin/blogs
 * - POST   /api/admin/blogs
 * - PUT    /api/admin/blogs/:id
 * - DELETE /api/admin/blogs/:id
 */
app.use("/api/admin/blogs", adminBlogRoutes);

/* ---------------- HEALTH CHECK ---------------- */
/* app.get("/", (req, res) => {
  res.send("API running ✅");
}); */

/* ---------------- DB ---------------- */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected ✅"))
  .catch((err) => console.error("Mongo error:", err));

mongoose.connection.once("open", () => {
  console.log("Connected to DB:", mongoose.connection.name);
});

/* ---------------- SERVER ---------------- */
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});

// Serve React build
app.use(express.static(path.join(__dirname, "../client/dist")));

app.use((req, res) => {
  res.sendFile(path.join(__dirname, "../client/dist/index.html"));
});