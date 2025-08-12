const Cart = require("../models/Cart");

const cartController = {};

// 장바구니 추가
cartController.addToCart = async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;

    // 유저의 장바구니 찾기
    let cart = await Cart.findOne({ userId });

    if (!cart) {
      // 장바구니가 없으면 새로 생성
      cart = new Cart({
        userId,
        products: [{ productId, quantity }],
      });
    } else {
      // 기존 장바구니에 같은 상품이 있는지 확인
      const productIndex = cart.products.findIndex(
        (item) => item.productId.toString() === productId
      );

      if (productIndex > -1) {
        // 이미 있으면 에러
        return res
          .status(404)
          .json({ status: "error", message: "이미 카트에 담긴 상품입니다." });
      } else {
        // 없으면 새로 추가
        cart.products.push({ productId, quantity });
      }
    }

    await cart.save();
    return res
      .status(200)
      .json({ status: "success", cart, cartQty: cart.products.length });
  } catch (error) {
    return res.status(500).json({ status: "error", message: error.message });
  }
};

// 장바구니 조회
cartController.getCart = async (req, res) => {
  try {
    const userId = req.params.id;

    const cart = await Cart.findOne({ userId }).populate("products.productId");
    if (!cart || cart.products.length === 0) {
      return res.status(200).json({ status: "success", cartQty: 0 });
    }

    return res
      .status(200)
      .json({ status: "success", cart, cartQty: cart.products.length });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "서버 오류입니다.",
      error: error.message,
    });
  }
};

// 장바구니 상품 수량 수정
cartController.udpateItemQuantity = async (req, res) => {
  try {
    const userId = req.params.id;
    const productId = req.params.productId;
    const { quantity } = req.body;

    // 장바구니 존재 확인
    const existCart = await Cart.findOne({ userId });
    if (!existCart) {
      return res.status(200).json({ status: "success", cartQty: 0 });
    }

    // 수량 업데이트
    const updated = await Cart.findOneAndUpdate(
      { userId, "products.productId": productId },
      { $set: { "products.$.quantity": Number(quantity) } },
      { new: true }
    ).populate("products.productId");

    // 장바구니는 있으나 해당 상품이 없는 경우
    if (!updated) {
      return res.status(404).json({
        status: "error",
        message: "장바구니에 해당 상품이 없습니다.",
        error: error.message,
      });
    }

    return res.status(200).json({
      status: "success",
      cart: updated,
      cartQty: updated.products.length,
      message: "수량이 업데이트되었습니다.",
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "서버 오류입니다.",
      error: error.message,
    });
  }
};

// 장바구니 상품 삭제
cartController.deleteItem = async (req, res) => {
  try {
    const userId = req.params.id;
    const productId = req.params.productId;

    const cart = await Cart.findOneAndUpdate(
      { userId },
      { $pull: { products: { productId } } },
      { new: true }
    ).populate("products.productId");

    if (!cart || cart.products.length === 0) {
      return res.status(200).json({ status: "success", cartQty: 0 });
    }

    return res.status(200).json({
      status: "success",
      cart,
      cartQty: cart.products.length,
      message: "상품이 장바구니에서 제거되었습니다.",
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "서버 오류입니다.",
      error: error.message,
    });
  }
};

module.exports = cartController;
