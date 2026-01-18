import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const Navbar = () => {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    // If the Enter key is pressed and the text is not empty
    if (e.key === 'Enter' && query.trim() !== "") {
      navigate(`/search/${query}`); // Move to page /search/naruto
      setQuery(""); // Empty input fields after search
    }
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-slate-950/80 backdrop-blur-md">
      <div className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto gap-4">
        
        {/* Logo */}
        <Link to="/" className="text-xl font-bold tracking-tight text-slate-100 cursor-pointer flex-shrink-0">
          Animend
        </Link>

        {/* Search Bar (Middle/Right) */}
        <div className="relative w-full max-w-md hidden sm:block">
            <Input 
                type="text" 
                placeholder="Search anime..." 
                className="bg-slate-900/50 border-slate-800 text-slate-200 placeholder:text-slate-600 focus-visible:ring-indigo-500 rounded-full px-4"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleSearch}
            />
        </div>

        {/* Menu & Login */}
        <div className="flex items-center gap-4 flex-shrink-0">
            <div className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-400">
                <Link to="/" className="hover:text-indigo-400 transition-colors">Home</Link>
                <Link to="#" className="hover:text-indigo-400 transition-colors">Popular</Link>
            </div>
            
            <Button variant="ghost" className="text-slate-300 hover:text-white hover:bg-slate-700 hidden md:inline-flex">
                Sign In
            </Button>
        </div>

      </div>
      
      {/* Mobile Search Bar (Appears below the navbar on small screens) */}
      <div className="sm:hidden px-6 pb-4">
        <Input 
            type="text" 
            placeholder="Search anime..." 
            className="bg-slate-900/50 border-slate-800 text-slate-200 placeholder:text-slate-600 focus-visible:ring-indigo-500 rounded-full px-4"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleSearch}
        />
      </div>
    </nav>
  )
}

export default Navbar
