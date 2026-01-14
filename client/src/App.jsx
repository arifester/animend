import { Routes, Route } from "react-router-dom"
import Navbar from "@/components/Navbar"
import Home from "@/pages/Home"
import AnimeDetail from "@/pages/AnimeDetail"
import Search from "@/pages/Search"

function App() {
  const currentYear = new Date().getFullYear();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 font-sans selection:bg-indigo-500/30">
      
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        
        <Route path="/anime/:id" element={<AnimeDetail />} />

        <Route path="/search/:query" element={<Search />} />
      </Routes>
      
      <footer className="py-8 text-center border-t border-slate-900 mt-auto">
        <p className="text-xs text-slate-600 font-medium tracking-widest uppercase">
          &copy; {currentYear} Animend Project
        </p>
      </footer>
    </div>
  )
}

export default App
