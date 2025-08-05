const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
require("dotenv").config();
const { v4: uuidv4 } = require("uuid"); // 파일명 충돌 방지용

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
  },
});

exports.uploadToS3 = async (file) => {
  const fileExt = file.originalname.split(".").pop();
  const fileName = `products/${Date.now()}-${uuidv4()}.${fileExt}`;

  const params = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: fileName,
    Body: file.buffer,
    ContentType: file.mimetype,
  };

  const command = new PutObjectCommand(params);
  await s3.send(command);

  // 리전/버킷에 따라 달라질 수 있음
  const imageUrl = `https://${params.Bucket}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;
  return imageUrl;
};
