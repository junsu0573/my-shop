const mongoose = require("mongoose");
const Order = require("../models/Order");
const Product = require("../models/Product");
const Cart = require("../models/Cart");
const { generateOrderNum } = require("../utils/generator");

const orderController = {};

// 주문 생성
orderController.createOrder = async (req, res) => {
  // 세션 등록
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const userId = req.user?._id; // JWT 미들웨어 req.user._id

    const {
      products, // [{ productId, quantity }]
      reciever, // { name, phone }
      totalPrice,
      shippingAddress, // { address, detailAddress }
      orderMemo,
      clearCart = true, // 선택: true면 장바구니 비우기
    } = req.body;

    // 상품 조회
    const ids = products.map((p) => p.productId);
    const dbProducts = await Product.find({ _id: { $in: ids } })
      .session(session)
      .lean();
    const map = new Map(dbProducts.map((d) => [String(d._id), d]));
    const shortages = []; //

    // 재고 확인
    for (const item of products) {
      const pid = String(item.productId);
      const reqQty = Number(item.quantity || 0);
      const p = map.get(pid);

      if (p.stock < reqQty) {
        shortages.push({
          productId: pid,
          requested: reqQty,
          available: p.stock,
        });
      }
    }

    if (shortages.length > 0) {
      const error = new Error("일부 상품의 재고가 부족합니다.");
      error.code = 404;
      error.detail = shortages;
      throw error;
    }

    // 재고 차감
    for (const item of products) {
      const updated = await Product.updateOne(
        { _id: item.productId, stock: { $gte: item.quantity } },
        { $inc: { stock: -item.quantity } },
        { session }
      );
      if (updated.modifiedCount !== 1) {
        const error = new Error("일부 상품의 재고가 부족합니다.");
        error.code = 404;
        throw error;
      }
    }

    // 주문번호 생성
    const orderNum = await generateOrderNum(session);

    // 주문 저장
    const order = await Order.create(
      [
        {
          userId,
          products,
          orderNum,
          reciever,
          totalPrice,
          status: "pending",
          shippingAddress,
          orderMemo,
        },
      ],
      { session }
    );

    // 장바구니 비우기
    if (clearCart)
      await Cart.updateOne({ userId }, { $set: { products: [] } }, { session });

    await session.commitTransaction();
    session.endSession();

    res.status(201).json({ status: "success", order: order[0] });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({
      status: "error",
      message: "서버 오류입니다.",
      error: error.message,
      detail: error.detail,
    });
  }
};

// 유저 주문 가져오기
orderController.getUserOrders = async (req, res) => {
  try {
    userId = req.user._id;
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;

    const [orders, total] = await Promise.all([
      Order.find({ userId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate({
          path: "products.productId",
        })
        .lean(),
      Order.countDocuments({ userId }),
    ]);

    return res.status(200).json({
      status: "success",
      data: orders,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "서버 오류입니다.",
      error: error.message,
    });
  }
};

// 주문 검색
orderController.searchOrder = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 3;
    const skip = (page - 1) * limit;
    const search = req.query.name || "";

    // 검색 조건: name 필드에서 부분일치
    const filter = search
      ? {
          orderNum: {
            $regex: search,
            $options: "i",
          },
        }
      : {};

    const [orders, total] = await Promise.all([
      Order.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate({ path: "products.productId" })
        .populate({ path: "userId" })
        .lean(),
      Order.countDocuments(filter),
    ]);

    res.status(200).json({
      status: "success",
      data: orders,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "서버 오류입니다.",
      error: error.message,
    });
  }
};

module.exports = orderController;
