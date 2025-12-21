import { useState, useEffect } from "react";
import "./Works.css";

export default function Works() {
  const [tab, setTab] = useState("projects");
  const [projects, setProjects] = useState([]);
  const [certs, setCerts] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const p = await fetch("http://localhost:4000/api/projects").then(res => res.json());
        const c = await fetch("http://localhost:4000/api/certifications").then(res => res.json());

        setProjects(p);
        setCerts(c);
      } catch (err) {
        console.log("Error fetching:", err);
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
        {tab === "projects" ? (
          <ProjectsAccordion data={projects} />
        ) : (
          <CertsAccordion data={certs} />
        )}
      </div>
    </div>
  );
}

/* ============================================================
   PROJECTS ACCORDION
============================================================ */
function ProjectsAccordion({ data }) {
  const [openId, setOpenId] = useState(null);

  const handleToggle = (id) => {
    if (openId === id) {
      setOpenId(null);
      return;
    }

    // Phase 1: open the new card immediately
    setOpenId(id);

    // Phase 2: close previous card in the next frame
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setOpenId(id);
      });
    });
  };

  return (
    <div className="cards-container">
      {data.map((p, i) => {
        const open = openId === p._id;

        return (
          <div
            key={p._id}
            className={`card show-card ${open ? "open" : ""}`}
            onClick = {() => handleToggle(p._id)}
          >
            <h3>{p.title}</h3>

            <div className="tech">
              {p.tech.map(t => (
                <span key={t}>{t}</span>
              ))}
            </div>
            <div className="accordion-body">
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
        );
      })}
    </div>
  );
}

/* ============================================================
   CERTIFICATIONS ACCORDION
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
              {c.issuer} — {c.date}
            </div>

            {open && (
              <div className="accordion-body">
                <p>{c.details}</p>

                {c.certificateImage && (
                  <img
                    src={c.certificateImage}
                    alt=""
                    className="cert-image"
                  />
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
