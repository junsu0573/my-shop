const User = require("../models/User");
const bcrypt = require("bcryptjs");

const userController = {};

// 회원가입
userController.createUser = async (req, res) => {
  try {
    const { email, password, name, phone, address, detailAddress } = req.body;

    // 중복 확인
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res
        .status(400)
        .json({ status: "error", message: "유저가 이미 존재합니다." });

    // 비밀번호 해싱
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 유저 생성
    const user = await User.create({
      email,
      password: hashedPassword,
      name,
      phone,
      address,
      detailAddress,
      role: "user",
    });
    return res.status(201).json({
      status: "success",
      message: "회원가입 성공",
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

module.exports = userController;
