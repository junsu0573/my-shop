const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth.middleware");
const cartConroller = require("../controllers/cart.controller");

// 장바구니 추가
router.post("/", authMiddleware.verifyToken, cartConroller.addToCart);

// 장바구니 조회
router.get("/:id", authMiddleware.verifyToken, cartConroller.getCart);

// 장바구니 상품 수정
router.put(
  "/:id/items/:productId",
  authMiddleware.verifyToken,
  cartConroller.udpateItemQuantity
);

// 장바구니 상품 삭제
router.delete(
  "/:id/items/:productId",
  authMiddleware.verifyToken,
  cartConroller.deleteItem
);

module.exports = router;
