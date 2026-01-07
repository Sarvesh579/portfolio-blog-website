import "./About.css";
import GravityBubbles from "../components/Bubbles";
import { Link } from "react-router-dom";
import { useEffect } from "react";

export default function About() {

  useEffect(() => {
    const scrambleEls = document.querySelectorAll(".scramble");
    const scrambleChars = "!<>-_\\/[]{}—=+*^?#________";

    scrambleEls.forEach((el) => {
      const finalText = el.getAttribute("data-text");
      let frame = 0;

      const update = () => {
        let output = "";

        for (let i = 0; i < finalText.length; i++) {
          if (i < frame) {
            output += finalText[i];
          } else {
            output += scrambleChars[Math.floor(Math.random() * scrambleChars.length)];
          }
        }

        el.textContent = output;

        frame++;
          if (frame <= finalText.length) {
            setTimeout(update, 120);   // SLOWER SCRAMBLE (was instant before)
          }
        };

        update();
      });


      /* =================================================
        TYPEWRITER EFFECT FOR PARAGRAPH
      =================================================== */
      const typeEls = document.querySelectorAll(".typewriter");
      typeEls.forEach((el) => {
        const text = el.getAttribute("data-text").trim();
        el.textContent = "";
        let index = 0;

        const type = () => {
          el.textContent = text.slice(0, index);
          index++;
          if (index <= text.length) {
            setTimeout(type, 10);  // MUCH FASTER (was 18ms)
          }
        };

        type();
      });

    }, []);


  return (
    <div className="about-page">

      {/* Background Layer */}
      <div className="animated-bg">
        <span className="shape s1"></span>
        <span className="shape s2"></span>
        <span className="shape s3"></span>
        <span className="shape s4"></span>
      </div>

      {/* INTRO */}
      <section className="about-intro">
        <div className="intro-card">

          {/* Photo */}
          <div className="intro-photo">
            <img src="/self_photo.jpeg" alt="Sarvesh" className="photo-animate" />
          </div>

          {/* Content */}
          <div className="intro-content">

            {/* Heading with SCRAMBLE animation */}
            <h2 className="intro-heading">
              <span className="first-name scramble" data-text="SARVESH"></span>
              <span className="last-name scramble" data-text="Dabholkar"></span>
            </h2>

            {/* Date */}
            <div className="intro-date scramble" data-text="Computer Engineer ● Mumbai"></div>

            {/* Paragraph */}
            <p  className="para-fade">
              I'm a student who enjoys building systems, from interactive frontends to scalable backends. I'm particularly interested in automation, fontend development, and applied Machine Learning. I care deeply about clean architecture, performance, and meaningful user experience.
            </p>
          </div>
        </div>
      </section>


      {/* Gravity Bubbles */}
      <GravityBubbles />


      {/* Skills */}
      <section className="about-skills">
        <h2>Technical Skills</h2>
        <div className="skills-grid">
          <div>
            <div>
              <h4>Web</h4>
              <span>MERN Stack</span>
              <span>REST APIs</span>
              <span>Design</span>
            </div>

            <div>
              <h4>Languages</h4>
              <span>C, C++</span>
              <span>Python</span>
              <span>Java</span>
              <span>JavaScript</span>
            </div>
          </div>

          <div>
            <div>
              <h4>AI / Data</h4>
              <span>Machine Learning</span>
              <span>Data Analysis</span>
              <span>Automation</span>
            </div>

            <div>
              <h4>Foundations</h4>
              <span>OOP</span>
              <span>DSA</span>
            </div>
          </div>
        </div>
      </section>

      {/* Personality Gallery */}
      <section className="about-gallery">
        <div className="gallery-track">
          <div className="gallery-item" style={{ minWidth: "130px"}}>ML Modelling</div>
          <div className="gallery-item">End-to-End<br></br>System Design</div>
          <div className="gallery-item">Data Analysis</div>
          <div className="gallery-item">UI/UX Design</div>
          <div className="gallery-item">Responsive<br></br>Layout</div>
          <div className="gallery-item">Creative Elements</div>
          <div className="gallery-item">Scalable Arch</div>
          <div className="gallery-item">Attention to Detail</div>
        </div>
      </section>

      {/* CTA */}
      <section className="about-cta">
        <a href="/resume.pdf" className="resume-btn" download>
          Download Resume
        </a>
        <Link to="/works" className="works-btn">
          Explore Projects →
        </Link>
      </section>

    </div>
  );
}
