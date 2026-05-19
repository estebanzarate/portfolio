import { useState, useEffect } from 'react'
import ThemeContext from './ThemeContext'

export const PALETTES = [
  { id: 'blue', label: 'Blue' },
  { id: 'silver', label: 'Silver' },
  { id: 'green', label: 'Green' },
  { id: 'red', label: 'Red' },
  { id: 'amber', label: 'Amber' },
  { id: 'cyan', label: 'Cyan' },
  { id: 'pearl', label: 'Pearl' },
  { id: 'mocha', label: 'Mocha' },
]

const DEFAULT_THEME = 'dark'
const DEFAULT_PALETTE = 'blue'
const LS_THEME = 'portfolio-theme'
const LS_PALETTE = 'portfolio-palette'

function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(
    () => localStorage.getItem(LS_THEME) ?? DEFAULT_THEME
  )

  const [palette, setPalette] = useState(() => {
    const saved = localStorage.getItem(LS_PALETTE)
    return PALETTES.find(p => p.id === saved) ? saved : DEFAULT_PALETTE
  })

  useEffect(() => {
    const root = document.documentElement
    root.setAttribute('data-theme', theme)
    root.setAttribute('data-palette', palette)
  }, [theme, palette])

  useEffect(() => { localStorage.setItem(LS_THEME, theme) }, [theme])
  useEffect(() => { localStorage.setItem(LS_PALETTE, palette) }, [palette])

  function toggleTheme() {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark')
  }

  function cyclePalette() {
    setPalette(prev => {
      const idx = PALETTES.findIndex(p => p.id === prev)
      return PALETTES[(idx + 1) % PALETTES.length].id
    })
  }

  const currentPalette = PALETTES.find(p => p.id === palette) ?? PALETTES[0]

  return (
    <ThemeContext.Provider value={{ theme, palette, currentPalette, toggleTheme, cyclePalette }}>
      {children}
    </ThemeContext.Provider>
  )
}

export default ThemeProvider