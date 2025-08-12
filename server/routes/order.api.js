const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth.middleware");
const orderController = require("../controllers/order.controller");

// 주문 생성
router.post("/", authMiddleware.verifyToken, orderController.createOrder);

module.exports = router;
