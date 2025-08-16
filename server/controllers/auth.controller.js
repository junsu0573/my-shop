const User = require("../models/User");
const bcrypt = require("bcryptjs");
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

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

// 구글 로그인
authController.googleLogin = async (req, res) => {
  try {
    const { gToken } = req.body;

    // 토큰 검증
    const payload = client.verifyIdToken({
      idToken: gToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const { email, name } = payload;

    if (!email) {
      return res.status(400).json({
        status: "error",
        message: "구글 이메일 정보를 가져올 수 없습니다.",
      });
    }

    // DB에서 email로 유저 찾기
    let user = await User.findOne({ email });

    // 없으면 새 유저 생성
    if (!user) {
      // 랜덤 비밀번호 생성
      const password = "" + Math.floor(Math.random() * 100000000);
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      user = await User.create({
        email,
        name: name || "Google User",
        password: hashedPassword,
        phone: "",
        address: "",
        detailAddress: "",
      });
    }

    // 4) JWT 발급
    const token = user.generateAuthToken();

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

module.exports = authController;
