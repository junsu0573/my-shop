const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth.middleware");
const authController = require("../controllers/auth.controller");

// 로그인
router.post("/login", authController.loginUser);
// 토큰 검증
router.get("/me", authMiddleware.verifyToken, authController.getCurrentUser);

module.exports = router;
