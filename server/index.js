import dotenv from "dotenv";
dotenv.config();   // ✅ MUST be before mongoose.connect()

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import blogRoutes from "./routes/blogRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import certificationRoutes from "./routes/certificationRoutes.js";
import adminBlogRoutes from "./routes/adminBlogRoutes.js";

const app = express();

app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

app.use(express.json());
app.use("/api/blogs", blogRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/admin/blogs", adminBlogRoutes); 
app.use("/api/projects", projectRoutes);
app.use("/api/certifications", certificationRoutes);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected ✅"))
  .catch(err => console.error("Mongo error:", err));

app.get("/", (req, res) => {
  res.send("API running");
});

app.listen(process.env.PORT || 4000, () => {
  console.log("Server started on port 4000");
});
