import { useState } from "react";
import { NavLink } from "react-router-dom";
import "./Navbar.css";

function Navbar({ openContact }) {
  const [open, setOpen] = useState(false);

  const toggleMenu = () => setOpen(!open);
  const closeMenu = () => setOpen(false);

  return (
    <nav className="navbar">
      {/* Brand */}
      <div className="nav-brand">Sarvesh Dabholkar</div>

      {/* Hamburger */}
      <div
        className={`hamburger ${open ? "open" : ""}`}
        onClick={toggleMenu}
      >
        <span></span>
        <span></span>
        <span></span>
      </div>

      {/* Nav Links */}
      <div className={`nav-links ${open ? "open" : ""}`}>
        <NavLink to="/" end onClick={closeMenu}>
          About
        </NavLink>

        <NavLink to="/works" onClick={closeMenu}>
          Works
        </NavLink>

        <NavLink to="/blogs" onClick={closeMenu}>
          Blogs
        </NavLink>

        <button
          className="contact-btn"
          onClick={() => {
            closeMenu();
            openContact();
          }}
        >
          Contact
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
