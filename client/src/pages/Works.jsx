import { useState, useEffect } from "react";
import "./Works.css";

function formatDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (isNaN(d)) return dateStr;

  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();

  return `${day}-${month}-${year}`;
}

export default function Works() {
  const [tab, setTab] = useState("projects");
  const [projects, setProjects] = useState([]);
  const [certs, setCerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);

        const [pRes, cRes] = await Promise.all([
          fetch(`${import.meta.env.VITE_API_URL}/api/projects`),
          fetch(`${import.meta.env.VITE_API_URL}/api/certifications`)
        ]);

        const p = await pRes.json();
        const c = await cRes.json();

        setProjects(p);
        setCerts(c);
      } catch (err) {
        console.error("Error fetching:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  return (
    <div className="works-page">
      <div className="animated-bg">
        <span className="shape s1"></span>
        <span className="shape s2"></span>
        <span className="shape s3"></span>
        <span className="shape s4"></span>
      </div>

      {/* Toggle */}
      <div className="toggle-wrapper">
        <div className="toggle-slider">
          <div className={`slider ${tab}`} />

          <button
            className={tab === "projects" ? "active" : ""}
            onClick={() => setTab("projects")}
          >
            Projects
          </button>

          <button
            className={tab === "certifications" ? "active" : ""}
            onClick={() => setTab("certifications")}
          >
            Certifications
          </button>
        </div>
      </div>

      <div className="works-content">
        {loading ? (
          <LoadingIndicator />
        ) : tab === "projects" ? (
          <ProjectsAccordion data={projects} />
        ) : (
          <CertsAccordion data={certs} />
        )}
      </div>
    </div>
  );
}

/* ============================================================
   PROJECTS ACCORDION (CLEANED)
============================================================ */
function ProjectsAccordion({ data }) {
  const [openId, setOpenId] = useState(null);

  return (
    <div className="cards-container">
      {data.map(p => {
        const open = openId === p._id;

        return (
          <div
            key={p._id}
            className={`card show-card ${open ? "open" : ""}`}
            onClick={() => setOpenId(open ? null : p._id)}
          >
            <h3>{p.title}</h3>

            <div className="tech">
              {p.tech.map(t => (
                <span key={t}>{t}</span>
              ))}
            </div>

            <div className="accordion-body">
              <div className="accordion-inner">
                <p>{p.description}</p>

                <div className="project-links">
                  {p.github && (
                    <a
                      href={p.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={e => e.stopPropagation()}
                    >
                      GitHub
                    </a>
                  )}

                  {p.live && (
                    <a
                      href={p.live}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={e => e.stopPropagation()}
                    >
                      Live Demo
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ============================================================
   CERTIFICATIONS ACCORDION (FIXED)
============================================================ */
function CertsAccordion({ data }) {
  const [openId, setOpenId] = useState(null);

  return (
    <div className="cards-container">
      {data.map(c => {
        const open = openId === c._id;

        return (
          <div
            key={c._id}
            className={`card show-card ${open ? "open" : ""}`}
            onClick={() => setOpenId(open ? null : c._id)}
          >
            <h3>{c.title}</h3>

            <div className="issuer">
              <strong>Issuer:</strong> {c.issuer}
            </div>

            <div className="accordion-body">
              <div className="accordion-inner">
                {c.date && (
                  <p className="cert-meta">
                    <strong>Date:</strong> {formatDate(c.date)}
                  </p>
                )}

                {c.credentialId && (
                  <p className="cert-meta">
                    <strong>Credential ID:</strong> {c.credentialId}
                  </p>
                )}

                {c.credentialUrl && (
                  <p className="cert-meta">
                    <strong>Verify:</strong>{" "}
                    <a
                      href={c.credentialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={e => e.stopPropagation()}
                    >
                      View Credential
                    </a>
                  </p>
                )}

                {c.image && (
                  <p className="cert-meta">
                    <strong>Certificate:</strong>{" "}
                    <a
                      href={c.image}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={e => e.stopPropagation()}
                    >
                      View Certificate ({c.fileType === "pdf" ? "PDF" : "IMAGE"})
                    </a>
                  </p>
                )}

              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function LoadingIndicator() {
  const [dots, setDots] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => (prev.length === 3 ? "" : prev + "."));
    }, 400);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="loading-box">
      <span>Fetching data{dots}</span>
    </div>
  );
}
