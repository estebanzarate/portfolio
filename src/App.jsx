import { lazy, Suspense } from 'react'
import LanguageProvider from './context/LanguageProvider'
import Header from './components/Header'
import Hero from './components/Hero'
import Experience from './components/Experience'
import Skills from './components/Skills'
import Footer from './components/Footer'
import ScrollToTop from './components/ScrollToTop'

const HTBMachines = lazy(() => import('./components/HTBMachines'))
const HTBAcademy = lazy(() => import('./components/HTBAcademy'))
const THMRooms = lazy(() => import('./components/THMRooms'))

function SectionFallback() {
  return (
    <div className="flex items-center justify-center py-24">
      <div className="flex flex-col items-center gap-3">
        <div className="w-6 h-6 rounded-full border-2 border-primary border-t-transparent animate-spin" />
        <span className="text-secondary text-sm">Cargando...</span>
      </div>
    </div>
  )
}

function App() {
  return (
    <LanguageProvider>
      <div className="min-h-screen bg-bg text-light font-sans flex flex-col">
        <Header />
        <main className="max-w-5xl w-full mx-auto px-4 py-10 flex-1">
          <div className="flex flex-col divide-y divide-surface2">
            <div className="pb-16"><Hero /></div>
            <div className="py-16"><Experience /></div>
            <div className="py-16"><Skills /></div>
            <div className="py-16">
              <Suspense fallback={<SectionFallback />}>
                <HTBMachines />
              </Suspense>
            </div>
            <div className="py-16">
              <Suspense fallback={<SectionFallback />}>
                <HTBAcademy />
              </Suspense>
            </div>
            <div className="pt-16">
              <Suspense fallback={<SectionFallback />}>
                <THMRooms />
              </Suspense>
            </div>
          </div>
        </main>
        <Footer />
        <ScrollToTop />
      </div>
    </LanguageProvider>
  )
}

export default App