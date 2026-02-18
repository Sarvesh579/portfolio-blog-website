import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import "./BlogDetail.css";
import remarkGfm from "remark-gfm";
const API = import.meta.env.VITE_API_URL || "";

export default function BlogDetail() {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchBlog() {
      try {
        const res = await fetch(`${API}/api/blogs/${id}`);
        if (!res.ok) {
          navigate("/blogs");
          return;
        }
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

        {blog.blogId && (
          <div className="blog-id">
            Blog ID: {blog.blogId}
          </div>
        )}

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
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              p({ node, children }) {
                // If paragraph contains ONLY an image/figure → unwrap it
                if (
                  node.children &&
                  node.children.length === 1 &&
                  node.children[0].tagName === "img"
                ) {
                  return <>{children}</>;
                }

                return <p>{children}</p>;
              },
              img({ node, ...props }) {
                const alt = props.alt || "";
                const hasCaption = alt.includes("|");

                let caption = "";
                let cleanAlt = alt;

                if (hasCaption) {
                  const parts = alt.split("|");
                  cleanAlt = parts[0].trim();
                  caption = parts.slice(1).join("|").trim();
                }

                return (
                  <figure className="blog-image">
                    <img {...props} alt={cleanAlt} />
                    {caption && <figcaption>{caption}</figcaption>}
                  </figure>
                );
              },
            }}
          >
            {blog.content}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
}
