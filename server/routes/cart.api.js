const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth.middleware");
const cartController = require("../controllers/cart.controller");

// 장바구니 추가
router.post("/", authMiddleware.verifyToken, cartController.addToCart);

// 장바구니 조회
router.get("/:id", authMiddleware.verifyToken, cartController.getCart);

// 장바구니 상품 수정
router.put(
  "/:id/items/:productId",
  authMiddleware.verifyToken,
  cartController.udpateItemQuantity
);

// 장바구니 상품 삭제
router.delete(
  "/:id/items/:productId",
  authMiddleware.verifyToken,
  cartController.deleteItem
);

module.exports = router;
