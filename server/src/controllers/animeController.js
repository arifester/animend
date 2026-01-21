const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * Add an anime to the user's wishlist
 */
const addToWishlist = async (req, res) => {
    const { animeId, title, image, score } = req.body;
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
                score: parseFloat(score)
            }
        });

        res.status(201).json({ message: "Added to wishlist successfully.", data: newItem });
    } catch (error) {
        console.error("Wishlist Add Error:", error);
        res.status(500).json({ message: "Failed to add to wishlist." });
    }
};

/**
 * Get all wishlist items for the authenticated user
 */
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

module.exports = { addToWishlist, getWishlist };
