import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL;

// 카테고리 폼 타입
export interface Category {
  _id: string;
  name: string;
}

// 프로덕트 생성 폼 타입
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

export interface Product {
  _id: string;
  sku: string;
  name: string;
  categoryId: string;
  part: string;
  weight: number;
  price: number;
  stock: number;
  description: string;
  imageUrl: string;
  reviewCount: number;
  rating: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// 프로덕트 검색 응답 타입
export interface ProductListResponse {
  data: Product[];
  total: number;
  page: number;
  totalPages: number;
}

// 프로덕트 검색 쿼리 타입
export interface ProductQuery {
  name?: string;
  page?: number;
  rating?: boolean;
}

// Product -> ProductFormData 변환
export const toProductFormData = (p: Product): ProductFormData => ({
  sku: p.sku,
  name: p.name,
  categoryId: p.categoryId,
  part: p.part,
  weight: p.weight,
  price: p.price,
  stock: p.stock,
  description: p.description,
  imageUrl: p.imageUrl,
});

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

// 프로덕트 검색
export const searchProduct = async ({
  name = "",
  page = 1,
  rating = false,
}: ProductQuery) => {
  const response = await axios.get(`${BASE_URL}/product`, {
    params: {
      name,
      page,
      rating,
    },
  });
  return response.data;
};

// 프로덕트 수정
export const updateProduct = async (
  id: string,
  formData: ProductFormData
): Promise<ProductFormData> => {
  const token = localStorage.getItem("token");

  const response = await axios.put(`${BASE_URL}/product/${id}`, formData, {
    headers: {
      Authorization: token,
    },
  });
  return response.data.product;
};

// 프로덕트 삭제
export const deleteProduct = async (id: string): Promise<ProductFormData> => {
  const token = localStorage.getItem("token");

  const response = await axios.delete(`${BASE_URL}/product/${id}`, {
    headers: {
      Authorization: token,
    },
  });
  return response.data.product;
};

// 프로덕트 조회
export const getProduct = async (id: string): Promise<Product> => {
  const response = await axios.get(`${BASE_URL}/product/${id}`);
  return response.data.product;
};
