import axios from "axios";
import type { Product } from "../product/productAPI";

const BASE_URL = import.meta.env.VITE_API_URL;

export interface OrderFormData {
  products: OrderProduct[];
  reciever: { name: string; phone: string };
  totalPrice: number;
  shippingAddress: { address: string; detailAddress: string };
  orderMemo?: string;
  clearCart: boolean;
}

export interface OrderProduct {
  productId: string;
  quantity: number;
}

export interface DetailOrderProduct {
  productId: Product;
  quantity: number;
}

export interface OrderResponseData {
  createdAt: Date;
  orderMemo: string;
  orderNum: string;
  products: DetailOrderProduct[];
  reciever: { name: string; phone: string };
  shippingAddress: { address: string; detailAddress: string };
  status: string;
  totalPrice: Number;
}

export interface OrderResponse {
  order: OrderResponseData;
  status: string;
}

export interface UserOderResponse {
  data: OrderResponseData[];
  total: number;
  page: number;
  totalPage: number;
}

// 주문 생성
export const CreateOrder = async (
  formData: OrderFormData
): Promise<OrderResponse> => {
  const token = localStorage.getItem("token");

  const response = await axios.post(`${BASE_URL}/order`, formData, {
    headers: {
      Authorization: token,
    },
  });
  console.log("response: ", response);
  return response.data;
};

// 유저 주문 가져오기
export const getUserOrder = async ({ page = 1 }: { page?: number }) => {
  const token = localStorage.getItem("token");

  const response = await axios.get(`${BASE_URL}/order`, {
    params: {
      page,
    },
    headers: {
      Authorization: token,
    },
  });

  return response.data;
};
