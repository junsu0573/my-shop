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

// 프로덕트 수정
router.put(
  "/:id",
  authMiddleware.verifyToken,
  authMiddleware.verifyAdmin,
  productController.updateProduct
);

// 프로덕트 삭제
router.delete(
  "/:id",
  authMiddleware.verifyToken,
  authMiddleware.verifyAdmin,
  productController.deleteProduct
);

module.exports = router;
