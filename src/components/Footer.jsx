import useLanguage from '../hooks/useLanguage'
import profile from '../data/profile.js'

function Footer() {
  const { lang } = useLanguage()
  const p = profile[lang]
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-surface2 mt-16">
      <div className="max-w-5xl mx-auto px-4 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex flex-col items-center sm:items-start gap-1">
          <span className="text-light font-semibold text-sm">{p.name}</span>
          <span className="text-secondary text-xs">{p.role}</span>
        </div>
        <span className="text-secondary text-xs">© {year} {p.name}</span>
        <div className="flex items-center gap-4">
          {p.links.github && (
            <a href={p.links.github} target="_blank" rel="noopener noreferrer"
              className="text-secondary hover:text-light transition-colors text-xs">
              GitHub
            </a>
          )}
          {p.links.linkedin && (
            <a href={p.links.linkedin} target="_blank" rel="noopener noreferrer"
              className="text-secondary hover:text-info transition-colors text-xs">
              LinkedIn
            </a>
          )}
          {p.links.blog && (
            <a href={p.links.blog} target="_blank" rel="noopener noreferrer"
              className="text-secondary hover:text-warning transition-colors text-xs">
              Blog
            </a>
          )}
        </div>
      </div>
    </footer>
  )
}

export default Footer