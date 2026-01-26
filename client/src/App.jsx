import { Routes, Route } from "react-router-dom"
import Navbar from "@/components/Navbar"
import Home from "@/pages/Home"
import AnimeDetail from "@/pages/AnimeDetail"
import Search from "@/pages/Search"
import Login from "@/pages/Login"
import Register from "@/pages/Register"
import Wishlist from "@/pages/Wishlist";
import Popular from "@/pages/Popular";
import { Toaster } from "@/components/ui/sonner"

function App() {
  const currentYear = new Date().getFullYear();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 font-sans selection:bg-indigo-500/30">
      
      <Navbar />

      <Routes>
        {/* Main Pages */}
        <Route path="/" element={<Home />} />
        <Route path="/anime/:id" element={<AnimeDetail />} />
        <Route path="/search/:query" element={<Search />} />
        
        {/* Authentication */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected / Other Pages */}
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/popular" element={<Popular />} />
      </Routes>
      
      <footer className="py-8 text-center border-t border-slate-900 mt-auto">
        <p className="text-xs text-slate-600 font-medium tracking-widest uppercase">
          &copy; {currentYear} Animend Project
        </p>
      </footer>

      <Toaster 
        position="bottom-right" 
        theme="dark"
        richColors
        duration={1500}
        closeButton
      />
    </div>
  )
}

export default App
