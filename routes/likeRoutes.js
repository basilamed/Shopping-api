const express = require('express');
const LikeController = require('../controllers/likeController');
const router = express.Router();

router.post('/add', LikeController.addLike);
router.get('/get-all', LikeController.getLikes);
router.delete('/delete/:id', LikeController.removeLike);

module.exports = router;