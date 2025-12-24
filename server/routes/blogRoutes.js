import express from "express";
import {
  getBlogs,
  getBlogById,
  getBlogsAdmin,
  createBlog,
  updateBlog,
  deleteBlog
} from "../controllers/blogController.js";

const router = express.Router();

/* ---------- ADMIN FIRST (most specific) ---------- */
router.get("/admin/all", getBlogsAdmin);
router.post("/", createBlog);
router.put("/:id", updateBlog);
router.delete("/:id", deleteBlog);

/* ---------- USER ---------- */
router.get("/", getBlogs);
router.get("/:id", getBlogById);

export default router;
