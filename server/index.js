import dotenv from "dotenv";
dotenv.config(); // ✅ MUST be before anything else

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";

/* ---------------- ROUTES ---------------- */
import blogRoutes from "./routes/blogRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import adminBlogRoutes from "./routes/adminBlogRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import certificationRoutes from "./routes/certificationRoutes.js";

/* ---------------- APP ---------------- */
const app = express();

/* ---------------- MIDDLEWARE ---------------- */

/**
 * CORS
 * - credentials: true → cookies allowed
 * - origin must be explicit (not "*")
 */
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

app.use(cookieParser());

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
app.get("/", (req, res) => {
  res.send("API running ✅");
});

/* ---------------- DB ---------------- */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected ✅"))
  .catch((err) => console.error("Mongo error:", err));

/* ---------------- SERVER ---------------- */
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
