import { useState, useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";
import useLanguage from "../hooks/useLanguage";
import translations from "../data/translations";

const MOBILE_NAV_ID = "mobile-nav-drawer";

function Header() {
  const { lang, toggleLang } = useLanguage();
  const t = translations[lang].nav;

  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const navLinks = [
    { label: t.about, to: "/about" },
    { label: t.skills, to: "/skills" },
    {
      label: lang === "es" ? "Laboratorios" : "Labs",
      to: "/labs",
    },
  ];

  function getLinkClass(isActive, mobile = false) {
    const base = "cursor-pointer transition-colors text-sm font-medium";

    if (mobile) {
      return `${base} px-3 py-2.5 rounded-lg ${
        isActive
          ? "text-primary bg-primary/10"
          : "text-secondary hover:text-primary hover:bg-surface2/50"
      }`;
    }

    return `${base} ${
      isActive ? "text-primary" : "text-secondary hover:text-primary"
    }`;
  }

  useEffect(() => {
    function handleKey(e) {
      if (e.key === "Escape") setMenuOpen(false);
    }

    document.addEventListener("keydown", handleKey);

    return () => document.removeEventListener("keydown", handleKey);
  }, []);

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    }

    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <header className="sticky top-0 z-50 bg-surface border-b border-surface2 shadow-lg">
      <div ref={menuRef}>
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <NavLink
            to="/"
            onClick={() => setMenuOpen(false)}
            className="cursor-pointer text-primary font-bold text-xl tracking-wide hover:opacity-80 transition-opacity"
          >
            Esteban Zárate
          </NavLink>

          <nav className="hidden md:flex items-center gap-5">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) => getLinkClass(isActive)}
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleLang}
              className="cursor-pointer px-2.5 py-1 rounded border border-surface2 text-secondary hover:text-light hover:border-primary/50 transition-all text-xs font-semibold tracking-wider"
            >
              {lang === "es" ? "EN" : "ES"}
            </button>

            <button
              onClick={() => setMenuOpen((prev) => !prev)}
              aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
              aria-expanded={menuOpen}
              aria-controls={MOBILE_NAV_ID}
              className="cursor-pointer flex md:hidden flex-col justify-center items-center w-8 h-8 gap-1.5 text-secondary hover:text-light transition-colors"
            >
              <span
                className={`block h-0.5 w-5 bg-current transition-all duration-300 origin-center ${
                  menuOpen ? "rotate-45 translate-y-2" : ""
                }`}
              />
              <span
                className={`block h-0.5 w-5 bg-current transition-all duration-300 ${
                  menuOpen ? "opacity-0 scale-x-0" : ""
                }`}
              />
              <span
                className={`block h-0.5 w-5 bg-current transition-all duration-300 origin-center ${
                  menuOpen ? "-rotate-45 -translate-y-2" : ""
                }`}
              />
            </button>
          </div>
        </div>

        {menuOpen && (
          <div id={MOBILE_NAV_ID} className="md:hidden drawer-open">
            <nav className="flex flex-col border-t border-surface2 px-4 py-3 gap-1">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  onClick={() => setMenuOpen(false)}
                  className={({ isActive }) => getLinkClass(isActive, true)}
                >
                  {link.label}
                </NavLink>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;
