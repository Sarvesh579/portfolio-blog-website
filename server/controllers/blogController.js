import Blog from "../models/Blog.js";

/* --------------------------------------------------
   BLOG ID GENERATOR
-------------------------------------------------- */
async function generateBlogId() {
  const now = new Date();
  const dd = String(now.getDate()).padStart(2, "0");
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const yyyy = now.getFullYear();

  const prefix = `${dd}${mm}${yyyy}`;

  const count = await Blog.countDocuments({
    blogId: new RegExp(`^${prefix}_`)
  });

  const serial = String(count + 1).padStart(2, "0");
  return `${prefix}_${serial}`;
}

/* --------------------------------------------------
   USER — ONLY PUBLISHED
-------------------------------------------------- */
export const getBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({ published: true })
      .sort({ importance: -1, date: -1 })
      .lean();

    res.json(blogs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findOne({
      _id: req.params.id,
      published: true
    }).lean();

    if (!blog) return res.status(404).json({ error: "Not found" });
    res.json(blog);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* --------------------------------------------------
   ADMIN — ALL BLOGS
-------------------------------------------------- */
export const getBlogsAdmin = async (req, res) => {
  try {
    const blogs = await Blog.find()
      .sort({ createdAt: -1 })
      .lean();

    res.json(blogs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* --------------------------------------------------
   CREATE
-------------------------------------------------- */
export const createBlog = async (req, res) => {
  try {
    const blogId = await generateBlogId();

    const blog = new Blog({
      ...req.body,
      blogId,
      contentSnippet:
        req.body.summary ||
        (req.body.content || "").slice(0, 160) + "..."
    });

    await blog.save();
    res.status(201).json(blog);
  } catch (err) {
    console.error("CREATE BLOG ERROR:", err);
    res.status(400).json({ error: err.message });
  }
};

/* --------------------------------------------------
   UPDATE / DELETE
-------------------------------------------------- */
export const updateBlog = async (req, res) => {
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
};

export const deleteBlog = async (req, res) => {
  try {
    await Blog.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
