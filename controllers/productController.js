const Product = require('../models/Product');
const User = require('../models/User');
const Like = require('../models/Like');

const addProduct = async (req, res) => {
    try {
        const product = new Product({
            name: req.body.name,
            image: req.body.image,
            description: req.body.description,
            barCode: req.body.barCode,
            user: req.body.user,
            type: req.body.type,
            company: req.body.company,
            price: req.body.price,
            discount: req.body.discount
        });
        const result = await product.save();
        res.status(201).json({
            message: 'Product created',
            product: result
        });
    } catch (err) {
        res.status(500).json({
            message: 'Product not created',
            error: err
        });
    }
};

const getAll = async (req, res) => {
    try {
        const products = await Product.find({});
        
        res.json(products);
    } catch (err) {
        res.status(500).json({
            message: 'Error fetching products',
            error: err
        });
    }
}

const getById = async (req, res) => {
    try {
        const productId = req.params.productId;
        console.log('Product ID:', productId);
        const product = await Product.findById(productId).populate('comments')
        .populate('ratings') 
        .populate('user') 
        .exec();
        
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.json(product);
    } catch(err) {
        res.status(500).json({
            message: 'Error fetching product',
            error: err
        });
    }
}

const deleteProduct = async (req, res) => {
    try {
      const productId = req.params.productId;
      const deletedProduct = await Product.findByIdAndDelete(productId);
  
      if (!deletedProduct) {
        return res.status(404).json({ message: 'Product not found' });
      }
  
      res.json({ message: 'Product deleted successfully', deletedProduct });
    } catch (err) {
      res.status(500).json({
        message: 'Error deleting product',
        error: err,
      });
    }
  };

const updateById = async (req, res) => {
    try {
        const productId = req.params.productId;
        const updatedProduct = await Product.findByIdAndUpdate(
            productId,
            req.body,
            { new: true }
        );

        if (!updatedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.json({ message: 'Product updated successfully', updatedProduct });
    } catch(err) {
        res.status(500).json({
            message: 'Error updating product',
            error: err
        });
    }
}

const getProductsByType = async (req, res) => {
    try {
        const typeId = req.params.categoryId;
        const products = await Product.find({ type: typeId });
        res.json(products);
    } catch (err) {
        res.status(500).json({
            message: 'Error fetching products',
            error: err
        });
    }
}

const allUserProducts = async (req, res) => {
    try {
        const userId = req.params.userId;
        const products = await Product.find({ user: userId });
        res.json(products);
    } catch (err) {
        res.status(500).json({
            message: 'Error fetching products',
            error: err
        });
    }
}

const likedProducts = async (req, res) => {
    try {
        const userId = req.params.userId;
        
        const likes = await Like.find({ user: userId }).populate('product');
        let productIdsArray = [];
        likes.forEach((like) => {
            productIdsArray.push(like.product._id);
        });
        const products = await Product.find({ _id: { $in: productIdsArray } });
        res.json({ likedProducts: products });

    } catch (err) {
        console.error('Error fetching products:', err);
        res.status(500).json({
            message: 'Error fetching products',
            error: err
        });
    }
}

const getByBarcode = async (req, res) => {
    try {
      const barCode = req.params.barCode;
      console.log('Product barcode:', barCode);
  
      const products = await Product.find({ barCode }).populate('comments')
      .populate('ratings') 
      .populate('user') 
      .exec();
  
      if (products.length === 0) {
        return res.status(404).json({ message: 'Products not found for the given barcode' });
      }
  
      res.json(products);
    } catch (err) {
        console.log(err);
      res.status(500).json({
        message: 'Error fetching products by barcode',
        error: err
      });
    }
  };
  
module.exports = {
    addProduct,
    getAll,
    getById,
    deleteProduct,
    updateById,
    getProductsByType,
    allUserProducts,
    likedProducts,
    getByBarcode
}