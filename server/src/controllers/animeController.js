const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { generateRecommendations } = require('../services/recommendationEngine');

const addToWishlist = async (req, res) => {
    const { animeId, title, image, score, genres } = req.body;
    const userId = req.userId; // Provided by authMiddleware

    try {
        // Check if the item already exists for this user
        const existingItem = await prisma.wishlistItem.findFirst({
            where: { userId, animeId }
        });

        if (existingItem) {
            return res.status(400).json({ message: "Anime already in wishlist." });
        }

        // Create new wishlist entry
        const newItem = await prisma.wishlistItem.create({
            data: {
                userId,
                animeId, animeId: parseInt(animeId),
                title,
                image,
                score: parseFloat(score),
                genres: genres
            }
        });

        res.status(201).json({ message: "Added to wishlist successfully.", data: newItem });
    } catch (error) {
        console.error("Wishlist Add Error:", error);
        res.status(500).json({ message: "Failed to add to wishlist." });
    }
};

const getWishlist = async (req, res) => {
    const userId = req.userId;

    try {
        const wishlist = await prisma.wishlistItem.findMany({
            where: { userId },
            orderBy: { addedAt: 'desc' }
        });
        res.json({ data: wishlist });
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch wishlist." });
    }
};

const removeFromWishlist = async (req, res) => {
    const { animeId } = req.params; // Get ID from URL
    const userId = req.userId;

    try {
        const result = await prisma.wishlistItem.deleteMany({
            where: {
                userId: userId,
                animeId: parseInt(animeId)
            }
        });

        if (result.count === 0) {
            return res.status(404).json({ message: "Item not found in your wishlist." });
        }

        res.json({ message: "Removed from wishlist successfully." });
    } catch (error) {
        console.error("Delete Error:", error);
        res.status(500).json({ message: "Failed to remove item." });
    }
};

const getUserRecommendations = async (req, res) => {
    const userId = req.userId;

    try {
        // Fetch User's Wishlist (including saved genres)
        const userWishlist = await prisma.wishlistItem.findMany({
            where: { userId },
            select: { 
                animeId: true,
                genres: true 
            }
        });

        // Fetch Candidates (Top Anime from Jikan)
        const response = await fetch('https://api.jikan.moe/v4/top/anime?limit=25');
        const data = await response.json();
        const candidateList = data.data;

        // Process with Recommendation Engine
        const recommendations = generateRecommendations(userWishlist, candidateList);

        res.json({ data: recommendations });

    } catch (error) {
        console.error("Recommendation Error:", error);
        res.status(500).json({ message: "Failed to generate recommendations." });
    }
};

module.exports = { addToWishlist, getWishlist, removeFromWishlist, getUserRecommendations };
