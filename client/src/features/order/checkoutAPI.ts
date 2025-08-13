import axios from "axios";

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

export interface OrderResponseData {
  createdAt: Date;
  orderMemo: string;
  orderNum: string;
  products: OrderProduct;
  reciever: Object;
  shippingAddress: Object;
  status: string;
  totalPrice: Number;
}

export interface OrderResponse {
  order: OrderResponseData;
  status: string;
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
