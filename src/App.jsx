import { BrowserRouter, Routes, Route } from "react-router-dom";

import LanguageProvider from "./context/LanguageProvider";

import Header from "./components/Header";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import ShareFAB from "./components/ShareFAB";
import ErrorBoundary from "./components/ErrorBoundary";

import Home from "./pages/Home";
import About from "./pages/About";
import Skills from "./pages/Skills";
import Labs from "./pages/Labs";

function AppContent() {
  return (
    <div className="min-h-screen bg-bg text-light">
      <Header />

      <main className="max-w-5xl mx-auto px-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/skills" element={<Skills />} />
          <Route path="/labs" element={<Labs />} />
        </Routes>
      </main>

      <Footer />
      <ScrollToTop />
      <ShareFAB />
    </div>
  );
}

function App() {
  return (
    <LanguageProvider>
      <BrowserRouter>
        <ErrorBoundary>
          <AppContent />
        </ErrorBoundary>
      </BrowserRouter>
    </LanguageProvider>
  );
}

export default App;
