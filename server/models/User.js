const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    detailAddress: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
  },
  { timestamps: true }
);

// 비밀번호를 제외한 유저 정보 반환
userSchema.methods.toJSON = function () {
  const obj = this._doc;
  delete obj.__v;
  delete obj.createdAt;
  delete obj.updatedAt;
  delete obj.password;
  return obj;
};

// 토큰 발행
userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign({ _id: this._id }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
  return token;
};

module.exports = mongoose.model("User", userSchema);
