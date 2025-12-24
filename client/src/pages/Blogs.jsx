import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import "./Blogs.css";

export default function Blogs() {
  const [blogs, setBlogs] = useState([]);
  const [search, setSearch] = useState("");
  const [tagFilter, setTagFilter] = useState("all");
  const [dropdownOpen, setDropdownOpen] = useState("closed"); // closed | open | closing

  const navigate = useNavigate();

  /* -------------------------------------------------------
     FETCH BLOGS (PUBLIC – PUBLISHED ONLY)
  ------------------------------------------------------- */
  useEffect(() => {
    async function fetchBlogs() {
      try {
        const res = await fetch("http://localhost:4000/api/blogs");
        const data = await res.json();
        setBlogs(data);
      } catch (err) {
        console.error("Error fetching blogs:", err);
      }
    }
    fetchBlogs();
  }, []);

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
    return () => document.removeEventListener("mousedown", handleClickOutside);
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
     FILTERED BLOGS (case-insensitive)
  ------------------------------------------------------- */
  const filteredBlogs = useMemo(() => {
    const searchLower = search.toLowerCase();

    return blogs.filter((b) => {
      const inTag =
        tagFilter === "all" ||
        (b.tags &&
          b.tags.map((t) => t.toLowerCase()).includes(tagFilter.toLowerCase()));

      const combinedText =
        `${b.title || ""} ${b.summary || ""} ${b.contentSnippet || ""}`.toLowerCase();

      const tagsText = (b.tags || []).join(" ").toLowerCase();

      const inSearch =
        combinedText.includes(searchLower) || tagsText.includes(searchLower);

      return inTag && inSearch;
    });
  }, [blogs, search, tagFilter]);

  return (
    <div className="blogs-page">
      <section className="blogs-header">
        <h1>Blogs</h1>
        <p className="blogs-subtitle">
          Thoughts, experiments, and stories from my journey in tech and beyond.
        </p>

        <div className="blogs-controls">
          <input
            type="text"
            placeholder="Search by title, or keywords..."
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
              {tagFilter === "all" ? "All topics" : tagFilter}
              <span className="arrow">▾</span>
            </div>

            {(dropdownOpen === "open" || dropdownOpen === "closing") && (
              <div
                className={`dropdown-menu ${
                  dropdownOpen === "closing" ? "close" : ""
                }`}
              >
                {/* ✅ SCROLL FIX */}
                <div className="dropdown-scroll">
                  <div
                    className="dropdown-item"
                    onClick={() => {
                      setTagFilter("all");
                      setDropdownOpen("closing");
                      setTimeout(() => setDropdownOpen("closed"), 180);
                    }}
                  >
                    All topics
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
      </section>

      {/* BLOG GRID */}
      <section className="blogs-grid">
        {filteredBlogs.map((blog) => (
          <article
            key={blog._id}
            className="blog-card"
            onClick={() => navigate(`/blogs/${blog._id}`)}
          >
            {blog.coverImage && (
              <div className="blog-card-image">
                <img src={blog.coverImage} alt={blog.title} />
              </div>
            )}

            <div className="blog-card-body">
              <h2>{blog.title}</h2>

              {blog.tags?.length > 0 && (
                <div className="blog-tags">
                  {blog.tags.map((t) => (
                    <span key={t}>{t}</span>
                  ))}
                </div>
              )}

              <p className="blog-summary">
                {blog.summary?.trim().length > 0
                  ? blog.summary
                  : blog.contentSnippet || ""}
              </p>
            </div>
          </article>
        ))}

        {filteredBlogs.length === 0 && (
          <div className="no-blogs">
            No blogs found. Try different keywords.
          </div>
        )}
      </section>
    </div>
  );
}
