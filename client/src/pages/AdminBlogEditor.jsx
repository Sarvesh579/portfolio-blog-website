import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import "./AdminBlogEditor.css";

/* -------------------------------------------------------
   DATE FORMAT UTILS
------------------------------------------------------- */
function toInputDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (isNaN(d)) return "";
  return d.toISOString().split("T")[0];
}

function todayInputDate() {
  return new Date().toISOString().split("T")[0];
}

export default function AdminBlogEditor() {
  const { id } = useParams(); // undefined for "new"
  const isEdit = Boolean(id);

  const navigate = useNavigate();

  const [form, setForm] = useState({
    blogId: "",
    title: "",
    summary: "",
    content: "",
    tags: "",
    coverImage: "",
    importance: 0,
    published: false,
    date: todayInputDate(),
  });

  const [saving, setSaving] = useState(false);

  /* -------------------------------------------------------
     FETCH BLOG IF EDITING
  ------------------------------------------------------- */
  useEffect(() => {
    if (!isEdit) return;

    async function fetchBlog() {
      try {
        const res = await fetch(
          `http://localhost:4000/api/blogs/${id}`
        );

        if (!res.ok) {
          throw new Error("Blog not found");
        }

        const data = await res.json();

        setForm({
          blogId: data.blogId || "",
          title: data.title || "",
          summary: data.summary || "",
          content: data.content || "",
          tags: (data.tags || []).join(", "),
          coverImage: data.coverImage || "",
          importance: data.importance ?? 0,
          published: data.published ?? false,
          date: toInputDate(data.date),
        });
      } catch (err) {
        console.error("Failed to load blog:", err);
        alert("Failed to load blog for editing.");
      }
    }

    fetchBlog();
  }, [id, isEdit]);

  /* -------------------------------------------------------
     SAVE BLOG
  ------------------------------------------------------- */
  async function saveBlog() {
    if (!form.title.trim() || !form.content.trim()) {
      alert("Title and content are required.");
      return;
    }

    const payload = {
      title: form.title.trim(),
      summary: form.summary.trim(),
      content: form.content,
      coverImage: form.coverImage.trim(),
      importance: Number(form.importance),
      published: form.published,
      date: form.date,
      tags: form.tags
        .split(",")
        .map(t => t.trim())
        .filter(Boolean),
    };

    try {
      setSaving(true);

      if (isEdit) {
        await fetch(`http://localhost:4000/api/blogs/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        await fetch("http://localhost:4000/api/blogs", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      navigate("/admin/blogs");
    } catch (err) {
      console.error("Save failed:", err);
      alert("Failed to save blog.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="admin-blog-editor">
      <Link to="/admin/blogs" className="back-btn">
        ← Back to Blogs
      </Link>

      <h1>{isEdit ? "Edit Blog" : "Add Blog"}</h1>

      {form.blogId && (
        <p className="blog-id">
          <strong>Blog ID:</strong> {form.blogId}
        </p>
      )}

      {/* BASIC INFO */}
      <div className="editor-section">
        <label>Blog Title</label>
        <input
          placeholder="Blog Title"
          value={form.title}
          onChange={e => setForm({ ...form, title: e.target.value })}
        />

        <label>Summary</label>
        <textarea
          rows="3"
          placeholder="Short summary (used in blog list)"
          value={form.summary}
          onChange={e => setForm({ ...form, summary: e.target.value })}
        />

        <label>Cover Image URL</label>
        <input
          placeholder="Cover Image URL (optional)"
          value={form.coverImage}
          onChange={e => setForm({ ...form, coverImage: e.target.value })}
        />

        <label>Tags (comma separated)</label>
        <input
          placeholder="Tags (comma separated)"
          value={form.tags}
          onChange={e => setForm({ ...form, tags: e.target.value })}
        />
      </div>

      {/* META ROW */}
      <div className="editor-row">
        <div>
          <label>Date</label>
          <input
            type="date"
            value={form.date}
            onChange={e => setForm({ ...form, date: e.target.value })}
          />
        </div>

        <div>
          <label>Importance</label>
          <input
            type="number"
            value={form.importance}
            onChange={e => setForm({ ...form, importance: e.target.value })}
          />
        </div>

        <div className="publish-toggle">
          <label>
            <input
              type="checkbox"
              checked={form.published}
              onChange={e =>
                setForm({ ...form, published: e.target.checked })
              }
            />
            Publish
          </label>
        </div>
      </div>

      {/* MARKDOWN EDITOR */}
      <div className="editor-section">
        <label>Markdown Content</label>
        <textarea
          className="markdown-editor"
          placeholder="Write your blog in markdown..."
          value={form.content}
          onChange={e => setForm({ ...form, content: e.target.value })}
        />
      </div>

      {/* ACTIONS */}
      <div className="editor-actions">
        <button
          className="save-btn"
          disabled={saving}
          onClick={saveBlog}
        >
          {saving ? "Saving..." : "Save Blog"}
        </button>

        <button
          className="cancel-btn"
          onClick={() => navigate("/admin/blogs")}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
