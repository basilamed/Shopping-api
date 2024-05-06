const express = require('express');
const CommentController = require('../controllers/commentController');
const router = express.Router();

router.post('/add', CommentController.addComment);
router.get('/get-all', CommentController.getAllComments);
router.get('/get-comments-for-product/:productId', CommentController.getCommentsForProduct);
router.delete('/delete/:commentId', CommentController.deleteComment);

module.exports = router;
