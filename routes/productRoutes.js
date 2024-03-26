const express = require("express");
const ProductController = require("../controllers/productController");
const router = express.Router();

router.get("/get-all", ProductController.getAll);
router.get("/get-by-id/:id", ProductController.getById);
router.post("/add", ProductController.addProduct);
router.put("/update/:id", ProductController.updateById);
router.delete("/delete/:id", ProductController.deleteProduct);
router.get("/liked-products/:userId", ProductController.likedProducts);
router.get("/get-by-barcode/:barCode", ProductController.getByBarcode);
router.get("/get-all-user-products/:userId", ProductController.allUserProducts);
router.get("/get-products-by-type/:typeId", ProductController.getProductsByType);

module.exports = router;

