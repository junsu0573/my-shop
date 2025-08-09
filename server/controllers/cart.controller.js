const Cart = require("../models/Cart");

const cartConroller = {};

// 장바구니 추가
cartConroller.addToCart = async (req, res) => {
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
    res
      .status(200)
      .json({ status: "success", cart, cartQty: cart.products.length });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

// 장바구니 조회
cartConroller.getCart = async (req, res) => {
  try {
    const userId = req.params.id;

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res
        .status(404)
        .json({ status: "error", message: "장바구니가 비어있습니다." });
    }

    res.status(200).json({ status: "success", cart });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "서버 오류입니다.",
      error: error.message,
    });
  }
};

module.exports = cartConroller;
