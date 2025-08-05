const imageController = {};

// 이미지 업로드
imageController.uploadImgae = async (req, res) => {
  try {
    const { name } = req.body;
    const category = await Category.create({ name });

    return res.status(201).json({ status: "success", category });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "서버 오류입니다.",
      error: error.message,
    });
  }
};

module.exports = imageController;
