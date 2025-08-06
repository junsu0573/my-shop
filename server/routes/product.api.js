const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth.middleware");
const productController = require("../controllers/product.controller");

// 프로덕트 생성
router.post(
  "/",
  authMiddleware.verifyToken,
  authMiddleware.verifyAdmin,
  productController.createProduct
);

// 프로덕트 검색
router.get("/", productController.getProduct);

module.exports = router;
