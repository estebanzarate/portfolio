import { useState, useEffect } from 'react'
import LanguageContext from './LanguageContext'

const DEFAULT_LANG = 'en'
const LS_LANG = 'portfolio-lang'

function LanguageProvider({ children }) {
  const [lang, setLang] = useState(
    () => localStorage.getItem(LS_LANG) ?? DEFAULT_LANG
  )

  useEffect(() => { document.documentElement.lang = lang }, [lang])
  useEffect(() => { localStorage.setItem(LS_LANG, lang) }, [lang])

  function toggleLang() {
    setLang(prev => prev === 'es' ? 'en' : 'es')
  }

  return (
    <LanguageContext.Provider value={{ lang, toggleLang }}>
      {children}
    </LanguageContext.Provider>
  )
}

export default LanguageProvider