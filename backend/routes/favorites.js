const express = require('express');
const router = express.Router();
const favoriteController = require('../controllers/favoriteController');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/', authMiddleware, favoriteController.list);
router.post('/', authMiddleware, favoriteController.add);
router.delete('/:movieId', authMiddleware, favoriteController.remove);
router.get('/community/popular', favoriteController.getCommunityFavorites);

module.exports = router;
