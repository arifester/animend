import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import AnimeCard from "@/components/AnimeCard"
import { Link } from "react-router-dom"
import { useAuth } from "@/context/AuthContext" // Import Auth

const Home = () => {
  const [data, setData] = useState([]); // Renamed from 'topAnime' to generic 'data'
  const [loading, setLoading] = useState(true);
  const { user, token } = useAuth(); // Access user state

  useEffect(() => {
    document.title = "Animend - Discover Your Next Favorite";

    const fetchData = async () => {
      setLoading(true);
      try {
        // Default Endpoint (Public/Guest)
        let endpoint = 'https://api.jikan.moe/v4/top/anime?limit=10';
        let headers = {};

        // Conditional Logic: If logged in, fetch from our Local Backend API
        if (user && token) {
            endpoint = 'http://localhost:5000/api/anime/recommendations';
            headers = { "Authorization": `Bearer ${token}` };
        }

        const response = await fetch(endpoint, { headers });
        const result = await response.json();

        // Both Jikan and our API return { data: [...] } structure
        setData(result.data);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, token]); // Re-fetch when user logs in/out

  return (
    <>
      {/* Hero Section */}
      <div className="flex flex-col items-center px-4 pt-32 pb-12 text-center max-w-3xl mx-auto space-y-6">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
          Discover Your Next <span className="text-indigo-500">Favorite</span>
        </h1>
        <p className="text-slate-400 text-lg leading-relaxed max-w-xl">
          Powered by Jikan API & Machine Learning to provide the best anime recommendations tailored just for you.
        </p>
      </div>

      {/* Content Section */}
      <main className="px-6 pb-20 max-w-7xl mx-auto">
        <div className="flex justify-between items-end mb-8 border-b border-slate-800 pb-4">
          <div>
            {/* Dynamic Heading based on Auth Status */}
            <h2 className="text-2xl font-bold text-slate-100">
                {user ? `Recommended for ${user.username}` : "Top Trending"}
            </h2>
            <p className="text-slate-500 text-sm mt-1">
                {user ? "Curated based on your preferences" : "Most popular anime right now"}
            </p>
          </div>
          
          <Link to="/popular">
            <Button variant="outline" className="bg-slate-800/50 text-slate-200 hover:bg-slate-700 hover:text-white border-none">
              View All
            </Button>
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 animate-pulse">
             {[...Array(10)].map((_, i) => (
                <div key={i} className="aspect-3/4 bg-slate-900 rounded-md"></div>
             ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {data.map((anime) => (
              <AnimeCard 
                key={anime.mal_id}
                id={anime.mal_id}
                title={anime.title}
                image={anime.images.webp.large_image_url}
                score={anime.score}
              />
            ))}
          </div>
        )}
      </main>
    </>
  )
}

export default Home
