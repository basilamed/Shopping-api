const express = require('express');
const RatingController = require('../controllers/ratingController');
const router = express.Router();

router.post('/add', RatingController.addRating);
router.get('/get-average-rating/:productId', RatingController.getAverageRating);
router.get('/get-rating/:productId', RatingController.getRating);

module.exports = router;
