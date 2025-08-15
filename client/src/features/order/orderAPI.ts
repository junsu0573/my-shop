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
  status: OrderStatus;
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
  totalPages: number;
}

export interface OrderUpdateForm {
  reciever: { name: string; phone: string };
  shippingAddress: { address: string; detailAddress: string };
  orderMemo: string;
  status: string;
}

export const statusLabel: Record<OrderStatus, string> = {
  pending: "주문접수",
  confirmed: "출고중",
  shipped: "배송중",
  delivered: "배송완료",
  cancelled: "취소",
};

export const statusBadgeClass: Record<OrderStatus, string> = {
  pending: "bg-amber-100 text-amber-700 border border-amber-200",
  confirmed: "bg-blue-100 text-blue-700 border border-blue-200",
  shipped: "bg-indigo-100 text-indigo-700 border border-indigo-200",
  delivered: "bg-emerald-100 text-emerald-700 border border-emerald-200",
  cancelled: "bg-rose-100 text-rose-700 border border-rose-200",
};

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "shipped"
  | "delivered"
  | "cancelled";

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

  const response = await axios.get(`${BASE_URL}/order/user`, {
    params: {
      page,
    },
    headers: {
      Authorization: token,
    },
  });

  return response.data;
};

// 전체 주문 검색
export const searchOrders = async ({
  name = "",
  page = 1,
}: {
  name?: string;
  page?: number;
}) => {
  const token = localStorage.getItem("token");

  const response = await axios.get(`${BASE_URL}/order`, {
    params: {
      name,
      page,
    },
    headers: {
      Authorization: token,
    },
  });

  return response.data;
};

// 주문 수정
export const updateOrder = async ({
  orderNum,
  formData,
}: {
  orderNum: string;
  formData: OrderUpdateForm;
}) => {
  const token = localStorage.getItem("token");

  const response = await axios.put(`${BASE_URL}/order/${orderNum}`, formData, {
    headers: {
      Authorization: token,
    },
  });

  return response.data;
};
