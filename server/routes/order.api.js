const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth.middleware");
const orderController = require("../controllers/order.controller");

// 주문 생성
router.post("/", authMiddleware.verifyToken, orderController.createOrder);

// 유저 주문 가져오기
router.get("/user", authMiddleware.verifyToken, orderController.getUserOrders);

// 주문 검색
router.get(
  "/",
  authMiddleware.verifyToken,
  authMiddleware.verifyAdmin,
  orderController.searchOrder
);

module.exports = router;
