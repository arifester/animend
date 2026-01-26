import { useEffect, useState, useRef } from "react"
import { useParams } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/context/AuthContext"

const AnimeDetail = () => {
  const { id } = useParams();
  const [anime, setAnime] = useState(null);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();
  
  const trailerRef = useRef(null);

  useEffect(() => {
    const fetchAnimeDetail = async () => {
      try {
        setLoading(true);
        const response = await fetch(`https://api.jikan.moe/v4/anime/${id}/full`);
        const data = await response.json();
        setAnime(data.data);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch anime details:", error);
        setLoading(false);
      }
    };

    fetchAnimeDetail();
    window.scrollTo(0, 0);
  }, [id]);

  useEffect(() => {
    if (anime) {
        document.title = `${anime.title} | Animend`;
    }
  }, [anime]);

  const handleAddToWishlist = async () => {
    if (!token) {
        alert("Please login first to save this anime!");
        return;
    }

    try {
        const response = await fetch("http://localhost:5000/api/anime/wishlist", {
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                animeId: anime.mal_id,
                title: anime.title,
                image: anime.images.webp.large_image_url,
                score: anime.score,

                genres: anime.genres.map(g => ({
                    mal_id: g.mal_id,
                    name: g.name
                }))
            }),
        });

        const data = await response.json();

        if (response.ok) {
            alert("Success! Added to your wishlist.");
        } else {
            alert(data.message || "Failed to add.");
        }
    } catch (error) {
        console.error("Wishlist error:", error);
        alert("Something went wrong.");
    }
  };

  // Function to scroll to the trailer section
  const scrollToTrailer = () => {
    if (trailerRef.current) {
        trailerRef.current.scrollIntoView({ behavior: "smooth" });
    } else {
        alert("No trailer available for this anime.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-500">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="h-12 w-12 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin"></div>
          <p>Loading Anime Data...</p>
        </div>
      </div>
    );
  }

  if (!anime) {
    return <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">Anime Not Found</div>;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 pb-20">
      
      {/* Hero Section */}
      <div className="relative h-[40vh] md:h-[50vh] w-full overflow-hidden">
        <div 
            className="absolute inset-0 bg-cover bg-center blur-xl opacity-50 scale-110"
            style={{ backgroundImage: `url(${anime.images.webp.large_image_url})` }}
        ></div>
        <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-slate-950/60 to-transparent"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 -mt-32 md:-mt-48">
        <div className="flex flex-col md:flex-row gap-8">
          
          {/* Left Column */}
          <div className="shrink-0 mx-auto md:mx-0 w-64 md:w-72 space-y-6">
            <div className="rounded-lg overflow-hidden shadow-2xl shadow-indigo-500/20 border border-slate-800">
              <img 
                src={anime.images.webp.large_image_url} 
                alt={anime.title} 
                className="w-full h-auto object-cover"
              />
            </div>

            <div className="grid grid-cols-1 gap-3">
              <Button 
                onClick={handleAddToWishlist} 
                className="w-full bg-indigo-600 hover:bg-indigo-700 font-bold">
                Add to Wishlist
              </Button>
              {/* Added onClick functionality */}
              <Button 
                onClick={scrollToTrailer}
                className="w-full bg-white text-slate-900 font-bold hover:bg-slate-200">
                Watch Trailer
              </Button>
            </div>

            <div className="bg-slate-900/50 p-5 rounded-lg border border-slate-800 space-y-4 text-sm">
                <div>
                    <span className="block text-slate-500 text-xs uppercase tracking-wider font-bold">Format</span>
                    <span className="text-slate-200">{anime.type} ({anime.episodes || "?"} eps)</span>
                </div>
                <div>
                    <span className="block text-slate-500 text-xs uppercase tracking-wider font-bold">Status</span>
                    <span className="text-slate-200">{anime.status}</span>
                </div>
                <div>
                    <span className="block text-slate-500 text-xs uppercase tracking-wider font-bold">Studio</span>
                    <span className="text-indigo-400">{anime.studios?.[0]?.name || "-"}</span>
                </div>
                <div>
                    <span className="block text-slate-500 text-xs uppercase tracking-wider font-bold">Season</span>
                    <span className="text-slate-200 capitalize">{anime.season} {anime.year}</span>
                </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="flex-1 space-y-8 pt-4 md:pt-0 text-center md:text-left">
            <div className="space-y-4">
                <div className="flex flex-col md:flex-row md:items-end gap-4 justify-center md:justify-start">
                    <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-tight">
                        {anime.title_english || anime.title}
                    </h1>
                    <div className="flex items-center gap-1 bg-yellow-500/10 border border-yellow-500/20 px-3 py-1 rounded-full text-yellow-500 font-bold text-lg w-fit mx-auto md:mx-0">
                        ⭐ <span>{anime.score}</span>
                    </div>
                </div>
                <p className="text-lg text-slate-400 italic font-medium">
                    {anime.title_japanese}
                </p>
            </div>

            <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                {anime.genres.map((genre) => (
                    <Badge 
                        key={genre.mal_id} 
                        variant="secondary"
                        className="px-3 py-1 text-xs hover:bg-indigo-500 hover:text-white transition-colors cursor-default"
                    >
                        {genre.name}
                    </Badge>
                ))}
            </div>

            <div className="space-y-3">
                <h3 className="text-xl font-bold border-l-4 border-indigo-500 pl-3">Synopsis</h3>
                <p className="text-slate-300 leading-relaxed text-base/7 bg-slate-900/30 p-6 rounded-xl border border-white/5">
                    {anime.synopsis}
                </p>
            </div>

            {anime.trailer?.embed_url && (
                <div ref={trailerRef} className="space-y-3 scroll-mt-32">
                    <h3 className="text-xl font-bold border-l-4 border-indigo-500 pl-3">Trailer</h3>
                    <div className="aspect-video w-full rounded-xl overflow-hidden bg-black border border-slate-800 shadow-2xl">
                        <iframe 
                            src={`${anime.trailer.embed_url}?autoplay=0`}
                            title="Trailer"
                            className="w-full h-full"
                            allowFullScreen
                        ></iframe>
                    </div>
                </div>
            )}
          </div>

        </div>
      </div>
    </div>
  )
}

export default AnimeDetail
