import axios from "axios";

const BASE_URL = import.meta.env.VITE_EB_API_URL;

export const uploadImageToS3 = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("image", file);

  console.log(
    "[S3 업로드] 파일 크기:",
    (file.size / (1024 * 1024)).toFixed(2),
    "MB"
  );

  const res = await axios.post(`${BASE_URL}/upload/image`, formData);

  return res.data.imageUrl;
};
