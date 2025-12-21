import "./About.css";
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
            <div className="intro-date scramble" data-text="July 2005, Mumbai"></div>

            {/* Paragraph */}
            <p  className="para-fade">
              An engineering student passionate about UI/UX, Machine Learning, creativity, and digital experiences. With a blend of logic and imagination, I explore problem-solving, design, and building meaningful tech projects. Learning consistently is my motive.
            </p>

          </div>
        </div>
      </section>

      {/* Personality Gallery */}
      <section className="about-gallery">
        <div className="gallery-track">
          <div className="gallery-item">Curious and Enthusiastic</div>
          <div className="gallery-item">Creative Head</div>
          <div className="gallery-item">Logical & Critical Thinking</div>
          <div className="gallery-item">Team Player & Leader</div>
          <div className="gallery-item">Dedicated</div>
          <div className="gallery-item">Adventurer</div>
          <div className="gallery-item">Friendly and Sociable</div>
        </div>
      </section>

      {/* Skills */}
      <section className="about-skills">
        <h2>Skills</h2>
        <div className="skills-grid">
          <span>MERN Stack Development</span>
          <span>C, C++</span>
          <span>Java</span>
          <span>Python</span>
          <span>Large Data Analysis</span>
          <span>Machine Learning</span>
          <span>DSA</span>
          <span>Machine Learning</span>
        </div>
      </section>

      {/* CTA */}
      <section className="about-cta">
        <a href="/resume.pdf" className="resume-btn" download>
          Download Resume
        </a>
        <Link to="/works" className="works-btn">
          View My Works →
        </Link>
      </section>

    </div>
  );
}
