import "./AdminDashboard.css";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function AdminDashboard() {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    blogs: 0,
    projects: 0,
    certificates: 0,
  });

  /* -------------------------------------------------------
     FETCH DASHBOARD STATS (COOKIE AUTH)
  ------------------------------------------------------- */
  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch("http://localhost:4000/api/admin/stats", {
          credentials: "include", // ✅ cookie-based auth
        });

        if (!res.ok) throw new Error("Unauthorized");

        const data = await res.json();
        setStats(data);
      } catch (err) {
        console.error("Stats fetch error:", err);
      }
    }

    fetchStats();
  }, []);

  /* -------------------------------------------------------
     LOGOUT
  ------------------------------------------------------- */
  async function handleLogout() {
    try {
      await fetch("http://localhost:4000/api/admin/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (err) {
      console.error("Logout error:", err);
    }

    navigate("/admin/login");
  }

  return (
    <div className="admin-dashboard">

      {/* Top bar */}
      <div className="admin-top-bar">
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>

      {/* Title */}
      <h1 className="admin-title-main">Admin Dashboard</h1>

      <p className="admin-desc">
        Overview of your content. Click any section to manage it.
      </p>

      {/* Stats */}
      <div className="admin-stats-grid">

        <div
          className="admin-card"
          onClick={() => navigate("/admin/blogs")}
        >
          <h2>Blogs</h2>
          <p className="stat-number">{stats.blogs}</p>
          <span className="stat-label">Total Blogs</span>
        </div>

        <div
          className="admin-card"
          onClick={() => navigate("/admin/projects")}
        >
          <h2>Projects</h2>
          <p className="stat-number">{stats.projects}</p>
          <span className="stat-label">Total Projects</span>
        </div>

        <div
          className="admin-card"
          onClick={() => navigate("/admin/certifications")}
        >
          <h2>Certificates</h2>
          <p className="stat-number">{stats.certificates}</p>
          <span className="stat-label">Total Certificates</span>
        </div>

      </div>
    </div>
  );
}
