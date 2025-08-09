import axios from "axios";
import type { Product } from "../product/productAPI";

const BASE_URL = import.meta.env.VITE_API_URL;

// 카트 요청 응답 타입
export interface CartResponse {
  cart: Cart;
  cartQty: number;
}

export interface Cart {
  userId: string;
  products: CartLine[];
}

export interface CartLine {
  productId: Product;
  quantity: number;
}

// 장바구니 생성 폼 타입
export interface CartFormdata {
  userId: string;
  productId: string;
  quantity: number;
}

// 장바구니 조회
export const getCart = async (userId: string): Promise<CartResponse> => {
  const token = localStorage.getItem("token");

  const response = await axios.get(`${BASE_URL}/cart/${userId}`, {
    headers: {
      Authorization: token,
    },
  });
  return response.data;
};

// 장바구니 추가
export const AddToCart = async (
  formData: CartFormdata
): Promise<CartResponse> => {
  const token = localStorage.getItem("token");

  const response = await axios.post(`${BASE_URL}/cart`, formData, {
    headers: {
      Authorization: token,
    },
  });
  return response.data;
};
