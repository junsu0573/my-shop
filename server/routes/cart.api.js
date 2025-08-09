const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth.middleware");
const cartConroller = require("../controllers/cart.controller");

// 장바구니 추가
router.post("/", authMiddleware.verifyToken, cartConroller.addToCart);

// 장바구니 조회
router.get("/:id", cartConroller.getCart);

module.exports = router;
