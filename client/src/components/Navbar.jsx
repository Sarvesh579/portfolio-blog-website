import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import "./Navbar.css";

function Navbar({ openContact }) {
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const toggleMenu = () => setOpen(!open);
  const closeMenu = () => setOpen(false);

  useEffect(() => {
    let lastScrollY = window.scrollY;
    let ticking = false;

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;

          if (currentScrollY > lastScrollY && currentScrollY > 80) {
            // scrolling down
            setHidden(true);
          } else if (currentScrollY < lastScrollY && currentScrollY > 80){
            // scrolling up
            setHidden(false);
          }

          lastScrollY = currentScrollY;
          ticking = false;
        });

        ticking = true;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);


  return (
    <nav className={`navbar ${hidden ? "nav-hidden" : ""}`}>
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
          My Works
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
