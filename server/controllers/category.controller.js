const Category = require("../models/Category");

const categoryController = {};

// 카테고리 생성
categoryController.createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const category = await Category.create({ name });

    return res.status(201).json({ status: "success", category });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "서버 오류입니다.",
      error: error.message,
    });
  }
};

// 카테고리 불러오기
categoryController.getCategories = async (req, res) => {
  try {
    const categories = await Category.find();

    return res.status(201).json({ status: "success", categories });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "서버 오류입니다.",
      error: error.message,
    });
  }
};

module.exports = categoryController;
