const express = require("express");
const multer = require("multer");
const { uploadToS3 } = require("../utils/s3");

const router = express.Router();

// 메모리 스토리지를 사용해 파일을 메모리 버퍼로 처리
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB 제한
});

// POST /api/upload/image
router.post("/image", upload.single("image"), async (req, res) => {
  try {
    const file = req.file;

    if (!file || !file.mimetype.startsWith("image/")) {
      return res
        .status(400)
        .json({ status: "error", message: "유효한 이미지 파일이 아닙니다." });
    }

    const imageUrl = await uploadToS3(file);

    res.status(200).json({ status: "success", imageUrl });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: "서버 오류입니다.",
      error: err.message,
    });
  }
});

module.exports = router;
