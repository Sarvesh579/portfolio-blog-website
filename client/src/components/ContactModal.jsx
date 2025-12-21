import "./ContactModal.css";
import { useEffect, useRef } from "react";

export default function ContactModal({ close }) {
  const modalRef = useRef();

  /* Close when clicking outside */
  useEffect(() => {
    const handler = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        close();
      }
    };
    document.addEventListener("mousedown", handler);

    return () => document.removeEventListener("mousedown", handler);
  }, []);

  /* Close on ESC key */
  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", handler);

    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <div className="contact-overlay">
      <div className="contact-modal" ref={modalRef}>
        <div className="modal-header">
            <h2>Contact Me</h2>
            <button className="close-modal" onClick={close}>×</button>
        </div>
        <p className="contact-email">sarvesh.dabholkar41@gmail.com</p>

        <form className="contact-form">
          <input type="text" placeholder="Your Name" required />
          <input type="email" placeholder="Your Email" required />
          <textarea placeholder="Your Message" required></textarea>

          <button type="submit" className="send-btn">
            Send Message
          </button>
        </form>

      </div>
    </div>
  );
}
