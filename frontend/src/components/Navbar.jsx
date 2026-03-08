
import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    // Check on mount
    handleResize();
    
    // Add listener
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const closeMenu = () => setOpen(false);

  return (
    <nav style={styles.nav}>
      {/* Logo */}
      <div style={styles.logo}>🛡️ SAFE-X</div>

      {/* Hamburger (Mobile only) */}
      {isMobile && (
        <div 
          style={styles.hamburger} 
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? "✕" : "☰"}
        </div>
      )}

      {/* Links */}
      {(!isMobile || open) && (
        <div style={isMobile ? styles.mobileLinks : styles.links}>
          <NavLink
            to="/"
            style={({ isActive }) =>
              isActive ? styles.activeLink : styles.link
            }
            onClick={closeMenu}
          >
            Home
          </NavLink>

          <NavLink
            to="/scan"
            style={({ isActive }) =>
              isActive ? styles.activeLink : styles.link
            }
            onClick={closeMenu}
          >
            Scan
          </NavLink>

          <NavLink
            to="/about"
            style={({ isActive }) =>
              isActive ? styles.activeLink : styles.link
            }
            onClick={closeMenu}
          >
            About
          </NavLink>

          <a
            href="https://github.com/fahad7-git"
            target="_blank"
            rel="noreferrer"
            style={styles.link}
          >
            GitHub
          </a>

          <a
            href="https://www.linkedin.com/in/fahad-mahfooz-5707862ba"
            target="_blank"
            rel="noreferrer"
            style={styles.link}
          >
            LinkedIn
          </a>
        </div>
      )}
    </nav>
  );
}

/* ================= STYLES ================= */

const styles = {
  nav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "12px 16px",
    backgroundColor: "#050505",
    borderBottom: "2px solid #00ff99",
    position: "sticky",
    top: 0,
    zIndex: 1000,
    flexWrap: "wrap",
  },

  logo: {
    color: "#00ff99",
    fontSize: "20px",
    fontWeight: "800",
    letterSpacing: "1px",
  },

  links: {
    display: "flex",
    gap: "20px",
    alignItems: "center",
    flexWrap: "wrap",
  },

  mobileLinks: {
    position: "absolute",
    top: "56px",
    left: 0,
    right: 0,
    backgroundColor: "#050505",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "16px",
    padding: "20px 0",
    borderBottom: "2px solid #00ff99",
    width: "100%",
  },

  link: {
    color: "#ffffff",
    textDecoration: "none",
    fontSize: "15px",
    fontWeight: "500",
    transition: "color 0.2s",
  },

  activeLink: {
    color: "#00ff99",
    textDecoration: "none",
    fontSize: "15px",
    fontWeight: "700",
    borderBottom: "2px solid #00ff99",
    paddingBottom: "4px",
  },

  hamburger: {
    fontSize: "24px",
    color: "#00ff99",
    cursor: "pointer",
    padding: "4px 8px",
  },
};


