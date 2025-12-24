import "./ContactModal.css";
import { useEffect, useRef, useState } from "react";

export default function ContactModal({ close }) {
  const modalRef = useRef();
  const [result, setResult] = useState("");
  const [sending, setSending] = useState(false);

  /* Close when clicking outside */
  useEffect(() => {
    const handler = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        close();
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [close]);

  /* Close on ESC key */
  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [close]);

  /* -------------------------------------------------------
     WEB3FORMS SUBMIT
  ------------------------------------------------------- */
  const onSubmit = async (event) => {
    event.preventDefault();
    setSending(true);
    setResult("");

    const formData = new FormData(event.target);
    formData.append("access_key", "8094e3c1-84ae-470d-9075-a0770daf0ae3");
    formData.append("from_name", "Portfolio Website");

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setResult("Message sent successfully!");
        event.target.reset();
      } else {
        setResult("Something went wrong. Please try again.");
      }
    } catch {
      setResult("Network error. Please try again.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="contact-overlay">
      <div className="contact-modal" ref={modalRef}>
        <div className="modal-header">
          <h2>Contact Me</h2>
          <button className="close-modal" onClick={close}>×</button>
        </div>

        <p className="contact-email">
          sarvesh.dabholkar41@gmail.com
        </p>

        <form className="contact-form" onSubmit={onSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Your Email"
            required
          />

          {/* ✅ NEW SUBJECT FIELD */}
          <input
            type="text"
            name="subject"
            placeholder="Subject"
            required
          />

          <textarea
            name="message"
            placeholder="Your Message"
            required
          />

          <button
            type="submit"
            className="send-btn"
            disabled={sending}
          >
            {sending ? "Sending..." : "Send Message"}
          </button>

          {result && <p className="form-result">{result}</p>}
        </form>
      </div>
    </div>
  );
}
