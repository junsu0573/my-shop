const User = require("../models/User");
const bcrypt = require("bcryptjs");

const authController = {};

// 로그인
authController.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 유저 찾기
    const user = await User.findOne({ email });
    if (!user)
      return res
        .status(400)
        .json({ status: "error", message: "유저가 존재하지 않습니다." });
    // 비밀번호 확인
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res
        .status(400)
        .json({ status: "error", message: "비밀번호가 일치하지 않습니다." });
    // JWT 생성
    const token = await user.generateAuthToken();
    return res.status(200).json({
      status: "success",
      user,
      token,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "서버 오류입니다.",
      error: error.message,
    });
  }
};

// 로그인 유저 정보 찾기
authController.getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    return res.status(200).json({
      status: "success",
      user,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "서버 오류입니다.",
      error: error.message,
    });
  }
};

module.exports = authController;
