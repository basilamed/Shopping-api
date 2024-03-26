const Comment = require('../models/Comment');
const Product = require('../models/Product');
const User = require('../models/User');

const addComment = async (req, res) => {
    try {
        //create a comment
        const productId = req.body.product;
        const userId = req.body.user;
        const content = req.body.content;

        const comment = new Comment({
            content: content,
            product: productId,
            user: userId
        });

        const savedComment = await comment.save();

        await Product.findByIdAndUpdate(productId, { $push: { comments: savedComment._id } });

        await User.findByIdAndUpdate(userId, { $push: { comments: savedComment._id } });

        res.status(201).json({
            message: 'Comment added to product',
            comment: savedComment
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Comment not created',
            error: err
        });
    }
}

const deleteComment = async (req, res) => {
    try {
        const commentId = req.params.commentId;

        const comment = await Comment.findById(commentId);

        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        const productId = comment.product;

        await Product.findByIdAndUpdate(productId, { $pull: { comments: commentId } });

        await Comment.findByIdAndDelete(commentId);

        res.json({ message: 'Comment deleted successfully', deletedComment: comment });
    } catch (err) {
        res.status(500).json({
            message: 'Error deleting comment',
            error: err
        });
    }
};

const getCommentsForProduct = async (req, res) => {
  try {
    const productId = req.params.productId;

    const comments = await Comment.find({ product: productId })
      .populate('user')
      .populate('product')
      .exec();

    // if (comments.length === 0) {
    //   return res.status(404).json({ message: 'No comments found for the product' });
    // }

    res.json(comments);

  } catch (err) {
    console.error('Error fetching comments for the product:', err);
    res.status(500).json({
      message: 'Error fetching comments for the product',
      error: err
    });
  }
};

  const getAllComments = async (req, res) => {
    try {
      const comments = await Comment.find({}).populate('user')
      .populate('product')
      .exec();
      res.json(comments);
    } catch (err) {
      res.status(500).json({
        message: 'Error fetching comments',
        error: err
      });
    }
  };
  
module.exports = {
    addComment,
    deleteComment,
    getCommentsForProduct,
    getAllComments
}