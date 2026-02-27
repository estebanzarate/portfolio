import profile from '../data/profile.js'

function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-surface2 mt-16">
      <div className="max-w-5xl mx-auto px-4 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">

        <div className="flex flex-col items-center sm:items-start gap-1">
          <span className="text-light font-semibold text-sm">{profile.name}</span>
          <span className="text-secondary text-xs">{profile.role}</span>
        </div>

        <div className="flex flex-col items-center gap-1">
          <span className="text-secondary text-xs">
            © {year} {profile.name}
          </span>
        </div>

        <div className="flex items-center gap-4">
          {profile.links.github && (
            <a
              href={profile.links.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-secondary hover:text-light transition-colors text-xs"
            >
              GitHub
            </a>
          )}
          {profile.links.linkedin && (
            <a
              href={profile.links.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-secondary hover:text-info transition-colors text-xs"
            >
              LinkedIn
            </a>
          )}
          {profile.links.blog && (
            <a
              href={profile.links.blog}
              target="_blank"
              rel="noopener noreferrer"
              className="text-secondary hover:text-warning transition-colors text-xs"
            >
              Blog
            </a>
          )}
        </div>

      </div>
    </footer>
  )
}

export default Footer