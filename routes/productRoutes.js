const express = require("express");
const ProductController = require("../controllers/productController");
const router = express.Router();

router.get("/get-all", ProductController.getAll);
router.get("/get-by-id/:productId", ProductController.getById);
router.post("/add", ProductController.addProduct);
router.put("/update/:productId", ProductController.updateById);
router.delete("/delete/:productId", ProductController.deleteProduct);
router.get("/liked-products/:userId", ProductController.likedProducts);
router.get("/get-by-barcode/:barCode", ProductController.getByBarcode);
router.get("/get-all-user-products/:userId", ProductController.allUserProducts);
router.get("/get-products-by-type/:categoryId", ProductController.getProductsByType);

module.exports = router;

