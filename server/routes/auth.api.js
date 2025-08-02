const express = require("express");
const router = express.Router();
const verifyToken = require("../middlewares/auth");

const authController = require("../controllers/auth.controller");

// 로그인
router.post("/login", authController.loginUser);
router.get("/me", verifyToken, authController.getCurrentUser);

module.exports = router;
