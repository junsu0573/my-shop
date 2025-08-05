import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL;

// 카테고리 폼 타입
export interface Category {
  _id: string;
  name: string;
}

// 프로덕트 폼 타입
export interface ProductFormData {
  sku: string;
  name: string;
  categoryId: string;
  part: string;
  weight: number;
  price: number;
  stock: number;
  description: string;
  imageUrl: string;
}

// 카테고리 요청
export const getAllCategories = async (): Promise<Category[]> => {
  const response = await axios.get(`${BASE_URL}/category`);
  return response.data.categories;
};

// 프로덕트 생성
export const createProduct = async (
  formData: ProductFormData
): Promise<ProductFormData> => {
  const token = localStorage.getItem("token");

  const response = await axios.post(`${BASE_URL}/product`, formData, {
    headers: {
      Authorization: token,
    },
  });
  return response.data.product;
};
