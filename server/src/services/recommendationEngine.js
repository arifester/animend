const generateRecommendations = (userWishlist, candidateAnimeList) => {
    
    const userGenreProfile = {};
    const wishlistedIds = new Set();

    userWishlist.forEach(item => {
        wishlistedIds.add(item.animeId); // Track wishlist IDs to avoid recommending already wishlisted anime
        
        if (item.genres) {
            item.genres.forEach(genre => {
                if (userGenreProfile[genre.name]) {
                    userGenreProfile[genre.name] += 1;
                } else {
                    userGenreProfile[genre.name] = 1;
                }
            });
        }
    });

    // Score Candidates
    const recommendations = candidateAnimeList
        .filter(anime => !wishlistedIds.has(anime.mal_id)) // Exclude items already in wishlist
        .map(anime => {
            let matchScore = 0;

            // Calculate score based on genre matches against user profile
            if (anime.genres) {
                anime.genres.forEach(genre => {
                    if (userGenreProfile[genre.name]) {
                        // Add the genre frequency as weight to the score
                        matchScore += userGenreProfile[genre.name];
                    }
                });
            }

            matchScore += (anime.score || 0) * 0.5;

            return {
                ...anime,
                matchScore // Include score for debugging/sorting
            };
        })
        .sort((a, b) => b.matchScore - a.matchScore) // Sort by highest relevance
        .slice(0, 10); // Return top 10 recommendations

    return recommendations;
};

module.exports = { generateRecommendations };
