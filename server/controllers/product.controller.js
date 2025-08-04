const Product = require("../models/Product");

const productController = {};

// 프로덕트 생성
productController.createProduct = async (req, res) => {
  try {
    const {
      sku,
      name,
      categoryId,
      part,
      weight,
      price,
      stock,
      description,
      imageUrl,
    } = req.body;

    const product = await Product.create({
      sku,
      name,
      categoryId,
      part,
      weight,
      price,
      stock,
      description,
      imageUrl,
    });

    return res.status(201).json({ status: "success", product });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "서버 오류입니다.",
      error: error.message,
    });
  }
};

module.exports = productController;
