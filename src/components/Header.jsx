import useLanguage from '../hooks/useLanguage'
import translations from '../data/translations'

function Header() {
  const { lang, toggleLang } = useLanguage()
  const t = translations[lang].nav

  const navLinks = [
    { label: t.about, href: '#about' },
    { label: t.experience, href: '#experience' },
    { label: t.skills, href: '#skills' },
    { label: t.machines, href: '#machines' },
    { label: t.academy, href: '#academy' },
    { label: t.thm, href: '#thm' },
  ]

  return (
    <header className="sticky top-0 z-50 bg-surface border-b border-surface2 shadow-lg">
      <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
        <span className="text-primary font-bold text-xl tracking-wide">
          Esteban Zárate
        </span>
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map(link => (
            <a
              key={link.href}
              href={link.href}
              className="text-secondary hover:text-primary transition-colors text-sm font-medium"
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
      </div>
    </header>
  )
}

export default Header