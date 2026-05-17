import { useState, useEffect, useRef } from 'react'
import useLanguage from '../hooks/useLanguage'
import profile from '../data/profile.js'
import translations from '../data/translations'

const FOCUSABLE = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(', ')

function ExternalLinkIcon() {
  return (
    <svg
      className="w-3 h-3 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6m0 0v6m0-6L10 14" />
    </svg>
  )
}

function CertificateModal({ edu, t, onClose, triggerRef }) {
  const modalRef = useRef(null)

  useEffect(() => {
    const firstFocusable = modalRef.current?.querySelectorAll(FOCUSABLE)?.[0]
    firstFocusable?.focus()
    return () => { triggerRef.current?.focus() }
  }, [])

  useEffect(() => {
    function handleKey(e) {
      if (e.key === 'Escape') {
        onClose()
        return
      }
      if (e.key !== 'Tab') return
      const focusable = [...(modalRef.current?.querySelectorAll(FOCUSABLE) ?? [])]
      if (focusable.length === 0) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
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
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="cert-modal-title"
        className="relative bg-surface border border-surface2 rounded-xl shadow-2xl max-w-2xl w-full p-4 flex flex-col gap-4"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 id="cert-modal-title" className="text-light font-semibold text-sm">{edu.title}</h3>
            <p className="text-primary text-xs mt-0.5">{edu.institution} — {edu.period}</p>
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
  const triggerRef = useRef(null)

  function openCert(edu, buttonEl) {
    triggerRef.current = buttonEl
    setActiveCert(edu)
  }

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
        <div className="border-l-4 border-primary pl-4">
          <h2 className="text-2xl font-bold text-light">
            {t.education} <span className="text-primary">{t.certifications}</span>
          </h2>
        </div>
        <div className="flex flex-col gap-3">
          {p.education.map(edu => (
            <div
              key={edu.id}
              className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 p-4 rounded-lg bg-surface border border-surface2 hover:border-primary/40 transition-colors"
            >
              <div className="flex flex-col gap-0.5">
                {edu.courseUrl ? (
                  <a
                    href={edu.courseUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-1.5 text-light hover:text-primary transition-colors font-medium text-sm w-fit"
                  >
                    {edu.title}
                    <ExternalLinkIcon />
                  </a>
                ) : (
                  <h3 className="text-light font-medium text-sm">{edu.title}</h3>
                )}
                <p className="text-primary text-xs">{edu.institution}</p>
              </div>
              <div className="flex items-center gap-3 self-start sm:self-auto shrink-0">
                <span className="text-secondary text-xs border border-surface2 px-2 py-1 rounded">
                  {edu.period}
                </span>
                {edu.certificate && (
                  <button
                    onClick={e => openCert(edu, e.currentTarget)}
                    className="text-xs px-2 py-1 rounded border border-primary/40 text-primary hover:bg-primary/10 transition-colors"
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
        <CertificateModal
          edu={activeCert}
          t={t}
          onClose={() => setActiveCert(null)}
          triggerRef={triggerRef}
        />
      )}
    </section>
  )
}

export default Experience