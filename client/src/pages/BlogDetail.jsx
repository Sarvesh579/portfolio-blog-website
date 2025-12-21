import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import "./BlogDetail.css";
import remarkGfm from "remark-gfm";

export default function BlogDetail() {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchBlog() {
      try {
        const res = await fetch(`http://localhost:4000/api/blogs/${id}`);
        const data = await res.json();
        setBlog(data);
      } catch (err) {
        console.error("Error fetching blog:", err);
      }
    }
    fetchBlog();
  }, [id]);

  if (!blog) {
    return (
      <div className="blog-detail-page">
        <div className="blog-detail-container">
          <p>Loading blog...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="blog-detail-page">
      <div className="blog-detail-container">
        <button className="back-btn" onClick={() => navigate("/blogs")}>
          ← Back to Blogs
        </button>

        <h1 className="blog-title">{blog.title}</h1>

        {blog.tags && blog.tags.length > 0 && (
          <div className="blog-detail-tags">
            {blog.tags.map((t) => (
              <span key={t}>{t}</span>
            ))}
          </div>
        )}

        {blog.createdAt && (
          <div className="blog-date">
            {new Date(blog.createdAt).toLocaleDateString()}
          </div>
        )}

        {/* Markdown body */}
        <div className="blog-markdown">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {blog.content}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
}
