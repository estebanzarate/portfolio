import { useState, useEffect, useRef } from 'react'
import useLanguage from '../hooks/useLanguage'
import useTheme from '../hooks/useTheme'
import translations from '../data/translations'

const MOBILE_NAV_ID = 'mobile-nav-drawer'

function SunIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="4" />
      <path strokeLinecap="round" d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
    </svg>
  )
}

function MoonIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
    </svg>
  )
}

function usePrimaryColor(deps) {
  const [color, setColor] = useState('')
  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      const value = getComputedStyle(document.documentElement)
        .getPropertyValue('--color-primary')
        .trim()
      setColor(value)
    })
    return () => cancelAnimationFrame(raf)
  }, deps)
  return color
}

function Header() {
  const { lang, toggleLang } = useLanguage()
  const { theme, palette, currentPalette, toggleTheme, cyclePalette } = useTheme()
  const t = translations[lang].nav
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('')
  const headerRef = useRef(null)
  const menuRef = useRef(null)

  const accentColor = usePrimaryColor([theme, palette])

  const navLinks = [
    { label: t.about, href: '#about', id: 'about' },
    { label: t.experience, href: '#experience', id: 'experience' },
    { label: t.skills, href: '#skills', id: 'skills' },
    { label: t.machines, href: '#machines', id: 'machines' },
    { label: t.academy, href: '#academy', id: 'academy' },
    { label: t.thm, href: '#thm', id: 'thm' },
  ]

  function scrollToSection(id) {
    const el = document.getElementById(id)
    if (!el) return
    const headerHeight = headerRef.current?.offsetHeight ?? 0
    const top = el.getBoundingClientRect().top + window.scrollY - headerHeight
    window.scrollTo({ top, behavior: 'smooth' })
  }

  function handleNavClick(e, id) {
    e.preventDefault()
    scrollToSection(id)
    setMenuOpen(false)
  }

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    setActiveSection('')
  }

  useEffect(() => {
    const sectionIds = navLinks.map(l => l.id)
    let intersectionObserver = null

    function setupIntersectionObserver() {
      if (intersectionObserver) intersectionObserver.disconnect()
      intersectionObserver = new IntersectionObserver(
        entries => {
          entries.forEach(entry => {
            if (entry.isIntersecting) setActiveSection(entry.target.id)
          })
        },
        { rootMargin: '-20% 0px -75% 0px', threshold: 0 }
      )
      sectionIds
        .map(id => document.getElementById(id))
        .filter(Boolean)
        .forEach(el => intersectionObserver.observe(el))
    }

    const mutationObserver = new MutationObserver(() => {
      const allFound = sectionIds.every(id => document.getElementById(id))
      setupIntersectionObserver()
      if (allFound) mutationObserver.disconnect()
    })

    setupIntersectionObserver()

    const main = document.querySelector('main')
    if (main) mutationObserver.observe(main, { childList: true, subtree: true })

    return () => {
      intersectionObserver?.disconnect()
      mutationObserver.disconnect()
    }
  }, [])

  useEffect(() => {
    function handleScroll() {
      if (window.scrollY === 0) setActiveSection('')
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    function handleKey(e) {
      if (e.key === 'Escape') setMenuOpen(false)
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [])

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false)
      }
    }
    if (menuOpen) document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [menuOpen])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  function getLinkClass(id, mobile = false) {
    const isActive = activeSection === id
    const base = 'cursor-pointer transition-colors text-sm font-medium'
    if (mobile) {
      return `${base} px-3 py-2.5 rounded-lg ${isActive
          ? 'text-primary bg-primary/10'
          : 'text-secondary hover:text-primary hover:bg-surface2/50'
        }`
    }
    return `${base} ${isActive ? 'text-primary' : 'text-secondary hover:text-primary'}`
  }

  return (
    <header
      ref={headerRef}
      className="sticky top-0 z-50 bg-surface border-b border-surface2 shadow-lg"
    >
      <div ref={menuRef}>
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={scrollToTop}
            className="cursor-pointer text-primary font-bold text-xl tracking-wide hover:opacity-80 transition-opacity"
          >
            Esteban Zárate
          </button>

          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map(link => (
              <a
                key={link.href}
                href={link.href}
                onClick={e => handleNavClick(e, link.id)}
                className={getLinkClass(link.id)}
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-2">
            <button
              onClick={cyclePalette}
              title={`Paleta: ${currentPalette.label}`}
              className="cursor-pointer w-7 h-7 rounded-full border-2 border-surface2 hover:border-primary/50 transition-all"
              style={{ backgroundColor: accentColor }}
            />
            <button
              onClick={toggleTheme}
              aria-label={theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
              className="cursor-pointer w-8 h-8 flex items-center justify-center rounded border border-surface2 text-secondary hover:text-primary hover:border-primary/50 transition-all"
            >
              {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
            </button>
            <button
              onClick={toggleLang}
              className="cursor-pointer px-2.5 py-1 rounded border border-surface2 text-secondary hover:text-light hover:border-primary/50 transition-all text-xs font-semibold tracking-wider"
            >
              {lang === 'es' ? 'EN' : 'ES'}
            </button>
          </div>

          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={cyclePalette}
              title={`Paleta: ${currentPalette.label}`}
              className="cursor-pointer w-6 h-6 rounded-full border-2 border-surface2 hover:border-primary/50 transition-all"
              style={{ backgroundColor: accentColor }}
            />
            <button
              onClick={toggleTheme}
              aria-label={theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
              className="cursor-pointer w-8 h-8 flex items-center justify-center rounded border border-surface2 text-secondary hover:text-primary transition-all"
            >
              {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
            </button>
            <button
              onClick={toggleLang}
              className="cursor-pointer px-2.5 py-1 rounded border border-surface2 text-secondary hover:text-light hover:border-primary/50 transition-all text-xs font-semibold tracking-wider"
            >
              {lang === 'es' ? 'EN' : 'ES'}
            </button>
            <button
              onClick={() => setMenuOpen(prev => !prev)}
              aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
              aria-expanded={menuOpen}
              aria-controls={MOBILE_NAV_ID}
              className="cursor-pointer flex flex-col justify-center items-center w-8 h-8 gap-1.5 text-secondary hover:text-light transition-colors"
            >
              <span className={`block h-0.5 w-5 bg-current transition-all duration-300 origin-center ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
              <span className={`block h-0.5 w-5 bg-current transition-all duration-300 ${menuOpen ? 'opacity-0 scale-x-0' : ''}`} />
              <span className={`block h-0.5 w-5 bg-current transition-all duration-300 origin-center ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
            </button>
          </div>
        </div>

        {menuOpen && (
          <div id={MOBILE_NAV_ID} className="md:hidden drawer-open">
            <nav className="flex flex-col border-t border-surface2 px-4 py-3 gap-1">
              {navLinks.map(link => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={e => handleNavClick(e, link.id)}
                  className={getLinkClass(link.id, true)}
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header