import { useState } from 'react'
import LanguageContext from './LanguageContext'

function LanguageProvider({ children }) {
  const [lang, setLang] = useState('es')

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