const express = require('express');
const router = express.Router();
const { addToWishlist, getWishlist } = require('../controllers/animeController');
const verifyToken = require('../middleware/authMiddleware');

// Protected Routes: User must be logged in
router.post('/wishlist', verifyToken, addToWishlist);
router.get('/wishlist', verifyToken, getWishlist);

module.exports = router;
