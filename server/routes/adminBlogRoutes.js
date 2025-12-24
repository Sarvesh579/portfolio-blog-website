import express from "express";
import Blog from "../models/Blog.js";

const router = express.Router();

/* -----------------------------------------------------
   ADMIN: GET ALL BLOGS (including drafts)
----------------------------------------------------- */
router.get("/", async (req, res) => {
  try {
    const blogs = await Blog.find({})
      .sort({ published: 1, updatedAt: -1 })
      .lean();

    res.json(blogs);
  } catch (err) {
    res.status(500).json({ error: "Error fetching blogs" });
  }
});

/* -----------------------------------------------------
   ADMIN: GET BLOG BY ID (draft or published)
----------------------------------------------------- */
router.get("/:id", async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id).lean();
    if (!blog) return res.status(404).json({ error: "Not found" });

    res.json(blog);
  } catch (err) {
    res.status(500).json({ error: "Error fetching blog" });
  }
});

/* -----------------------------------------------------
   ADMIN: CREATE BLOG
----------------------------------------------------- */
router.post("/", async (req, res) => {
  try {
    const blog = new Blog(req.body);
    await blog.save();
    res.json(blog);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/* -----------------------------------------------------
   ADMIN: UPDATE BLOG
----------------------------------------------------- */
router.put("/:id", async (req, res) => {
  try {
    const blog = await Blog.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(blog);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/* -----------------------------------------------------
   ADMIN: DELETE BLOG
----------------------------------------------------- */
router.delete("/:id", async (req, res) => {
  try {
    await Blog.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
