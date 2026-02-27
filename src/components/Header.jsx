const navLinks = [
  { label: 'Sobre mí', href: '#about' },
  { label: 'Experiencia', href: '#experience' },
  { label: 'Skills', href: '#skills' },
  { label: 'HTB Machines', href: '#machines' },
  { label: 'HTB Academy', href: '#academy' },
]

function Header() {
  return (
    <header className="sticky top-0 z-50 bg-surface border-b border-surface2 shadow-lg">
      <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
        <span className="text-primary font-bold text-xl tracking-wide">
          Esteban Zárate
        </span>
        <nav className="hidden md:flex gap-6">
          {navLinks.map(link => (
            <a
              key={link.href}
              href={link.href}
              className="text-secondary hover:text-primary transition-colors text-sm font-medium"
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