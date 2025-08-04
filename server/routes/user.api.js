const express = require("express");
const router = express.Router();

const userController = require("../controllers/user.controller");

// 회원가입
router.post("/register", userController.createUser);

router.get("/", (req, res) => {
  res.send("Hello World.");
});

module.exports = router;
