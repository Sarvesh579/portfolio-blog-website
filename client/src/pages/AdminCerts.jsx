import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./AdminCerts.css";

function formatDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (isNaN(d)) return dateStr;

  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();

  return `${day}-${month}-${year}`;
}

export default function AdminCerts() {
  const [certs, setCerts] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const [form, setForm] = useState({
    title: "",
    issuer: "",
    date: "",
    description: "",
    fileUrl: "",
    fileType: "image",
    importance: 0
  });

  async function fetchCerts() {
    const res = await fetch("http://localhost:4000/api/certifications", {
      credentials: "include"
    });
    const data = await res.json();
    setCerts(data);
  }

  useEffect(() => {
    fetchCerts();
  }, []);

  function openAddModal() {
    setEditing(null);
    setForm({
      title: "",
      issuer: "",
      date: "",
      credentialId: "",
      credentialUrl: "",
      fileUrl: "",
      fileType: "image",
      importance: 0
    });
    setModalOpen(true);
  }

  function openEditModal(c) {
    setEditing(c._id);
    setForm({
      title: c.title,
      issuer: c.issuer,
      date: c.date,
      credentialId: c.credentialId || "",
      credentialUrl: c.credentialUrl || "",
      fileUrl: c.fileUrl || c.image || "",
      fileType: c.fileType || "image",
      importance: c.importance ?? 0
    });
    setModalOpen(true);
  }

  async function saveCert() {
    const payload = {
      title: form.title,
      issuer: form.issuer,
      date: form.date,
      credentialId: form.credentialId,
      credentialUrl: form.credentialUrl,
      importance: Number(form.importance),
      image: form.fileUrl,
      fileType: form.fileType
    };

    try {
      if (editing) {
        await fetch(`http://localhost:4000/api/certifications/${editing}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(payload)
        });
      } else {
        await fetch("http://localhost:4000/api/certifications", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(payload)
        });
      }

      setModalOpen(false);
      fetchCerts();
    } catch (err) {
      console.error("Save error:", err);
    }
  }

  async function deleteCert(id) {
    if (!confirm("Delete this certificate?")) return;

    await fetch(`http://localhost:4000/api/certifications/${id}`, {
      method: "DELETE",
      credentials: "include"
    });

    fetchCerts();
  }

  return (
    <div className="admin-certs">
      <Link to="/admin/dashboard" className="back-btn">
        ← Back to Dashboard
      </Link>

      <div className="certs-header">
        <h1>Manage Certifications</h1>
        <button className="add-btn" onClick={openAddModal}>
          + Add Certificate
        </button>
      </div>

      <div className="certs-list">
        {certs.map(c => (
          <div className="cert-card-admin" key={c._id}>
            <div className="cert-card-content">
              {/* LEFT: text */}
              <div className="cert-text">
                <h2>{c.title}</h2>

                {c.issuer && <p><strong>Issuer:</strong> {c.issuer}</p>}
                {c.date && <p><strong>Date:</strong> {formatDate(c.date)}</p>}
                <p><strong>Importance:</strong> {c.importance ?? 0}</p>

                {c.credentialId && (
                  <p><strong>Credential ID:</strong> {c.credentialId}</p>
                )}

                {c.credentialUrl && (
                  <p>
                    <strong>Verify:</strong>{" "}
                    <a href={c.credentialUrl} target="_blank" rel="noopener noreferrer">
                      View Credential
                    </a>
                  </p>
                )}

                {c.image && (
                  <p>
                    <strong>Certificate:</strong>{" "}
                    <a href={c.image} target="_blank" rel="noopener noreferrer">
                      View Certificate ({c.fileType === "pdf" ? "PDF" : "IMAGE"})
                    </a>
                  </p>
                )}
              </div>
            </div>

            <div className="admin-actions">
              <button onClick={() => openEditModal(c)}>Edit</button>
              <button onClick={() => deleteCert(c._id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>

      {/* ---------------- MODAL ---------------- */}
      {modalOpen && (
        <div className="modal-bg" onClick={() => setModalOpen(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setModalOpen(false)}>
              ✕
            </button>

            <h2>{editing ? "Edit Certificate" : "Add Certificate"}</h2>

            <input
              placeholder="Course Title"
              value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })}
            />

            <input
              placeholder="Issuer"
              value={form.issuer}
              onChange={e => setForm({ ...form, issuer: e.target.value })}
            />

            <div className="form-row">
              <input
                type="date"
                value={form.date}
                onChange={e => setForm({ ...form, date: e.target.value })}
              />

              <select
                value={form.fileType}
                onChange={e => setForm({ ...form, fileType: e.target.value })}
              >
                <option value="pdf">PDF</option>
                <option value="image">Image</option>
              </select>
            </div>

            <input
              placeholder="Certificate URL (Google Drive / Cloudinary)"
              value={form.fileUrl}
              onChange={e => setForm({ ...form, fileUrl: e.target.value })}
            />

            <input
              placeholder="Credential ID"
              value={form.credentialId}
              onChange={e =>
                setForm({ ...form, credentialId: e.target.value })
              }
            />

            <input
              placeholder="Credential URL"
              value={form.credentialUrl}
              onChange={e =>
                setForm({ ...form, credentialUrl: e.target.value })
              }
            />

            <input
              type="number"
              placeholder="Importance"
              value={form.importance}
              onChange={e => setForm({ ...form, importance: e.target.value })}
            />

            <button onClick={saveCert}>
              {editing ? "Save Changes" : "Create Certificate"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
