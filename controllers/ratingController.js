const Product = require('../models/Product');
const User = require('../models/User');
const Rating = require('../models/Rating');

const addRating = async (req, res) => {
    try {
        const productId = req.body.product; 
        const userId = req.body.user; 
        const ratingValue = req.body.rating;

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const rating = new Rating({
            rating: ratingValue,
            user: userId,
            product: productId
        });

        const result = await rating.save();
        res.status(201).json({
            message: 'Rating created',
            rating: result
        });
    } catch (err) {
        res.status(500).json({
            message: 'Rating not created',
            error: err
        });
    }
}

const getAverageRating = async (req, res) => {
    try {
        const productId = req.params.productId;

        const ratings = await Rating.find({ product: productId });

        if (!ratings) {
            return res.status(404).json({ message: 'Ratings not found' });
        }

        let sum = 0;
        ratings.forEach((rating) => {
            sum += rating.rating;
        })

        const averageRating = sum / ratings.length;

        const roundedAverageRating = averageRating.toFixed(2);

        res.json({
            averageRating: roundedAverageRating
        });
    } catch (err) {
        res.status(500).json({
            message: 'Error fetching average rating',
            error: err
        });
    }
}

const getRating = async (req, res) => {
    try{
        const productId = req.params.productId;
        const ratings = await Rating.find({ product: productId });
        res.json({
            ratings
        });
        }catch (err) {
            res.status(500).json({
                message: 'Error fetching rating',
                error: err
            });
        }
}

module.exports = {
    addRating,
    getAverageRating,
    getRating
}
