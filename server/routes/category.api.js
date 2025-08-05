const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth.middleware");
const categoryController = require("../controllers/category.controller");

// 카테고리 생성
router.post(
  "/",
  authMiddleware.verifyToken,
  authMiddleware.verifyAdmin,
  categoryController.createCategory
);
// 카테고리 불러오기
router.get("/", categoryController.getCategories);

module.exports = router;
