import { useState, useEffect } from 'react'
import useLanguage from '../hooks/useLanguage'
import profile from '../data/profile.js'
import translations from '../data/translations'

function CertificateModal({ edu, t, onClose }) {
  useEffect(() => {
    function handleKey(e) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative bg-surface border border-surface2 rounded-xl shadow-2xl max-w-2xl w-full p-4 flex flex-col gap-4"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-light font-semibold text-sm">{edu.title}</h3>
            <p className="text-info text-xs mt-0.5">{edu.institution} — {edu.period}</p>
          </div>
          <button
            onClick={onClose}
            className="text-secondary hover:text-light transition-colors text-lg leading-none shrink-0"
          >
            ✕
          </button>
        </div>
        <img
          src={edu.certificate}
          alt={`${t.viewCertificate} — ${edu.title}`}
          className="w-full rounded-lg border border-surface2 object-contain max-h-[70vh]"
        />
      </div>
    </div>
  )
}

function Experience() {
  const { lang } = useLanguage()
  const p = profile[lang]
  const t = translations[lang].experience
  const [activeCert, setActiveCert] = useState(null)

  return (
    <section id="experience" className="flex flex-col gap-10 scroll-mt-20">
      <div className="flex flex-col gap-6">
        <div className="border-l-4 border-warning pl-4">
          <h2 className="text-2xl font-bold text-light">{t.title}</h2>
        </div>
        <div className="flex flex-col gap-4">
          {p.experience.map(exp => (
            <div
              key={exp.id}
              className="flex flex-col gap-3 p-5 rounded-lg bg-surface border border-surface2 hover:border-primary/40 transition-colors"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                <div>
                  <h3 className="text-light font-semibold text-base">{exp.role}</h3>
                  <p className="text-primary text-sm">{exp.company}</p>
                </div>
                <span className="text-secondary text-xs border border-surface2 px-2 py-1 rounded self-start sm:self-auto">
                  {exp.period}
                </span>
              </div>
              <p className="text-secondary text-sm leading-relaxed">{exp.description}</p>
              <div className="flex flex-wrap gap-2">
                {exp.tags.map(tag => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 rounded bg-surface2 text-secondary text-xs border border-surface2"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-6">
        <div className="border-l-4 border-info pl-4">
          <h2 className="text-2xl font-bold text-light">
            {t.education} <span className="text-info">{t.certifications}</span>
          </h2>
        </div>
        <div className="flex flex-col gap-3">
          {p.education.map(edu => (
            <div
              key={edu.id}
              className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 p-4 rounded-lg bg-surface border border-surface2 hover:border-info/40 transition-colors"
            >
              <div>
                <h3 className="text-light font-medium text-sm">{edu.title}</h3>
                <p className="text-info text-xs mt-0.5">{edu.institution}</p>
              </div>
              <div className="flex items-center gap-3 self-start sm:self-auto">
                <span className="text-secondary text-xs border border-surface2 px-2 py-1 rounded">
                  {edu.period}
                </span>
                {edu.certificate && (
                  <button
                    onClick={() => setActiveCert(edu)}
                    className="text-xs px-2 py-1 rounded border border-info/40 text-info hover:bg-info/10 transition-colors"
                  >
                    {t.viewCertificate}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      {activeCert && (
        <CertificateModal edu={activeCert} t={t} onClose={() => setActiveCert(null)} />
      )}
    </section>
  )
}

export default Experience