import { useState, useEffect, useRef } from 'react'
import useLanguage from '../hooks/useLanguage'
import translations from '../data/translations'

const SITE_URL = 'https://estebanzarate.vercel.app'
const SITE_TEXT = 'Esteban Zárate — Cybersecurity Analyst'

function ShareFAB() {
  const { lang } = useLanguage()
  const t = translations[lang].share
  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const fabRef = useRef(null)

  const ACTIONS = [
    {
      id: 'copy',
      label: copied ? t.copied : t.copy,
      href: null,
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <rect x="9" y="9" width="13" height="13" rx="2" />
          <path strokeLinecap="round" d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
        </svg>
      ),
    },
    {
      id: 'whatsapp',
      label: t.whatsapp,
      href: `https://wa.me/?text=${encodeURIComponent(`${SITE_TEXT} ${SITE_URL}`)}`,
      icon: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
          <path d="M12 0C5.373 0 0 5.373 0 12c0 2.117.549 4.1 1.508 5.822L0 24l6.335-1.65A11.94 11.94 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.006-1.371l-.36-.214-3.727.977.995-3.638-.235-.373A9.79 9.79 0 012.182 12C2.182 6.58 6.58 2.182 12 2.182S21.818 6.58 21.818 12 17.42 21.818 12 21.818z" />
        </svg>
      ),
    },
    {
      id: 'telegram',
      label: t.telegram,
      href: `https://t.me/share/url?url=${encodeURIComponent(SITE_URL)}&text=${encodeURIComponent(SITE_TEXT)}`,
      icon: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12L7.17 13.674l-2.96-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.131.978.885z" />
        </svg>
      ),
    },
    {
      id: 'linkedin',
      label: t.linkedin,
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(SITE_URL)}`,
      icon: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
      ),
    },
    {
      id: 'twitter',
      label: t.twitter,
      href: `https://x.com/intent/tweet?text=${encodeURIComponent(SITE_TEXT)}&url=${encodeURIComponent(SITE_URL)}`,
      icon: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
    },
    {
      id: 'facebook',
      label: t.facebook,
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(SITE_URL)}`,
      icon: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      ),
    },
  ]

  useEffect(() => {
    function handleClickOutside(e) {
      if (fabRef.current && !fabRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    if (open) document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [open])

  async function handleAction(action) {
    if (action.id === 'copy') {
      await navigator.clipboard.writeText(SITE_URL)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
      return
    }
    window.open(action.href, '_blank', 'noopener,noreferrer')
  }

  return (
    <div ref={fabRef} className="fixed bottom-6 right-6 z-40 flex flex-col-reverse items-end gap-2">
      {open && ACTIONS.map((action, i) => (
        <div
          key={action.id}
          className="flex items-center gap-2"
          style={{
            animation: 'fab-item-in 200ms ease forwards',
            animationDelay: `${i * 35}ms`,
            opacity: 0,
          }}
        >
          <span className="text-xs text-secondary bg-surface border border-surface2 px-2 py-0.5 rounded shadow-sm whitespace-nowrap">
            {action.label}
          </span>
          <button
            onClick={() => handleAction(action)}
            title={action.label}
            aria-label={action.label}
            className="cursor-pointer w-9 h-9 rounded-full bg-surface border border-surface2 text-secondary hover:text-primary hover:border-primary/50 flex items-center justify-center shadow transition-colors"
          >
            {action.icon}
          </button>
        </div>
      ))}

      <button
        onClick={() => setOpen(prev => !prev)}
        title={open ? t.close : t.open}
        aria-label={open ? t.close : t.open}
        aria-expanded={open}
        className="cursor-pointer w-11 h-11 rounded-full bg-surface border border-surface2 text-secondary hover:text-primary hover:border-primary/50 flex items-center justify-center shadow-lg transition-all"
      >
        <svg
          className={`w-5 h-5 transition-transform duration-300 ${open ? 'rotate-45' : ''}`}
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
        </svg>
      </button>
    </div>
  )
}

export default ShareFAB