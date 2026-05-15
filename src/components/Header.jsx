import { useState, useEffect, useRef } from 'react'
import useLanguage from '../hooks/useLanguage'
import translations from '../data/translations'

function Header() {
  const { lang, toggleLang } = useLanguage()
  const t = translations[lang].nav
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('about')
  const menuRef = useRef(null)

  const navLinks = [
    { label: t.about, href: '#about', id: 'about' },
    { label: t.experience, href: '#experience', id: 'experience' },
    { label: t.skills, href: '#skills', id: 'skills' },
    { label: t.machines, href: '#machines', id: 'machines' },
    { label: t.academy, href: '#academy', id: 'academy' },
    { label: t.thm, href: '#thm', id: 'thm' },
  ]

  useEffect(() => {
    const sectionIds = navLinks.map(l => l.id)
    let intersectionObserver = null

    // Registra en el IntersectionObserver todos los section IDs
    // que ya existen en el DOM en ese momento
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

    // Observa el main para detectar cuando los componentes lazy
    // montan sus secciones y agregan los elementos al DOM
    const mutationObserver = new MutationObserver(() => {
      const allFound = sectionIds.every(id => document.getElementById(id))
      setupIntersectionObserver()
      if (allFound) mutationObserver.disconnect()
    })

    setupIntersectionObserver()

    const main = document.querySelector('main')
    if (main) {
      mutationObserver.observe(main, { childList: true, subtree: true })
    }

    return () => {
      intersectionObserver?.disconnect()
      mutationObserver.disconnect()
    }
  }, [])

  // Cerrar menú con Escape
  useEffect(() => {
    function handleKey(e) {
      if (e.key === 'Escape') setMenuOpen(false)
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [])

  // Cerrar menú al hacer click fuera
  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false)
      }
    }
    if (menuOpen) document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [menuOpen])

  // Bloquear scroll del body cuando el menú está abierto
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  function getLinkClass(id, mobile = false) {
    const isActive = activeSection === id
    const base = 'transition-colors text-sm font-medium'
    if (mobile) {
      return `${base} px-3 py-2.5 rounded-lg ${isActive
        ? 'text-primary bg-primary/10'
        : 'text-secondary hover:text-primary hover:bg-surface2/50'
        }`
    }
    return `${base} ${isActive ? 'text-primary' : 'text-secondary hover:text-primary'}`
  }

  return (
    <header className="sticky top-0 z-50 bg-surface border-b border-surface2 shadow-lg" ref={menuRef}>
      <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
        <span className="text-primary font-bold text-xl tracking-wide">
          Esteban Zárate
        </span>

        {/* Nav desktop */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map(link => (
            <a
              key={link.href}
              href={link.href}
              className={getLinkClass(link.id)}
            >
              {link.label}
            </a>
          ))}
          <button
            onClick={toggleLang}
            className="ml-2 px-2.5 py-1 rounded border border-surface2 text-secondary hover:text-light hover:border-primary/50 transition-all text-xs font-semibold tracking-wider"
          >
            {lang === 'es' ? 'EN' : 'ES'}
          </button>
        </nav>

        {/* Controles mobile */}
        <div className="flex md:hidden items-center gap-3">
          <button
            onClick={toggleLang}
            className="px-2.5 py-1 rounded border border-surface2 text-secondary hover:text-light hover:border-primary/50 transition-all text-xs font-semibold tracking-wider"
          >
            {lang === 'es' ? 'EN' : 'ES'}
          </button>
          <button
            onClick={() => setMenuOpen(prev => !prev)}
            aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={menuOpen}
            className="flex flex-col justify-center items-center w-8 h-8 gap-1.5 text-secondary hover:text-light transition-colors"
          >
            <span className={`block h-0.5 w-5 bg-current transition-all duration-300 origin-center ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`block h-0.5 w-5 bg-current transition-all duration-300 ${menuOpen ? 'opacity-0 scale-x-0' : ''}`} />
            <span className={`block h-0.5 w-5 bg-current transition-all duration-300 origin-center ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
          </button>
        </div>
      </div>

      {/* Drawer mobile */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${menuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
      >
        <nav className="flex flex-col border-t border-surface2 px-4 py-3 gap-1">
          {navLinks.map(link => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className={getLinkClass(link.id, true)}
            >
              {link.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  )
}

export default Header