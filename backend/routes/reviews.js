const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/', authMiddleware, reviewController.create);
router.get('/feed', reviewController.getCommunityFeed);
router.get('/stats/me', authMiddleware, reviewController.getStats);
router.get('/movie/:movieId', reviewController.getByMovie);

module.exports = router;
