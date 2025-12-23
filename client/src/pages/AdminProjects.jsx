import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./AdminProjects.css";

export default function AdminProjects() {
  const [projects, setProjects] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const [form, setForm] = useState({
    title: "",
    tech: "",
    description: "",
    github: "",
    live: "",
    importance: 0
  });

  async function fetchProjects() {
    const res = await fetch("http://localhost:4000/api/projects");
    const data = await res.json();
    setProjects(data);
  }

  useEffect(() => {
    fetchProjects();
  }, []);

  function openAddModal() {
    setEditing(null);
    setForm({
      title: "",
      tech: "",
      description: "",
      github: "",
      live: "",
      importance: 0
    });
    setModalOpen(true);
  }

  function openEditModal(p) {
    setEditing(p._id);
    setForm({
      title: p.title,
      tech: Array.isArray(p.tech) ? p.tech.join(", ") : "",
      description: p.description,
      github: p.github,
      live: p.live,
      importance: p.importance ?? 0
    });
    setModalOpen(true);
  }

  /* ----------------------------------------
        CREATE / EDIT PROJECT
  ----------------------------------------- */
  async function saveProject() {
    const payload = {
      ...form,
      importance: Number(form.importance),
      tech: form.tech.split(",").map(t => t.trim())
    };

    try {
      if (editing) {
        await fetch(`http://localhost:4000/api/projects/${editing}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
      } else {
        await fetch("http://localhost:4000/api/projects", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
      }

      setModalOpen(false);
      fetchProjects();
    } catch (err) {
      console.error("Save error:", err);
    }
  }

  async function deleteProject(id) {
    if (!confirm("Delete this project?")) return;

    const res = await fetch(`http://localhost:4000/api/projects/${id}`, {
      method: "DELETE"
    });

    if (!res.ok) {
      const err = await res.json();
      console.error("Delete failed:", err);
      alert("Delete failed");
      return;
    }

    fetchProjects();
  }

  return (
    <div className="admin-projects">
      <Link to="/admin/dashboard" className="back-btn">
        ← Back to Dashboard
      </Link>

      <div className="projects-header">
        <h1>Manage Projects</h1>
        <button className="add-btn" onClick={openAddModal}>
          + Add Project
        </button>
      </div>

      <div className="projects-list">
        {projects.map(p => (
          <div className="project-card-admin" key={p._id}>
            <h2>{p.title}</h2>

            <p>
              <strong>Importance:</strong> {p.importance ?? 0}
            </p>

            <p>
              <strong>Tech:</strong> {p.tech.join(", ")}
            </p>

            <p>
              <strong>Description:</strong><br />
              {p.description}
            </p>

            <p>
              <strong>Github:</strong>{" "}
              {p.github ? (
                <a href={p.github} target="_blank" rel="noopener noreferrer">
                  {p.github}
                </a>
              ) : (
                "—"
              )}
            </p>

            <p>
              <strong>Live:</strong>{" "}
              {p.live ? (
                <a href={p.live} target="_blank" rel="noopener noreferrer">
                  {p.live}
                </a>
              ) : (
                "—"
              )}
            </p>

            <div className="admin-actions">
              <button onClick={() => openEditModal(p)}>Edit</button>
              <button onClick={() => deleteProject(p._id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>

      {/* ---------------------- MODAL ---------------------- */}
      {modalOpen && (
        <div
          className="modal-bg"
          onClick={() => setModalOpen(false)}
        >
          <div
            className="modal"
            onClick={e => e.stopPropagation()}
          >
            <button
              className="modal-close"
              onClick={() => setModalOpen(false)}
            >
              ✕
            </button>

            <h2>{editing ? "Edit Project" : "Add Project"}</h2>

            <input
              placeholder="Project Title"
              value={form.title}
              onChange={e =>
                setForm({ ...form, title: e.target.value })
              }
            />

            <input
              placeholder="Tech (comma separated)"
              value={form.tech}
              onChange={e =>
                setForm({ ...form, tech: e.target.value })
              }
            />

            <textarea
              rows="4"
              placeholder="Description"
              value={form.description}
              onChange={e =>
                setForm({ ...form, description: e.target.value })
              }
            />

            <input
              type="number"
              placeholder="Importance (higher = higher priority)"
              value={form.importance}
              onChange={e =>
                setForm({ ...form, importance: e.target.value })
              }
            />

            <input
              placeholder="Github URL"
              value={form.github}
              onChange={e =>
                setForm({ ...form, github: e.target.value })
              }
            />

            <input
              placeholder="Live Demo URL"
              value={form.live}
              onChange={e =>
                setForm({ ...form, live: e.target.value })
              }
            />

            <button onClick={saveProject}>
              {editing ? "Save Changes" : "Create Project"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
