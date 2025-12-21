import express from "express";
import Blog from "../models/Blog.js";

const router = express.Router();

/* -----------------------------------------------------
   GET ALL BLOGS  (List view)
----------------------------------------------------- */
router.get("/", async (req, res) => {
  try {
    const blogs = await Blog.find({})
      .sort({ createdAt: -1 })
      .lean();

    // Auto-generate snippets if missing
    const withSnippet = blogs.map((b) => ({
      ...b,
      contentSnippet:
        b.contentSnippet ||
        (b.content ? b.content.slice(0, 160) + "..." : ""),
    }));

    res.json(withSnippet);
  } catch (err) {
    res.status(500).json({ error: "Error fetching blogs" });
  }
});

/* -----------------------------------------------------
   GET BLOG BY ID  (Full blog page)
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
   CREATE NEW BLOG (Admin / Postman use)
----------------------------------------------------- */
router.post("/", async (req, res) => {
  try {
    const newBlog = new Blog(req.body);
    await newBlog.save();
    res.json(newBlog);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
