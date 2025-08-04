const jwt = require("jsonwebtoken");
const User = require("../models/User");

const authMiddleware = {};

// 토큰 검증 미들웨어
authMiddleware.verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token)
    return res
      .status(401)
      .json({ status: "error", message: "토큰이 없습니다." });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      status: "error",
      message: "서버 오류입니다.",
      error: error.message,
    });
  }
};

// 어드민 검증 미들웨어
authMiddleware.verifyAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (user.role !== "admin")
      return res
        .status(401)
        .json({ status: "error", message: "관리자 권한이 필요합니다." });
    next();
  } catch (error) {
    return res.status(401).json({
      status: "error",
      message: "서버 오류입니다.",
      error: error.message,
    });
  }
};

module.exports = authMiddleware;
