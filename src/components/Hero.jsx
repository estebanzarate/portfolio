import profile from '../data/profile.js'
import avatar from '../assets/profile.webp'

const linkConfig = [
  {
    key: 'github',
    label: 'GitHub',
    color: 'hover:text-light',
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
      </svg>
    ),
  },
  {
    key: 'linkedin',
    label: 'LinkedIn',
    color: 'hover:text-info',
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    key: 'htb',
    label: 'HackTheBox',
    color: 'hover:text-success',
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M11.996 0L3 4.875v9.753l8.996 4.875L21 14.628V4.875L11.996 0zm-1.15 16.002l-6.27-3.4V7.4l6.27 3.4v5.202zm.769-6.55L5.346 6.05l6.27-3.4 6.27 3.4-6.27 3.402zm7.04 3.15l-6.27 3.4V10.8l6.27-3.4v5.202z" />
      </svg>
    ),
  },
  {
    key: 'thm',
    label: 'TryHackMe',
    color: 'hover:text-danger',
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z" />
      </svg>
    ),
  },
  {
    key: 'blog',
    label: 'Blog',
    color: 'hover:text-warning',
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15l-5-5 1.41-1.41L11 14.17l7.59-7.59L20 8l-9 9z" />
      </svg>
    ),
  },
  {
    key: 'email',
    label: 'Email',
    color: 'hover:text-primary',
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
      </svg>
    ),
  },
]

function Hero() {
  return (
    <section id="about" className="py-16 scroll-mt-20">
      <div className="flex flex-col md:flex-row items-center md:items-start gap-10">

        {/* Avatar placeholder */}
        <div className="shrink-0 rounded-full bg-surface2 border-2 border-primary flex items-center justify-center text-5xl select-none">
          <img
            src={avatar}
            alt={profile.name}
            className="shrink-0 w-32 h-32 rounded-full border-4 border-primary object-cover"
          />
        </div>

        {/* Info */}
        <div className="flex flex-col gap-4 text-center md:text-left">

          <h1 className="text-4xl font-bold text-light">{profile.name}</h1>

          {/* Rol */}
          <p className="text-info text-lg font-medium">{profile.role}</p>

          {/* Descripción */}
          <p className="text-secondary max-w-xl leading-relaxed">{profile.description}</p>

          {/* Ubicación */}
          <div className="flex items-center justify-center md:justify-start gap-1 text-secondary text-sm">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
            </svg>
            {profile.location}
          </div>

          {/* Links */}
          <div className="flex flex-wrap justify-center md:justify-start gap-3 mt-2">
            {linkConfig.map(({ key, label, icon, color }) =>
              profile.links[key] ? (
                <a
                  key={key}
                  href={profile.links[key]}
                  target={key !== 'email' ? '_blank' : undefined}
                  rel="noopener noreferrer"
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface2 border border-surface2 text-secondary ${color} transition-all text-sm font-medium hover:border-primary/50`}
                >
                  {icon}
                  {label}
                </a>
              ) : null
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero