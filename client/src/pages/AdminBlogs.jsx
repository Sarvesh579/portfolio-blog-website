 import { useEffect, useState, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
const API = import.meta.env.VITE_API_URL || "";
import "./AdminBlogs.css";

export default function AdminBlogs() {
  const [blogs, setBlogs] = useState([]);
  const [search, setSearch] = useState("");
  const [tagFilter, setTagFilter] = useState("all");
  const [dropdownOpen, setDropdownOpen] = useState("closed"); // closed | open | closing

  const navigate = useNavigate();

  /* -------------------------------------------------------
     FETCH BLOGS (ADMIN – ALL, INCLUDING DRAFTS)
  ------------------------------------------------------- */
  async function fetchBlogs() {
    try {
      const res = await fetch(`${API}/api/blogs/admin/all`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`
        },
      });
      const data = await res.json();
      setBlogs(data);
    } catch (err) {
      console.error("Error fetching blogs:", err);
    }
  }

  useEffect(() => {
    fetchBlogs();
  }, []);

  /* -------------------------------------------------------
     DELETE BLOG
  ------------------------------------------------------- */
  async function deleteBlog(id) {
    if (!confirm("Delete this blog?")) return;

    try {
      await fetch(`${API}/api/blogs/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`
        }
      });
      fetchBlogs();
    } catch (err) {
      console.error("Delete failed:", err);
    }
  }

  /* -------------------------------------------------------
     CLOSE DROPDOWN WHEN CLICKING OUTSIDE
  ------------------------------------------------------- */
  useEffect(() => {
    function handleClickOutside(e) {
      if (!e.target.closest(".dropdown")) {
        if (dropdownOpen === "open") {
          setDropdownOpen("closing");
          setTimeout(() => setDropdownOpen("closed"), 180);
        }
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownOpen]);

  /* -------------------------------------------------------
     UNIQUE TAG LIST
  ------------------------------------------------------- */
  const allTags = useMemo(() => {
    const tagSet = new Set();
    blogs.forEach((b) => b.tags?.forEach((t) => tagSet.add(t)));
    return Array.from(tagSet);
  }, [blogs]);

  /* -------------------------------------------------------
     FILTERED BLOGS
  ------------------------------------------------------- */
  const filteredBlogs = useMemo(() => {
    const searchLower = search.toLowerCase();

    return blogs.filter((b) => {
      const inTag =
        tagFilter === "all" ||
        b.tags?.map((t) => t.toLowerCase()).includes(tagFilter.toLowerCase());

      const combinedText =
        `${b.title || ""} ${b.summary || ""} ${b.contentSnippet || ""}`.toLowerCase();

      const tagsText = (b.tags || []).join(" ").toLowerCase();

      const inSearch =
        combinedText.includes(searchLower) || tagsText.includes(searchLower);

      return inTag && inSearch;
    });
  }, [blogs, search, tagFilter]);

  return (
    <div className="admin-blogs">
      <Link to="/admin/dashboard" className="back-btn">
        ← Back to Dashboard
      </Link>

      <div className="admin-blogs-header">
        <h1>Manage Blogs</h1>
        <button
          className="add-btn"
          onClick={() => navigate("/admin/blogs/new")}
        >
          + Add Blog
        </button>
      </div>

      {/* SEARCH + FILTERS */}
      <div className="blogs-controls">
        <input
          type="text"
          placeholder="Search blogs..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* TAG DROPDOWN */}
        <div className="dropdown">
          <div
            className="dropdown-selected"
            onClick={() => {
              if (dropdownOpen === "open") {
                setDropdownOpen("closing");
                setTimeout(() => setDropdownOpen("closed"), 180);
              } else {
                setDropdownOpen("open");
              }
            }}
          >
            {tagFilter === "all" ? "All tags" : tagFilter}
            <span className="arrow">▾</span>
          </div>

          {(dropdownOpen === "open" || dropdownOpen === "closing") && (
            <div
              className={`dropdown-menu ${
                dropdownOpen === "closing" ? "close" : ""
              }`}
            >
              <div className="dropdown-scroll">
                <div
                  className="dropdown-item"
                  onClick={() => {
                    setTagFilter("all");
                    setDropdownOpen("closing");
                    setTimeout(() => setDropdownOpen("closed"), 180);
                  }}
                >
                  All tags
                </div>

                {allTags.map((tag) => (
                  <div
                    key={tag}
                    className="dropdown-item"
                    onClick={() => {
                      setTagFilter(tag);
                      setDropdownOpen("closing");
                      setTimeout(() => setDropdownOpen("closed"), 180);
                    }}
                  >
                    {tag}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* BLOG LIST */}
      <div className="blogs-list">
        {filteredBlogs.map((blog) => (
          <div key={blog._id} className="blog-admin-card">
            <div className="blog-admin-info">
              <h2>{blog.title}</h2>

              {blog.blogId && (
                <div className="blog-id">
                  Blog ID: {blog.blogId}
                </div>
              )}

              <p className="blog-summary">
                {blog.summary || "—"}
              </p>

              {blog.tags?.length > 0 && (
                <div className="blog-tags">
                  {blog.tags.map((t) => (
                    <span key={t}>{t}</span>
                  ))}
                </div>
              )}

              <div className="blog-meta">
                <span>
                  Status: {blog.published ? "Published" : "Draft"}
                </span>
                <span>
                  Importance: {blog.importance ?? 0}
                </span>
              </div>
            </div>

            <div className="blog-admin-actions">
              <button
                onClick={() =>
                  navigate(`/admin/blogs/edit/${blog._id}`)
                }
              >
                Edit
              </button>

              <button
                className="delete-btn"
                onClick={() => deleteBlog(blog._id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}

        {filteredBlogs.length === 0 && (
          <div className="no-blogs">No blogs found.</div>
        )}
      </div>
    </div>
  );
}
