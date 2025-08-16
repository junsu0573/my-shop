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
productController.searchProduct = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;
    const search = req.query.name || "";
    const isRating = req.query.rating === "true";

    // 검색 조건: name 필드에서 부분일치
    const filter = search
      ? { name: { $regex: search, $options: "i" } } // 대소문자 무시
      : {};

    const sortOption = isRating ? { rating: -1 } : { createdAt: -1 };

    const [products, total] = await Promise.all([
      Product.find(filter).sort(sortOption).skip(skip).limit(limit),
      Product.countDocuments(filter),
    ]);

    res.status(200).json({
      status: "success",
      data: products,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "상품 목록 조회 실패",
      error: error.message,
    });
  }
};

// 프로덕트 수정
productController.updateProduct = async (req, res) => {
  try {
    const productId = req.params.id;
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

    const product = await Product.findByIdAndUpdate(
      productId,
      {
        sku,
        name,
        categoryId,
        part,
        weight,
        price,
        stock,
        description,
        imageUrl,
      },
      { new: true }
    );

    return res.status(200).json({ status: "success", product });
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

// 프로덕트 삭제
productController.deleteProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await Product.findByIdAndDelete(productId);
    return res.status(200).json({ status: "success", product });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "서버 오류입니다.",
      error: error.message,
    });
  }
};

// 프로덕트 조회
productController.getProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await Product.findById(productId);
    return res.status(200).json({ status: "success", product });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "서버 오류입니다.",
      error: error.message,
    });
  }
};

module.exports = productController;
