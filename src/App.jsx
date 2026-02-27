import LanguageProvider from './context/LanguageProvider'
import Header from './components/Header'
import Hero from './components/Hero'
import Experience from './components/Experience'
import Skills from './components/Skills'
import HTBMachines from './components/HTBMachines'
import HTBAcademy from './components/HTBAcademy'
import Footer from './components/Footer'

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
            <div className="py-16"><HTBMachines /></div>
            <div className="pt-16"><HTBAcademy /></div>
          </div>
        </main>
        <Footer />
      </div>
    </LanguageProvider>
  )
}

export default App