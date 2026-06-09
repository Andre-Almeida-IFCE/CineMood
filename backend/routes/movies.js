const express = require('express');
const router = express.Router();
const movieController = require('../controllers/movieController');

router.get('/trending', movieController.getTrending);
router.get('/search', movieController.search);
router.get('/surprise', movieController.surpriseMe);
router.get('/recommendations', movieController.getRecommendations);
router.get('/:id', movieController.getDetails);

module.exports = router;
