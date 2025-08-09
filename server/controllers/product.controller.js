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
      message:
        (error.message?.includes("E11000") && "중복된 SKU입니다.") ||
        "서버 오류입니다.",
      error: error.message,
    });
  }
};

// 프로덕트 검색
productController.getProduct = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;
    const search = req.query.name || "";

    // 검색 조건: name 필드에서 부분일치
    const filter = search
      ? { name: { $regex: search, $options: "i" } } // 대소문자 무시
      : {};

    const [products, total] = await Promise.all([
      Product.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Product.countDocuments(filter),
    ]);

    res.status(200).json({
      status: "success",
      data: products,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: "error", message: "상품 목록 조회 실패" });
  }
};

module.exports = productController;
