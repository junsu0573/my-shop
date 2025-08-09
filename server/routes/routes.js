const express = require("express");
const router = express.Router();

const userRouter = require("./user.api");
const authRouter = require("./auth.api");
const productRouter = require("./product.api");
const categoryRouter = require("./category.api");
const uploadRouter = require("./upload.api");
const cartRouter = require("./cart.api");

router.use("/user", userRouter);
router.use("/auth", authRouter);
router.use("/product", productRouter);
router.use("/category", categoryRouter);
router.use("/upload", uploadRouter);
router.use("/cart", cartRouter);

module.exports = router;
