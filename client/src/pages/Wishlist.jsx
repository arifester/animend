import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import AnimeCard from "@/components/AnimeCard";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { toast } from "sonner"

const Wishlist = () => {
    const [wishlist, setWishlist] = useState([]);
    const [loading, setLoading] = useState(true);
    const { token } = useAuth();

    // Fetch Wishlist
    useEffect(() => {
        const fetchWishlist = async () => {
            try {
                const response = await fetch("http://localhost:5000/api/anime/wishlist", {
                    headers: { "Authorization": `Bearer ${token}` }
                });
                const data = await response.json();
                setWishlist(data.data || []); // Ensure it's an array
            } catch (error) {
                console.error("Failed to fetch wishlist", error);
            } finally {
                setLoading(false);
            }
        };

        if (token) fetchWishlist();
    }, [token]);

    // Handle Remove
    const handleRemove = async (animeId) => {
        try {
            const response = await fetch(`http://localhost:5000/api/anime/wishlist/${animeId}`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${token}` }
            });

            if (response.ok) {
                // Remove from UI
                setWishlist(wishlist.filter(item => item.animeId !== animeId));

                // Show Success Toast
                toast.success("Removed from Wishlist", {
                    description: "The anime has been removed from your collection.",
                });
            } else {
                toast.error("Failed to remove item.");
            }
        } catch (error) {
            console.error("Error removing item:", error);
            toast.error("Something went wrong.");
        }
    };

    if (loading) return <div className="text-center py-20 text-slate-500">Loading your collection...</div>;

    return (
        <div className="min-h-screen bg-slate-950 text-slate-50 pt-32 px-6 pb-20">
            <div className="max-w-7xl mx-auto">
                
                <div className="mb-8 border-b border-slate-800 pb-4 flex justify-between items-end">
                    <div>
                        <h1 className="text-3xl font-bold text-white">My Wishlist</h1>
                        <p className="text-slate-400 mt-1">Manage your saved anime collection</p>
                    </div>
                    <div className="text-slate-500 text-sm font-medium">
                        {wishlist.length} Items
                    </div>
                </div>

                {wishlist.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                        {wishlist.map((item) => (
                            <div key={item.id} className="relative group">
                                {/* Reuse existing AnimeCard */}
                                <AnimeCard 
                                    id={item.animeId} // Ensure pass the Jikan ID, not the DB ID
                                    title={item.title}
                                    image={item.image}
                                    score={item.score}
                                />
                                
                                {/* Remove Button (Overlay or Below) */}
                                <Button 
                                    variant="destructive" 
                                    size="sm"
                                    className="w-full mt-2 bg-red-900/50 hover:bg-red-600 text-red-200 hover:text-white border border-red-900"
                                    onClick={() => handleRemove(item.animeId)}
                                >
                                    Remove
                                </Button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-slate-900/30 rounded-xl border border-dashed border-slate-800">
                        <h3 className="text-xl font-bold text-slate-300">Your wishlist is empty</h3>
                        <p className="text-slate-500 mt-2">Start exploring to find your next favorite!</p>
                        <Link to="/">
                            <Button className="mt-6 bg-indigo-600 hover:bg-indigo-700">Explore Anime</Button>
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Wishlist;
