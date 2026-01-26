const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/authMiddleware');
const { addToWishlist, getWishlist, removeFromWishlist, getUserRecommendations } = require('../controllers/animeController');

// Protected Routes: User must be logged in
router.post('/wishlist', verifyToken, addToWishlist);
router.get('/wishlist', verifyToken, getWishlist);
router.delete('/wishlist/:animeId', verifyToken, removeFromWishlist);
router.get('/recommendations', verifyToken, getUserRecommendations);

module.exports = router;
